// Assign strings methods to top level
module.exports = Object.assign(require('./string'), {
    font: require('./font'),
    template: require('./template'),
    timestamp: require('./timestamp'),
    formatter: require('./formatter')
});
