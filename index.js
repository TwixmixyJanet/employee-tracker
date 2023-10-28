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

function startPrompt() {
    const startQuestion = [
        {
            type: 'list',
            name: 'action',
            message: 'What action would you like to take?',
            loop: false,
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "Add an employee",
                "Add a role",
                "Add a department",
                "Update employee role",
                "Update employee's manager",
                "View employees by manager",
                "Delete a department",
                "Delete a role",
                "Delete an employee",
                "View the total budget of a department",
                "QUIT"
            ]
        }
    ]

    inquirer.prompt(startQuestion)
    .then(response => {
        switch(response.action) {
            case "View all employees":
                viewAll("EMPLOYEE");
                break;
            case "View all roles":
                viewAll("ROLE");
                break;
            case "View all departments":
                viewAll("DEPARTMENT");
                break;
            case "Add an employee":
                addNewEmployee();
                break;
            case "Add a role":
                addNewRole();
                break;
            case "Add a department":
                addNewDepartment();
                break;
            case "Update employee role":
                updateRole();
                break;
            case "Update employee's manager":
                updateManager();
                break;
            case "View employees by manager":
                viewEmployeeByManager();
                break;
            case "Delete a department":
                deleteDepartment();
                break;
            case "Delete a role":
                deleteRole();
                break;
            case "Delete an employee":
                deleteEmployee();
                break;
            case "View the total budget of a department":
                viewBudget();
                break;
                default:
                    connection.end();
        }
    })
    .catch(err => {
        console.error(err);
    });
}