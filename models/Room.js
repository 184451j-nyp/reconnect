const seq = require("sequelize");
const db = require("../config/DBConfig");

const Room = db.define("room", {
    room_id: {
        type: seq.STRING,
        allowNull: false,
        primaryKey: true
    },
    past_qns: {
        type: seq.STRING,
        get: function () {
            return JSON.parse(this.getDataValue("past_qns"));
        },
        set: function (val) {
            return this.setDataValue("past_qns", JSON.stringify(val));
        },
        defaultValue: "[]"
    },
    current_qn: {
        type: seq.INTEGER,
        defaultValue: -1
    },
    current_level: {
        type: seq.INTEGER,
        defaultValue: 1
    }
}, {
    createdAt: false
});

module.exports = Room;