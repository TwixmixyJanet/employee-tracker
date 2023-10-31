// NPM packages to potentially use
require('dotenv').config();
const mysql = require('mysql2'); // to create the mysql connection
const inquirer = require('inquirer'); // to allow for prompts in the terminal
const cTable = require('console.table'); // better tble display for any reports
const figlet = require('figlet'); // to have a fun header
const chalk = require('chalk'); // to add color in the app

// connect to the server
const connection = mysql.createConnection(
    { 
        //////////////////////////////////////////////////////////////
        // !!You need to update the below data for your own needs!!//
        ////////////////////////////////////////////////////////////
        host: '127.0.0.1',
        // port: 3306,
        user: 'root',
        password: 'pastel',
        database: 'employee_tracker'
    }
);

// connect to the database
connection.connect((err) => {
    if (err) throw err; // IF errors and .catch errors placed throughout the system to catch potential issues for the development process and for the user, if needed.
    console.log(`connection made through id ${connection.threadId}
    `);
    figlet(
        `
        **************

        Employee Tracker

        **************
        `
        , function (err, data) {
        if (err) { 
            console.log(`ASCII art not loaded`);
        } else {
            console.log(data);
        }
        startMainMenu(); // initial start of the prompt main menu questions
    });
});

// The content management system heavily relies on the prompt questions
function startMainMenu() {
    const mainMenu = [
        {
            type: 'list',
            name: 'action',
            message: 'What action would you like to take?',
            loop: false, // set to false so I could be in charge of when user is re-routed to main menu
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "View employees by manager",
                "Add an employee",
                "Add a role",
                "Add a department",
                "Update employee role",
                "Update employee's manager",
                "Delete a department",
                "Delete a role",
                "Delete an employee",
                "View the total budget of a department",
                "QUIT"
            ]
        }
    ]

    inquirer.prompt(mainMenu) // creating a course of actions base off of main menu selection
    .then(response => {
        switch(response.action) { // using the switch statement method instead of IF statements
            case "View all employees":
                viewReport("EMPLOYEE");
                break;
            case "View all roles":
                viewReport("ROLE");
                break;
            case "View all departments":
                viewReport("DEPARTMENT");
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
                viewEmployeeManagerReport();
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
                viewDepartmentBudgetReport();
                break;
                default: // If the user selects Quit, then the connection will end
                    connection.end();
        }
    })
    .catch(err => {
        console.error(err);
    });
};

// A catch all report for if they user selects department, role, or employee
// Because it was combined and required joining of tables, it required research into how to call on and display the SQL data.
// For example (the "ROLE" table), R.id AS id gives the id column an alias for the role's table and to avoid name collision.
// LEFT JOIN ensures that it will return all rows from the role table, even if there is no matching row in the department table.
// ON R.department_id = D.id specifies the join condition. For this case, the two tables are joined on the department_id column.
const viewReport = (table) => {
    let query;
    if (table === "DEPARTMENT") {
        query = `SELECT * FROM department`;
    } else if (table === "ROLE") {
        query = `SELECT R.id AS id, title, salary, D.name as department FROM ROLE AS R LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id;`;
    } else {
        query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
        FROM EMPLOYEE AS E
        LEFT JOIN ROLE AS R ON E.role_id = R.id
        LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
        LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id;`;
    }

// This function makes a query against the database connection. The SQL qeury and the callback function, calling on the cb whent he query finishes executing. First it's checking to see if there are any errors, if not it uses the console.table to display the report data.
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);

        startMainMenu();
    });
};

// There are functions for all potential additions to the database. They all function the same way. Using inquirer it prompts the user for information. Then it uses a query to send a SQL command to the database. If there is no error then it will respond with a console log message saying it's successful and then it returns to the main menu.
const addNewDepartment = () => {
    let questions = [
        {
            type: 'input',
            name: 'name',
            message: "What is department name?"
        }
    ];

    inquirer.prompt(questions)
    .then(response => {
        const query = `INSERT INTO department (name)  VALUE (?)`;
        connection.query(query, [response.name], (err, res) => {
            if (err) throw err;
            // Used the chalk NPM to add some color highlight to some of the console logs when data was added
            console.log(chalk`Successfully added {magentaBright ${response.name}} department with an ID of ${res.insertId}`);
            startMainMenu();
        });
    })
    .catch(err => {
        console.error(err);
    })
};

// Add role and add employee have another layer of complexity because they need to have questions based off of referential data in the system. At the beginning of each function there is a call to the database to find the existing referential data and that is then pushed to display as part of the question "which department" (for example). This way the latest department and role data will always be up to date when adding a new role or a new employee. From there it's the same as the function above.
const addNewRole = () => {
    const departments = []
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;

        res.forEach(dep => {
            let qObj = {
                name: dep.name,
                value: dep.id
            }
            departments.push(qObj);
        });

        let questions = [
            {
                type: 'input',
                name: 'title',
                message: "What is the role name?"
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of the role?"
            },
            {
                type: 'list',
                name: 'department',
                message: "Which department is this role?",
                choices: departments
            }
        ];

        inquirer.prompt(questions)
        .then(response => {
            const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
            connection.query(query, [[response.title, response.salary, response.department]], (err, res) => {
                if (err) throw err;
                console.log(chalk`Successfully added {magentaBright ${response.title}} role with an ID of ${res.insertId}`);
                startMainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

const addNewEmployee = () => {
    connection.query(`SELECT * FROM employee`, (err, employeeResponse) => {
        if (err) throw err;
        const selectEmployee = [
            {
                name: 'None',
                value: 0
            }
        ];
        employeeResponse.forEach(({ first_name, last_name, id }) => {
            selectEmployee.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        connection.query(`SELECT * FROM role`, (err, roleResponse) => {
            if (err) throw err;
            const selectRole = [];
            roleResponse.forEach(({ title, id }) => {
                selectRole.push(
                    {
                        name: title,
                        value: id
                    }
                );
            });

            let questions = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What's the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What's the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What's the employee's role?",
                    choices: selectRole
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Select the emplyee's manager (if they have one)",
                    choices: selectEmployee
                }
            ]

            inquirer.prompt(questions)
            .then(response => {
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`;
                // Not everyone needs a manager, If the response give is not equal to zero then it will assign the proper manager id correlation. Otherwise it sets the value to null.
                let manager_id = response.manager_id !== 0? response.manager_id: null;
                connection.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
                    if (err) throw err;
                    console.log(chalk`Successfully added employee {magentaBright ${response.first_name} ${response.last_name}} with an ID of ${res.insertId}`);
                    startMainMenu();
                });
            })
            .catch(err => {
                console.error(err);
            });
        })
    });
};

// Much like above when needing to pull data from the db, when updating information about an employees role or a role's department, it also needs to query the db. First it needs to request the employees to select from to update their role, then it needs to make a request to pull the roles available. After querying the db, the information is pushed to display in the prompt. It then updates the refential data accordingly.
const updateRole = () => {
    connection.query(`SELECT * FROM employee`, (err, employeeResponse) => {
        if (err) throw err;
        const selectEmployee = [];
        employeeResponse.forEach(({ first_name, last_name, id }) => {
            selectEmployee.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        connection.query(`SELECT * FROM role`, (err, roleResponse) => {
            if (err) throw err;
            const selectRole = [];
            roleResponse.forEach(({ title, id }) => {
                selectRole.push(
                    {
                        name: title,
                        value: id
                    }
                );
            });

            let questions = [
                {
                    type: 'list',
                    name: 'id',
                    message: "Which employee's role do you want to update?",
                    choices: selectEmployee
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's new role?",
                    choices: selectRole
                }
            ]

            inquirer.prompt(questions)
            .then(response => {
                const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
                connection.query(query, 
                    [
                        {role_id: response.role_id},
                        'id',
                        response.id
                    ],
                    (err, res) => {
                        if (err) throw err;

                        console.log(`Successfully update employee's role to ${response.role_id}`);
                        startMainMenu();
                    }
                );
            })
            .catch(err => {
                console.error(err);
            });
        })
    });
};

const updateManager = () => {
    connection.query(`SELECT * FROM employee`, (err, employeeResponse) => {
        if (err) throw err;
        const selectEmployee = [];
        employeeResponse.forEach(({ first_name, last_name, id }) => {
            selectEmployee.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        const selectManager = [{
            name: 'None',
            value: 0
        }];
        employeeResponse.forEach(({ first_name, last_name, id }) => {
            selectManager.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which employee do you want to update?",
                choices: selectEmployee
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Which manager do you select for this employee?",
                choices: selectManager
            }
        ]

        inquirer.prompt(questions)
        .then(response => {
            const query = `UPDATE EMPLOYEE SET ? WHERE id = ?;`;
            let manager_id = response.manager_id !== 0? response.manager_id: null;
            connection.query(query, [
                {manager_id: manager_id},
                response.id
            ], (err, res) => {
                if (err) throw err;
                console.log(`Successfully updated the employee's manager`);
                startMainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    })
};

// To display a manager's employees report, much like the functions above it needs to make a query to the database to ask which manager the report is on. Once the prompt selection is made, then the report data can be displayed based off the ID selected. The SQL statements are much like from the viewReports function and specifics about them are broken down above.
const viewEmployeeManagerReport = () => {
    connection.query(`SELECT * FROM employee`, (err, employeeResponse) => {
        if (err) throw err;
        const selectEmployee = [
            {
                name: 'None',
                value: 0
            }
        ];
        employeeResponse.forEach(({ first_name, last_name, id }) => {
            selectEmployee.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        let questions = [
            {
                type: 'list',
                name: 'manager_id',
                message: "Which do you want to view?",
                choices: selectEmployee
            }
        ]

        inquirer.prompt(questions)
        .then(response => {
            let manager_id, query;
            if (response.manager_id) {
                query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
                R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
                FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
                LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
                LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id
                WHERE E.manager_id = ?;`;
            } else {
                manager_id = null;
                query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, 
                R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
                FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
                LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
                LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id
                WHERE E.manager_id is null;`;
            }
            connection.query(query, [response.manager_id], (err, res) => {
                if (err) throw err;

                console.table(res);
                
                setTimeout(function() {
                    // This is giving time for the table to load before the startMainMenu executes.
                }, 1000)

                startMainMenu();
                
                
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

// Much like the add and edit functions, the delete function also requires a query to the database to begin with. Once the selection is made, the SQL statement can be executed to delete that line of data from the db.
const deleteDepartment = () => {
    const departments = [];
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;

        res.forEach(dep => {
            let qObj = {
                name: dep.name,
                value: dep.id
            }
            departments.push(qObj);
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which department do you want to delete?",
                choices: departments
            }
        ];

        inquirer.prompt(questions)
        .then(response => {
            const query = `DELETE FROM DEPARTMENT WHERE id = ?`;
            connection.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} successfully deleted.`);
                startMainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

const deleteRole = () => {
    const departments = [];
    connection.query(`SELECT * FROM ROLE`, (err, res) => {
        if (err) throw err;

        const selectRole = [];
        res.forEach(({ title, id }) => {
            selectRole.push({
                name: title,
                value: id
            });
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which role do you want to delete?",
                choices: selectRole
            }
        ];

        inquirer.prompt(questions)
        .then (response => {
            const query = `DELETE FROM ROLE WHERE id = ?`;
            connection.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} successfully deleted.`);
                startMainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

const deleteEmployee = () => {
    connection.query(`SELECT * FROM EMPLOYEE`, (err, res) => {
        if (err) throw err;

        const selectEmployee = [];
        res.forEach(({ first_name, last_name, id }) => {
            selectEmployee.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which employee do you want to delete?",
                choices: selectEmployee
            }
        ];

        inquirer.prompt(questions)
        .then(response => {
            const query = `DELETE FROM EMPLOYEE WHERE id = ?`;
            connection.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} successfully deleted.`);
                startMainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

// Same as the report function with a combination of pretty much every other function above. First query the database, then issue the SQL statement to display the report.
const viewDepartmentBudgetReport = () => {
    connection.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
        if (err) throw err;

        const selectDepartment = [];
        res.forEach(({ name, id }) => {
            selectDepartment.push({
                name: name,
                value: id
            });
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which department's budget would you like to review?",
                choices: selectDepartment
            }
        ];

        inquirer.prompt(questions)
        .then(response => {
            const query = `SELECT D.name, SUM(salary) AS budget FROM EMPLOYEE AS E 
            LEFT JOIN ROLE AS R
            ON E.role_id = R.id 
            LEFT JOIN DEPARTMENT AS D 
            ON R.department_id = D.id
            WHERE D.id = ?
            `;
            connection.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.table(res);
                startMainMenu();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};