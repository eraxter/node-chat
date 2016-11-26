/**
 * Created by Erik on 11/25/2016.
 */

(function () {
    "use strict";

    var PORT = 8081;
    var options = {
        transports: ['polling','websocket'],
        pingInterval: 10000
    };
    var fs = require('fs');
    var server = require('https').createServer({
        key: fs.readFileSync('C:/certs/ERIKDEV.key'),
        cert: fs.readFileSync('C:/certs/ERIKDEV.crt')
    }, function (request, response) {
        //response.writeHead(200);
        //response.end('<h1>This is a test</h1>');
    });
    var io = require('socket.io')(server, options);
    var clients = [];

    var isNullOrEmpty = function (str) {
        return (typeof str == 'undefined' || str == null || str == '');
    };

    var getClients = function (room) {
        if (!isNullOrEmpty(room)) {
            return clients.filter(function (client) {
                var name = client.handshake.query.name;
                return (!isNullOrEmpty(client.rooms[room]) && !isNullOrEmpty(name));
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

    var getUser = function (id) {
        var users = getUsers('/#' + id);
        return (users.length == 1) ? users[0] : null;
    };

    io.on('connection', function (client) {

        var id = client.conn.id;
        var name = client.handshake.query.name;
        var room = client.handshake.query.room;

        if (isNullOrEmpty(name)) {

        }

        if (isNullOrEmpty(room)) {

        }

        client.join(room, function () {
            var users = getUsers(room);
            //tell others in the room a user has joined
            client.to(room).emit('message', { text: name + ' has joined the chat.' });
            //tell others in the room to update their user lists
            client.to(room).emit('users', users);
            //tell the new user who else is in the room
            client.emit('users', users);
        });

        clients.push(client);
        console.log('client connected; clients = ' + clients.length);

        client.on('disconnect', function () {
            clients.splice(clients.indexOf(client), 1);
            console.log('client disconnected; client = ' + clients.length);
            if (!isNullOrEmpty(room)) {
                var users = getUsers(room);
                //tell others in the room a user has left
                client.to(room).emit('message', { text: name + ' has left the chat.' });
                //tell others in the room to update their user list
                client.to(room).emit('users', users);
            }
        });

        client.on('message', function (message) {
            if (!isNullOrEmpty(message.to)) {
                if (message.to == room) {
                    //send a message to the room
                    client.to(room).emit('message', message);
                }
                else {
                    //send a private message to another user
                    client.to(message.to).emit('message', message);
                }
            }
        });

    });

    server.listen(PORT);
    console.log('Server is listening on port ' + PORT);

})();
