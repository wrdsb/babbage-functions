module.exports = function (context) {
    var waterfall = require('async/waterfall');

    // give our bindings more human-readable names
    var people_now = context.bindings.peopleNow;
    var people_previous = context.bindings.peoplePrevious;
    var people_diff = context.bindings.peopleDiff;

    // object to store our total diff as we build it
    var changed_records = {};

    waterfall([
        find_creates_and_updates(people_previous, people_now, changed_records),
        find_deletes(people_previous, changed_records)
    ], function (err, changed_records) {
        if (err) {
            context.done(err);
        } else {
            context.bindings.peoplePrevious = context.bindings.peopleNow;
            context.bindings.peopleDiff = changed_records;
            context.done(null, changed_records);
        }
    });

    function find_creates_and_updates(people_previous, people_now, changed_records, callback) {
        // loop through all records in people_now, looking for changes
        Object.getOwnPropertyNames(people_now).forEach(function (ein) {
            var new_record = people_now[ein];      // get the full person record from people_now
            var old_record = people_previous[ein]; // get the corresponding record in people_previous
    
            // track whether or not we found changes, and what they were
            var person_changed = false;
            var person_changes = [];
    
            // if we found a corresponding record in people_previous, look for changes
            if (old_record) {
                var person_diff = diff_person(old_record, new_record, person_changed, person_changes);
                person_changed = person_diff.person_changed;
                person_changes = person_diff.person_changes;
    
                var assignments_diff = diff_assignments(old_record, new_record, person_changed, person_changes);
                person_changed = assignments_diff.person_changed;
                person_changes = assignments_diff.person_changes;
    
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
        callback(null, people_previous, changed_records);
    }

    function find_deletes(people_previous, changed_records, callback) {
        // if we have any old records remaining, they didn't match a new record, so they must be deletes
        Object.getOwnPropertyNames(people_previous).forEach(function (ein) {
            var old_record = people_previous[ein];
    
            console.log('Found deleted record for EIN ' + ein);
            changed_records[ein] = {delete: old_record};
        });
        callback(null, changed_records);
    }

    function diff_person(old_record, new_record, person_changed, person_changes) {
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
        return {person_changed: person_changed, person_changes: person_changes};
    }

    function diff_assignments(old_record, new_record, person_changed, person_changes) {
        var old_assignments = old_record.assignments;
        var new_assignments = new_record.assignments;

        var created_assignments = [];
        var updated_assignments = [];
        var deleted_assignments = [];

        new_assignments.forEach( function(new_assignment) {
            if (!old_assignments.some( function(old_assignment) {
                    return old_assignment.ipps_job_code     != new_assignment.ipps_job_code &&
                    old_assignment.ipps_location_code       != new_assignment.ipps_location_code &&
                    old_assignment.ipps_employee_group_code != new_assignment.ipps_employee_group_code;
            })) {
                created_assignments.push(new_assignment);
            }
        });

        new_assignments.forEach( function(new_assignment) {
            if (old_assignments.some( function(old_assignment) {
                    return old_assignment.ipps_job_code     == new_assignment.ipps_job_code &&
                    old_assignment.ipps_location_code       == new_assignment.ipps_location_code &&
                    old_assignment.ipps_employee_group_code == new_assignment.ipps_employee_group_code &&
                    (
                        old_assignment.ipps_job_description            != new_assignment.ipps_job_description ||
                        old_assignment.ipps_location_description       != new_assignment.ipps_location_description ||
                        old_assignment.ipps_employee_group_category    != new_assignment.ipps_employee_group_category ||
                        old_assignment.ipps_employee_group_description != new_assignment.ipps_employee_group_description ||
                        old_assignment.ipps_school_code                != new_assignment.ipps_school_code ||
                        old_assignment.ipps_school_type                != new_assignment.ipps_school_type ||
                        old_assignment.ipps_panel                      != new_assignment.ipps_panel ||
                        old_assignment.ipps_phone_no                   != new_assignment.ipps_phone_no ||
                        old_assignment.ipps_extension                  != new_assignment.ipps_extension ||
                        old_assignment.ipps_home_location_indicator    != new_assignment.ipps_home_location_indicator ||
                        old_assignment.ipps_activity_code              != new_assignment.ipps_activity_code
                    );
            })) {
                updated_assignments.push(new_assignment);
            }
        });

        old_assignments.forEach( function(old_assignment) {
            if (!new_assignments.some( function(new_assignment) {
                    return new_assignment.ipps_job_code     != old_assignment.ipps_job_code &&
                    new_assignment.ipps_location_code       != old_assignment.ipps_location_code &&
                    new_assignment.ipps_employee_group_code != old_assignment.ipps_employee_group_code;
            })) {
                deleted_assignments.push(old_assignment);
            }
        });

        if (created_assignments.length > 0) {
            person_changed = true;
            person_changes.push({
                created_assignments: created_assignments
            });
        }

        if (updated_assignments.length > 0) {
            person_changed = true;
            person_changes.push({
                updated_assignments: updated_assignments
            });
        }

        if (deleted_assignments.length > 0) {
            person_changed = true;
            person_changes.push({
                deleted_assignments: deleted_assignments
            });
        }
        return {person_changed: person_changed, person_changes: person_changes};
    }
};
