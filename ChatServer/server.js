'use strict';
var fs = require('fs');
var port = process.env.PORT || 8081;

var options = {
    transports: ['polling', 'websocket'],
    pingInterval: 10000
};

var server = require('https').createServer({
    cert: fs.readFileSync('C:/certs/cert.crt'),
    key: fs.readFileSync('C:/certs/key.pem')
}, function (request, response) {
    response.writeHead(200);
    response.end();
});

var io = require('socket.io')(server, options);

var clients = new Array();

var getUsers = function (room) {
    var users = clients;
    if (room) {
        users = clients.filter(function (client) {
            return typeof client.rooms[room] !== 'undefined';
        });
    }
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

    client.on('disconnect', function () {
        clients.splice(clients.indexOf(client), 1);
        // tell others in the room a user has left
        client.to(room).emit('message', { text: name + ' has left the chat.' });
        // tell others in the room to update their user list
        var users = getUsers(room);
        client.to(room).emit('users', users);
    });

    client.on('message', function (message) {
        if (message && message.to) {
            // send a message
            client.to(message.to).emit('message', message);
        }
    });

    client.join(room, function () {
        // tell others in the room a user has joined
        client.to(room).emit('message', { text: name + ' has joined the chat.' });
        // tell others in the room to update their user list
        var users = getUsers(room);
        client.to(room).emit('users', users);
        // tell the new user who else is in the room
        client.emit('users', users);
    });
});

server.listen(port);
console.log('server is listening on port ' + port);
