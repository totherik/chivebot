'use strict';

var path = require('path'),
    util = require('util'),
    exec = require('child_process').exec;


var script = path.join(__dirname, 'parse.js');
var slice = Function.prototype.call.bind(Array.prototype.slice);

function noop(raw, args, cb) {
    cb(null, '');
}

/**
 * Inspired by http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony
 * @param fn the method which it's not know if it's sync or async
 * @param cb the callback to be invoked upon resolution of fn
 */
function async(fn, cb) {
    var sync;

    function wrapper() {
        var args, complete;

        args = slice(arguments);
        args.unshift(null);

        complete = Function.prototype.bind.apply(cb, args);
        if (sync) {
            setImmediate(complete);
            return;
        }
        complete();
    }

    sync = true;
    fn(wrapper);
    sync = false;
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

                handler = commands[args[1]] || noop;
                async(handler.bind(null, req.payload, args), function (err, data) {
                    reply(err || { text: data });
                });
            });

        },

        registerCommand: function registerCommand(name, fn) {
            commands[name] = fn;
        }
    };
};