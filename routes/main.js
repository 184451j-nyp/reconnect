'use strict';
const express = require('express');
const router = express.Router();
const rm = require("../models/Room");
const qn = require("../models/Question");

router.get("/", (req, res) => {
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
        rm.create({
            room_id: id,
            past_qns: JSON.stringify([]),
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
        let room = await rm.findByPk(id);
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
    (async () => {
        let id = req.session.roomCode;
        let shuffle = true;
        let deeper = false;
        const room = await rm.findByPk(id);
        var arr = JSON.parse(room.past_qns);
        var question = "";
        if (arr.length >= 15 && room.current_level == 1) {
            deeper = true;
        }
        if (room.current_qn == 0) {
            question = "Tell Me Your Story";
        } else {
            let rt = await qn.findByPk(room.current_qn);
            question = rt.qn_string
        }
        res.render("game", {
            code: id,
            question,
            shuffle,
            deeper
        });
    })();
});

router.get("/partialshuffle", (req, res) => {
    let code = req.session.roomCode;
    let shuffle = true;
    let deeper = false;
    (async () => {
        const room = await rm.findByPk(code);
        var arr = JSON.parse(room.past_qns);
        arr.push(room.current_qn);
        var qnSet = await qn.findAll({
            where: {
                qn_rating: room.current_level
            },
            raw: true
        });
        var question = qnSet[Math.floor(Math.random() * qnSet.length)];
        while(arr.includes(question.qn_id)){
            question = qnSet[Math.floor(Math.random() * qnSet.length)];
        }
        room.current_qn = question.qn_id;

        rm.update({
            past_qns: JSON.stringify(arr),
            current_qn: room.current_qn
        }, {
            where: {
                room_id: code
            }
        });

        if(room.past_qns.length >= 15 && room.current_level == 1){
            deeper = true;
        }

        res.send(question.qn_string);
    })();
});

router.get("/partialdeeper", (req, res) => {

});

router.get("/refresh", (req, res) => {
    (async() => {
        const id = req.session.roomCode;
        const room = await rm.findByPk(id);
        if(room.current_qn != 0){
            const question = await qn.findByPk(room.current_qn);
            res.send(question.qn_string);
        }
        else{
            res.end();
        }
    })();
})

module.exports = router;