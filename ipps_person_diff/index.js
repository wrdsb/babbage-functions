module.exports = function (context, data) {
    var execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z
    var skyline_message;

    var old_record = data.old_record;
    var new_record = data.new_record;

    var old_positions = {};
    var new_positions = {};

    if (old_record.positions) {
        old_positions = old_record.positions;
    }

    if (new_record.positions) {
        new_positions = new_record.positions;
    }

    var created = false;
    var deleted = false;
    var changed = false;
    var changes = {};

    changes.positions = {};
    changes.positions.added = {};
    changes.positions.changed = {};
    changes.positions.removed = {};

    if (Object.getOwnPropertyNames(old_record).length < 1) {
        changed = true;
        created = true;
    }

    if (Object.getOwnPropertyNames(new_record).length < 1) {
        changed = true;
        deleted = true;
    }

    Object.getOwnPropertyNames(new_record).forEach(function (new_property) {
        if (new_property != 'positions' && !new_property.startsWith('_')) {
            if (!old_record[new_property]) {
                changed = true;
                changes[new_property] = {
                    from: null,
                    to: new_record[new_property]
                };
            } else if (old_record[new_property] != new_record[new_property]) {
                changed = true;
                changes[new_property] = {
                    from: old_record[new_property],
                    to: new_record[new_property]
                };
            }
        }
    });

    Object.getOwnPropertyNames(old_record).forEach(function (old_property) {
        if (old_property != 'positions' && !old_property.startsWith('_')) {
            if (!new_record[old_property]) {
                changed = true;
                changes[old_property] = {
                    from: old_record[old_property],
                    to: null
                };
            }
        }
    });

    Object.getOwnPropertyNames(new_positions).forEach(function (new_position_id) {
        var old_position = old_positions[new_position_id];
        var new_position = new_positions[new_position_id];

        // if the same position isn't present in old_positions, it's a brand new position
        if (!old_position) {
            changed = true;
            changes.positions.added[new_position_id] = new_position;
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
                changed = true;
                changes.positions.changed[new_position_id] = {old_position: old_position, new_position: new_position};
            }
        }
    });

    Object.getOwnPropertyNames(old_positions).forEach(function (old_position_id) {
        if (!new_positions[old_position_id]) {
            changed = true;
            changes.positions.removed[old_position_id] = old_positions[old_position_id];
        }
    });

    skyline_message = {
        service: 'babbage',
        operation: 'ipps_person_diff',
        function_name: context.executionContext.functionName,
        invocation_id: context.executionContext.invocationId,
        data: {
            created: created,
            deleted: deleted,
            changed: changed,
            changes: changes
        },
        timestamp: execution_timestamp
    };
    context.bindings.skylineEventHubMessage = JSON.stringify(skyline_message);
    context.res = {
        status: 200,
        body: skyline_message
    };
    context.log(JSON.stringify(skyline_message));
    context.done(null, JSON.stringify(skyline_message));
};
