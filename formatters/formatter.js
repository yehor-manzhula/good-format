const {isFunction, get} = require('lodash');
 
module.exports = (fn = _.noop) => {
    return key => {
        return context => {
            const value = isFunction(key) ? key.call(context, context) : get(context, key, key);
            return fn(value);
        };
    };
};
