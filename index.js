const db = require('./db/mysql');

db.connect(err => {
    console.log(err);
    if (err) throw err;
})