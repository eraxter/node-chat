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
            .otherwise({
                redirectTo: '/'
            });
    })
    .factory('$user', function () {
        return { id: '', name: '', room: 'testing' };
    })
    .factory('$socket', function () {
        return new Socket(window.location.hostname, { secure: true });
    });

angular
    .module('socketChat')
    .controller('MainController', function ($scope, $location, $user, $socket) {
        var connect = function () {
            if ($user.name && $user.room) {
                $location.path('/chat');
            }
        };

        $scope.user = $user;
        $scope.connect = connect;
    });

angular
    .module('socketChat')
    .controller('ChatController', function ($scope, $location, $user, $socket) {
        if (!$user.name || !$user.room) {
            $location.path('/');
            return;
        }

        var connect = function () {
            $user.id = this.id;
            showMessage({ text: '<strong>welcome to the chat!</strong>' });
        };

        var disconnect = function () {
            showMessage({ text: '<strong class="text-danger">disconnected from server!</strong>' });
        };

        var leaveChat = function () {
            $socket.close();
            $location.path('/');
        };

        var lookupName = function (id) {
            var name = '';

            $.each($scope.users, function () {
                if (this.id === id) {
                    name = this.name;
                }
            });

            return name;
        };

        var sendMessage = function () {
            var message = {
                to: $('#userList').val(),
                from: $user.id,
                text: $scope.text
            };

            if (message.to && message.text) {
                $scope.text = '';
                $socket.emit('message', message);
                showMessage(message);
            }
        };

        var showMessage = function (message) {
            var chatWindow = $('#chatWindow');

            if (message) {
                var cn = message.to ? message.to === $user.room ? 'public' : 'private' : 'info';
                var msg = message.text;

                if (cn == 'public') {
                    if (message.from === $user.id) {
                        msg = 'me: ' + msg;
                    }
                    else {
                        msg = lookupName(message.from) + ': ' + msg;
                    }
                }
                else if (cn == 'private') {
                    if (message.to === $user.id) {
                        msg = '[from ' + lookupName(message.from) + ']: ' + msg;
                    }
                    else {
                        msg = '[to ' + lookupName(message.to) + ']: ' + msg;
                    }
                }

                $('<p>').addClass(cn).html(msg).appendTo(chatWindow);
                chatWindow.scrollTop(chatWindow[0].scrollHeight);
            }
        };

        var showUsers = function (users) {
            var userList = $('#userList');
            var userWindow = $('#userWindow');

            if (users) {
                $scope.users = users;

                userList.find('option[value!="' + $user.room + '"]').remove();
                userWindow.html('');

                $.each($scope.users, function () {
                    if (this.id !== $user.id) {
                        $('<option>').val(this.id).html(this.name).appendTo(userList);
                    }

                    $('<p>').html(this.name).appendTo(userWindow);
                });
            }
        };

        $scope.text = '';
        $scope.user = $user;
        $scope.users = [];
        $scope.leaveChat = leaveChat;
        $scope.sendMessage = sendMessage;

        $socket.options.query = 'name=' + $user.name + '&room=' + $user.room;
        $socket.open();
        $socket.on('connect', connect);
        $socket.on('disconnect', disconnect);
        $socket.on('message', showMessage);
        $socket.on('users', showUsers);
    });