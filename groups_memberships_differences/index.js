module.exports = function (context, message) {
    var azure = require('azure-storage');
    var codexBlobService = azure.createBlobService(process.env['wrdsbcodex'], process.env['wrdsbcodex_storageKey']);
    var babbageBlobService = azure.createBlobService(process.env['wrdsbbabbage'], process.env['wrdsbbabbage_storageKey']);

    var group_name = message.group_email;
    var filename = group_name + '.json';

    context.log('Calculate membership differences for ' + group_name);

    var memberships_actual       = JSON.parse(codexBlobService.getBlobToText('groups-memberships-actual', filename));
    var memberships_central      = JSON.parse(codexBlobService.getBlobToText('groups-memberships-central', filename));
    var memberships_ipps         = JSON.parse(codexBlobService.getBlobToText('groups-memberships-ipps', filename));
    var memberships_supplemental = JSON.parse(codexBlobService.getBlobToText('groups-memberships-supplemental', filename));

    if (!memberships_actual) {
        context.log('No groups-memberships-actual file found for ' + filename);
        codexBlobService.createBlockBlobFromText('groups-memberships-actual', filename, '{}', function(error, result, response){
            if(!error){
                // file uploaded
            }
        });
        memberships_actual = {};
    }

    if (!memberships_central) {
        context.log('No groups-memberships-central file found for ' + filename);
        codexBlobService.createBlockBlobFromText('groups-memberships-central', filename, '{}', function(error, result, response){
            if(!error){
                // file uploaded
            }
        });
        memberships_central = {};
    }

    if (!memberships_ipps) {
        context.log('No groups-memberships-ipps file found for ' + filename);
        codexBlobService.createBlockBlobFromText('groups-memberships-ipps', filename, '{}', function(error, result, response){
            if(!error){
                // file uploaded
            }
        });
        memberships_ipps = {};
    }

    if (!memberships_supplemental) {
        context.log('No groups-memberships-supplemental file found for ' + filename);
        codexBlobService.createBlockBlobFromText('groups-memberships-supplemental', filename, '{}', function(error, result, response){
            if(!error){
                // file uploaded
            }
        });
        memberships_supplemental = {};
    }

    var memberships_ideal = Object.assign(memberships_ipps, memberships_central, memberships_supplemental);

    // objects to store our diff parts
    var missing_memberships = {};
    var extra_memberships = {};
    var diff = {};
    var diff_found = false;

    context.log('Processing data for ' + filename);

    Object.getOwnPropertyNames(memberships_ideal).forEach(function (member) {
        if (!memberships_actual[member]) {
            console.log('Did not find member: ' + member);
            missing_memberships[member] = memberships_ideal[member];
        } else {
            //context.log('Found '+ member +' in '+ filename);
        }
    });

    Object.getOwnPropertyNames(memberships_actual).forEach(function (member) {
        if (!memberships_ideal[member]) {
            console.log('Found extra member: ' + member);
            extra_memberships[member] = memberships_actual[member];
        } else {
            //context.log('Found '+ member +' in '+ filename);
        }
    });

    if (Object.getOwnPropertyNames(missing_memberships).length > 0) {
        diff.missing_memberships = missing_memberships;
        diff_found = true;
    }
    if (Object.getOwnPropertyNames(extra_memberships).length > 0) {
        diff.extra_memberships = extra_memberships;
        diff_found = true;
        context.bindings.membershipsSupplemental = extra_memberships;
    }

    if (diff_found) {
        context.log(diff);
        babbageBlobService.createBlockBlobFromText('groups-memberships-differences', filename, diff, function(error, result, response) {
            if (!error) {
                console.log(filename + ' uploaded');
                console.log(result);
                console.log(response);
            } else {
                console.log(error);
            }
        });
    }
    context.done(null);
};