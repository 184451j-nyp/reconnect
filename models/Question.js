const seq = require("sequelize");
const db = require("../config/DBConfig");

const Question = db.define("question", {
    qn_id: {
        type: seq.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    qn_string: {
        type: seq.STRING
    },
    qn_rating: {
        type: seq.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Question;