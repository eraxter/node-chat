(function () {
    'use strict';

    angular
        .module('socketChat')
        .controller('MainController', MainController);

    MainController.$inject = ['$location', '$socket', '$user'];

    function MainController($location, $socket, $user) {
        var self = this;

        function connect() {
            if (self.user.name && self.user.room) {
                $location.path('/chat');
            }
        }

        self.user = $user;
        self.connect = connect;
    }
})();
