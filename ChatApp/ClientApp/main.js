(function () {
    'use strict';

    angular
        .module('socketChat')
        .controller('MainController', MainController);

    MainController.$inject = ['$location', '$socket', '$user'];

    function MainController($location, $socket, $user) {
        var self = this;

        self.user = $user;

        self.connect = function () {
            if (self.user.name && self.user.room) {
                $socket.options.query = 'name=' + self.user.name + '&room=' + self.user.room;
                $socket.open(function () {
                    $location.path('/chat');
                });
            }
        };
    }
})();
