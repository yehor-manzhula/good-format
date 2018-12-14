const {isFunction, get} = require('lodash');

/**
 * Template function
 * Process template filling its keys with key value from the context
 *
 * @param  {String} strings Template strings
 * @param  {String} ...keys Template keys
 * @returns {String}
 */
module.exports = (strings, ...keys) => {
    return context => {    
        return strings.reduce((result, string, index) => {
            result.push(string);

            const key = keys[index];
            const value = isFunction(key) ? key.call(context, context) : get(context, key, key);
           
            result.push(value);

            return result;
        }, []).join('');
    };
};
