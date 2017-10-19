module.exports = function (context) {
    var waterfall = require('async/waterfall');

    // give our bindings more human-readable names
    var people_now = context.bindings.peopleNow;
    var people_previous = context.bindings.peoplePrevious;
    var people_diff = context.bindings.peopleDiff;

    // object to store our total diff as we build it
    var changed_records = {};

    waterfall([
        kickoff,
        find_creates_and_updates,
        find_deletes
    ], function (err, result) {
        if (err) {
            context.done(err);
        } else {
            context.bindings.peoplePrevious = result.people_now;
            context.bindings.peopleDiff = result.changed_records;
            context.done(null, result.changed_records);
        }
    });

    function kickoff(callback) {
        callback(null, people_previous, people_now, changed_records);
    }

    function find_creates_and_updates(people_previous, people_now, changed_records, callback) {
        // loop through all records in people_now, each of which is a property of people_now, named for the record's EIN
        Object.getOwnPropertyNames(people_now).forEach(function (ein) {
            context.log('Processing EIN ' + ein);
            var new_record = people_now[ein];      // get the full person record from people_now
            var old_record = people_previous[ein]; // get the corresponding record in people_previous
    
            // if we found a corresponding record in people_previous, look for changes
            if (old_record) {
                context.log('Found existing record for EIN ' + ein);

                // track whether or not we found changes, and what they were
                var person_changed = false;
                var person_changes = {};

                // TODO: Make into a waterfall
                var person_diff = diff_person(old_record, new_record, person_changed, person_changes);
                person_changed = person_diff.person_changed;
                person_changes = person_diff.person_changes;
    
                var positions_diff = diff_positions(old_record, new_record, person_changed, person_changes);
                person_changed = positions_diff.person_changed;
                person_changes = positions_diff.person_changes;
    
                // if person changed, add changes to total diff
                if (person_changed) {
                    console.log('Found updated record for EIN ' + ein);
                    changed_records[ein] = {update: person_changes};
                } else {
                    console.log('No changes found for EIN ' + ein);
                }
    
                // remove old_record from people_previous to leave us with a diff. See find_deletes().
                delete people_previous[ein];
    
            // if we don't find a corresponding record in people_previous, they're new
            } else {
                console.log('Found new record for EIN ' + ein);
                changed_records[ein] = {create: new_record};
            }
        });
        callback(null, people_previous, people_now, changed_records);
    }

    function find_deletes(people_previous, people_now, changed_records, callback) {
        // if we have any old records remaining, they didn't match a new record, so they must be deletes
        Object.getOwnPropertyNames(people_previous).forEach(function (ein) {
            console.log('Found deleted record for EIN ' + ein);
            changed_records[ein] = {delete: people_previous[ein]};
        });
        // collect our total result, and pass to final function of main waterfall
        var result = {people_previous: people_previous, people_now: people_now, changed_records: changed_records};
        callback(null, result);
    }

    function diff_person(old_record, new_record, person_changed, person_changes) {
        // changed username?
        if (old_record.username != new_record.username) {
            person_changed = true;
            person_changes.username = {
                from: old_record.username,
                to: new_record.username
            };
        }

        // changed email?
        if (old_record.email != new_record.email) {
            person_changed = true;
            person_changes.email = {
                from: old_record.email,
                to: new_record.email
            };
        }

        // changed name?
        if (old_record.name != new_record.name) {
            person_changed = true;
            person_changes.name = {
                from: old_record.name,
                to: new_record.name
            };
        }

        // changed sortable name?
        if (old_record.sortable_name != new_record.sortable_name) {
            person_changed = true;
            person_changes.sortable_name = {
                from: old_record.sortable_name,
                to: new_record.sortable_name
            };
        }

        // changed first_name?
        if (old_record.first_name != new_record.first_name) {
            person_changed = true;
            person_changes.first_name = {
                from: old_record.first_name,
                to: new_record.first_name
            };
        }

        // changed last_name?
        if (old_record.last_name != new_record.last_name) {
            person_changed = true;
            person_changes.last_name = {
                from: old_record.last_name,
                to: new_record.last_name
            };
        }

        // changed ipps_home_location?
        if (old_record.ipps_home_location != new_record.ipps_home_location) {
            person_changed = true;
            person_changes.ipps_home_location = {
                from: old_record.ipps_home_location,
                to: new_record.ipps_home_location
            };
        }
        return {person_changed: person_changed, person_changes: person_changes};
    }

    function diff_positions(old_record, new_record, person_changed, person_changes) {
        var old_positions = old_record.positions;
        var new_positions = new_record.positions;

        var created_positions = {};
        var updated_positions = {};
        var deleted_positions = {};

        Object.getOwnPropertyNames(new_positions).forEach(function (new_position_id) {
            var old_position = old_positions[new_position_id];
            var new_position = new_positions[new_position_id];

            // if the same position isn't present in old_positions, it's a brand new position
            if (!old_position) {
                created_positions[new_position_id] = new_position;
            } else {
                if (
                    (old_position.ipps_job_code                   != new_position.ipps_job_code) ||
                    (old_position.ipps_location_code              != new_position.ipps_location_code) ||
                    (old_position.ipps_employee_group_code        != new_position.ipps_employee_group_code) ||
                    (old_position.ipps_job_description            != new_position.ipps_job_description) ||
                    (old_position.ipps_location_description       != new_position.ipps_location_description) ||
                    (old_position.ipps_employee_group_category    != new_position.ipps_employee_group_category) ||
                    (old_position.ipps_employee_group_description != new_position.ipps_employee_group_description) ||
                    (old_position.ipps_school_code                != new_position.ipps_school_code) ||
                    (old_position.ipps_school_type                != new_position.ipps_school_type) ||
                    (old_position.ipps_panel                      != new_position.ipps_panel) ||
                    (old_position.ipps_phone_no                   != new_position.ipps_phone_no) ||
                    (old_position.ipps_extension                  != new_position.ipps_extension) ||
                    (old_position.ipps_home_location_indicator    != new_position.ipps_home_location_indicator) ||
                    (old_position.ipps_activity_code              != new_position.ipps_activity_code)
                    
                    // TODO: convert to dates and compare
                    // (old_position.ipps_position_start_date        != new_position.ipps_position_start_date)
                    // (old_position.ipps_position_end_date          != new_position.ipps_position_end_date)
                ) {
                    updated_positions[new_position_id] = {old_position: old_position, new_position: new_position};
                }
            }
        });

        Object.getOwnPropertyNames(old_positions).forEach(function (old_position_id) {
            if (!new_positions[old_position_id]) {
                deleted_positions[old_position_id] = old_positions[old_position_id];
            }
        });

        if (Object.getOwnPropertyNames(created_positions).length > 0) {
            person_changed = true;
            person_changes.created_positions = created_positions;
        }

        if (Object.getOwnPropertyNames(updated_positions).length > 0) {
            person_changed = true;
            person_changes.updated_positions = updated_positions;
        }

        if (Object.getOwnPropertyNames(deleted_positions).length > 0) {
            person_changed = true;
            person_changes.deleted_positions = deleted_positions;
        }
        return {person_changed: person_changed, person_changes: person_changes};
    }

    function is_new_position(position, index, array) {
        
    }

    function is_updated_position(position, index, array) {
        
    }

    function is_removed_position(position, index, array) {
        
    }
};
