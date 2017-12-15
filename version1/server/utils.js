/**
 * Created by Erik on 6/24/2017.
 */

var exports = module.exports = { };

exports.isNullOrEmpty = function(str) {
    "use strict";
    return (typeof str === 'undefined' || str === null || str === '');
};