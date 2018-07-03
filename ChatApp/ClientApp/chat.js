(function () {
    'use strict';

    angular
        .module('socketChat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$location', '$socket', '$user'];

    function isNullOrEmpty(str) {
        return (typeof str === 'undefined' || str === null || str === '');
    }

    function ChatController($location, $socket, $user) {

        var self = this;

        if (isNullOrEmpty($user.name)) {
            $socket.close();
            $location.path('/');
        }

        self.user = $user;
        self.users = new Array();

        self.to = self.user.room;
        self.text = '';

        self.lookupName = function (id) {
            var name = '';
            $.each(self.users, function () {
                if (id === this.id) {
                    name = this.name;
                }
            });
            return name;
        };

        self.showMessage = function (message) {
            var chatWindow = $('#ChatWindow');

            if (!isNullOrEmpty(message)) {
                var className = isNullOrEmpty(message.to) ? 'info' : (message.to === self.user.room) ? 'public' : 'private';
                var displayMsg = message.text;     

                $('<p>').addClass(className).html(displayMsg).appendTo(chatWindow);
                chatWindow.scrollTop(chatWindow[0].scrollHeight);
            }
        };

        self.listUsers = function (users) {
            var userSelect = $('#UserSelect');
            var usersWindow = $('#UsersWindow');

            if (!isNullOrEmpty(users)) {
                self.users = users;
                userSelect.find('option[value!="' + self.user.room + '"]').remove();
                usersWindow.html('');

                $.each(self.users, function () {
                    $('<option>').attr('value', this.id).html(this.name).appendTo(userSelect);
                    $('<p>').attr('id', this.id).html(this.name).appendTo(usersWindow);
                });

                userSelect.find('option[value=""]').remove();
                usersWindow.find('#' + self.user.id).insertBefore(usersWindow.children().eq(0));
            }
        };

        self.send = function () {
            var message = {
                to: self.to,
                from: self.user.id,
                text: self.text.trim()
            };

            $socket.send('message', message);

            self.text = '';
        };

        self.leave = function () {
            $socket.close();
            $location.path('/');
        };

        $socket.on('connect', function () {
            self.showMessage({ text: '<strong>welcome to the chat!</strong>' });
        });

        $socket.on('disconnect', function () {
            self.showMessage({ text: '<strong style="color:red;">disconnected from server</strong>' });
        });

        $socket.on('message', self.showMessage);

        $socket.on('users', self.listUsers);
    }
})();
