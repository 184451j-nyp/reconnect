'use strict';
const express = require('express');
const router = express.Router();
const rm = require("../models/Room");
const qn = require("../models/Question");

router.get("/shuffle", (req, res) => {
    var code = req.session.roomCode;
    var shuffle = true;
    var deeper = false;
    var question = "";
    (async () => {
        const room = await rm.findByPk(code);
        let room_past_qns = room.past_qns;
        let room_current_qn = room.current_qn;
        let room_current_level = room.current_level;
        room_past_qns.push(room.current_qn);

        const totalByClass = await qn.findAll({
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
                    question = "\"What is a man but the sum of his memories? We are the stories we live, the tales we tell ourselves.\"";
                    room_current_qn = -3;
                    req.session.roomQn = -3;
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

        rm.update({
            past_qns: room_past_qns,
            current_level: room_current_level,
            current_qn: room_current_qn
        }, {
            where: {
                room_id: room.room_id
            }
        });

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
        const room = await rm.findByPk(code);
        if (room.current_level == 1) {
            await rm.update({
                current_level: 2,
                past_qns: []
            }, {
                where: {
                    room_id: code
                }
            });
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

    (async () => {
        const room = await rm.findByPk(code);
        if (req.session.roomQn == room.current_qn) {
            res.end();
            return;
        }

        if (room.current_qn < 0) {
            switch (room.current_qn) {
                case -1:
                    question = "Tell me your story.";
                    break;
                case -2:
                    question = "Let's dig deeper.";
                    shuffle = false;
                    deeper = true;
                    break;
                case -3:
                    question = "\"What is a man but the sum of his memories? We are the stories we live, the tales we tell ourselves.\"";
                    shuffle = false;
                    break;
            }
        } else {
            if (room.past_qns.length >= 15 && room.current_level == 1) {
                deeper = true;
            }
            req.session.roomQn = room.current_qn;
            const qnObj = await qn.findByPk(room.current_qn);
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

router.get("/unload", (req, res) => {
    const id = req.session.roomCode;
    (async () => {
        const room = await rm.findByPk(id);
        var roomCapacity = room.capacity - 1;
        room.update({
            capacity: roomCapacity
        }, {
            where: {
                room_id: id
            }
        });
        req.session = null;
        res.end();
    })();
});

module.exports = router;