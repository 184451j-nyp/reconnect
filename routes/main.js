'use strict';
const express = require('express');
const router = express.Router();
const roomORM = require("../models/Room");
const qnsORM = require("../models/Question");

router.get("/", (req, res) => {
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
        var id;
        var room;
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
        if (room != null && room.capacity < 2) {
            req.session.roomCode = id;
            req.session.roomQn = room.current_qn;
            let currentCapacity = room.capacity + 1;
            roomORM.update({
                capacity: currentCapacity
            }, {
                where: {
                    room_id: id
                }
            });
            res.redirect("/game");
        } else {
            req.flash("fail", "Invalid join code!");
            res.redirect("/enter");
        }
    })();
});

router.get("/game", (req, res) => {
    var code = req.session.roomCode;
    var shuffle = true;
    var deeper = false;
    var question = "";

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
                    question = "\"Thank you, Mario! But our Princess is in another castle!\"";
                    shuffle = false;
                    break;
            }
        } else {
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

router.get("/shop", (req, res) => {
    res.render("shop");
})

module.exports = router;