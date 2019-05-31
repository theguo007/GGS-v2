const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
const uuidVerification = require("uuid-validate");

// io.origins((origin, callback) => {
//     if (origin !== 'https://jamesbond.azurewebsites.net') {
//       return callback('origin not allowed', false);
//     }
//     callback(null, true);
// });

io.on("connection", socket => {
    console.log(`New client connected`);

    function getGameId(){
        return Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
    }

    // Wait for Game UUID
    socket.on("GameId", GameId => {
        if(!uuidVerification(GameId, 4)){
            socket.emit("Invalid Game ID");
            return;
        }
        // Check how many people are in room
        var room = io.sockets.adapter.rooms[GameId];
        if(!room){
            socket.join(GameId);
            io.to(GameId).emit("Waiting");
        } else if (room.length == 1){
            socket.join(GameId);
            io.to(GameId).emit("Begin");
        } else {
            socket.emit("Full");
        }
    });
    socket.on("MakeMove", Move => {
        socket.to(getGameId()).emit("Move", Move);
    });

    socket.on("Replay", Move => {
        socket.to(getGameId()).emit("Replay");
    });

    socket.on("SyncError", () => {
        socket.to(getGameId()).emit("SyncError");
    })

    socket.on("Is Opponent Still There", () => {
        var room = io.sockets.adapter.rooms[getGameId()];
        if(!room || room.length != 2){
            io.to(getGameId()).emit("Opponent Disconnected");
        };
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });    
});

server.listen(port, () => console.log(`Listening on port ${port}`));
