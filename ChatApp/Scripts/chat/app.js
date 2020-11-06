'use strict';
angular
    .module('socketChat', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'MainController',
                templateUrl: '/Content/html/main.html'
            })
            .when('/chat', {
                controller: 'ChatController',
                templateUrl: '/Content/html/chat.html'
            })
            .otherwise({ redirectTo: '/' });
    })
    .factory('$socket', function () {
        return new Socket(window.location.hostname, { secure: true });
    })
    .factory('$user', function () {
        return { id: '', name: '', room: 'testing' };
    });