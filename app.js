// var app = require('express')();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var portfinder = require('portfinder');
var async = require('async');
var uuid = require("node-uuid");

app.use(express.static(__dirname + '/public'));

var numClients = 0;

var nsp = {};

var people = {};

var isDirty = {};

Object.defineProperty(Date.prototype, "format", {
    value: function (format) {
        var date = this;

        var result = "";

        if (!format) {

            format = ""

        }

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];

        if (format.match(/YYYY\-mm\-dd/)) {

            result = date.getFullYear() + "-" + padZeros((parseInt(date.getMonth()) + 1), 2) + "-" + padZeros(date.getDate(), 2);

        } else if (format.match(/mmm\/d\/YYYY/)) {

            result = months[parseInt(date.getMonth())] + "/" + date.getDate() + "/" + date.getFullYear();

        } else if (format.match(/d\smmmm,\sYYYY/)) {

            result = date.getDate() + " " + monthNames[parseInt(date.getMonth())] + ", " + date.getFullYear();

        } else {

            result = date.getDate() + "/" + months[parseInt(date.getMonth())] + "/" + date.getFullYear();

        }

        return result;
    }
});

function padZeros(number, positions) {
    var zeros = parseInt(positions) - String(number).length;
    var padded = "";

    for (var i = 0; i < zeros; i++) {
        padded += "0";
    }

    padded += String(number);

    return padded;
}

io.on('connection', function (socket) {
    numClients++;
    io.emit('stats', { numClients: numClients, id: "ALL" });

    // console.log('Connected clients:', numClients);

    socket.on('disconnect', function (me) {
        numClients--;
        io.emit('stats', { numClients: numClients, id: "ALL" });

        // console.log('Connected clients:', numClients);
    });

    socket.on('init', function (custom) {

        nsp[custom.id] = io.of('/' + custom.id);
        nsp[custom.id].on('connection', function (me) {

            var id = me.id.match(/\/([^\#]+)/)[1];

            // console.log('someone connected on ' + id);

        });

        nsp[custom.id].on('disconnect', function (me) {

            var id = me.id.match(/\/([^\#]+)/)[1];

            // console.log('Connected clients on ' + id + ':', numConns[id]);

        });

        socket.on('demographics', function (data) {

            updateUserView(data);

        });

        socket.on('click', function (data) {
            // console.log("received event for: " + data.id);
            nsp[data.id].emit('hi', "Someone says: " + data.message + " on " + data.id);
        })

        socket.on('update', function (data) {

            console.log(data);

            saveData(data, function () {

                // if (people[data.data.patient_id])
                //    people[data.data.patient_id].data.programs = {};

                isDirty[data.data.patient_id] = true;

                // console.log(JSON.stringify(people[data.data.patient_id].data.programs));

                updateUserView({id: data.data.patient_id});

            });

        })

        nsp[custom.id].emit('hi ' + custom.id, 'New connection in ' + custom.id + '!');

        socket.emit('newConnection', {id: custom.id});

    });

});

function saveData(data, callback) {

    var patient_program_id;

    var patient_id;

    var encounter_id;

    async.series([

        function (icallback) {

            var npid = data.data.patient_id;

            var sql = "SELECT patient_id FROM patient_identifier WHERE identifier = '" + npid + "' AND voided = 0";

            queryRaw(sql, function (res) {

                if (res[0].length > 0)
                    patient_id = res[0][0].patient_id;

                icallback();

            });

        },

        function (icallback) {

            var sql = "SELECT patient_program_id FROM patient_program LEFT OUTER JOIN program ON program.program_id = " +
                "patient_program.program_id WHERE patient_id = '" + patient_id +
                "' AND voided = 0 AND program.name = '" + data.data.program + "'";

            queryRaw(sql, function (res) {

                if (res[0].length > 0)
                    patient_program_id = res[0][0].patient_program_id;

                icallback();

            });

        },

        function (icallback) {

            if (!patient_program_id) {

                var sql = "INSERT INTO patient_program (patient_id, program_id, date_enrolled, creator, date_created, " +
                    "uuid, location_id) VALUES ('" + patient_id + "', (SELECT program_id FROM program WHERE name = '" +
                    data.data.program + "'), NOW(), '" + data.data.user_id + "', NOW(), '" + uuid.v1() + "', '" + 1 + "')";

                queryRaw(sql, function (res) {

                    var sql = "SELECT patient_program_id FROM patient_program LEFT OUTER JOIN program ON program.program_id = " +
                        "patient_program.program_id WHERE patient_id = '" + patient_id +
                        "' AND voided = 0 AND program.name = '" + data.data.program + "'";

                    queryRaw(sql, function (res) {

                        if (res[0].length > 0)
                            patient_program_id = res[0][0].patient_program_id;

                        icallback();

                    });

                });

            } else {

                icallback();

            }

        },

        function (icallback) {

            var sql = "INSERT INTO encounter (encounter_type, patient_id, provider_id, location_id, encounter_datetime, " +
                "creator, date_created, uuid, patient_program_id) VALUES ((SELECT encounter_type_id FROM encounter_type " +
                " WHERE name = '" + data.data.encounter_type + "'), '" + patient_id + "', '" + data.data.user_id +
                "', '" + 1 + "', NOW(), '" + data.data.user_id + "', NOW(), '" + uuid.v1() + "', '" + patient_program_id + "')";

            queryRaw(sql, function (res) {

                encounter_id = res[0].insertId;

                icallback();

            });

        },

        function (icallback) {

            var keys = Object.keys(data.data.obs);

            async.each(keys, function (group, oCallback) {

                var cKeys = Object.keys(data.data.obs[group]);

                async.each(cKeys, function(concept, iOCallback){

                    var category = "value_text";

                    if(group == "number") {

                        category = "value_numeric";

                    } else if(group == "date") {

                        category = "value_datetime";

                    }

                    var sql = "INSERT INTO obs (person_id, concept_id, encounter_id, obs_datetime, location_id, " +
                        category + "," +
                        " creator, date_created, uuid) VALUES ('" + patient_id + "', (SELECT concept_id FROM concept_name " +
                        "WHERE name = '" + concept + "' AND voided = 0 LIMIT 1), '" + encounter_id + "', NOW(), '" + 1 + "', '" +
                        data.data.obs[group][concept] + "', '" + data.data.user_id + "', NOW(), '" + uuid.v1() + "')";

                    queryRaw(sql, function (res) {

                        iOCallback();

                    });

                }, function () {

                    oCallback();

                })

            }, function () {

                icallback();

            })

        }

    ], function (err, results) {

        if (err) {

            callback(err);

        } else {

            callback();

        }

    });

}

function updateUserView(data) {

    var patient_id;

    var patientProgramIds = {};

    async.series([

        function (callback) {

            if (!people[data.id]) {

                queryData('patient_identifier', ['patient_id'], {identifier: data.id}, function (identifier) {

                    if (identifier.length > 0) {

                        patient_id = identifier[0].patient_id;

                        queryData('person_name', ['given_name', 'middle_name', 'family_name', 'family_name2', 'uuid'],
                            {person_id: patient_id}, function (names) {

                                // console.log(names);

                                var collection = [];

                                for (var i = 0; i < names.length; i++) {

                                    var demographics = {};

                                    demographics['First Name'] = names[i].given_name;

                                    demographics['Family Name'] = names[i].family_name;

                                    demographics['Middle Name'] =
                                        (String(names[i].middle_name).trim().toLowerCase() != "unknown" ?
                                            names[i].middle_name : "");

                                    demographics['Maiden Name'] = names[i].maiden_name;

                                    demographics['UUID'] = names[i].uuid;

                                    collection.push(demographics);

                                }

                                if (!people[data.id]) {

                                    people[data.id] = {
                                        data: {
                                            names: [],
                                            addresses: [],
                                            identifiers: {},
                                            programs: {},
                                            gender: null,
                                            birthdate: null,
                                            birthdate_estimated: null,
                                            UUID: null
                                        }
                                    };

                                }

                                console.log("First time query.");

                                people[data.id].data.names = collection;

                                nsp[data.id].emit('demographics',
                                    JSON.stringify({names: people[data.id].data.names }));

                                callback();

                            });

                    }

                });

            } else {

                queryData('patient_identifier', ['patient_id'], {identifier: data.id}, function (identifier) {

                    if (identifier.length > 0) {

                        patient_id = identifier[0].patient_id;

                    }

                    console.log("Sent existing names data");

                    nsp[data.id].emit('demographics',
                        JSON.stringify({names: people[data.id].data.names }));

                    callback();

                });

            }

        },

        function (callback) {

            if (people[data.id].data.addresses.length <= 0) {

                queryData('person_address', ['address1', 'address2', 'city_village', 'state_province',
                        'county_district', 'neighborhood_cell', 'township_division', 'uuid'],
                    {person_id: patient_id}, function (addresses) {

                        var collection = [];

                        for (var i = 0; i < addresses.length; i++) {

                            var address = {};

                            address['Current District'] = addresses[i].state_province;

                            address['Current T/A'] = addresses[i].township_division;

                            address['Current Village'] = addresses[i].city_village;

                            address['Closest Landmark'] = addresses[i].address1;

                            address['Home District'] = addresses[i].address2;

                            address['Home T/A'] = addresses[i].county_district;

                            address['Home Village'] = addresses[i].neigborhood_cell;

                            address['UUID'] = addresses[i].uuid;

                            collection.push(address);

                        }

                        if (!people[data.id]) {

                            people[data.id] = {
                                data: {
                                    names: [],
                                    addresses: [],
                                    identifiers: {},
                                    programs: {},
                                    gender: null,
                                    birthdate: null,
                                    birthdate_estimated: null,
                                    UUID: null
                                }
                            };

                        }

                        console.log("First time address query.");

                        people[data.id].data.addresses = collection;

                        nsp[data.id].emit('demographics',
                            JSON.stringify({addresses: people[data.id].data.addresses }));

                        callback();

                    });

            }
            else {

                console.log("Sent existing address data");

                nsp[data.id].emit('demographics',
                    JSON.stringify({addresses: people[data.id].data.addresses }));

                callback();

            }

        },

        function (callback) {

            if (!people[data.id].data.gender) {

                queryData('person', ['gender', 'birthdate', 'birthdate_estimated', 'uuid'],
                    {person_id: patient_id}, function (person) {

                        if (!people[data.id]) {

                            people[data.id] = {
                                data: {
                                    names: [],
                                    addresses: [],
                                    identifiers: {},
                                    programs: {},
                                    gender: null,
                                    birthdate: null,
                                    birthdate_estimated: null,
                                    UUID: null
                                }
                            };

                        }

                        people[data.id].data.gender = person[0].gender;

                        people[data.id].data.birthdate = person[0].birthdate;

                        people[data.id].data.birthdate_estimated = person[0].birthdate_estimated;

                        nsp[data.id].emit('demographics',
                            JSON.stringify({ gender: people[data.id].data.gender }));

                        nsp[data.id].emit('demographics',
                            JSON.stringify({ birthdate: people[data.id].data.birthdate }));

                        nsp[data.id].emit('demographics',
                            JSON.stringify({ birthdate_estimated: people[data.id].data.birthdate_estimated }));

                        console.log("Sent first basic data");

                        callback();

                    });

            }
            else {

                console.log("Sent existing basic data");

                nsp[data.id].emit('demographics',
                    JSON.stringify({ gender: people[data.id].data.gender }));

                nsp[data.id].emit('demographics',
                    JSON.stringify({ birthdate: people[data.id].data.birthdate }));

                nsp[data.id].emit('demographics',
                    JSON.stringify({ birthdate_estimated: people[data.id].data.birthdate_estimated }));

                callback();

            }

        },

        function (callback) {

            if (Object.keys(people[data.id].data.identifiers).length <= 0) {

                queryJoinData('patient_identifier', 'patient_identifier_type', 'patient_identifier.identifier_type',
                    'patient_identifier_type.patient_identifier_type_id', ['identifier', 'patient_identifier.uuid',
                        'name'],
                    {patient_id: patient_id, voided: 0}, function (identifiers) {

                        var collection = {};

                        for (var i = 0; i < identifiers.length; i++) {

                            collection[identifiers[i].name] = {
                                identifier: identifiers[i].identifier,
                                UUID: identifiers[i].uuid
                            }

                        }

                        if (!people[data.id]) {

                            people[data.id] = {
                                data: {
                                    names: [],
                                    addresses: [],
                                    identifiers: {},
                                    programs: {},
                                    gender: null,
                                    birthdate: null,
                                    birthdate_estimated: null,
                                    UUID: null
                                }
                            };

                        }

                        console.log("First time identifiers query.");

                        people[data.id].data.identifiers = collection;

                        nsp[data.id].emit('demographics',
                            JSON.stringify({identifiers: people[data.id].data.identifiers }));

                        callback();

                    });

            }
            else {

                console.log("Sent existing identifiers data");

                nsp[data.id].emit('demographics',
                    JSON.stringify({identifiers: people[data.id].data.identifiers }));

                callback();

            }

        },

        function (callback) {

            if (Object.keys(people[data.id].data.programs).length <= 0 || isDirty[data.id]) {

                queryJoinData('patient_program', 'program', 'patient_program.program_id',
                    'program.program_id', ['patient_program_id', 'date_enrolled', 'date_completed', 'name',
                        'program.uuid AS pUuid', 'patient_program.uuid AS mUuid'],
                    {patient_id: patient_id, voided: 0}, function (programs) {

                        var collection = {};

                        async.each(programs, function (program, iCallback) {

                            queryJoinData('encounter', 'encounter_type', 'encounter.encounter_type',
                                'encounter_type.encounter_type_id', ['encounter_id', 'encounter_datetime', 'name',
                                    'encounter.uuid'],
                                {patient_program_id: program.patient_program_id, voided: 0}, function (encounters) {

                                    // console.log(encounters);

                                    if (!collection[program.name]) {

                                        collection[program.name] = {
                                            UUID: "",
                                            patient_programs: {}
                                        };

                                    }

                                    collection[program.name]['UUID'] = program.pUuid;

                                    if (!collection[program.name]['patient_programs']) {

                                        collection[program.name]['patient_programs'] = {};

                                    }

                                    if (!collection[program.name]['patient_programs'][program.mUuid]) {

                                        collection[program.name]['patient_programs'][program.mUuid] = {};

                                    }

                                    if (!patientProgramIds[program.patient_program_id]) {

                                        patientProgramIds[program.mUuid] = program['patient_program_id'];

                                    }

                                    collection[program.name]['patient_programs'][program.mUuid]['date_enrolled'] =
                                        program['date_enrolled'];

                                    collection[program.name]['patient_programs'][program.mUuid]['date_completed'] =
                                        program['date_completed'];

                                    if (!collection[program.name]['patient_programs'][program.mUuid]['visits']) {

                                        collection[program.name]['patient_programs'][program.mUuid]['visits'] = {};

                                    }

                                    async.each(encounters, function (encounter, oCallback) {

                                        var encounterDatetime = (new Date(encounter.encounter_datetime)).format("YYYY-mm-dd");

                                        if (!collection[program.name]['patient_programs'][program.mUuid]['visits'][encounterDatetime]) {

                                            collection[program.name]['patient_programs'][program.mUuid]['visits'][encounterDatetime] = {};

                                        }

                                        if (!collection[program.name]['patient_programs'][program.mUuid]['visits'][encounterDatetime][encounter.name]) {

                                            collection[program.name]['patient_programs'][program.mUuid]['visits'][encounterDatetime][encounter.name] = [];

                                        }

                                        buildObs(encounter, function (data) {

                                            for(var i = 0; i < data.length; i++) {

                                                collection[program.name]['patient_programs'][program.mUuid]
                                                    ['visits'][encounterDatetime][encounter.name].push(data[i]);

                                            }

                                            oCallback();

                                        });

                                        // oCallback();

                                    }, function () {

                                        iCallback();

                                    });

                                }, 'encounter_datetime');

                        }, function () {

                            if (!people[data.id]) {

                                people[data.id] = {
                                    data: {
                                        names: [],
                                        addresses: [],
                                        identifiers: {},
                                        programs: {},
                                        gender: null,
                                        birthdate: null,
                                        birthdate_estimated: null,
                                        UUID: null
                                    }
                                };

                            }

                            people[data.id].data.programs = collection;

                            console.log("Sent new programs data");

                            nsp[data.id].emit('demographics',
                                JSON.stringify({programs: people[data.id].data.programs }));

                            callback();

                        });

                    });

            }
            else {

                console.log("Sent existing programs data");

                nsp[data.id].emit('demographics',
                    JSON.stringify({programs: people[data.id].data.programs }));

                callback();

            }

        }

    ], function (err, results) {

        if (err) {

            nsp[data.id].emit('error', err.message);

            console.log(err.message);

        }

    });

}

function buildObs(encounter, oCallback) {

    var sql = "SELECT (SELECT name FROM concept_name WHERE concept_name.concept_id = o.concept_id LIMIT 1) AS name, o.uuid, c.uuid AS cUuid, " +
        "CASE WHEN COALESCE(value_coded_name_id,'') != '' THEN (SELECT name FROM concept_name WHERE concept_name_id = " +
        "value_coded_name_id LIMIT 1)" +
        " WHEN COALESCE(value_coded,'') != '' THEN (SELECT name FROM concept_name WHERE concept_id = value_coded LIMIT 1)" +
        " WHEN COALESCE(value_boolean,'') != '' THEN value_boolean" +
        " WHEN COALESCE(value_datetime,'') != '' THEN DATE(value_datetime)" +
        " WHEN COALESCE(value_numeric,'') != '' THEN value_numeric" +
        " ELSE value_text END AS value, " +
        "CASE WHEN COALESCE(value_coded_name_id,'') != '' OR COALESCE(value_coded,'') != '' THEN 'SPECIFIC NAME' " +
        " WHEN COALESCE(value_boolean,'') != '' THEN 'TRUE/FALSE' " +
        " WHEN COALESCE(value_datetime,'') != '' THEN 'DATE AND TIME' " +
        " WHEN COALESCE(value_numeric,'') != '' THEN 'NUMERIC' " +
        " ELSE 'TEXT' END AS category " +
        " FROM obs o LEFT OUTER JOIN concept c ON c.concept_id = o.concept_id " +
        " WHERE o.encounter_id = " + encounter.encounter_id;

    // console.log(sql);

    queryRaw(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            var entry = {};

            var leaf = data[0][i];

            entry[leaf.name] = {
                UUID: leaf.uuid,
                concept: {
                    UUID: leaf.cUuid
                },
                response: {
                    value: leaf.value,
                    category: leaf.category
                }
            }

            collection.push(entry);

        }

        oCallback(collection);

    })

}

function queryRaw(sql, callback) {

    var config = require(__dirname + "/config/database.json");

    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        },
        pool: {
            min: 0,
            max: 500
        }
    });

    knex.raw(sql)
        .then(function (result) {

            callback(result);

        })
        .catch(function (err) {

            console.log(err.message);

            callback(err);

        });

}

function queryJoinData(table, jointTable, srcField, jointField, fields, condition, callback, orderByField) {

    var config = require(__dirname + "/config/database.json");

    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        },
        pool: {
            min: 0,
            max: 500
        }
    });

    if (condition) {

        if (orderByField) {

            // console.log(knex(table).leftOuterJoin(jointTable, srcField, jointField).where(condition).orderBy(orderByField, 'DESC')
            //    .select(fields).toSQL());

            knex(table).leftOuterJoin(jointTable, srcField, jointField).where(condition).orderBy(orderByField, 'DESC')
                .select(fields)
                .then(function (values) {

                    var data = [];

                    for (var i = 0; i < values.length; i++) {

                        data.push(values[i]);

                    }

                    callback(data);

                })
                .catch(function (err) {

                    console.log(err.message);

                    callback(err);

                });

        } else {

            // console.log(knex(table).leftOuterJoin(jointTable, srcField, jointField).where(condition)
            //    .select(fields).toSQL());

            knex(table).leftOuterJoin(jointTable, srcField, jointField).where(condition)
                .select(fields)
                .then(function (values) {

                    var data = [];

                    for (var i = 0; i < values.length; i++) {

                        data.push(values[i]);

                    }

                    callback(data);

                })
                .catch(function (err) {

                    console.log(err.message);

                    callback(err);

                });

        }

    }
    else {

        console.log(knex.select(fields).from(table).leftOuterJoin(jointTable, srcField, jointField).toSQL());

        knex.select(fields).from(table).leftOuterJoin(jointTable, srcField, jointField)
            .then(function (values) {

                var data = [];

                for (var i = 0; i < values.length; i++) {

                    data.push(values[i]);

                }

                callback(data);

            })
            .catch(function (err) {

                console.log(err.message);

                callback(err);

            })

    }

}

function queryData(table, fields, condition, callback) {

    var config = require(__dirname + "/config/database.json");

    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        },
        pool: {
            min: 0,
            max: 500
        }
    });

    if (condition) {

        // console.log(knex(table).where(condition)
        //    .select(fields).toSQL());

        knex(table).where(condition)
            .select(fields)
            .then(function (values) {

                var data = [];

                for (var i = 0; i < values.length; i++) {

                    data.push(values[i]);

                }

                callback(data);

            })
            .catch(function (err) {

                console.log(err.message);

                callback(err);

            });

    }
    else {

        // console.log(knex.select(fields).from(table).toSQL());

        knex.select(fields).from(table)
            .then(function (values) {

                var data = [];

                for (var i = 0; i < values.length; i++) {

                    data.push(values[i]);

                }

                callback(data);

            })
            .catch(function (err) {

                console.log(err.message);

                callback(err);

            })

    }

}

app.get('/:id', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data/person.json', function (req, res) {
    res.sendFile(__dirname + '/data/person.json');
});

app.get('/data/modules.json', function (req, res) {
    res.sendFile(__dirname + '/data/modules.json');
});

portfinder.basePort = 3014;

portfinder.getPort(function (err, port) {

    server.listen(port, function () {
        console.log("✔ Server running on port %d in %s mode", port, app.get('env'));
    });

});