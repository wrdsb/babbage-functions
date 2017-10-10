module.exports = function (context) {
    // give our bindings more human-readable names
    var filename = context.bindingData.filename;
    var group_name = filename.replace('.json', '');

    var groups_settings_now = context.bindings.groupsSettingsNow;
    var groups_settings_previous = context.bindings.groupsSettingsPrevious;

    if (!groups_settings_now) {
        // TODO: missing file? create it and try again.
        context.done('groups_settings_now file not found for ' + filename);
        return;
    }
    if (!groups_settings_previous) {
        // TODO: missing file? create it and try again.
        context.done('groups_settings_previous file not found for ' + filename);
        return;
    }

    // objects to store our diff parts
    var diff = {};
    var diff_found = false;

    context.log('Processing data for ' + filename);

    Object.getOwnPropertyNames(groups_settings_now).forEach(function (setting) {
        if (groups_settings_now[setting] != groups_settings_previous[setting]) {
            console.log('Found changed setting: ' + setting);
            diff[setting] = {
                was: groups_settings_previous[setting],
                is: groups_settings_now[setting]
            }
            diff_found = true;
        } else {
            //context.log();
        }
    });

    if (diff_found) {
        context.log(diff);
        context.bindings.groupsSettingsDiff = diff;
    }
    context.done();
};