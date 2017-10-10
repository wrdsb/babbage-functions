module.exports = function (context) {
    var filename = context.bindingData.filename;
    var group_address = filename.replace('.json', '');

    var message_body = {
        group_email: group_address
    };

    var message = {
        body: JSON.stringify(message_body)
    };

    context.done(null, message);
};