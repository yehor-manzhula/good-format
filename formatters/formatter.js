const {isFunction, get} = require('lodash');

/**
 * Function gets value for the given key in context
 * and invoke function given as an argument.
 * Main purpose create chain of functions to be executed
 * while context become available
 * 
 * @param {Function} fn=_.noop Function to be called when value become available
 * @returns {*}
 */
module.exports = (fn = _.noop) => {
    return key => {
        return context => {
            const value = isFunction(key) ? key.call(context, context) : get(context, key, '');
            return fn(value);
        };
    };
};
