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
    sender_name: {
        type: seq.STRING
    },
    sender_email: {
        type: seq.STRING
    },
    sender_address: {
        type: seq.STRING
    },
    sender_postal_code: {
        type: seq.INTEGER
    },
    sender_contact_no: {
        type: seq.INTEGER
    },
    receiver_name: {
        type: seq.STRING
    },
    receiver_address: {
        type: seq.STRING
    },
    receiver_postal_code: {
        type: seq.INTEGER
    },
    receiver_contact_no: {
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