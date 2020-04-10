const db = require("./DBConfig");
const invoice = require("../models/Invoice");
const sender = require("../models/Sender");
const receiver = require("../models/Receiver");

const setUpDB = () => {
    db.authenticate().then(
        () => {}
    ).then(
        () => {
            invoice.belongsTo(sender, {foreignKey: "sender_id"});
            invoice.belongsTo(receiver, {foreignKey: "receiver_id"});
            db.sync().catch(err => console.log(err));
        }
    ).catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB }