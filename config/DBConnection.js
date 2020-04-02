const db = require("./DBConfig");

const setUpDB = () => {
    db.authenticate().then(
        () => {
            console.log('database connected');
        }
    ).then(
        () => {
            db.sync().catch(err => console.log(err));
        }
    ).catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };