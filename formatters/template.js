const {isFunction, get} = require('lodash');

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
