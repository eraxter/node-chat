'use strict';

var port = 8081;
var options = {
    transports: ['polling', 'websocket'],
    pingInterval: 10000
};

var fs = require('fs');

var server = require('https').createServer({
    key: fs.readFileSync('C:/certs/key.pem'),
    cert: fs.readFileSync('C:/certs/cert.crt')
}, function (request, response) {
    response.writeHead(200);
    response.end();
});

var io = require('socket.io')(server, options);

var clients = new Array();

var getClients = function (room) {
    if (room) {
        return clients.filter(function (client) {
            return (client.rooms[room] && client.handshake.query.name)
        });
    }
    return clients;
};

var getUsers = function (room) {
    var users = getClients(room);
    return users.map(function (user) {
        return { id: user.id, name: user.handshake.query.name };
    });
};

io.on('connection', function (client) {
    var name = client.handshake.query.name;
    var room = client.handshake.query.room;

    if (!name || !room) {
        return;
    }

    clients.push(client);
    console.log('client ' + name + ' connected, # clients = ' + clients.length);

    client.join(room, function () {
        setTimeout(function () {
            var users = getUsers(room);
            // tell others in the room a user has joined
            client.to(room).emit('message', { to: room, text: name + ' has joined the chat' });
            // tell others in the room to update their user lists
            client.to(room).emit('users', users);
            // tell the new user who else is in the room
            client.emit('users', users);
        }, 500);
    });

    client.on('disconnect', function () {
        clients.splice(clients.indexOf(client), 1);
        console.log('client ' + name + ' disconnected, # clients = ' + clients.length);
        setTimeout(function () {
            var users = getUsers(room);
            // tell others in the room a user has left
            client.to(room).emit('message', { to: room, text: name + ' has left the chat' });
            // tell others in the room to update their user list
            client.to(room).emit('users', users);
        }, 500);
    });

    client.on('message', function (message) {
        if (message && message.to) {
            // send a message
            client.to(message.to).emit('message', message);
        }
    });
});

server.listen(port);
console.log('server is listening on port ' + port);
