module.exports = function (context, data) {
    var calendar_id = data.calendar;

    // give our bindings more human-readable names
    var memberships_actual =  context.bindings.aclsActual;
    var memberships_central = context.bindings.aclsCentral;
    var memberships_ipps =    context.bindings.aclsIPPS;

    var memberships_ideal = Object.assign(memberships_ipps, memberships_central);

    // objects to store our diff parts
    var ideal_minus_actual = {};
    var actual_minus_ideal = {};
    var incongruent_memberships = {};
    var diff = {};

    context.log('Processing data for ' + calendar_id);

    Object.getOwnPropertyNames(memberships_ideal).forEach(function (member) {
        if (!memberships_actual[member]) {
            console.log('Did not find member: ' + member);
            ideal_minus_actual[member] = memberships_ideal[member];
        } else {
            if (memberships_actual[member].role != memberships_ideal[member].role) {
                context.log(memberships_actual[member].email +' role changed from '+ memberships_actual[member].role +' to '+ memberships_ideal[member].role +' in '+ calendar_id);
                incongruent_memberships[member] = {
                    ideal: memberships_ideal[member],
                    actual: memberships_actual[member]
                };
            }
        }
    });

    Object.getOwnPropertyNames(memberships_actual).forEach(function (member) {
        if (!memberships_ideal[member]) {
            console.log('Found extra member: ' + member);
            actual_minus_ideal[member] = memberships_actual[member];
        }
    });

    if (Object.getOwnPropertyNames(ideal_minus_actual).length > 0) {
        diff.ideal_minus_actual = ideal_minus_actual;
    } else {
        diff.ideal_minus_actual = null;
    }

    if (Object.getOwnPropertyNames(actual_minus_ideal).length > 0) {
        diff.actual_minus_ideal = actual_minus_ideal;
    } else {
        diff.actual_minus_ideal = null;
    }

    if (Object.getOwnPropertyNames(incongruent_memberships).length > 0) {
        diff.incongruent_memberships = incongruent_memberships;
    } else {
        diff.incongruent_memberships = null;
    }

    context.log(diff);
    context.bindings.aclsDiff = diff;
    context.res = {
        status: 200,
        body: JSON.stringify(diff)
    };
    context.done();
};