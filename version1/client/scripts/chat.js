/**
 * Created by Erik on 11/25/2016.
 */

(function () {
    "use strict";

    var isNullOrEmpty = function (str) {
        return (typeof str === 'undefined' || str == null || str === '');
    };

    var ChatController = function ($location, socket, user) {

        var self = this;

        if (isNullOrEmpty(user.name)) {
            $location.path('/');
            return;
        }

        self.user = user;
        self.users = [];
        self.to = self.user.room;
        self.text = '';

        self.lookupName = function (id) {
            var name = '';
            $.each(self.users, function () {
                if (this.id === id) {
                    name = this.name;
                }
            });
            return name;
        };

        self.showMessage = function (message) {
            var name = '';
            var className = 'info';
            var chatWindow = $('#chatWindow');

            if (!isNullOrEmpty(message.to)) {
                if (message.to === self.user.room) {
                    name = (message.from === self.user.id) ? 'me: ' : self.lookupName(message.from) + ': ';
                }
                else if (message.to === self.user.id) {
                    name = '[from ' + self.lookupName(message.from) + ']: ';
                }
                else {
                    name = '[to ' + self.lookupName(message.to) + ']: ';
                }
                className = (message.to === self.user.room) ? 'public' : 'private';
            }

            $('<p>').addClass(className).html(name + message.text).appendTo(chatWindow);
            chatWindow.scrollTop(chatWindow[0].scrollHeight);
        };

        self.showUsers = function (users) {
            self.users = users;
            var userWindow = $('#userWindow').html('');

            $('#userSelect').find('option[value!="' + self.user.room + '"]').remove();

            $.each(self.users, function () {
                if (this.name === self.user.name) {
                    self.user.id = this.id;
                    this.name = '&#9733;' + this.name + '';
                }
                $('<p>').attr('id', this.id).html(this.name).appendTo(userWindow);
                if (this.id !== self.user.id) {
                    $('<option>').attr('value', this.id).html(this.name).appendTo('#userSelect');
                }
            });

            userWindow.find('#' + self.user.id).insertBefore(userWindow.children().eq(0));
        };

        self.send = function () {
            var message = {
                to: self.to,
                from: self.user.id,
                text: self.text.trim()
            };
            self.showMessage(message);
            socket.send('message', message);
            self.text = '';
        };

        self.insertLink = function () {
            var text = (!isNullOrEmpty(self.text)) ? self.text.trim() : prompt('URL:');
            if (!isNullOrEmpty(text)) {
                self.text = '<a href="' + text + '">' + text + '</a>';
            }
        };

        socket.on('connect', function () {
            //self.user.id = socket.getId();
            self.showMessage({ text: 'joining the chat ...' });
        });

        socket.on('disconnect', function () {
            self.showMessage({ text: '<strong style="color:red;">disconnected from server.</strong>' });
        });

        socket.on('message', self.showMessage);

        socket.on('users', self.showUsers);

    };

    angular
        .module('socketChat')
        .controller('ChatController', ['$location', 'socket', 'user', ChatController]);

})();