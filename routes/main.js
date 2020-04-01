'use strict';
const express = require('express');
const router = express.Router();
const rm = require("../models/Room");
const qn = require("../models/Question");

router.get("/", (req, res) => {
    req.session.destroy();
    res.render("index");
});

router.get("/enter", (req, res) => {
    res.render("enter", {
        fail: req.flash("fail")
    });
});

router.get("/create", (req, res) => {
    (async () => {
        var id = (Math.floor(Math.random() * (999999 - 10)) + 10).toString().padStart(6, "0");
        var room = await rm.findByPk(id);
        while (room != null) {
            id = (Math.floor(Math.random() * (999999 - 10)) + 10).toString().padStart(6, "0");
            room = await rm.findByPk(id);
        }
        await rm.create({
            room_id: id,
            past_qns: [],
            current_qn: 0,
            current_level: 1
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
            res.redirect("/game");
        }
    })();
});

router.get("/game", (req, res) => {
    var id = req.session.roomCode;
    var shuffle = true;
    var deeper = false;
    var question = "";
    (async () => {
        const room = await rm.findByPk(id);
        
        if (room.past_qns >= 15 && room.current_level == 1) {
            deeper = true;
        }
        if (room.current_qn == 0) {
            switch(room.current_level){
                case 1:
                    question = "Tell Me Your Story.";
                    break;
                case 2:
                    question = "It's time to go deeper.";
                    break;
                default:
                    question = "Good job. You broke it.";
                    break;
            }
        }
        else {
            const rt = await qn.findByPk(room.current_qn);
            question = rt.qn_string;
        }
        res.render("game", {
            code: id,
            question,
            shuffle,
            deeper
        });
    })();
});

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
        
        let totalByClass = await qn.findAll({
            where: {
                qn_rating: room.current_level
            }
        });

        if (room.past_qns.length == totalByClass.length) {
            switch (room.current_level) {
                case 1:
                    question = "It's time to go deeper.";
                    deeper = true
                    break
                case 2:
                    question = "That's it, we're done. I don't know what else to tell you.";
                    break;
                default:
                    question = "Good job. You somehow broke this thing.";
                    break;
            }
            room_current_qn = 0;
            shuffle = false;
        } else {
            let random;
            let selectQnId;
            do{
                random = Math.floor(Math.random() * totalByClass.length);
                selectQnId = totalByClass[random].qn_id;
            } while(room_past_qns.includes(selectQnId));
            room_current_qn = selectQnId;
            const qnObj = await qn.findByPk(selectQnId);
            question = qnObj.qn_string;

            if(room_past_qns.length >= 15 && room_current_level == 1) {
                deeper = true;
            }
        }
        
        rm.update({
            past_qns: room_past_qns,
            current_level: room_current_level,
            current_qn: room_current_qn
        }, {where: {room_id: room.room_id}});

        res.render("panel", {
            layout: false,
            question,
            shuffle,
            deeper
        });
    })();
});

router.get("/deeper", (req, res) => {
    let code = req.session.roomCode;
    (async () => {
        await rm.update({
            current_level: 2,
            past_qns: []
        }, {
            where: {
                room_id: code
            }
        });
        res.redirect("/shuffle");
    })();
});

router.get("/refresh", (req, res) => {
    (async () => {
        let id = req.session.roomCode;
        const room = await rm.findByPk(id);
        if (room.current_qn != 0) {
            const question = await qn.findByPk(room.current_qn);
            res.send(question.qn_string);
        } else {
            res.end();
        }
    })();
})

module.exports = router;