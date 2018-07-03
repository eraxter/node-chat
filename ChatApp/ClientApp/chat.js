(function () {
    'use strict';

    angular
        .module('socketChat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$location', '$socket', '$user'];

    function ChatController($location, $socket, $user) {
        var self = this;

        if (!$socket || !$user.name || !$user.room) {
            $location.path('/');
        }

        self.user = $user;
        self.users = new Array();
        self.to = self.user.room;
        self.text = '';

        self.showMessage = function (message) {

        };

        self.listUsers = function (users) {

        };

        self.leaveChat = function () {
            $socket.close();
            $location.path('/');
        };

        $socket.on('connect', function () {

        });

        $socket.on('disconnect', function () {

        });

        $socket.on('message', self.showMessage);

        $socket.on('users', self.listUsers);
    }
})();
