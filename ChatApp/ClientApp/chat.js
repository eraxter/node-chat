(function () {
    'use strict';

    angular
        .module('socketChat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$location', '$socket', '$user'];

    function ChatController($location, $socket, $user) {
        var self = this;

        function lookupName(id) {
            var name = '';
            if (self.users) {
                $.each(self.users, function () {
                    if (this.id === id) {
                        name = this.name;
                    }
                });
            }
            return name;
        }

        function showMessage(message) {
            var chatWindow = $('#ChatWindow');

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
        }

        function listUsers(users) {
            var userSelect = $('#UserSelect');
            var usersWindow = $('#UsersWindow');

            if (users) {
                self.users = users;
                usersWindow.html('');
                userSelect.find('option[value!="' + self.user.room + '"]').remove();

                $.each(self.users, function () {
                    var username = this.name;
                    if (this.id === self.user.id) {
                        username = '&#9733;' + username;
                    }

                    $('<p>').attr('id', this.id).html(username).appendTo(usersWindow);
                    $('<option>').attr('value', this.id).html(this.name).appendTo(userSelect);
                });

                userSelect.find('option[value="' + self.user.id + '"]').remove();
            }
        }

        function sendMessage() {
            var msg = {
                to: $('#UserSelect').val(),
                from: self.user.id,
                text: self.text.trim()
            };
            if (msg.to && msg.text) {
                $socket.send('message', msg);
                showMessage(msg);
                self.text = '';
            }
        }

        function leaveChat() {
            $socket.close();
            $location.path('/');
        }

        if (!$socket || !$user.name || !$user.room) {
            $location.path('/');
            return;
        }

        $socket.options.query = 'name=' + $user.name + '&room=' + $user.room;
        $socket.open();

        $socket.on('connect', function () {
            self.user.id = this.id;
            showMessage({ text: '<strong>welcome to the chat!</strong>' })
        });

        $socket.on('disconnect', function () {
            showMessage({ text: '<strong style="color:red;">disconnected from server</strong>' });
        });

        $socket.on('message', showMessage);

        $socket.on('users', listUsers);

        self.text = '';
        self.user = $user;
        self.users = new Array();
        self.leaveChat = leaveChat;
        self.sendMessage = sendMessage;
    }
})();
