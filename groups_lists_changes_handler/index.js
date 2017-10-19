module.exports = function (context) {
    var filename = context.bindingData.filename;
    var group_name = filename.replace('.json', '');

    // Manufacture events by publishing individual changes or change sets to ServiceBus topic
    context.bindings.groupsListDiffTopic = context.bindings.groupsListDiff;

    // Log changes to Skyline
    var event = {
        function: context.executionContext.functionName,
        invocation_id: context.executionContext.invocationId,
        group: group_name,
        difference: context.bindings.groupsListDiff
    };
    context.bindings.skylineQueue = event;

    context.done();
};