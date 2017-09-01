module.exports = function (context, peopleNow) {
    context.log("JavaScript blob trigger function processed blob peopleNow:\n Blob Size:", peopleNow.length, "Bytes");
    context.done();
};
