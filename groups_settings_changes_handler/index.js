module.exports = function (context) {
    var filename = context.bindingData.filename;
    var group_name = filename.replace('.json', '');

    // Overwrite previous file with now file
    context.log('Overwrite previous file with contents now file for ' + filename);
    context.bindings.groupsSettingsPrevious = context.bindings.groupsSettingsNow;

    // Manufacture events by publishing individual changes or change sets to ServiceBus topic
    context.bindings.groupsSettingsDiffTopic = context.bindings.groupsSettingsDiff;

    // Log changes to Skyline
    var event = {
        function: context.executionContext.functionName,
        invocation_id: context.executionContext.invocationId,
        group: group_name,
        difference: context.bindings.groupsSettingsDiff
    };
    context.bindings.skylineQueue = event;

    context.done();
};