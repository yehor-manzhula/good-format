const isFunction = require('lodash');
const formatter = require('./formatter');

/**
 * Wrap math methods with formatter function
 * to make possible use in template
 */
module.exports = Object.getOwnPropertyNames(Math)
    .filter(prop => isFunction(Math[prop]))
    .reduce((result, method) => {
        result[method] = formatter(Math[method]);
        return result;
    }, {});
