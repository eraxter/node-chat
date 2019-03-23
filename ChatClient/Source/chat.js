'use strict';
angular
    .module('socketChat')
    .controller('ChatController', function ($scope, $location, $socket, $user) {
        if (!$user.name || !$user.room) {
            $location.path('/');
            return;
        }

        var lookupName = function (id) {
            var name = '';
            $.each($scope.users, function () {
                if (id === this.id) {
                    name = this.name;
                }
            });
            return name;
        };

        var showMessage = function (message) {
            var chatWindow = $('#chatWindow');
            if (message) {
                var className = typeof message.to === 'undefined' ? 'info' : message.to === $user.room ? 'public' : 'private';
                var msg = message.text;
                if (className === 'public') {
                    if (message.from === $user.id) {
                        msg = 'me: ' + msg;
                    }
                    else {
                        msg = lookupName(message.from) + ': ' + msg;
                    }
                }
                else if (className === 'private') {
                    if (message.to === $user.id) {
                        msg = '[from ' + lookupName(message.from) + ']: ' + msg;
                    }
                    else {
                        msg = '[to ' + lookupName(message.to) + ']: ' + msg;
                    }
                }
                $('<p>').addClass(className).html(msg).appendTo(chatWindow);
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
                    $('<p>').html(this.name).appendTo(userWindow);
                    if ($user.id !== this.id) {
                        $('<option>').attr('value', this.id).html(this.name).appendTo(userList);
                    }
                });
            }
        };
        
        $scope.text = '';
        $scope.user = $user;
        $scope.users = new Array();
        $scope.leaveChat = function () {
            $socket.close();
            $location.path('/');
        };
        $scope.sendMessage = function () {
            var message = {
                to: $('#userList').val(),
                from: $user.id,
                text: $scope.text
            };
            if (message.to && message.text) {
                $socket.send('message', message);
                showMessage(message);
                $scope.text = '';
            }
        };

        $socket.options.query = 'name=' + $user.name + '&room=' + $user.room;

        $socket.open();

        $socket.on('connect', function () {
            $user.id = this.id;
            showMessage({ text: '<strong>welcome to the chat!</strong>' });
        });

        $socket.on('disconnect', function () {
            showMessage({ text: '<strong class="text-danger">disconnected from server!</strong>' });
        });

        $socket.on('message', showMessage);

        $socket.on('users', showUsers);
    });
