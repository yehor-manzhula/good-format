const Hoek = require('hoek');
const Stream = require('stream');
const formatters = require('./formatters');

const {template, timestamp, font, toUpper, toString, stringify} = formatters;

font.setTheme({
    error: ['red', 'bold'],
    success: ['green', 'bold'],
    warn: ['yellow', 'bold'],
    info: ['blue', 'bold']
});

const statusCodeColor = statusCode => {
    if (statusCode >= 500) {
        return 'error';
    } 
    
    if (statusCode >= 400) {
        return 'warn';
    } 
    
    if (statusCode >= 300) {
        return 'info';
    }
    
    return 'success';
};

const methodColor = method => {
    return ({
        GET: 'info',
        POST: 'success',
        PUT: 'success',
        DELETE: 'error',
        OPTIONS: 'warn'
    })[method.toUpperCase()] || 'info';
};

const pid = template`PID:${'pid'}`;
const tags = template`[${toString('tags')}]`;
const method = template`${toUpper('method')}`;
const responseTime = template`(${'responseTime'}ms)`;
const query = template`${stringify('query')}`;
const event = template`${'event'}`;

const general = template` ${font.info(pid)} ${timestamp('timestamp', 'YYMMDDHHmmssSSS')} ${font.info(tags)}`; 

const internals = {
    defaults: {
        response: template`${general} ${font.bold(event)} ${font(method, methodColor)} ${'route'} ${query} ${font('statusCode', statusCodeColor)} ${font.warn(responseTime)}`,
        error: template`${general} ${font.bold(event)} message: ${'event.error.message'}, stack: ${'event.error.stack'}`,
        log: template`${general} ${'data'}`
    }
};

class GoodFormat extends Stream.Transform {
    constructor(config = {}) {
        super({objectMode: true});
        this._settings = Hoek.applyToDefaults(internals.defaults, config);
    }

    _transform(data, enc, next) {
        const formatter = this._settings[data.event];
        const output = formatter ? formatter(data) : formatters.stringify(data);

        return next(null, `${output}\n`);
    }
}

module.exports = Object.assign(GoodFormat, formatters);
