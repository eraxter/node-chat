(function () {
    'use strict';

    angular
        .module('socketChat')
        .controller('MainController', MainController);

    MainController.$inject = ['$location', '$socket', '$user'];

    function MainController($location, $socket, $user) {
        var self = this;

        self.user = $user;

        
    }
})();
