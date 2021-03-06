﻿'use strict';
var Socket = function (host, options) {
    this.host = host || 'localhost';
    this.options = options || { secure: true };
    this.connection = null;

    if (this.host.indexOf(':') < 0) {
        this.host = this.host + ':' + (this.options.port || 8081);
    }

    if (typeof io === 'undefined') {
        this.injectClient();
    }
};

Socket.prototype.injectClient = function () {
    var script = document.createElement('script');
    script.src = (this.options.secure ? 'https://' : 'http://') + this.host + (this.options.path || '/socket.io') + '/socket.io.js';
    document.getElementsByTagName('head')[0].appendChild(script);
};

Socket.prototype.open = function () {
    try {
        this.connection = io.connect(this.host, this.options);
    }
    catch (err) {
        console.error(err);
    }
};

Socket.prototype.close = function () {
    try {
        if (this.connection != null) {
            this.connection.close();
        }
    }
    catch (err) {
        console.error(err);
    }
};

Socket.prototype.emit = function (type, data) {
    try {
        if (this.connection != null) {
            this.connection.emit(type, data);
        }
    }
    catch (err) {
        console.error(err);
    }
};

Socket.prototype.on = function (event, handler) {
    try {
        if (this.connection != null) {
            this.connection.on(event, handler);
        }
    }
    catch (err) {
        console.error(err);
    }
};