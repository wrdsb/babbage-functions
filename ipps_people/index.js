module.exports = function (context) {
    // give our bindings more human-readable names
    var people_now = context.bindings.peopleNow;
    var people_previous = context.bindings.peoplePrevious;
    var people_diff = context.bindings.peopleDiff;

    // object to store our total diff as we build it
    var changed_records = {};

    // loop through all records in people_now, looking for changes
    Object.entries(people_now).forEach(([ein, new_record]) => {

        // track whether or not we found changes, and what they were
        var person_changed = false;
        var person_changes = [];

        // get the corresponding record in people_previous
        var old_record = people_previous[ein];

        // if we found a corresponding record in people_previous, look for changes
        if (old_record) {

            // changed username?
            if (old_record.username != new_record.username) {
                person_changed = true;
                person_changes.push({
                    username: {
                        from: old_record.username,
                        to: new_record.username
                    }
                });
            }

            // if person changed, add changes to total diff
            if (person_changed) {
                console.log('Found updated record for EIN ' + ein);
                changed_records[ein] = {update: person_changes};
            }

            // remove old_record from people_previous
            delete people_previous[ein];

        // if we don't find a corresponding record in people_previous, they're new
        } else {
            console.log('Found new record for EIN ' + ein);
            changed_records[ein] = {create: new_record};
        }
    });

    // if we have any old records remaining, they didn't match a new record, so they must be deletes
    Object.entries(people_previous).forEach(([ein, new_record]) => {
        console.log('Found deleted record for EIN ' + ein);
        changed_records[ein] = {delete: new_record};
    });

    people_diff = changed_records;
    context.done(null, changed_records);
};
