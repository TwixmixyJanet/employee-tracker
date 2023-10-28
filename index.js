// coded myself into a corner... commenting these out to try something else
// const db = require('./db/mysql');
// const cmsMenu = require('./lib/inquirer');

// NPM packages to potentially use
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const bTable = require('console.table');
const figlet = require('figlet');

// db connect error
// db.connect(err => {
//     console.log(err);
//     if (err) throw err;
// })

// connect to the server
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'process.env.DB_PASSWORD',
        database: 'employee_tracker'
    }
);

// connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log(`connection made through id ${connection.threadId}
    `);
    figlet('Employee tracker', function (err, data) {
        if (err) {
            console.log(`ASCII art not loaded`);
        } else {
            console.log(data);
        }
        startPrompt();
    });
});