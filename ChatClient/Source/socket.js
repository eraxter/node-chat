﻿var Socket = (function () {
    'use strict';
    var connection = null;

    var Socket = function (host, options) {
        this.host = host;
        this.options = options || {};

        if (typeof io === 'undefined') {
            this.injectScript();
        }
    };

    Socket.prototype.injectScript = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = (this.options.secure ? 'https://' : 'http://') + this.host + (this.options.path || '/socket.io') + '/socket.io.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    Socket.prototype.open = function () {
        try {
            connection = io.connect(this.host, this.options);
        }
        catch (err) {
            console.error(err);
        }
    };

    Socket.prototype.close = function () {
        try {
            if (connection !== null) {
                connection.close();
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    Socket.prototype.send = function (type, data) {
        try {
            if (connection !== null) {
                connection.emit(type, data);
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    Socket.prototype.on = function (type, handler) {
        try {
            if (connection !== null) {
                connection.on(type, handler);
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    return Socket;
})();