module.exports = function (context) {
    var group_address = context.bindingData.filename.replace('.json', '');

    context.log('Publishing diffs for ' + group_address);

    var missing_memberships = context.bindings.membershipsDiff.missing_memberships;
    var changed_memberships = context.bindings.membershipsDiff.changed_memberships;
    var extra_memberships = context.bindings.membershipsDiff.extra_memberships;

    var message = {};
    
    message.group_address = group_address;
    
    if (missing_memberships) {
        message.missing_memberships = missing_memberships;
    }
    if (changed_memberships) {
        message.changed_memberships = changed_memberships;
    }
    if (extra_memberships) {
        message.extra_memberships = extra_memberships;
    }

    context.log(message);
    context.bindings.membershipsDiffTopic = message;
    context.done(null, 'Publishing diffs for ' + group_address);
};
