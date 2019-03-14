(function () {
    'use strict';

    function ChatController($location, $socket, $user) {
        var self = this;

        var leaveChat = function () {
            $socket.close();
            $location.path('/');
        };

        var lookupName = function (id) {
            var name = '';
            $.each(self.users, function () {
                if (this.id === id) {
                    name = this.name;
                }
            });
            return name;
        };

        var listUsers = function (users) {
            if (users) {
                self.users = users;
            }
        };

        var sendMessage = function () {
            var message = {
                to: '',
                from: self.user.id,
                text: self.text.trim()
            };
            if (message.to && message.text) {
                $socket.send('message', message);
                showMessage(message);
                self.text = '';
            }
        };

        var showMessage = function (message) {
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

                $('<p>').addClass(className).html(msg);
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
            showMessage({ text: '<strong style="color:red;">disconnected from server</strong>' });
        });

        $socket.on('users', listUsers);

        $socket.on('message', showMessage);

        self.text = '';
        self.user = $user;
        self.users = new Array();
        self.leaveChat = leaveChat;
        self.sendMessage = sendMessage;
    }

    ChatController.$inject = ['$location', '$socket', '$user'];

    angular
        .module('socketChat')
        .controller('ChatController', ChatController);
})();