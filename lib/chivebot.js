'use strict';

var Hapi = require('hapi');
var Minimist = require('minimist');


exports.create = function (/* options */) {
    var commands = Object.create(null);

    return {

        handler: function handler(req, reply) {
            var cmd, handler;

            cmd = Minimist(req.payload.text.split(' '));
            handler = commands[cmd._[0]];

            if (typeof handler === 'function') {

                cmd._.unshift('chivebot');
                handler(req.payload, cmd, function (err, data) {
                    reply(err || { text: String(data) });
                });

            } else {
                reply(Hapi.error.notFound('Plugin not found.'));
            }
        },

        registerCommand: function registerCommand(name, fn) {
            commands[name] = fn;
        }

    };
};