module.exports = function(context) {
    var people_diff = context.bindings.peopleDiff;
    var queue_messages = [];

    Object.getOwnPropertyNames(people_diff).forEach(function (ein) {
        context.log('Found change for EIN ' + ein);
        var diff = {
            ein: ein,
            change: people_diff[ein]
        };
        queue_messages.push(diff);
    });

    context.bindings.peopleDiffQueue = queue_messages;

    context.done();
};