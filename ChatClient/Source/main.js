(function () {
    'use strict';
    var MainController = function ($location, $socket, $user) {
        var self = this;

        var connect = function () {
            if (self.user.name && self.user.room) {
                $location.path('/chat');
            }
        };

        self.user = $user;
        self.connect = connect;
    };
    angular
        .module('socketChat')
        .controller('MainController', MainController);
})();