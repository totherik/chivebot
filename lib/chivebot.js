'use strict';

var cool = require('cool-ascii-faces');


module.exports = function chivebot(req, reply) {
    console.log(req.payload);
//    reply({ text: cool() });
    reply({ text: '' });
};