const Hoek = require('hoek');
const Stream = require('stream');
const formatters = require('./formatters');
const SafeStringify = require('json-stringify-safe');

const {template, timestamp, font, toUpper, toString, stringify, math, formatter} = formatters;

/**
 * Round bytes value to Mb
 * 
 * @param {int} value Value to be processed
 * @returns {float}
 */
const bytesToMb = formatter(value => {
    const mb = Math.round(value) / (1024 * 1024)
    return Math.round(mb * 100) / 100;
});

/**
 * Round all the items in the given array
 * 
 * @param {int} value Value to be processed
 * @returns {float}
 */
const roundAll = formatter(value => (value || []).map(item => {
    return Math.round(item * 100) / 100;
}));

/**
 * Add custom theme to font formatter
 */
font.setTheme({
    error: ['red', 'bold'],
    success: ['green', 'bold'],
    warn: ['yellow', 'bold'],
    info: ['blue', 'bold']
});

/**
 * Returns theme name depending on code
 * 
 * @param {int} statusCode
 * @returns {string} 
 */
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

/**
 * Returns theme name depending on HTTP method
 * 
 * @param {String} method
 * @returns {String} 
 */
const methodColor = method => {
    return ({
        GET: 'info',
        POST: 'success',
        PUT: 'success',
        DELETE: 'error',
        OPTIONS: 'warn'
    })[method.toUpperCase()] || 'info';
};

// Event partials
const pid = template`PID:${'pid'}`;
const tags = template`[${toString('tags')}]`;
const method = template`${toUpper('method')}`;
const responseTime = template`(${'responseTime'}ms)`;
const query = template`${stringify('query')}`;
const data = template`${stringify('data')}`;
const error = template`${'error.message'}\n${font.error('error.stack')}}`;

const event = template`${'event'}`;
const memory = template`${bytesToMb('proc.mem.rss')}`;

const general = template` ${font.info(pid)} ${timestamp('timestamp', 'YYMMDDHHmmssSSS')}`; 

const internals = {
    defaults: {
        log: template`${general} ${font.info(tags)} ${'data'} ${error}`,
        ops: template`${general} memory: ${memory}Mb, uptime: ${math.round('proc.uptime')}s, load: [${roundAll('os.load')}]`,
        error: template`${general} ${font.bold(event)} ${error}`,
 
        request: template`${general} ${font.info(tags)} ${font.bold(event)} ${font(method, methodColor)} ${'path'} ${data}`,
        response: template`${general} ${font.info(tags)} ${font.bold(event)} ${font(method, methodColor)} ${'route'} ${query} ${font('statusCode', statusCodeColor)} ${font.warn(responseTime)}`
    }
};

class GoodFormat extends Stream.Transform {
    constructor(config = {}) {
        super({objectMode: true});
        this._settings = Hoek.applyToDefaults(internals.defaults, config);
    }

    _transform(data, enc, next) {
        const formatter = this._settings[data.event];
        const output = formatter ? formatter(data) : SafeStringify(data);

        return next(null, `${output}\n`);
    }
}

module.exports = Object.assign(GoodFormat, formatters);
