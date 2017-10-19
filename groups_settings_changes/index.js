module.exports = function (context, data) {
    var group_name = data.group;

    var group_settings_now = context.bindings.groupSettingsNow;
    var group_settings_previous = context.bindings.groupSettingsPrevious;

    // object to store our diff parts
    var diff = {};

    context.log('Processing data for ' + group_name);

    Object.getOwnPropertyNames(group_settings_now).forEach(function (setting) {
        if (group_settings_now[setting] != group_settings_previous[setting]) {
            console.log('Found changed setting: ' + setting);
            diff[setting] = {
                changed: {
                    from: group_settings_previous[setting],
                    to: group_settings_now[setting]
                },
                unchanged: false
            };
        } else {
            diff[setting] = {
                changed: null,
                unchanged: true
            };
        }
    });

    context.log(diff);
    context.bindings.groupSettingsDiff = diff;
    context.res = {
        status: 200,
        body: JSON.stringify(diff)
    };
    context.done();
};