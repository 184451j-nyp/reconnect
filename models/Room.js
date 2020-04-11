const seq = require("sequelize");
const db = require("../config/DBConfig");

const Room = db.define("room", {
    room_id: {
        type: seq.INTEGER,
        allowNull: false,
        primaryKey: true,
        get(){
            return this.getDataValue("room_id").toString().padStart(6, "0");
        },
        set(val){
            return this.setDataValue("room_id", parseInt(val));
        }
    },
    past_qns: {
        type: seq.STRING,
        get() {
            return JSON.parse(this.getDataValue("past_qns"));
        },
        set(val) {
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