/**
 * Created by Erik on 11/25/2016.
 */

(function () {
    "use strict";

    angular
        .module('socketChat', ['ngRoute'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/main.html',
                    controller: 'MainController as main'
                })
                .when('/chat', {
                    templateUrl: 'templates/chat.html',
                    controller: 'ChatController as chat'
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
