(function () {
    'use strict';

    var MainController = (function ($location, socket, user) {

        var self = this;

        self.user = user;

        self.connect = function () {
            socket.options.query = 'name=' + self.user.name + '&room=' + self.user.room;
            socket.open();
            $location.path('/chat');
        };

    });

    angular
        .module('nodeChat')
        .controller('MainController', ['$location', 'socket', 'user', MainController]);

})();