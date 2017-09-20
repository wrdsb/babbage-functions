module.exports = function (context) {
    // give our bindings more human-readable names
    var filename = context.bindingData.filename;

    var memberships_ideal = context.bindings.membershipsIdeal;
    if (!memberships_ideal) {
        context.done('memberships_ideal file not found for ' + filename);
    }
    var memberships_actual = context.bindings.membershipsActual;
    if (!memberships_actual) {
        context.done('memberships_actual file not found for ' + filename);
    }
    var memberships_diff = context.bindings.membershipsDiff;
    if (!memberships_diff) {
        context.done('memberships_diff file not found for ' + filename);
    }

    // objects to store our diff parts
    var missing_memberships = {};
    var extra_memberships = {};
    var diff = {};
    var diff_found = false;

    context.log('Processing data for ' + filename);

    Object.getOwnPropertyNames(memberships_ideal).forEach(function (member) {
        if (!memberships_actual[member]) {
            console.log('Did not find member: ' + member);
            missing_memberships[member] = memberships_ideal[member];
        } else {
            //context.log('Found '+ member +' in '+ filename);
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
    if (Object.getOwnPropertyNames(extra_memberships).length > 0) {
        diff.extra_memberships = extra_memberships;
        diff_found = true;
    }

    if (diff_found) {
        context.log(diff);
        memberships_diff = diff;
    }
    context.done();
};