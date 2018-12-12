const _ = require('lodash');
const SafeStringify = require('json-stringify-safe');

const formatter = require('./formatter');

module.exports = ['toUpper', 'toLower', 'toString', 'capitalize'].reduce((result, method) => {
    result[method] = formatter(_[method]);
    return result;
}, {
    stringify: formatter(SafeStringify)
});
