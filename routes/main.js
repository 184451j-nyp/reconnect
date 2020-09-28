'use strict';
const express = require('express');
const router = express.Router();
const roomORM = require("../models/Room");
const qnsORM = require("../models/Question");

router.get("/", (req, res) => {
    console.log(`${req.ip} is requesting index page`);
    res.render("index");
});

router.get("/instructions", (req, res) => {
    res.render("instructions");
});

router.get("/enter", (req, res) => {
    res.render("enter", {
        fail: req.flash("fail")
    });
});

router.get("/create", (req, res) => {
    (async () => {
        let id;
        let room;
        do {
            id = (Math.floor(Math.random() * (999999 - 10)) + 10).toString().padStart(6, "0");
            room = await roomORM.findByPk(id);
        } while (room != null);

        await roomORM.create({
            room_id: id
        });
        req.session.roomCode = id;
        res.redirect("/game");
    })();
});

router.post("/join", (req, res) => {
    let id = req.body.tbRoomCode;
    (async () => {
        const room = await roomORM.findByPk(id);
        if (room != null) {
            req.session.roomCode = id;
            req.session.roomQn = room.current_qn;
            res.redirect("/game");
        } else {
            req.flash("fail", "Invalid join code!");
            res.redirect("/enter");
        }
    })();
});

router.get("/game", (req, res) => {
    let code = req.session.roomCode;
    let shuffle = true;
    let deeper = false;
    let question = "";

    if (code == null) {
        res.redirect("/enter");
        return;
    }

    (async () => {
        const room = await roomORM.findByPk(code);
        req.session.roomQn = room.current_qn;
        if (room.current_qn < 0) {
            switch (room.current_qn) {
                case -1:
                    question = "Tell me your story.";
                    break;
                case -2:
                    question = "It's time to go deeper.";
                    deeper = true;
                    shuffle = false;
                    break;
                case -3:
                    question = "Write a note for your partner. Send it to them after the call ends.";
                    shuffle = false;
                    break;
            }
        } else {
            if (room.past_qns.length >= 15 && room.current_level == 1) {
                deeper = true;
            }
            const qnObj = await qnsORM.findByPk(room.current_qn);
            question = qnObj.qn_string;
        }

        res.render("game", {
            layout: "ingame",
            code,
            question,
            shuffle,
            deeper
        });
    })();
});

router.get("/endgame", (req, res) => {
    res.render("endgame");
});

module.exports = router;