/**
 * Created by Erik on 2/5/2016.
 */

(function () {
    "use strict";

    var ChatController = function ($location, socket, user) {

        var self = this;

        var isNullOrEmpty = function (str) {
            return (typeof str == 'undefined' || str == null || str == '');
        };

        if (isNullOrEmpty(user.name)) {
            $location.path('/');
            return;
        }

        self.user = user;
        self.users = [];
        self.to = self.user.room;
        self.text = "";

        var lookupName = function (id) {
            var name = '';
            $.each(self.users, function () {
                if (this.id == id)
                    name = this.name;
            });
            return name;
        };

        var postMessage = function (data) {
            var name = '';
            var chatWindow = $('#chatWindow');
            if (!isNullOrEmpty(data.to)) {
                if (data.to == self.user.room)
                    name = (data.from == self.user.id) ? 'me: ' : lookupName(data.from) + ': ';
                else if (data.to == self.user.id)
                    name = '[from ' + lookupName(data.from) + ']: ';
                else
                    name = '[to ' + lookupName(data.to) + ']: ';
            }
            $('<p>')
                .addClass(!isNullOrEmpty(data.to) ? (data.to == self.user.room ? 'public' : 'private') : 'info')
                .html(name + data.message)
                .appendTo(chatWindow);
            chatWindow.scrollTop(chatWindow[0].scrollHeight);
        };

        var showUsers = function (users) {
            self.users = users;
            var userWindow = $('#userWindow').html('');
            $('#userSelect').find('option[value!="' + self.user.room + '"]').remove();
            $.each(self.users, function () {
                $('<p>')
                    .attr('id', this.id)
                    .html(this.id == self.user.id ? '&#9733;' + this.name + '&#9733;' : this.name)
                    .appendTo('#userWindow');
                if (this.id != self.user.id) {
                    $('<option>')
                        .attr('value', this.id)
                        .html(this.name)
                        .appendTo('#userSelect');
                }
            });
            userWindow.find('#' + self.user.id).insertBefore(userWindow.children().eq(0));
        };

        socket.on('connect', function () {
            console.log('connected to ' + socket.host);
            postMessage({ message: 'joinging room ' + self.user.room + ' ...'})
            self.user.id = this.id
        });

        socket.on('disconnect', function () {
            postMessage({ message: '<strong style="color:red">disconnected from server</strong>' });
        });

        socket.on('users', showUsers);

        socket.on('message', postMessage);


        self.send = function () {
            var data = {
                to: self.to,
                from: self.user.id,
                message: self.text.trim()
            };
            postMessage(data);
            socket.send('message', data);
            self.text = '';
        };

        self.insertLink = function () {
            var text = !isNullOrEmpty(self.text) ? self.text : prompt('url:');
            if (!isNullOrEmpty(text)) {
                self.text = '<a href="' + text + '">' + text + '</a>';
            }
        };

    };

    angular
        .module('socketChat')
        .controller('ChatController', ['$location', 'socket', 'user', ChatController]);

})();