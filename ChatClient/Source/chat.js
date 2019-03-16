﻿(function () {
    'use strict';
    var ChatController = function ($location, $socket, $user) {
        var self = this;

        var leaveChat = function () {
            $socket.close();
            $location.path('/');
        };

        var lookupName = function (id) {
            var name = '';
            $.each(self.users, function () {
                if (id === this.id) {
                    name = this.name;
                }
            });
            return name;
        };

        var sendMessage = function () {
            var message = {
                to: $('#userList').val(),
                from: self.user.id,
                text: self.text
            };
            if (message.to && message.text) {
                $socket.send('message', message);
                showMessage(message);
                self.text = '';
            }
        };

        var showMessage = function (message) {
            var chatWindow = $('#chatWindow');

            if (message) {
                var className = !message.to ? 'info' : message.to === self.user.room ? 'public' : 'private';
                var msg = message.text;

                if (className === 'private') {
                    if (message.to === self.user.id) {
                        msg = '[from ' + lookupName(message.from) + ']: ' + msg;
                    }
                    else {
                        msg = '[to ' + lookupName(message.to) + ']: ' + msg;
                    }
                }

                if (className === 'public') {
                    if (message.from === self.user.id) {
                        msg = 'me: ' + msg;
                    }
                    else {
                        msg = lookupName(message.from) + ': ' + msg;
                    }
                }

                $('<p>').addClass(className).html(msg).appendTo(chatWindow);
                chatWindow.scrollTop(chatWindow[0].scrollHeight);
            }
        };

        var showUsers = function (users) {
            var userList = $('#userList');

            if (users) {
                self.users = users;
                userList.find('option[value!="' + self.user.room + '"]').remove();
                $.each(self.users, function () {
                    if (self.user.id !== this.id) {
                        $('<option>').attr('value', this.id).html(this.name).appendTo(userList);
                    }
                });
            }
        };

        if (!$socket || !$user.name || !$user.room) {
            $location.path('/');
            return;
        }

        $socket.options.query = 'name=' + $user.name + '&room=' + $user.room;

        $socket.open();

        $socket.on('connect', function () {
            self.user.id = this.id;
            showMessage({ text: '<strong>welcome to the chat!</strong>' });
        });

        $socket.on('disconnect', function () {
            showMessage({ text: '<strong class="text-danger">disconnected from server!</strong>' });
        });

        $socket.on('message', showMessage);

        $socket.on('users', showUsers);
        
        self.text = '';
        self.user = $user;
        self.users = new Array();
        self.leaveChat = leaveChat;
        self.sendMessage = sendMessage;
    };
    angular
        .module('socketChat')
        .controller('ChatController', ChatController);
})();