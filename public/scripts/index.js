const movieList = document.getElementById('movie-list');
const movieOptions = document.getElementById('movie-options');
const movieItems = document.getElementsByClassName('movie-item');
const backBtn = document.getElementById('back-btn');
const optionsImage = document.getElementById('options-image');
const optionsTitle = document.getElementById('options-title');
const optionsPG = document.getElementById('options-pg');
const optionsDesc = document.getElementById('options-desc');
const reserveBtn = document.getElementById('reserve-btn');
const reserveError = document.getElementById('reserve-error');

fetch('/movies', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(res => {
    new Promise((resolve, reject) => {
        res['results'] && res['results'].forEach(movie => {
            const id = movie['id'];
            const image = movie['poster_path'];
            const pg = movie['adult'] ? 'PG 18' : 'PG 13';
            const title = movie['title'];
            const description = movie['overview'];
    
            movieList.insertAdjacentHTML('beforeend', `
                <li class="movie-item">
                    <div class="movie-front">
                        <img src="https://image.tmdb.org/t/p/w200${image}" alt="Image unavailable" srcset="" class="movie-image">
                    </div>
                    <div class="movie-info">
                        <h1 class="movie-title">${title}</h1>
                        <p class="movie-pg">${pg}</p>
                    </div>
                    <div hidden>
                        <p class="movie-desc">${description}</p>
                        <p class="movie-id">${id}</p>
                    </div>
                </li>
            `);
        });
        resolve();
    })
    .then(() => {
        Array.from(movieItems).forEach((movie, index) => {            
            movie.addEventListener('click', e => {
                const image = document.getElementsByClassName('movie-image')[index].src;
                const pg = document.getElementsByClassName('movie-pg')[index].textContent;
                const title = document.getElementsByClassName('movie-title')[index].textContent;
                const description = document.getElementsByClassName('movie-desc')[index].textContent;
                
                reserveError.textContent = '';
                optionsImage.src = image;
                optionsTitle.textContent = title;
                optionsPG.textContent = pg;
                optionsDesc.textContent = description;
                movieOptions.style.display = 'flex';
            });
        });
    })
})
.catch(err => {
    
});

backBtn.addEventListener('click', e => {
    movieOptions.style.display = 'none';
});

reserveBtn.addEventListener('click', e => {
    if(!sessionStorage.getItem('userInfo')){
        reserveErrorHandler('You have to be logged in to reserve a ticket.');
        return;
    }
    fetch('/reserve', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uid: JSON.parse(sessionStorage.getItem('userInfo'))["uid"],
            movie: optionsTitle.textContent
        })
    })
    .then(res => res.json())
    .then(res => {
        if (!res['message']) {
            reserveErrorHandler('Ticket not reserved!')
            return;
        }
        reserveErrorHandler(`Your ticket has been reserved successfully. Your ticket id is ${res['ticket_id']}`, 'green');
    })
    .catch(err => {
        reserveErrorHandler('Ticket not reserved!', 'red');
    });
});

function reserveErrorHandler(message = '', color = 'red') {
    reserveError.style.color = color;
    reserveError.textContent = message;
    reserveError.style.display = 'block';
}

const navDiv = document.getElementById('nav-div');
const loginDiv = document.getElementById('to-login-div');
const toLoginBtn = document.getElementById('to-login-btn');
const toSignupBtn = document.getElementById('to-signup-btn');
const logoutBtn = document.getElementById('logout-btn');

if (!sessionStorage.getItem('userInfo')) loginDiv.style.display = 'flex';
else navDiv.style.display = 'flex';

toLoginBtn.addEventListener('click', e => {
    location.href = '/login';
});

toSignupBtn.addEventListener('click', e => {
    location.href = '/signup';
});


logoutBtn.addEventListener('click', e => {
    sessionStorage.clear();
    location.href = '/login';
});