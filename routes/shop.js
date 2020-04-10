'use strict';
const express = require('express');
const router = express.Router();
const invoiceORM = require("../models/Invoice");
const senderORM = require("../models/Sender");
const receiverORM = require("../models/Receiver");

router.get("/", (req, res) => {
    res.render("shop");
});

router.post("/", (req, res) => {
    var cardMsg = req.body.cardMsg;
    req.session.cardMsg = cardMsg;
    res.redirect("/shop/details");
});

router.get("/details", (req, res) => {
    var cardMsg = req.session.cardMsg;
    res.render("orderform", {
        cardMsg
    });
});

router.post("/details", (req, res) => {
    let sendername = req.body.senderfname + " " + req.body.senderlname,
        senderemail = req.body.senderemail,
        senderaddress = req.body.senderaddress,
        senderpostal = req.body.senderpostal,
        sendercontact = req.body.sendercontact,
        receivername = req.body.receiverfname + " " + req.body.receiverlname,
        receiveraddress = req.body.receiveraddress,
        receiverpostal = req.body.receiverpostal,
        receivercontact = req.body.receivercontact,
        shipping = req.body.shipping,
        cardmsg = req.body.cardmsg;
        
    (async() => {
        const invoice = await invoiceORM.create({
            sender_name: sendername,
            sender_email: senderemail,
            sender_address: senderaddress,
            sender_postal_code: senderpostal,
            sender_contact_no: sendercontact,
            receiver_name: receivername,
            receiver_address: receiveraddress,
            receiver_postal_code: receiverpostal,
            receiver_contact_no: receivercontact,
            postage: shipping,
            card_msg: cardmsg
        });

        res.render("payment", {
            receiptNo: invoice.id
        });
    })();
});

module.exports = router;