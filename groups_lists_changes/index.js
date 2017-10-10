module.exports = function (context) {
    // give our bindings more human-readable names
    var filename = context.bindingData.filename;
    var group_name = filename.replace('.json', '');

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
    var deleted_groups = {};
    var diff = {};
    var diff_found = false;

    context.log('Processing data for ' + filename);

    Object.getOwnPropertyNames(groups_list_now).forEach(function (group) {
        if (!groups_list_previous[group]) {
            console.log('Found new group: ' + group);
            created_groups[group] = groups_list_now[group];
        } else {
            //context.log();
        }
    });

    Object.getOwnPropertyNames(groups_list_previous).forEach(function (group) {
        if (!groups_list_now[group]) {
            console.log('Found deleted group: ' + group);
            deleted_groups[group] = groups_list_previous[group];
        } else {
            //context.log();
        }
    });

    if (Object.getOwnPropertyNames(created_groups).length > 0) {
        diff.created_groups = created_groups;
        diff_found = true;
    }
    if (Object.getOwnPropertyNames(deleted_groups).length > 0) {
        diff.deleted_groups = deleted_groups;
        diff_found = true;
    }

    if (diff_found) {
        context.log(diff);
        context.bindings.groupsListDiff = diff;
    }
    context.done();
};