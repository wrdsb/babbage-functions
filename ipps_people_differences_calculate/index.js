module.exports = function (context, data) {
    var waterfall = require('async/waterfall');
    var isEqual = require('lodash.isequal');

    // give our bindings more human-readable names
    var people_previous = context.bindings.peoplePrevious;
    var people_now = context.bindings.peopleNow;
    var people_diff = context.bindings.peopleDifferences;

    // object to store our total diff as we build it
    var differences = {};
    differences.created_records = {};
    differences.updated_records = {};
    differences.deleted_records = {};

    waterfall([
        kickoff,
        find_creates_and_updates,
        find_deletes
    ], function (err, differences) {
        if (err) {
            context.done(err);
        } else {
            context.bindings.peopleDifferences = JSON.stringify(differences);
            context.res = {
                status: 200,
                body: JSON.stringify(differences)
            };
            context.done(null, differences);
        }
    });

    function kickoff(callback) {
        callback(null, people_previous, people_now, differences);
    }

    function find_creates_and_updates(people_previous, people_now, differences, callback) {
        // loop through all records in people_now, each of which is a property of people_now, named for the record's EIN
        Object.getOwnPropertyNames(people_now).forEach(function (ein) {
            context.log('Processing EIN ' + ein);
            var new_record = people_now[ein];      // get the full person record from people_now
            var old_record = people_previous[ein]; // get the corresponding record in people_previous
    
            // if we found a corresponding record in people_previous, look for changes
            if (old_record) {
                context.log('Found existing record for EIN ' + ein);

                // Compare old and new records using Lodash _.isEqual, which performs a deep comparison
                var records_equal = isEqual(old_record, new_record);
    
                // if person changed, add changes to total diff
                if (!records_equal) {
                    context.log('Found changed record for EIN ' + ein);
                    differences.updated_records[ein] = {
                        previous: old_record,
                        now: new_record
                    };
                } else {
                    context.log('No changes found for EIN ' + ein);
                }
    
                // remove old_record from people_previous to leave us with a diff. See find_deletes().
                delete people_previous[ein];
    
            // if we don't find a corresponding record in people_previous, they're new
            } else {
                context.log('Found new record for EIN ' + ein);
                differences.created_records[ein] = new_record;
            }
        });
        callback(null, people_previous, people_now, differences);
    }

    function find_deletes(people_previous, people_now, differences, callback) {
        // if we have any old records remaining, they didn't match a new record, so they must be deletes
        Object.getOwnPropertyNames(people_previous).forEach(function (ein) {
            context.log('Found deleted record for EIN ' + ein);
            differences.deleted_records[ein] = people_previous[ein];
        });
        callback(null, differences);
    }
};
