# good-format

`good-format` is a transform stream useful for turning [good](https://github.com/hapijs/good) server events into formatted strings.
[![Current Version](https://img.shields.io/npm/v/good-format.svg)](https://www.npmjs.com/package/good-format)

Maintainer: [Yehor Manzhula][author-github]

Due to lack of customization in good-console plugin new plugin come up.
With possibilities set font colors, styles formatting etc. 

Author was inspired by [GraphQl][graphql-npm-url] and [colors][colors-npm-url] packages.

## Usage

## `new GoodFormat([config])`
Creates a new GoodFormat object with the following arguments:

    - `[config]` - optional configuration object with the following keys
    - `response` - template for response event 
    - `error` - template for error event
    - `log` - template for log event
    - `opts` - template for opts event

In manifest.js

    const GoodFormat = require('good-format');

    module.exports = {
        ...
        register: {
            plugins: {
                ...
                plugin: 'good',
                options: {
                    includes: {
                        request: ['headers', 'payload'],
                        response: ['payload']
                    },
                    ops: {
                        interval: 1000
                    },
                    reporters: {
                        consoleReporter: [
                            new GoodFormat(),
                            'stdout']
                    } 
                }
                ...
            }
        }
    };

## Output Formats

Below examples of default output for the event type:
    
    - "ops" - 160318/013330.957, [ops] memory: 29Mb, uptime (seconds): 6, load: [1.650390625,1.6162109375,1.65234375]
    - "error" - 160318/013330.957, [error,`event.tags`] message: Just a simple error, stack: `event.error.stack`
    - "request" - 160318/013330.957, [request,`event.tags`] data: you made a request
    - "log" - 160318/013330.957, [log,`event.tags`] data: you made a default
    - "response" - 160318/013330.957, [response, `event.tags`] http://localhost:61253: post /data {"name":"adam"} 200 (150ms)
    
    - "ops" - PID:29333 181213171922478 memory: 126.68Mb, uptime: 8s, load: [4.42,3.53,2.54]
    - "log" - PID:29333 181213171917674 [`event.tags`] Database connection open mongodb://mongo.example.com:27017
    - "error" - PID:2591 181213173743466 error some error happen
        Error: some error happen
            at findTemplate (/var/www/test/actions.js:51:19)
            at module.exports.internals.Manager.execute (/var/www/test/node_modules/hapi/lib/toolkit.js:35:106)
            at Object.internals.handler (/var/www/test/node_modules/hapi/lib/handler.js:52:48)
            at exports.execute (/var/www/test/node_modules/hapi/lib/handler.js:37:36)
            at Request._lifecycle (/var/www/test/node_modules/hapi/lib/request.js:262:62)
            at process._tickCallback (internal/process/next_tick.js:68:7)}
    - "request" - PID:29333 181213171922261 [`event.tags`] request GET /partials [{content: "<span>test</span>"}]
    - "response" - PID:29333 181213171922052 [`event.tags`] response GET /partials {"name": "test"} 200 (23ms)

## Customization



[author-github]: <https://github.com/yehor-manzhula>
[colors-npm-url]: <https://www.npmjs.com/package/colors>
[graphql-npm-url]: <https://www.npmjs.com/package/graphql>