(function () {
    'use strict';

    angular
        .module('socketChat', ['ngRoute'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: 'MainController as main',
                    templateUrl: '/ClientApp/main.html'
                })
                .when('/chat', {
                    controller: 'ChatController as chat',
                    templateUrl: '/ClientApp/chat.html'
                })
                .otherwise({ redirectTo: '/' });
        })
        .factory('$socket', function () {
            return new Socket('localhost:8081', { secure: true });
        })
        .factory('$user', function () {
            return { id: '', name: '', room: 'testing' };
        });
})();
