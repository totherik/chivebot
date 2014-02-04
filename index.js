'use strict';

var hapi = require('hapi'),
    pkg = require('./package'),
    chivebot = require('./lib/chivebot');


module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {
        var bot = chivebot.create(options);

        plugin.ext('onPreHandler', function (req, next) {
            var trigger, text;

            if (!req.payload) {
                next(hapi.error.notFound());
                return;
            }

            if (req.payload.token !== options.token) {
                next(hapi.error.unauthorized('Invalid token'));
                return;
            }

            if (req.payload['user_name'] === options['user_name']) {
                next({ text: '' });
                return;
            }

            trigger = options['trigger_word'];
            text = req.payload.text;
            if (trigger && text.indexOf(trigger) === 0) {
                req.payload.text = text.slice(text.indexOf(' ') + 1);
            }

            next();
        });


        plugin.route({
            method: 'POST',
            path: '/',
            vhost: options.vhost,
            config: {
                handler: bot.handler
            }
        });


        plugin.events.on('log', function (event, tags) {
            console.log(event);
        });


        plugin.expose({
            registerCommand: bot.registerCommand.bind(bot)
        });

        next();
    }

};