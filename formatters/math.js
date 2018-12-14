const isFunction = require('lodash');
const formatter = require('./formatter');

module.exports = Object.getOwnPropertyNames(Math)
    .filter(prop => isFunction(Math[prop]))
    .reduce((result, method) => {
        result[method] = formatter(Math[method]);
        return result;
    }, {});
