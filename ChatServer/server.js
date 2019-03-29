'use strict';
var fs = require('fs');
var port = 8081;

var options = {
    transports: ['polling', 'websocket'],
    pingInterval: 10000
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
        ca = clients.filter(function (client) {
            return room === client.handshake.query.room;
        });
    }
    return ca.map(function (client) {
        return { id: client.id, name: client.handshake.query.name };
    });
};

io.on('connection', function (client) {
    var name = client.handshake.query.name;
    var room = client.handshake.query.room;

    if (!name || !room) {
        client.disconnect(true);
    }
    else {
        clients.push(client);

        client.on('disconnect', function () {
            clients.splice(clients.indexOf(client), 1);
            client.to(room).emit('message', { text: name + ' has left the chat.' });
            var users = getClients(room);
            client.to(room).emit('users', users);
        });

        client.on('message', function (message) {
            if (message && message.to) {
                client.to(message.to).emit('message', message);
            }
        });

        client.join(room, function () {
            client.to(room).emit('message', { text: name + ' has joined the chat.' });
            var users = getClients(room);
            client.to(room).emit('users', users);
            client.emit('users', users);
        });
    }
});

server.listen(port);
console.log('server is listening on port ' + port);