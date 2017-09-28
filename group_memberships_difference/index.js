module.exports = function (context) {
    // give our bindings more human-readable names
    var filename = context.bindingData.filename;
    var group_address = context.bindingData.filename.replace('.json', '');

    var all_supplemental = context.bindings.membershipsSupplementalAll;
    if (!all_supplemental[group_address]) {
        all_supplemental[group_address] = [];
    }

    var memberships_ideal = context.bindings.membershipsIdeal;
    if (!memberships_ideal) {
        context.done('memberships_ideal file not found for ' + filename);
        return;
    }
    var memberships_actual = context.bindings.membershipsActual;
    if (!memberships_actual) {
        context.done('memberships_actual file not found for ' + filename);
        return;
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
            all_supplemental[group_address].push(member);
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
        context.bindings.membershipsSupplemental = extra_memberships;
    }

    if (diff_found) {
        context.log(diff);
        context.bindings.membershipsDiff = diff;
        context.bindings.membershipsSupplementalAll = all_supplemental;
    }
    context.done(null, 'Processing data for ' + filename);
};