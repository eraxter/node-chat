'use strict';
angular
    .module('socketChat', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'mainController',
                templateUrl: '/Content/html/main.html'
            })
            .when('/chat', {
                controller: 'chatController',
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
        return new Socket(window.location.hostname);
    })
    .controller('mainController', function ($scope, $location, $user, $socket) {
        $('form.needs-validation').on('submit', function (e) {
            $(this).addClass('was-validated');

            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            else {
                $location.path('/chat');
            }
        });

        $scope.user = $user;
    })
    .controller('chatController', function ($scope, $location, $user, $socket) {
        if (!$user.name || !$user.room) {
            $location.path('/');
            return;
        }

        $('form.needs-validation').on('submit', function (e) {
            $(this).addClass('was-validated');

            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            else {
                sendMessage();
            }
        });

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
                if (id === this.id) {
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

        $socket.options.query = 'name=' + $user.name + '&room=' + $user.room;
        $socket.open();
        $socket.on('connect', connect);
        $socket.on('disconnect', disconnect);
        $socket.on('message', showMessage);
        $socket.on('users', showUsers);
    });