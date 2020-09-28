const roomORM = require("../models/Room");
const socketIO = require("socket.io");

const bindListener = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinRoom", (room) => {
            socket.join(room);
        });
        socket.on("refresh", () => {
            let roomCode = Object.keys(socket.rooms)[0];
            socket.to(roomCode).emit("refresh", roomCode);
        });
        socket.on("disconnect", () => {
        });
    });
}

module.exports = (server) => {
    const io = socketIO(server);
    bindListener(io);
}