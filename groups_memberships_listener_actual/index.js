module.exports = function (context) {
    var filename = context.bindingData.filename;
    var group_address = filename.replace('.json', '');

    var message = {
        group_email: group_address
    };

    context.bindings.outputQueue = message;

    context.done(null, message);
};