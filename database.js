require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error(`Error: ${err.message}`);
        return;
    }

    new Promise((res, rej) => {
        db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, err => {
            if (err) {
                rej(err);
            };
            res();
        });
    })
    .then(() => {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME
        });

        createTableCustomers(conn);
        // createTableMovies(conn);
        createTableReservations(conn);
    });
}, (err) => {
    console.error(err.message);
});

function createTableCustomers(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS customers (
        uid INTEGER(9) AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(30) NOT NULL,
        lastname VARCHAR(30) NOT NULL,
        username VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(30) NOT NULL
    )`;
    conn.query(sql, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Table 'customers' created.`);
    });
}

function createTableReservations(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS reservations (
        ticket_id VARCHAR(35) NOT NULL PRIMARY KEY,
        movie VARCHAR(100) NOT NULL,
        start_date VARCHAR(20) NOT NULL,
        end_date VARCHAR(20) NOT NULL,
        uid INTEGER(9) NOT NULL
    )`;
    conn.query(sql, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Table 'reservations' created.`);
    });
}

function createTableMovies(conn) {
    const sql = `CREATE TABLE IF NOT EXISTS movies (
        
    )`;
    conn.query(sql, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`Table 'movies' created.`);
    });
}