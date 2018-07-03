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
        
        
    }
})();
