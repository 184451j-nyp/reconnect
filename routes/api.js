'use strict';
const express = require('express');
const router = express.Router();
const roomORM = require("../models/Room");
const qnsORM = require("../models/Question");

router.get("/shuffle", (req, res) => {
    var code = req.session.roomCode;
    var shuffle = true;
    var deeper = false;
    var question = "";
    (async () => {
        const room = await roomORM.findByPk(code);
        let room_past_qns = room.past_qns;
        let room_current_qn = room.current_qn;
        let room_current_level = room.current_level;
        room_past_qns.push(room.current_qn);

        const totalByClass = await qnsORM.findAll({
            where: {
                qn_rating: room.current_level
            }
        });

        if (room_past_qns.length >= totalByClass.length) {
            switch (room_current_level) {
                case 1:
                    question = "It's time to go deeper.";
                    room_current_qn = -2;
                    req.session.roomQn = -2;
                    shuffle = false;
                    deeper = true;
                    break;
                case 2:
                    question = "Write a note for your partner. Send it to them after the call ends.";
                    req.session.roomQn = -3;
                    room_current_qn = -3;
                    shuffle = false;
                    break;
                default:
                    res.end();
                    return;
            }
        } else {
            if (room_past_qns.length >= 15 && room_current_level == 1) {
                deeper = true;
            }
            let randomInt;
            let qnObjId;
            do {
                randomInt = Math.floor(Math.random() * totalByClass.length);
                qnObjId = totalByClass[randomInt].qn_id;
            } while (room_past_qns.includes(qnObjId));

            room_current_qn = qnObjId;
            question = totalByClass[randomInt].qn_string;
            req.session.roomQn = qnObjId;
        }

        room.past_qns = room_past_qns;
        room.current_level = room_current_level;
        room.current_qn = room_current_qn;
        await room.save();

        res.render("panel", {
            layout: false,
            question,
            shuffle,
            deeper
        });
    })();
});

router.get("/deeper", (req, res) => {
    var code = req.session.roomCode;
    (async () => {
        const room = await roomORM.findByPk(code);
        if (room.current_level == 1) {
            room.current_level = 2;
            room.past_qns = [];
            await room.save();
            res.redirect("/api/shuffle");
        } else {
            res.end();
        }
    })();
});

router.get("/refresh", (req, res) => {
    var code = req.session.roomCode;
    var shuffle = true;
    var deeper = false;
    var question = "";

    if(code == null){
        res.redirect("/");
        return;
    }

    (async () => {
        const room = await roomORM.findByPk(code);
        if(room == null){
            res.redirect("/api/refresh");
            return;
        }
        else if (req.session.roomQn == room.current_qn) {
            res.end();
            return;
        }

        if (room.current_qn < 0) {
            switch (room.current_qn) {
                case -1:
                    question = "Tell me your story.";
                    req.session.roomQn = -1;
                    break;
                case -2:
                    question = "Let's dig deeper.";
                    req.session.roomQn = -2;
                    shuffle = false;
                    deeper = true;
                    break;
                case -3:
                    question = "Write a note for your partner. Send it to them after the call ends.";
                    req.session.roomQn = -3;
                    shuffle = false;
                    break;
                default:
                    res.end();
                    return;
            }
        } else {
            if (room.past_qns.length >= 15 && room.current_level == 1) {
                deeper = true;
            }
            req.session.roomQn = room.current_qn;
            const qnObj = await qnsORM.findByPk(room.current_qn);
            question = qnObj.qn_string;
        }

        res.render("panel", {
            layout: false,
            question,
            shuffle,
            deeper
        });
    })();
});

module.exports = router;