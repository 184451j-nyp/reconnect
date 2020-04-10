const seq = require("sequelize");
const db = require("../config/DBConfig");

const Invoice = db.define("invoice", {
    id:{
        type: seq.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        get(){
            return "RCR" + this.getDataValue("id").toString().padStart(6, "0");
        }
    },
    sender_id:{
        type: seq.INTEGER
    },
    receiver_id: {
        type: seq.INTEGER
    },
    postage:{
        type: seq.INTEGER,
        get(){
            switch(this.getDataValue("postage")){
                case 1:
                    return "Normal";
                case 2:
                    return "Registered";
                default:
                    return "error";
            }
        }
    },
    card_msg: {
        type: seq.STRING
    }
}, {
    updatedAt: false
});

module.exports = Invoice;