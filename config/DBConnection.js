const db = require("./DBConfig");
const invoice = require("../models/Invoice");
const sender = require("../models/Sender");
const receiver = require("../models/Receiver");

const setUpDB = () => {
    db.authenticate().then(
        () => {}
    ).then(
        () => {
            db.sync().catch(err => console.log(err));
        }
    ).catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB }