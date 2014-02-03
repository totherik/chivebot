'use strict';

var cool = require('cool-ascii-faces');


module.exports = function chivebot(req, reply) {
    reply({ text: cool() });
};