module.exports = function (context) {
    // give our bindings more human-readable names
    var memberships_ideal = context.bindings.aclsIdeal;
    var memberships_actual = context.bindings.aclsActual;
    var filename = context.bindingData.filename;
    var calendar_id = filename.replace('.json', '');

    // objects to store our diff parts
    var missing_memberships = {};
    var changed_memberships = {};
    var extra_memberships = {};
    var diff = {};
    var diff_found = false;

    context.log('Processing data for ' + calendar_id);

    Object.getOwnPropertyNames(memberships_ideal).forEach(function (member) {
        if (!memberships_actual[member]) {
            console.log('Did not find member: ' + member);
            missing_memberships[member] = memberships_ideal[member];
        } else {
            if (memberships_actual[member].role != memberships_ideal[member].role) {
                context.log(memberships_actual[member].email +' role changed from '+ memberships_actual[member].role +' to '+ memberships_ideal[member].role +' in '+ filename);
                changed_memberships[member] = memberships_ideal[member];
            }
        }
    });

    Object.getOwnPropertyNames(memberships_actual).forEach(function (member) {
        if (!memberships_ideal[member]) {
            console.log('Found extra member: ' + member);
            extra_memberships[member] = memberships_actual[member];
        } else {
            //context.log('Found '+ member +' in '+ filename);
        }
    });

    if (Object.getOwnPropertyNames(missing_memberships).length > 0) {
        diff.missing_memberships = missing_memberships;
        diff_found = true;
    }
    if (Object.getOwnPropertyNames(changed_memberships).length > 0) {
        diff.changed_memberships = changed_memberships;
        diff_found = true;
    }
    if (Object.getOwnPropertyNames(extra_memberships).length > 0) {
        diff.extra_memberships = extra_memberships;
        diff_found = true;
    }

    if (diff_found) {
        context.log(diff);
        context.bindings.aclsDiff = diff;
    }
    context.done(null, 'Processing data for ' + calendar_id);
};