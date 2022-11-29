const userInput = document.getElementById('user');
const passInput = document.getElementById('pass');
const popup = document.getElementById('popup');
const popupDiv = document.querySelector('.popup-div');
const toSignup = document.getElementById('to-signup');


document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();

    const user = userInput.value;
    const pass = passInput.value;

    fetch('/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: user.toLowerCase(),
            pass: pass
        })
    })
    .then(res => res.json())
    .then(res => {
        if (!res['userInfo']) {
            popupHandler(1, 'Login Unsuccessful.', 'red');
            setTimeout(() => {
                popupHandler();
            }, 3000);
            return;
        }
        sessionStorage.clear();
        sessionStorage.setItem('userInfo', JSON.stringify(res['userInfo']));
        location.href = '/';
    })
    .catch(err => {
        console.error(err.message);
        popupHandler(1, 'An error occured.', 'red');
        setTimeout(() => {
            popupHandler();
        }, 3000);
    });
});

function popupHandler(opacity = 0, message = '', color = '') {
    popupDiv.style.transition = 'opacity 0.5s linear';
    popupDiv.style.backgroundColor = color ? color : popupDiv.style.backgroundColor;
    popup.textContent = message ? message : popup.textContent;
    popupDiv.style.opacity = opacity;
    popupDiv.style.cursor = opacity === 0 ? 'default' : 'pointer'
}

popupDiv.addEventListener('click', () => {
    popupHandler();
});

toSignup.addEventListener('click', e => {
    e.preventDefault();
    location.href = '/signup';
});