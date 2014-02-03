'use strict';

var hapi = require('hapi'),
    pkg = require('./package'),
    chivebot = require('./lib/chivebot');


module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.ext('onPreHandler', function (req, next) {
            if (req.payload.token !== options.token) {
                next(hapi.error.unauthorized('Invalid token'));
                return;
            }
            next();
        });


        plugin.route({
            method: 'POST',
            path: '/chivebot',
            vhost: options.vhost,
            config: {
                handler: chivebot
            }
        });


        plugin.events.on('log', function (event, tags) {
            console.log(event);
        });
        
        next();
    }

};