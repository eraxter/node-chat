'use strict';
var fs = require('fs');
var port = 8081;

var options = {
    transports: ['polling', 'websocket'],
    pingInterval: 10000,
    cors: {
        origin: 'https://localhost:44387'
    }
};

var server = require('https').createServer({
    cert: fs.readFileSync('C:/certs/cert.crt'),
    key: fs.readFileSync('C:/certs/key.pem')
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
    }
    else {
        clients.push(socket);

        socket.on('disconnect', function () {
            clients.splice(clients.indexOf(socket), 1);
            socket.leave(room);
            io.to(room).emit('message', { text: name + ' has left the chat' });

            var users = getClients(room);
            io.to(room).emit('users', users);
        });

        socket.on('message', function (message) {
            if (message && message.to) {
                socket.to(message.to).emit('message', message);
            }
        });

        socket.join(room);
        socket.to(room).emit('message', { text: name + ' has joined the chat' });

        var users = getClients(room);
        io.to(room).emit('users', users);
    }
});

server.listen(port);
console.log('server is listening on port ' + port);