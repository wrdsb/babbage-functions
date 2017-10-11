module.exports = function (context, message) {
    var group_name = message.group_email;
    var filename = group_name + '.json';
    context.log('Calculate membership differences for ' + group_name);

    var async = require('async');
    var azure = require('azure-storage');

    context.log('loaded');

    var memberships_actual = {};
    var memberships_central = {};
    var memberships_ipps = {};
    var memberships_supplemental = {};
    var memberships_ideal = {};

    async.waterfall([
        codex_handshake,
        fetchBlobs,
        parseBlobs,
        calculateDifferences
    ], function (error, diff) {
        context.log(diff);
        //context.log('babbage handshake');
        //var babbageBlobService = azure.createBlobService('wrdsbbabbage', process.env["wrdsbbabbage_storageKey"]);
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

    function codex_handshake (callback) {
        context.log('codex handshake');
        var codexBlobService = azure.createBlobService('wrdsbcodex', process.env["wrdsbcodex_storageKey"]);
        callback(null, codexBlobService);
    }

    function fetchBlobs(codexBlobService, callback) {
        async.series({
            groups_memberships_actual: function(callback) {
                context.log('Fetch groups-memberships-actual/' + filename);
                codexBlobService.getBlobToText('groups-memberships-actual', filename, function(error, result, response) {
                    if (error) {
                        if (error.statusCode == 404) {
                            context.log('No groups-memberships-actual file found for ' + filename);
                            codexBlobService.createBlockBlobFromText('groups-memberships-actual', filename, '{}', function(error, result, response){
                                if(!error){
                                    context.log('Successfully created empty groups-memberships-actual file for ' + filename);
                                } else {
                                    context.log('Error creating empty groups-memberships-actual file for ' + filename);
                                }
                            });
                            callback(null, JSON.stringify({}));
                        } else {
                            callback(error);
                        }
                    } else {
                        context.log('Found groups-memberships-actual file for ' + filename);
                        callback(null, result);
                    }
                });
            },
            groups_memberships_central: function(callback) {
                context.log('Fetch groups-memberships-central/' + filename);
                codexBlobService.getBlobToText('groups-memberships-central', filename, function(error, result, response) {
                    if (error) {
                        if (error.statusCode == 404) {
                            context.log('No groups-memberships-central file found for ' + filename);
                            codexBlobService.createBlockBlobFromText('groups-memberships-central', filename, '{}', function(error, result, response){
                                if(!error){
                                    context.log('Successfully created empty groups-memberships-central file for ' + filename);
                                } else {
                                    context.log('Error creating empty groups-memberships-central file for ' + filename);
                                }
                            });
                            callback(null, JSON.stringify({}));
                        } else {
                            callback(error);
                        }
                    } else {
                        context.log('Found groups-memberships-central file for ' + filename);
                        callback(null, result);
                    }
                });
            },
            groups_memberships_ipps: function(callback) {
                context.log('Fetch groups-memberships-ipps/' + filename);
                codexBlobService.getBlobToText('groups-memberships-ipps', filename, function(error, result, response) {
                    if (error) {
                        if (error.statusCode == 404) {
                            context.log('No groups-memberships-ipps file found for ' + filename);
                            codexBlobService.createBlockBlobFromText('groups-memberships-ipps', filename, '{}', function(error, result, response){
                                if(!error){
                                    context.log('Successfully created empty groups-memberships-ipps file for ' + filename);
                                } else {
                                    context.log('Error creating empty groups-memberships-ipps file for ' + filename);
                                }
                            });
                            callback(null, JSON.stringify({}));
                        } else {
                            callback(error);
                        }
                    } else {
                        context.log('Found groups-memberships-ipps file for ' + filename);
                        callback(null, result);
                    }
                });
            },
            groups_memberships_supplemental: function (callback) {
                context.log('Fetch groups-memberships-supplemental/' + filename);
                codexBlobService.getBlobToText('groups-memberships-supplemental', filename, function(error, result, response) {
                    if (error) {
                        if (error.statusCode == 404) {
                            context.log('No groups-memberships-supplemental file found for ' + filename);
                            codexBlobService.createBlockBlobFromText('groups-memberships-supplemental', filename, '{}', function(error, result, response){
                                if(!error){
                                    context.log('Successfully created empty groups-memberships-supplemental file for ' + filename);
                                } else {
                                    context.log('Error creating empty groups-memberships-supplemental file for ' + filename);
                                }
                            });
                            callback(null, JSON.stringify({}));
                        } else {
                            callback(error);
                        }
                    } else {
                        context.log('Found groups-memberships-supplemental file for ' + filename);
                        callback(null, result);
                    }
                });
            }
        }, function(error, results) {
            if (results.groups_memberships_actual.error) {
                context.log('Error retrieving groups-memberships-actual file for ' + filename);
                context.log(results.groups_memberships_actual.error);
            } else {
                memberships_actual = results.groups_memberships_actual.value;
            }
            if (results.groups_memberships_central.error) {
                context.log('Error retrieving groups-memberships-central file for ' + filename);
                context.log(results.groups_memberships_central.error);
            } else {
                memberships_central = results.groups_memberships_central.value;
            }
            if (results.groups_memberships_ipps.error) {
                context.log('Error retrieving groups-memberships-ipps file for ' + filename);
                context.log(results.groups_memberships_ipps.error);
            } else {
                memberships_ipps = results.groups_memberships_ipps.value;
            }
            if (results.groups_memberships_supplemental.error) {
                context.log('Error retrieving groups-memberships-supplemental file for ' + filename);
                context.log(results.groups_memberships_supplemental.error);
            } else {
                memberships_supplemental = results.groups_memberships_supplemental;
            }
            callback(null, memberships_actual, memberships_central, memberships_ipps, memberships_supplemental);
        });
    }

    function parseBlobs(memberships_actual, memberships_central, memberships_ipps, memberships_supplemental, callback) {
        if (!memberships_actual) {
            memberships_actual = {};
        } else {
            memberships_actual = JSON.parse(memberships_actual);
        }
    
        if (!memberships_central) {
            memberships_central = {};
        } else {
            memberships_central = JSON.parse(memberships_central);
        }
    
        if (!memberships_ipps) {
            memberships_ipps = {};
        } else {
            memberships_ipps = JSON.parse(memberships_ipps);
        }
    
        if (!memberships_supplemental) {
            memberships_supplemental = {};
        } else {
            memberships_supplemental = JSON.parse(memberships_supplemental);
        }
        memberships_ideal = Object.assign(memberships_ipps, memberships_supplemental, memberships_central);
        callback(null, memberships_ideal);
    }

    function calculateDifferences(memberships_ideal, callback) {
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