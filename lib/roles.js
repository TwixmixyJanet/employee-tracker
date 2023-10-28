const db = require('../db/mysql');

const roleSelect = `SELECT roles.id, roles.title, roles.salary, departments.name
AS department
FROM roles
LEFT JOIN departments
ON roles.department_id = departments.id`;

const rolePrompt = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the role you would like to add?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role? (Value must be a numer)'
    },
    {
        type: 'input',
        name: 'department',
        message: 'Which department is this role?',
        choices: []
    }
];

const roleInsert = (({ roleName, salary, department }) => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, (SELECT id FROM departments WHERE name = ?))`;
    const params = [roleName, salary, department];
    db.query(sql, params);
})

roleDestoyPrompt = [
    {
        type: 'input',
        name: 'destroyRole',
        message: 'Which role would you like to remove?',
        choices: []
    }
];