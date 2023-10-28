// coded myself into a corner... commenting these out to try something else
// const db = require('./db/mysql');
// const cmsMenu = require('./lib/inquirer');

// NPM packages to potentially use
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const bTable = require('console.table');
const figlet = require('figlet');
const { response } = require('express');

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
};

const viewAll = (table) => {
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

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);

        startPrompt();
    });
};

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
            console.log(`Successfully added ${response.name} department with an ID of ${res.insertId}`);
            startPrompt();
        });
    })
    .catch(err => {
        console.error(err);
    })
};

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
                console.log(`Successfully added ${response.title} role with an ID of ${res.insertId}`);
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

const addNewEmployee = () => {
    connection.query(`SELECT * FROM employee`, (err, emplRes) => {
        if (err) throw err;
        const employeeChoice = [
            {
                name: 'None',
                value: 0
            }
        ];
        emplRes.forEach(({ first_name, last_name, id }) => {
            employeeChoice.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        connection.query(`SELECT * FROM role`, (err, rolRes) => {
            if (err) throw err;
            const roleChoice = [];
            rolRes.forEach(({ title, id }) => {
                roleChoice.push(
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
                    choices: roleChoice
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Select the emplyee's manager (if they have one)",
                    choices: employeeChoice
                }
            ]

            inquirer.prompt(questions)
            .then(response => {
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`;
                let manager_id = response.manager_id !== 0? response.manager_id: null;
                connection.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
                    if (err) throw err;
                    console.log(`Successfully added employee ${response.first_name} ${response.last_name} with an ID of ${res.insertId}`);
                    startPrompt();
                });
            })
            .catch(err => {
                console.error(err);
            });
        })
    });
};

const updateRole = () => {
    connection.query(`SELECT * FROM employee`, (err, emplRes) => {
        if (err) throw err;
        const employeeChoice = [];
        emplRes.forEach(({ first_name, last_name, id }) => {
            employeeChoice.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        connection.query(`SELECT * FROM role`, (err, rolRes) => {
            if (err) throw err;
            const roleChoice = [];
            rolRes.forEach(({ title, id }) => {
                roleChoice.push(
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
                    choices: employeeChoice
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's new role?",
                    choices: roleChoice
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
                        startPrompt();
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
    connection.query(`SELECT * FROM employee`, (err, emplRes) => {
        if (err) throw err;
        const employeeChoice = [];
        emplRes.forEach(({ first_name, last_name, id }) => {
            employeeChoice.push(
                {
                    name: first_name + " " + last_name,
                    value: id
                }
            );
        });

        const managerChoice = [{
            name: 'None',
            value: 0
        }];
        emplRes.forEach(({ first_name, last_name, id }) => {
            managerChoice.push(
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
                choices: employeeChoice
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Which manager do you select for this employee?",
                choices: managerChoice
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
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    })
};

const viewEmployeeByManager = () => {
    connection.query(`SELECT * FROM employee`, (err, emplRes) => {
        if (err) throw err;
        const employeeChoice = [
            {
                name: 'None',
                value: 0
            }
        ];
        emplRes.forEach(({ first_name, last_name, id }) => {
            employeeChoice.push(
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
                choices: employeeChoice
            }
        ]

        inquirer.prompt(questions)
        .then(response => {
            let manager_id, query;
            if (response.manager_id) {
                query = `SELECT E.id AS id, 
                E.first_name AS first_name, 
                E.last_name AS last_name,
                R.title AS role, 
                D.name AS department, 
                CONCAT(M.first_name, " ", M.last_name) AS manager
                FROM EMPLOYEE AS E 
                LEFT JOIN ROLE AS R ON E.role_id = R.id 
                LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id 
                WHERE E.manager_id is null;`;
            }
            connection.query(query, [response.manager_id], (err, res) => {
                if (err) throw err;
                console.table(res);
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

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
                startPrompt();
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

        const roleChoice = [];
        res.forEach(({ title, id }) => {
            roleChoice.push({
                name: title,
                value: id
            });
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which role do you want to delete?",
                choices: roleChoice
            }
        ];

        inquirer.prompt(questions)
        .then (response => {
            const query = `DELETE FROM ROLE WHERE id = ?`;
            connection.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} successfully deleted.`);
                startPrompt();
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

        const employeeChoice = [];
        res.forEach(({ first_name, last_name, id }) => {
            employeeChoice.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which employee do you want to delete?",
                choices: employeeChoice
            }
        ];

        inquirer.prompt(questions)
        .then(response => {
            const query = `DELETE FROM EMPLOYEE WHERE id = ?`;
            connection.query(query, [response.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} successfully deleted.`);
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};

const viewBudget = () => {
    connection.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
        if (err) throw err;

        const deptChoice = [];
        res.forEach(({ name, id }) => {
            deptChoice.push({
                name: name,
                value: id
            });
        });

        let questions = [
            {
                type: 'list',
                name: 'id',
                message: "Which department's budget would you like to review?",
                choices: deptChoice
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
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });
};