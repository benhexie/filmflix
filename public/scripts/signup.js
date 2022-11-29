const firstnameInput = document.getElementById('firstname');
const lastnameInput = document.getElementById('lastname');
const userInput = document.getElementById('user');
const passInput = document.getElementById('pass');
const c_passInput = document.getElementById('c-pass');
const popup = document.getElementById('popup');
const popupDiv = document.querySelector('.popup-div');
const toLogin = document.getElementById('to-login');

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();

    const user = userInput.value.toLowerCase();
    const pass = passInput.value;
    const c_pass = c_passInput.value;
    const firstname = firstnameInput.value;
    const lastname = lastnameInput.value;

    if (pass === c_pass) {
        fetch('/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                user: user,
                pass: pass
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res["message"] === 'ok') {
                popupHandler(1, 'Signup Successful.', 'green');
                setTimeout(() => {
                    popupHandler();
                    location.href = '/login';
                }, 3000);
            }
            else {
                popupHandler(1, 'Signup Failed.', 'red');
                setTimeout(() => {
                    popupHandler();
                }, 3000);
            }
        })
        .catch(err => {
            console.error(err.message);
            popupHandler(1, 'An error occured.', 'red');
            setTimeout(() => {
                popupHandler();
            }, 3000);
        });
    } else {
        popupHandler(1, 'Both password fields must contain the same value.', 'red');
        setTimeout(() => {
            popupHandler();
        }, 3000);
    }
});

function popupHandler(opacity = 0, message = '', color = '') {
    popupDiv.style.transition = 'opacity 0.5s linear';
    popupDiv.style.opacity = opacity;
    popupDiv.style.backgroundColor = color ? color : popupDiv.style.backgroundColor;
    popup.textContent = message ? message : popup.textContent;
    popupDiv.style.cursor = opacity === 0 ? 'default' : 'pointer'
}

popupDiv.addEventListener('click', () => {
    popupHandler();
});

toLogin.addEventListener('click', e => {
    e.preventDefault();
    location.href = '/login';
});