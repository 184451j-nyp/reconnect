const seq = require("sequelize");
const db = require("../config/DBConfig");

const Receiver = db.define("receiver", {
    id: {
        type: seq.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: seq.STRING
    },
    address: {
        type: seq.STRING
    },
    postal_code: {
        type: seq.INTEGER
    },
    contact_no: {
        type: seq.INTEGER
    }
}, {
    updatedAt: false
});

module.exports = Receiver;