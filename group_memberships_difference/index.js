module.exports = function (context, info) {
    // give our bindings more human-readable names
    var memberships_ideal = context.bindings.membershipsIdeal;
    var memberships_actual = context.bindings.membershipsActual;
    var memberships_diff = context.bindings.membershipsDiff;

    // objects to store our diff parts
    var missing_memberships = {};
    var extra_memberships = {};

    if ('filename' in info) {
        context.log('Processing data for ' + info.filename);
    }

    Object.getOwnPropertyNames(memberships_ideal).forEach(function (member) {
        if (!memberships_actual[member]) {
            console.log('Did not find member: ' + member);
            missing_memberships[member] = memberships_ideal[member];
        } else {
            
        }
    });

    Object.getOwnPropertyNames(memberships_actual).forEach(function (member) {
        if (!memberships_ideal[member]) {
            console.log('Found extra member: ' + member);
            extra_memberships[member] = memberships_actual[member];
        }
    });

    memberships_diff = {
        missing_memberships: {missing_memberships},
        extra_memberships: {extra_memberships}
    };
    context.done();
};