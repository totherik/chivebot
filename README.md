### chivebot

A pluggable slack bot.

#### Creating a custom bot
First, declare your dependencies
```bash
$ mkdir fembot && cd fembot
$ npm init

# ...

$ npm install --save chivebot
# also any additional plugins, e.g.
#   $ npm install --save chivebot-weather
#   $ npm install --save chivebot-coolfaces

# create the config file
$ touch config.json
# configure server (see below)
$ npm start
```

Then define a start script in your package.json
```js
"scripts": {
  "start": "hapi -c config.json"
}
```

Then configure your server and plugins.
```json
{
    "servers": [
        {
            "host": "0.0.0.0",
            "port": "8000"
        }
    ],
    "plugins": {
        "chivebot-coolfaces": {},
        "chivebot-weather": {},
        "chivebot": {
            "trigger_word": "my_bot",
            "user_name": "my_bot",
            "token": "{webhook_token}"
        }
    }
}
```

#### Options
- `user_name` (*String*) - The username set for the bot. This is important as it filters messages such that the bot doesn't respond to itself.
- `token` (*String*) - The outgoing webhook token as provided by slack.
- `trigger_word` (*String*, optional) - If you configured a trigger word in slack, set it here so the messge text can be parsed correctly.
