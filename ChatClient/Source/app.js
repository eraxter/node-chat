'use strict';
angular
    .module('socketChat', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'MainController as main',
                templateUrl: '/Views/main.html'
            })
            .when('/chat', {
                controller: 'ChatController as chat',
                templateUrl: '/Views/chat.html'
            })
            .otherwise({ redirectTo: '/' });
    })
    .factory('$socket', function () {
        return new Socket(window.location.hostname + ':8081', { secure: true });
    })
    .factory('$user', function () {
        return { id: '', name: '', room: 'testing' };
    });
