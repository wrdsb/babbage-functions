module.exports = function (context, message) {
    var async = require('async');
    var azure = require('azure-storage');
    var codexBlobService = azure.createBlobService('wrdsbcodex', process.env["wrdsbcodex_storageKey"]);
    var babbageBlobService = azure.createBlobService('wrdsbbabbage', process.env["wrdsbbabbage_storageKey"]);

    var group_name = message.group_email;
    var filename = group_name + '.json';
    var memberships_actual = {};
    var memberships_central = {};
    var memberships_ipps = {};
    var memberships_supplemental = {};
    var memberships_ideal = {};

    context.log('Calculate membership differences for ' + group_name);

    async.waterfall([
       fetchBlobs,
       parseBlobs,
       calculateDifferences
    ], function (error, diff) {
        context.log(diff);
        // babbageBlobService.createBlockBlobFromText('groups-memberships-differences', filename, diff, function(error, result, response) {
            // if (!error) {
                // console.log(filename + ' uploaded');
                // console.log(result);
                // console.log(response);
            // } else {
                // console.log(error);
            // }
        // });
        context.done(null);
    });

    function fetchBlobs(callback) {
        async.parallel({
            groups_memberships_actual: async.reflect(function(callback) {
                var blob = codexBlobService.getBlobToText('groups-memberships-actual', filename, function(error, result, response) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, blob);
                    }
                });
            }),
            groups_memberships_central: async.reflect(function(callback) {
                var blob = codexBlobService.getBlobToText('groups-memberships-central', filename, function(error, result, response) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, blob);
                    }
                });
            }),
            groups_memberships_ipps: async.reflect(function(callback) {
                var blob = codexBlobService.getBlobToText('groups-memberships-ipps', filename, function(error, result, response) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, blob);
                    }
                });
            }),
            groups_memberships_supplemental: async.reflect(function (callback) {
                var blob = codexBlobService.getBlobToText('groups-memberships-supplemental', filename, function(error, result, response) {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, blob);
                    }
                });
            })
        }, function(error, results) {
            if (results.groups_memberships_actual.error) {
                context.log('Error retrieving groups-memberships-actual file for ' + filename);
                context.log(results.groups_memberships_actual.error);
            } else {
                
            }
            if (results.groups_memberships_central.error) {
                context.log('Error retrieving groups-memberships-central file for ' + filename);
                context.log(results.groups_memberships_central.error);
            } else {
                
            }
            if (results.groups_memberships_ipps.error) {
                context.log('Error retrieving groups-memberships-ipps file for ' + filename);
                context.log(results.groups_memberships_ipps.error);
            } else {
                
            }
            if (results.groups_memberships_supplemental.error) {
                context.log('Error retrieving groups-memberships-supplemental file for ' + filename);
                context.log(results.groups_memberships_supplemental.error);
            } else {
                memberships_actual = results.groups_memberships_actual.value;
                memberships_central = results.groups_memberships_central.value;
                memberships_ipps = results.groups_memberships_ipps.value;
                memberships_supplemental = results.groups_memberships_supplemental;
            }
        });
    }

    function parseBlobs(callback) {
        if (!memberships_actual) {
            context.log('No groups-memberships-actual file found for ' + filename);
            codexBlobService.createBlockBlobFromText('groups-memberships-actual', filename, '{}', function(error, result, response){
                if(!error){
                    context.log('Successfully created empty groups-memberships-actual file for ' + filename);
                } else {
                    context.log('Error creating empty groups-memberships-actual file for ' + filename);
                }
            });
            memberships_actual = {};
        } else {
            memberships_actual = JSON.parse(memberships_actual);
        }
    
        if (!memberships_central) {
            context.log('No groups-memberships-central file found for ' + filename);
            codexBlobService.createBlockBlobFromText('groups-memberships-central', filename, '{}', function(error, result, response){
                if(!error){
                    context.log('Successfully created empty groups-memberships-central file for ' + filename);
                } else {
                    context.log('Error creating empty groups-memberships-central file for ' + filename);
                }
            });
            memberships_central = {};
        } else {
            memberships_central = JSON.parse(memberships_central);
        }
    
        if (!memberships_ipps) {
            context.log('No groups-memberships-ipps file found for ' + filename);
            codexBlobService.createBlockBlobFromText('groups-memberships-ipps', filename, '{}', function(error, result, response){
                if(!error){
                    context.log('Successfully created empty groups-memberships-ipps file for ' + filename);
                } else {
                    context.log('Error creating empty groups-memberships-ipps file for ' + filename);
                }
            });
            memberships_ipps = {};
        } else {
            memberships_ipps = JSON.parse(memberships_ipps);
        }
    
        if (!memberships_supplemental) {
            context.log('No groups-memberships-supplemental file found for ' + filename);
            codexBlobService.createBlockBlobFromText('groups-memberships-supplemental', filename, '{}', function(error, result, response){
                if(!error){
                    context.log('Successfully created empty groups-memberships-supplemental file for ' + filename);
                } else {
                    context.log('Error creating empty groups-memberships-supplemental file for ' + filename);
                }
            });
            memberships_supplemental = {};
        } else {
            memberships_supplemental = JSON.parse(memberships_supplemental);
        }
        memberships_ideal = Object.assign(memberships_ipps, memberships_central, memberships_supplemental);
    }

    function calculateDifferences(callback) {
        // objects to store our diff parts
        var missing_memberships = {};
        var extra_memberships = {};
        var diff = {};
    
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
        }
        if (Object.getOwnPropertyNames(extra_memberships).length > 0) {
            diff.extra_memberships = extra_memberships;
        }
        callback(null, diff);
    }
};