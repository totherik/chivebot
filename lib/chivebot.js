'use strict';

var path = require('path'),
    util = require('util'),
    exec = require('child_process').exec;

var script = path.join(__dirname, 'parse.js');

function noop(raw, args, cb) {
    cb(null, '');
}

exports.create = function (options) {
    var commands;

    options = options || {};
    commands = {};

    return {
        handler: function chivebot(req, reply) {
            var cmd;

            cmd = util.format('node %s %s', script, req.payload.text);

            exec(cmd, function (err, stdout, stderr) {
                var args, handler;

                if (err) {
                    reply(err);
                    return;
                }

                if (stderr) {
                    reply(new Error(stderr));
                    return;
                }

                args = stdout.split(0x1c);
                args.unshift('chivebot');

                console.log(args);
                handler = commands[args[1]] || noop;
                handler(req.payload, args, function (err, data) {
                    reply(err || { text: data });
                });
            });

        },

        registerCommand: function registerCommand(name, fn) {
            commands[name] = fn;
        }
    };
};