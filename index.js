const db = require('./db/mysql');
const cmsMenu = require('./lib/inquirer');

db.connect(err => {
    console.log(err);
    if (err) throw err;
})