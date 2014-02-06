'use strict';

var Hapi = require('hapi'),
    settings = require('./config'),
    server = settings.servers[0];

// NOTE: This all could be done using hapi composer config files.
// and by running `hapi -c config.json`

var app = new Hapi.Server(server.host, server.port);
app.pack.require('../', settings.plugins.chivebot, function (err) {
    if (err) {
        throw err;
    }

    app.start(function () {
        if (err) {
            throw err;
        }
        console.log('Server started at', app.info.uri);
    });
});