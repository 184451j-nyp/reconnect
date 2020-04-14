const roomORM = require("../models/Room");
const socketIO = require("socket.io");
const redis = require("socket.io-redis");

const bindListener = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinRoom", (room) => {
            socket.join(room);
        });
        socket.on("refresh", () => {
            var roomCode = Object.keys(socket.rooms)[0];
            socket.to(roomCode).emit("refresh", roomCode);
        });
        socket.on("disconnect", () => {
        });
    });
}

module.exports = (server) => {
    const io = socketIO(server);
    io.adapter(redis({ host: 'localhost', port: 6379 }));
    bindListener(io);
}