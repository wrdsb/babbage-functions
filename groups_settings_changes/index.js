module.exports = function (context, data) {
    var group_name = data.group;

    var group_settings_now = context.bindings.groupSettingsNow;
    var group_settings_previous = context.bindings.groupSettingsPrevious;

    if (!group_settings_now) {
        // TODO: missing file? create it and try again.
        context.done('groups_settings_now file not found for ' + group_name);
        return;
    }
    if (!group_settings_previous) {
        // TODO: missing file? create it and try again.
        context.done('groups_settings_previous file not found for ' + group_name);
        return;
    }

    // objects to store our diff parts
    var diff = {};
    var diff_found = false;

    context.log('Processing data for ' + group_name);

    Object.getOwnPropertyNames(group_settings_now).forEach(function (setting) {
        if (group_settings_now[setting] != group_settings_previous[setting]) {
            console.log('Found changed setting: ' + setting);
            diff[setting] = {
                was: group_settings_previous[setting],
                is: group_settings_now[setting]
            };
            diff_found = true;
        } else {
            //context.log();
        }
    });

    if (diff_found) {
        context.log(diff);
        context.bindings.groupSettingsDiff = diff;
        context.res = {
            status: 200,
            body: JSON.stringify(diff)
        };
    }
    context.done();
};