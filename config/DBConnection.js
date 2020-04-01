const db = require("./DBConfig");

const setUpDB = (drop) => {
    db.authenticate().then(
        () => {
            console.log('database connected');
        }
    ).then(
        () => {
            db.sync({ // Creates table if none exists
                force: drop
            }).catch(err => console.log(err));
        }
    ).catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };