/**
 * Created by Erik on 2/5/2016.
 */

(function () {
    "use strict";

    process.title = 'node-chat';

    var PORT = 8081;
    var options = {
        transports: ['polling', 'websocket'],
        pingInterval: 10000
    };
    var fs = require('fs');
    var server = require('https').createServer({
        key: fs.readFileSync('certs/server.key'),
        cert: fs.readFileSync('certs/server.crt')
    }, function (request, response) {
        //response.writeHead(200);
        //response.end();
    });
    var io = require('socket.io')(server, options);
    var clients = [];

    var isNullOrEmpty = function (str) {
        return (typeof str == 'undefined' || str == null || str == '');
    };

    var getClients = function (room) {
        if (!isNullOrEmpty(room)) {
            return clients.filter(function (client) {
                return (!isNullOrEmpty(client.rooms[room]) && !isNullOrEmpty(client.handshake.query.name));
            });
        }
        return clients;
    };

    var getUsers = function (room) {
        var users = getClients(room);
        return users.map(function (user) {
            return { id: user.id.slice(2), name: user.handshake.query.name };
        });
    };

    var getUser = function (id) {
        var users = getUsers('/#' + id);
        return (users.length == 1 ? users[0] : null);
    };

    io.on('connection', function (client) {

        var id = client.conn.id;
        var name = client.handshake.query.name || "";
        var room = client.handshake.query.room;

        clients.push(client);
        console.log('client ' + name + ' connected; clients = ' + clients.length);

        if (!isNullOrEmpty(room)) {
            client.join(room, function () {
                var users = getUsers(room);
                // tell others in room a user has joined
                client.to(room).emit('message', { message: name + ' has joined the chat' });
                // tell others in room to update their user lists
                client.to(room).emit('users', users);
                // tell the user that just joined who else is in the room
                client.emit('users', users);
            });
        }

        client.on('disconnect', function () {
            clients.splice(clients.indexOf(client), 1);
            if (!isNullOrEmpty(room)) {
                var users = getUsers(room);
                // tell others in room a user has left
                client.to(room).emit('message', { message: name + ' has left the chat' });
                // tell others in room to update their user lists
                client.to(room).emit('users', users);
            }
            console.log('client ' + name + ' disconnected; clients = ' + clients.length);
        });

        client.on('message', function (data) {
            if (!isNullOrEmpty(data.to)) {
                if (data.to == room) {
                    // send a message to the room
                    client.to(room).emit('message', data);
                }
                else {
                    // send a private message to another user
                    client.to('/#' + data.to).emit('message', data);
                }
            }
            else {
                // send a message to all connected clients
                client.broadcast.emit('message', data);
            }
        });

    });

    server.listen(PORT);
    console.log('server is listening on port ' + PORT);

})();
