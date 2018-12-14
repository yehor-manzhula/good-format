/***
 * Assign string methods to top level
 */
module.exports = Object.assign(require('./string'), {
    font: require('./font'),
    math: require('./math'),
    template: require('./template'),
    timestamp: require('./timestamp'),
    formatter: require('./formatter')
});
