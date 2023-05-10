'use strict';
var fs = require('fs');
var port = process.env.PORT || 8081;
var options = {
    transports: ['polling', 'websocket'],
    pingInterval: 10000,
    cors: {
        origin: 'https://localhost:44325'
    }
};
var server = require('https').createServer({
    cert: fs.readFileSync('./certs/cert.crt'),
    key: fs.readFileSync('./certs/key.pem')
});
var io = require('socket.io')(server, options);
var clients = [];
var getClients = function (room) {
    var ca = clients;

    if (room) {
        ca = clients.filter(function (socket) {
            return socket.rooms.has(room);
        });
    }

    return ca.map(function (socket) {
        return { id: socket.id, name: socket.handshake.query.name };
    });
};

io.on('connection', function (socket) {
    var name = socket.handshake.query.name;
    var room = socket.handshake.query.room;

    if (!name || !room) {
        socket.disconnect(true);
        return;
    }

    clients.push(socket);

    socket.on('disconnect', function () {
        clients.splice(clients.indexOf(socket), 1);
        socket.to(room).emit('message', { text: name + ' has left the chat' });
        socket.leave(room);
        io.to(room).emit('users', getClients(room));
    });

    socket.on('message', function (message) {
        if (message && message.to) {
            socket.to(message.to).emit('message', message);
        }
    });

    socket.join(room);
    socket.to(room).emit('message', { text: name + ' has joined the chat' });
    io.to(room).emit('users', getClients(room));
});
server.listen(port);
console.log('server is listening on port ' + port);