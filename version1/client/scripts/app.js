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
        .directive('bnUser', function () {
            var link = function ($scope, elem, args) {
                var userSelect = $('#userSelect');
                elem.on('click', 'p', function (e) {
                    if (userSelect.find('option[value="' + e.target.id + '"]').length == 1) {
                        userSelect.val(e.target.id);
                    }
                    else {
                        userSelect.val(userSelect.children().eq(0).val())
                    }
                    userSelect.change();
                });
            };
            return { link: link };
        })
        .factory('socket', function () {
            return new Socket('localhost:8081', { secure: false });
        })
        .factory('user', function () {
            return { id: '', name: '', room: 'test' };
        });

})();
