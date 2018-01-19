module.exports = function (context, data) {
    var group = data.group;

    var memberships_actual = context.bindings.membershipsActual;
    var memberships_ipps = context.bindings.membershipsIPPS;
    var memberships_central = context.bindings.membershipsCentral;
    var memberships_supplemental = context.bindings.membershipsSupplemental;

    var memberships_ideal = Object.assign(memberships_ipps, memberships_supplemental, memberships_central);

    // objects to store our diff parts
    var missing_memberships = [];
    var changed_memberships = [];
    var extra_memberships = [];
    var diff = {};

    context.log('Processing data for ' + group);

    Object.getOwnPropertyNames(memberships_ideal).forEach(function (member) {
        if (!memberships_actual[member]) {
            console.log('Did not find member: ' + member);
            missing_memberships.push = memberships_ideal[member];
        } else {
            if (memberships_actual[member].role != memberships_ideal[member].role) {
                context.log(memberships_actual[member].email +' role changed from '+ memberships_actual[member].role +' to '+ memberships_ideal[member].role +' in '+ group);
                changed_memberships.push = memberships_ideal[member];
            }
        }
    });

    Object.getOwnPropertyNames(memberships_actual).forEach(function (member) {
        if (!memberships_ideal[member]) {
            console.log('Found extra member: ' + member);
            extra_memberships.push = memberships_actual[member];
        }
    });

    diff.missing_memberships = missing_memberships;
    diff.changed_memberships = changed_memberships;
    diff.extra_memberships = extra_memberships;

    context.log(diff);
    context.bindings.membershipsDiff = diff;

    context.done(null, 'Processing data for ' + group);
};