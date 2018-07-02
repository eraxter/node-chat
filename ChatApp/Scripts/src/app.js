(function () {
    'use strict';

    angular
        .module('nodeChat', ['ngRoute'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: 'MainController as main',
                    templateUrl: '../Content/templates/main.html'
                })
                .when('/chat', {
                    controller: 'ChatController as chat',
                    templateUrl: '../Content/templates/chat.html'
                })
                .otherwise({ redirectTo: '/' });
        })
        .factory('socket', function () {
            return new Socket('localhost:8081', { secure: true });
        })
        .factory('user', function () {
            return { id: '', name: '', room: 'test' };
        });

})();