// Assign strings methods to top level
module.exports = Object.assign(require('./string'), {
    font: require('./font'),
    template: require('./template'),
    timestamp: require('./timestamp'),
    math: require('./math'),
    formatter: require('./formatter')
});
