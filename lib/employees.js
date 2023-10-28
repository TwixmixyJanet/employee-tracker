const db = require('../db/mysql');

const employeeByManager = `
SELECT a.id, .first_name, a.last_name, 
roles.title AS role, 
departments.name AS department, 
roles.salary AS salary, 
CONCAT_WS(' ', b.first_name, b.last_name) AS manager 
FROM employees a
LEFT JOIN employees b ON a.manager_id = b.id
LEFT JOIN roles ON a.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY manager`;

const employeeByDepartment = `
SELECT a.id, .first_name, a.last_name, 
roles.title AS role, 
departments.name AS department, 
roles.salary AS salary, 
CONCAT_WS(' ', b.first_name, b.last_name) AS manager 
FROM employees a
LEFT JOIN employees b ON a.manager_id = b.id
LEFT JOIN roles ON a.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY department`;

const employeePrompt = [
    {
        type: 'input',
        name: 'first',
        message: "What's the employee's first name?"
    },
    {
        type: 'input',
        name: 'last',
        message: "What's the employee's last name?"
    },
    {
        type: 'list',
        name: 'role',
        message: "What's the employee's role?",
        choices: []
    },
    {
        type: 'confirm',
        name: 'confirmManager',
        message: "Does the employee have a manager?",
        default: true
    },
    {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: [],
        when: ({ confirmManager }) => {
            if (confirmManager) {
                return true;
            } else {
                return false;
            }
        }
    }
];

const getId = (employeeX) => {
    let employeeId;

    if (employeeX ===)
}