module.exports = function (context) {
    var calendar_id = context.bindingData.filename;

    context.log('Publishing diffs for ' + calendar_id);

    var missing_memberships = context.bindings.membershipsDiff.missing_memberships;
    var extra_memberships = context.bindings.membershipsDiff.extra_memberships;

    var message = {};
    
    message.calendar_id = calendar_id;
    
    if (missing_memberships) {
        message.missing_memberships = missing_memberships;
    }
    if (extra_memberships) {
        message.extra_memberships = extra_memberships;
    }

    context.log(message);
    context.bindings.membershipsDiffTopic = message;
    context.done();
};