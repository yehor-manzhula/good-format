const moment = require('moment');
const formatter = require('./formatter');

/**
 * Formats value using given 
 * format with moment library

 * @param {String} key Context value key
 * @param {String} format='' Output time format
 * @returns {String}
 */
module.exports = (key, format = '') => {
    return formatter(value => {
        try {
            return moment(value).format(format);
        } catch (e) {
            return value;
        }
    })(key);
};
