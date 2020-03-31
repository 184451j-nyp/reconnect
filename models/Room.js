const seq = require("sequelize");
const db = require("../config/DBConfig");

const Room = db.define("room", {
    room_id: {
        type: seq.STRING,
        allowNull: false,
        primaryKey: true
    },
    past_qns: {
        type: seq.STRING
    },
    current_qn: {
        type: seq.INTEGER
    },
    current_level: {
        type: seq.INTEGER
    }
});

module.exports = Room;