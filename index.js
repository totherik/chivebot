'use strict';

var Joi = require('joi');
var Hoek = require('hoek');
var Hapi = require('hapi');
var Package = require('./package');
var Chivebot = require('./lib/chivebot');


var internals = {

    defaults: {},

    authorize: function (token, username) {
        return function authorize(req, reply) {

            console.log(req.payload);
            if (req.payload.token !== token) {
                // Must have valid token
                reply(Hapi.error.unauthorized('Not allowed.'));
                return;
            }

            if (req.payload['user_name'] === username) {
                // Can't talk to itself.
                reply({ text: '' }).takeover();
                return;
            }

            // Keep the token private
            delete req.payload.token;
            reply();
        };
    },

    sanitize: function (trigger) {
        return function sanitize(req, reply) {
            // Remove trigger word from text payload.
            var text = req.payload.text;
            if (trigger && text.indexOf(trigger) === 0) {
                req.payload.text = text.slice(text.indexOf(' ') + 1);
            }

            reply();
        }
    }

};


exports.register = function(plugin, options, next) {
    var bot;

    Hoek.assert(typeof options === 'object', 'options must provided');
    Hoek.assert(typeof options['user_name'] === 'string', 'user_name must be a string');
    Hoek.assert(typeof options['trigger_word'] === 'string', 'trigger_word must be a string');
    Hoek.assert(typeof options['token'] === 'string', 'token must be a string');

    options = Hoek.applyToDefaults(internals.defaults, Hoek.clone(options || {}));

    bot = Chivebot.create(options);

    plugin.expose('registerCommand', function () {
        bot.registerCommand.apply(bot, arguments);
    });

    plugin.route({
        method: 'POST',
        path: '/',
        config: {
            pre: [
                internals.authorize(options['token'], options['user_name']),
                internals.sanitize(options['trigger_word'])
            ],
            validate: {
                payload: Joi.object().keys({
                    'token': Joi.string().token().required(),
                    'team_id': Joi.string(),
                    'team_domain': Joi.string(),
                    'service_id': Joi.string(),
                    'channel_id': Joi.string(),
                    'channel_name': Joi.string(),
                    'timestamp': Joi.string(),
                    'user_id': Joi.string(),
                    'user_name': Joi.string().required(),
                    'text': Joi.string().required(),
                    'trigger_word': Joi.string()
                }).unknown(true)
            },
            handler: bot.handler
        }
    });

    next();
};

exports.register.attributes = {
    pkg: Package
};
