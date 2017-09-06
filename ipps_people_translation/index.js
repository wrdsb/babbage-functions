module.exports = function(context) {
    context.log('Overwrite people_previous.json with contents of people_now.json');
    context.bindings.peoplePrevious = context.bindings.peopleNow;
    context.done();
};