'use strict';
const express = require('express');
const router = express.Router();
const rm = require("../models/Room");
const qn = require("../models/Question");

router.get("/", (req, res) => {
    req.session = null;
    res.render("index");
});

router.get("/enter", (req, res) => {
    res.render("enter", {
        fail: req.flash("fail")
    });
});

router.get("/create", (req, res) => {
    (async () => {
        var id;
        var room;
        do {
            id = (Math.floor(Math.random() * (999999 - 10)) + 10).toString().padStart(6, "0");
            room = await rm.findByPk(id);
        } while (room != null);

        await rm.create({
            room_id: id
        });
        req.session.roomCode = id;
        res.redirect("/game");
    })();
});

router.post("/join", (req, res) => {
    let id = req.body.tbRoomCode;
    (async () => {
        const room = await rm.findByPk(id);
        if (room == null) {
            req.flash("fail", "Invalid join code!");
            res.redirect("/enter");
        } else {
            req.session.roomCode = id;
            req.session.roomQn = room.current_qn;
            res.redirect("/game");
        }
    })();
});

router.get("/game", (req, res) => {
    var code = req.session.roomCode;
    var shuffle = true;
    var deeper = false;
    var question = "";

    if(code == null){
        res.redirect("/enter");
        return;
    }

    (async () => {
        const room = await rm.findByPk(code);
        if(room.current_qn < 0){
            switch(room.current_qn){
                case -1:
                    question = "Tell me your story.";
                    req.session.roomQn = -1;
                    break;
                case -2:
                    question = "Let's dig deeper.";
                    deeper = true;
                    shuffle = false;
                    req.session.roomQn = -2;
                    break;
                case -3:
                    question = "\"Thank you, Mario! But our Princess is in another castle!\"";
                    shuffle = false;
                    break;
            }
        }
        else{
            const qnObj = await qn.findByPk(room.current_qn);
            question = qnObj.qn_string;
        }

        res.render("game", {
            code,
            question,
            shuffle,
            deeper
        });
    })();
});

module.exports = router;