module.exports = function(context) {
    var ein = context.bindings.peopleDiffQueue.ein;
    var change = context.bindings.peopleDiffQueue.change;
    process_change(ein, change);

    context.log('Node.js queue trigger function processed work item', context.bindings.peopleDiffQueue);
    context.log('queueTrigger =', context.bindingData.queueTrigger);
    context.log('expirationTime =', context.bindingData.expirationTime);
    context.log('insertionTime =', context.bindingData.insertionTime);
    context.log('nextVisibleTime =', context.bindingData.nextVisibleTime);
    context.log('id=', context.bindingData.id);
    context.log('popReceipt =', context.bindingData.popReceipt);
    context.log('dequeueCount =', context.bindingData.dequeueCount);
    context.done();

    function process_change(ein, change) {
        if (change.delete) {
            context.log('Found delete for ' + ein);
        } else if (change.create) {
            context.log('Found create for ' + ein);
        } else if (change.update) {
            context.log('Found update for ' + ein);
        } else {
            context.log('Unknown change type for ' + ein);
        }
    }
};