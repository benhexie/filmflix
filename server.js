require('dotenv').config();
const express = require('express');
const app = express();

const crypto = require('crypto');

const mysql = require('mysql');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

app.use(express.static(`${__dirname}/public`));


// MAIN SECTION
app.get('/', (req, res) => {
    res.sendFile(express.static(`${__dirname}/public/index.html`));
});

app.post('/movies', jsonParser, (req, res) => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY}`)
    .then(res => res.json())
    .then(movies => {
        res.json(movies);
    })
    .catch(err => {
        res.json({error: `Movies could not be gotten`});
    });
});

app.post('/reserve', jsonParser, (req, res) => {

    const uid = Number(req.body.uid);
    const start_date = new Date().toLocaleDateString();
    const end_date = '31/12/2022';
    const movie = req.body.movie;
    const ticket_id = crypto.randomUUID().split('-').join('');

    const ticketObj = {
        message: '',
        ticket_id: ticket_id
    };

    const sql = `INSERT INTO reservations (
        ticket_id, movie, start_date, end_date, uid
    ) VALUES (
        '${ticket_id}', '${movie}', '${start_date}', '${end_date}', ${uid})`;
    conn.query(sql, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        ticketObj.message = 'reserved!';
        res.json(ticketObj);
    });
});

// *******************************************************************



// SIGNUP SECTION
app.get('/signup', (req, res) => {
    res.sendFile(`${__dirname}/public/signup.html`);
});

app.post('/signup', jsonParser, (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.user;
    const password = req.body.pass;

    const sql = `INSERT INTO customers (firstname, lastname, username, password)
        VALUES ('${firstname}', '${lastname}', '${username}', '${password}')`;
    conn.query(sql, err => {
        if (err) {
            res.json({message: 'error'});
            return;
        }
        res.json({message: 'ok'});
    });
});

// *******************************************************************


// LOGIN SECTION
app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/public/login.html`);
});

app.post('/login', jsonParser, (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    const userObj = {
        userInfo: {}
    };

    const sql = `SELECT uid, firstname, lastname FROM customers WHERE username='${username}' AND password='${password}'`;
    conn.query(sql, (err, results, fields) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            return;
        }
        userObj.userInfo = results[0];
        res.json(userObj);
    });
});
// *******************************************************************


const listener = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${listener.address().port}`);
});