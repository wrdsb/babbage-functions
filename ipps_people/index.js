module.exports = function (context) {
    // give our bindings more human-readable names
    var people_now = context.bindings.peopleNow;
    var people_previous = context.bindings.peoplePrevious;
    var people_diff = context.bindings.peopleDiff;

    // object to store our total diff as we build it
    var changed_records = {};

    // loop through all records in people_now, looking for changes
    Object.getOwnPropertyNames(people_now).forEach(function (ein) {
        var new_record = people_now[ein];

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

            // changed email?
            if (old_record.email != new_record.email) {
                person_changed = true;
                person_changes.push({
                    email: {
                        from: old_record.email,
                        to: new_record.email
                    }
                });
            }

            // changed name?
            if (old_record.name != new_record.name) {
                person_changed = true;
                person_changes.push({
                    name: {
                        from: old_record.name,
                        to: new_record.name
                    }
                });
            }

            // changed sortable name?
            if (old_record.sortable_name != new_record.sortable_name) {
                person_changed = true;
                person_changes.push({
                    sortable_name: {
                        from: old_record.sortable_name,
                        to: new_record.sortable_name
                    }
                });
            }

            // changed first_name?
            if (old_record.first_name != new_record.first_name) {
                person_changed = true;
                person_changes.push({
                    first_name: {
                        from: old_record.first_name,
                        to: new_record.first_name
                    }
                });
            }

            // changed last_name?
            if (old_record.last_name != new_record.last_name) {
                person_changed = true;
                person_changes.push({
                    last_name: {
                        from: old_record.last_name,
                        to: new_record.last_name
                    }
                });
            }

            // changed ipps_home_location?
            if (old_record.ipps_home_location != new_record.ipps_home_location) {
                person_changed = true;
                person_changes.push({
                    ipps_home_location: {
                        from: old_record.ipps_home_location,
                        to: new_record.ipps_home_location
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
    Object.getOwnPropertyNames(people_previous).forEach(function (ein) {
        var old_record = people_previous[ein];

        console.log('Found deleted record for EIN ' + ein);
        changed_records[ein] = {delete: old_record};
    });

    people_diff = changed_records;
    context.done(null, changed_records);
};
