'use strict';
angular
    .module('socketChat')
    .controller('MainController', function ($scope, $location, $socket, $user) {
        $scope.user = $user;

        $scope.connect = function () {
            if ($user.name && $user.room) {
                $location.path('/chat');
            }
        };
    });