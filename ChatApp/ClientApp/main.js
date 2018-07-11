﻿(function () {
    'use strict';

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

    MainController.$inject = ['$location', '$socket', '$user'];

    angular
        .module('socketChat')
        .controller('MainController', MainController);
})();
