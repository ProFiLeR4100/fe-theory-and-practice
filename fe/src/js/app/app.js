var app = angular.module('LiveChat',[]);

app
    .component('chat', {
        bindings: {
            host: '@',
            port: '@'
        },
        templateUrl: '/templates/chat.html',
        controller: ['$scope', function ($scope) {
            var $ctrl = this;
            var socket;
            $ctrl.signedIn = false;
            $ctrl.messages = [];
            $ctrl.$onInit = function () {
                if (!$ctrl.host || !$ctrl.port) {
                    console.error("No host or port specified.");
                    return;
                }
                if (!io) {
                    console.error("IO library not found.");
                    return;
                }
                socket = io("http://" + $ctrl.host + ":" + $ctrl.port);

                /* Connect events */
                $ctrl.signIn = function (name) {
                    socket.emit('user_connect', name);
                    $ctrl.signedIn = true;
                };

                socket.on('user_connected', function(data) {
                    $ctrl.messages = $ctrl.messages.concat(data);
                    $scope.$apply();
                });

                /* Disconnect events */
                $ctrl.signOut = function () {
                    socket.emit('user_disconnect');
                    $ctrl.signedIn = false;
                };

                $scope.$on('$destroy', function() {
                    socket.emit('user_disconnect');
                    socket.disconnect();
                    $ctrl.signedIn = false;
                });

                /* Messages events */
                $ctrl.sendMessage = function (message) {
                    socket.emit('send_message', message);
                };

                socket.on('receive_message', function(data) {
                    $ctrl.messages = $ctrl.messages.concat(data);
                    $scope.$apply();
                });
            };
        }]
    })
    .component('message', {
        bindings: {
            message: '<'
        },
        templateUrl: '/templates/message.html'
    });