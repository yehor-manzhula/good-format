const moment = require('moment');
const formatter = require('./formatter');

module.exports = (key, format = '') => {
    return formatter(value => {
        try {
            return moment(value).format(format);
        } catch (e) {
            return value;
        }
    })(key);
};
