module.exports = function (context, data) {
    var list = data.list;
    var filename = list + '-object.json';

    var groups_list_now = context.bindings.groupsListNow;
    var groups_list_previous = context.bindings.groupsListPrevious;

    if (!groups_list_now) {
        // TODO: missing file? create it and try again.
        context.done('groups_list_now file not found for ' + filename);
        return;
    }
    if (!groups_list_previous) {
        // TODO: missing file? create it and try again.
        context.done('groups_list_previous file not found for ' + filename);
        return;
    }

    // objects to store our diff parts
    var created_groups = {};
    var created_groups_count = 0;
    var deleted_groups = {};
    var deleted_groups_count = 0;
    var diff = {};
    var stats = {};

    context.log('Processing data for ' + list);

    Object.getOwnPropertyNames(groups_list_now).forEach(function (group) {
        if (!groups_list_previous[group]) {
            console.log('Found new group: ' + group);
            created_groups[group] = groups_list_now[group];
            created_groups_count++;
        } else {
            //context.log();
        }
    });

    Object.getOwnPropertyNames(groups_list_previous).forEach(function (group) {
        if (!groups_list_now[group]) {
            console.log('Found deleted group: ' + group);
            deleted_groups[group] = groups_list_previous[group];
            deleted_groups_count++;
        } else {
            //context.log();
        }
    });

    if (Object.getOwnPropertyNames(created_groups).length > 0) {
        diff.created_groups = created_groups;
        stats.created_groups = created_groups_count;
    } else {
        diff.created_groups = null;
        stats.created_groups = 0;
    }
    if (Object.getOwnPropertyNames(deleted_groups).length > 0) {
        diff.deleted_groups = deleted_groups;
        stats.deleted_groups = deleted_groups_count;
    } else {
        diff.deleted_groups = null;
        stats.deleted_groups = 0;
    }

    context.log(diff);
    context.log(stats);
    context.bindings.groupsListDiff = JSON.stringify(diff);
    context.bindings.groupsListStats = JSON.stringify(stats);
    context.res = {
        status: 200,
        body: JSON.stringify(diff)
    };
    context.done();
};