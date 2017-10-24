module.exports = function (context) {
    var calendar_id = context.bindingData.filename.replace('.json', '');

    context.log('Publishing diffs for ' + calendar_id);

    var missing_memberships = context.bindings.aclsDiff.ideal_minus_actual;
    var incongruent_memberships = context.bindings.aclsDiff.incongruent_memberships;
    var extra_memberships = context.bindings.aclsDiff.actual_minus_ideal;

    var changed_memberships ={};
    var message = {};

    message.calendar_id = calendar_id;

    if (missing_memberships) {
        message.missing_memberships = missing_memberships;
    }
    if (incongruent_memberships) {
        Object.getOwnPropertyNames(incongruent_memberships).forEach(function (membership) {
            changed_memberships[membership.email] = membership.ideal;
        });
        message.changed_memberships = changed_memberships;
    }
    if (extra_memberships) {
        message.extra_memberships = extra_memberships;
    }

    context.log(message);
    context.bindings.aclsDiffTopic = message;
    context.done(null, 'Publishing diffs for ' + calendar_id);
};
