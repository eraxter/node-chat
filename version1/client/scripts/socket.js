/**
 * Created by Erik on 11/25/2016.
 */

var Socket = (function () {
    "use strict";

    var connection = null;

    var isNullOrEmpty = function (str) {
        return (typeof str == 'undefined' || str == null || str == '');
    };

    function Socket(host, options) {
        if (!(this instanceof Socket)) {
            return new Socket(host, options);
        }
        options = options || {};

        this.host = host;
        this.options = options;

        if (typeof io == 'undefined') {
            this.injectClientScript();
        }
    }

    Socket.prototype.injectClientScript = function () {

        if (!isNullOrEmpty(this.host)) {
            var script = document.createElement('script');
            script.src = (this.options.secure == true ? 'https://' : 'http://') +
                this.host + (this.options.path || '/socket.io') + '/socket.io.js';
            document.getElementsByTagName('head')[0].appendChild(script);
        }

    };

    Socket.prototype.isConnected = function () {
        return (connection != null && connection.connected == true);
    };

    Socket.prototype.getId = function () {
        return (connection != null && !isNullOrEmpty(connection.id)) ? connection.id : null;
    };

    Socket.prototype.open = function (callback) {
        try {
            if (isNullOrEmpty(this.host)) {
                throw new Error('host is null or empty')
            }
            connection = io.connect(this.host, this.options);
            if (typeof callback == 'function') {
                callback(this);
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    Socket.prototype.close = function () {
        try {
            connection.close();
        }
        catch (err) {
            console.error(err);
        }
    };

    Socket.prototype.send = function (type, data) {
        try {
            connection.emit(type, data);
        }
        catch (err) {
            console.error(err);
        }
    };

    Socket.prototype.on =
        Socket.prototype.receive = function (type, handler) {
            try {
                connection.on(type, handler);
            }
            catch (err) {
                console.error(err);
            }
        };

    return Socket;

})();
