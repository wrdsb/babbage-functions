# IPPS People Difference
Calculates differences in person records from IPPS.

changed_records[ein] = {
    update: {
        username: {
            from: old_record.username,
            to: new_record.username
        },
        email: {
            from: old_record.email,
            to: new_record.email
        },
        name: {
            from: old_record.name,
            to: new_record.name
        },
        sortable_name: {
            from: old_record.sortable_name,
            to: new_record.sortable_name
        },
        first_name: {
            from: old_record.first_name,
            to: new_record.first_name
        },
        last_name: {
            from: old_record.last_name,
            to: new_record.last_name
        },
        ipps_home_location: {
            from: old_record.ipps_home_location,
            to: new_record.ipps_home_location
        },
        created_positions: {
            [new_position_id]: new_position,
            [new_position_id]: new_position
        },
        updated_positions: {
            [new_position_id]: {
                old_position: old_position,
                new_position: new_position
            }
        },
        deleted_positions: {
            [old_position_id]: old_positions[old_position_id]
        }
    }
};

changed_records[ein] = {
    create: new_record
};

changed_records[ein] = {
    delete: people_previous[ein]
};