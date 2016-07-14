/**
 * Created by Erik on 2/5/2016.
 */

(function () {
    "use strict";

    var MainController = function ($location, socket, user) {

        var self = this;

        self.user = user;

        self.connect = function () {
            socket.options.query = 'name=' + self.user.name + '&room=' + self.user.room;
            socket.open();
            $location.path('/chat');
        };

    };

    angular
        .module('socketChat')
        .controller('MainController', ['$location', 'socket', 'user', MainController]);

})();