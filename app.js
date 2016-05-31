// var app = require('express')();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var portfinder = require('portfinder');
var async = require('async');
var uuid = require("node-uuid");
var bodyParser = require('body-parser');
var Mutex = require('Mutex');
var md5 = require('md5');
var randomstring = require("randomstring");

var mutex = new Mutex('htc_lock');

var url = require('url');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// for forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

function getAge(birthdate, estimated) {

    var age;

    if ((new Date(birthdate)) == "Invalid Date") {

        return "???";

    }

    if ((((new Date()) - (new Date(birthdate))) / (365 * 24 * 60 * 60 * 1000)) > 1) {

        age = Math.round((((new Date()) - (new Date(birthdate))) / (365 * 24 * 60 * 60 * 1000)), 0);

    } else if ((((new Date()) - (new Date(birthdate))) / (30 * 24 * 60 * 60 * 1000)) > 1) {

        age = Math.round((((new Date()) - (new Date(birthdate))) / (30 * 24 * 60 * 60 * 1000)), 0) + " months";

    } else if ((((new Date()) - (new Date(birthdate))) / (7 * 24 * 60 * 60 * 1000)) > 1) {

        age = Math.round((((new Date()) - (new Date(birthdate))) / (7 * 24 * 60 * 60 * 1000)), 0) + " weeks";

    } else if ((((new Date()) - (new Date(birthdate))) / (24 * 60 * 60 * 1000)) > 1) {

        age = Math.round((((new Date()) - (new Date(birthdate))) / (24 * 60 * 60 * 1000)), 0) + " days";

    } else if ((((new Date()) - (new Date(birthdate))) / (60 * 60 * 1000)) > 1) {

        age = Math.round((((new Date()) - (new Date(birthdate))) / (60 * 60 * 1000)), 0) + " hours";

    } else {

        age = "< 1hr";

    }

    age = (estimated != undefined && parseInt(estimated) == 1 ? "~" + age : age);

    return age;

}

function encrypt(password, salt) {

    var encrypted = md5(password + salt);

    return encrypted;

}

function generateId(patientId, username, location, callback) {

    if (mutex.isLocked()) {

        callback("Locked");

    } else {

        mutex.lock();

        var yr = (new Date()).getFullYear();

        var sql = "SELECT property_value FROM global_property WHERE property = 'htc.id.counter." + yr + "'";

        queryRaw(sql, function (res) {

            var nextId = 1;

            if (res[0].length > 0) {

                nextId = parseInt(res[0][0].property_value) + 1;

                sql = "UPDATE global_property SET property_value = '" + nextId + "' WHERE property = 'htc.id.counter." + yr + "'";

                queryRaw(sql, function (res) {

                    var id = nextId + "-" + yr;

                    var sql = "INSERT INTO patient_identifier (patient_id, identifier, identifier_type, location_id, " +
                        "creator, date_created, uuid) VALUES ('" + patientId + "', '" + id +
                        "', (SELECT patient_identifier_type_id FROM patient_identifier_type WHERE name = 'HTS Number'), " +
                        "(SELECT location_id FROM location WHERE name = '" + location + "'), (SELECT user_id FROM users " +
                        " WHERE username = '" + username + "'), NOW(), '" + uuid.v1() + "')";

                    queryRaw(sql, function (res) {

                        mutex.unlock();

                        var cid = id;

                        callback(cid);

                    });

                });

            } else {

                sql = "INSERT INTO global_property (property, property_value) VALUES ('htc.id.counter." + yr + "', '" +
                    nextId + "') ON DUPLICATE KEY UPDATE property = 'htc.id.counter." + yr + "'";

                queryRaw(sql, function (res) {

                    var id = nextId + "-" + yr;

                    var sql = "INSERT INTO patient_identifier (patient_id, identifier, identifier_type, location_id, " +
                        "creator, date_created, uuid) VALUES ('" + patientId + "', '" + id +
                        "', (SELECT patient_identifier_type_id FROM patient_identifier_type WHERE name = 'HTS Number'), " +
                        "(SELECT location_id FROM location WHERE name = '" + location + "'), (SELECT user_id FROM users " +
                        " WHERE username = '" + username + "'), NOW(), '" + uuid.v1() + "')";

                    queryRaw(sql, function (res) {

                        mutex.unlock();

                        var cid = id;

                        callback(cid);

                    });

                });

            }

        });

    }

}

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

                async.each(cKeys, function (concept, iOCallback) {

                    var category = "value_text";

                    if (group == "number") {

                        category = "value_numeric";

                    } else if (group == "date") {

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

                                            for (var i = 0; i < data.length; i++) {

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

function queryRawStock(sql, callback) {

    var config = require(__dirname + "/config/database.json");

    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.stockDatabase
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

function transferStock(data, res) {

    if (data.receipt_id) {

        var sql = "UPDATE transfer SET dispatch_id = '" + data.dispatch_id + "', transfer_quantity = '" + data.transfer_quantity +
            "', transfer_datetime = '" + data.transfer_datetime + "', transfer_who_transfered = '" + data.userId +
            "transfer_who_received = '" + (data.transfer_who_received ? data.transfer_who_received : "") +
            "', transfer_who_authorised = '" + (data.transfer_who_authorised ? data.transfer_who_authorised : "") +
            "', transfer_destination = '" + (data.transfer_destination ? data.transfer_destination : "") + "' WHERE " +
            "transfer_id = '" + data.transfer_id;

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.send(stock[0].insertId)

        });

    }
    else {

        var sql = "INSERT INTO transfer (dispatch_id, transfer_quantity, transfer_datetime, transfer_who_transfered, " +
            " transfer_who_received, transfer_who_authorised, transfer_destination) VALUES('" +
            data.dispatch_id + "', '" + data.transfer_quantity + "', '" + data.transfer_datetime + "', '" + data.userId +
            "', '" + (data.transfer_who_received ? data.transfer_who_received : "") + "', '" +
            (data.transfer_who_authorised ? data.transfer_who_authorised : "") + "', '" +
            (data.transfer_destination ? data.transfer_destination : "") + "')";

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.send(stock[0].insertId)

        });

    }

}

function dispatchStock(data, res) {

    if (data.receipt_id) {

        var sql = "UPDATE dispatch SET stock_id = '" + data.stock_id + "', dispatch_quantity = '" + data.dispatch_quantity +
            "', dispatch_datetime = '" + data.dispatch_datetime + "', dispatch_who_dispatched = '" + data.userId +
            "dispatch_who_received = '" + (data.dispatch_who_received ? data.dispatch_who_received : "") +
            "', dispatch_who_authorised = '" + (data.dispatch_who_authorised ? data.dispatch_who_authorised : "") +
            "', dispatch_destination = '" + (data.dispatch_destination ? data.dispatch_destination : "") + "' WHERE " +
            "dispatch_id = '" + data.dispatch_id;

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.send(stock[0].insertId)

        });

    }
    else {

        var sql = "INSERT INTO dispatch (stock_id, dispatch_quantity, dispatch_datetime, dispatch_who_dispatched, " +
            " dispatch_who_received, dispatch_who_authorised, dispatch_destination) VALUES('" +
            data.stock_id + "', '" + data.dispatch_quantity + "', '" + data.dispatch_datetime + "', '" + data.userId +
            "', '" + (data.dispatch_who_received ? data.dispatch_who_received : "") + "', '" +
            (data.dispatch_who_authorised ? data.dispatch_who_authorised : "") + "', '" +
            (data.dispatch_destination ? data.dispatch_destination : "") + "')";

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.send(stock[0].insertId)

        });

    }

}

function receiveStock(data, res) {

    if (data.receipt_id) {

        var sql = "UPDATE receipt SET stock_id = '" + data.stock_id + "', receipt_quantity = '" + data.receipt_quantity +
            "', receipt_datetime = '" + data.receipt_datetime + "', receipt_who_received = '" + data.userId + "' WHERE " +
            "receipt_id = '" + data.receipt_id;

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.send(stock[0].insertId)

        });

    }
    else {

        var sql = "INSERT INTO receipt (stock_id, receipt_quantity, receipt_datetime, receipt_who_received) VALUES('" +
            data.stock_id + "', '" + data.receipt_quantity + "', '" + data.receipt_datetime + "', '" + data.userId + "')";

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.send(stock[0].insertId)

        });

    }

}

function saveStock(data, res) {

    if (data.stock_id) {

        var sql = "SELECT category_id FROM category WHERE name = '" + data.category + "'";

        console.log(sql);

        queryRawStock(sql, function (category) {

            if (category[0].length <= 0) {

                var sql = "INSERT INTO category (name) VALUES('" + data.category + "')";

                queryRawStock(sql, function (category) {

                    var category_id = category[0].insertId;

                    var sql = "UPDATE stock SET name = '" + data.item_name + "', " +
                        "description = '" + (data.description ? data.description : "") + "', " +
                        "reorder_level = '" + data.re_order_level + "', " +
                        "category_id = '" + category_id + "', " +
                        "date_created = NOW(), " +
                        "creator= '" + data.userId + "' WHERE stock_id = '" + data.stock_id + "'";

                    console.log(sql);

                    queryRawStock(sql, function (stock) {

                        console.log(stock[0]);

                        res.send(stock[0])

                    });

                });

            } else {

                var category_id = category[0][0].category_id;

                var sql = "UPDATE stock SET name = '" + data.item_name + "', " +
                    "description = '" + (data.description ? data.description : "") + "', " +
                    "reorder_level = '" + data.re_order_level + "', " +
                    "category_id = '" + category_id + "', " +
                    "date_created = NOW(), " +
                    "creator= '" + data.userId + "' WHERE stock_id = '" + data.stock_id + "'";

                console.log(sql);

                queryRawStock(sql, function (stock) {

                    console.log(stock[0]);

                    res.send(stock[0])

                });

            }

        });

    }
    else {

        var sql = "SELECT category_id FROM category WHERE name = '" + data.category + "'";

        console.log(sql);

        queryRawStock(sql, function (category) {

            if (category[0].length <= 0) {

                var sql = "INSERT INTO category (name) VALUES('" + data.category + "')";

                queryRawStock(sql, function (category) {

                    var category_id = category[0].insertId;

                    var sql = "INSERT INTO stock (name, description, reorder_level, category_id, date_created, creator) VALUES('" +
                        data.item_name + "', '" + (data.description ? data.description : "") + "', '" + data.re_order_level +
                        "', '" + category_id + "', NOW(), '" + data.userId + "')";

                    console.log(sql);

                    queryRawStock(sql, function (stock) {

                        console.log(stock[0]);

                        res.send(stock[0].insertId)

                    });

                });

            } else {

                var category_id = category[0][0].category_id;

                var sql = "INSERT INTO stock (name, description, reorder_level, category_id, date_created, creator) VALUES('" +
                    data.item_name + "', '" + (data.description ? data.description : "") + "', '" + data.re_order_level +
                    "', '" + category_id + "', NOW(), '" + data.userId + "')";

                console.log(sql);

                queryRawStock(sql, function (stock) {

                    console.log(stock[0]);

                    res.send(stock[0].insertId)

                });

            }

        });

    }

}

function loggedIn(token, callback) {

    var sql = "SELECT user_property.user_id, username FROM user_property LEFT OUTER JOIN users ON users.user_id = " +
        "user_property.user_id WHERE property = 'token' AND property_value = '" + token + "'";

    console.log(sql);

    queryRaw(sql, function (user) {

        if(user[0].length > 0) {

            callback(true, user[0][0].user_id, user[0][0].username);

        } else {

            callback(false);

        }

    });

}

app.get('/authentic/:id', function(req, res) {

    loggedIn(req.params.id, function(result, user_id, username){

        res.status(200).json({loggedIn: result, userId: user_id, username: username});

    })

})

app.get('/logout/:id', function(req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "DELETE FROM user_property WHERE property = 'token' AND property_value = '" + req.params.id + "'";

    console.log(sql);

    queryRaw(sql, function (user) {

        console.log(user[0]);

        res.status(200).json({message: "Logged out"});

    });

})

app.post('/login', function (req, res) {

    console.log(req.body);

    var data = req.body;

    var sql = "SELECT user_id, username FROM users WHERE username = '" + data.username + "' AND password = MD5(CONCAT('" +
        data.password + "', salt))";

    queryRaw(sql, function (user) {

        if(user[0].length <= 0) {

            res.status(401).json({message: "Access denied!"});

        } else {

            var token = randomstring.generate(12);

            sql = "INSERT INTO user_property (user_id, property, property_value) VALUES('" + user[0][0].user_id +
                "', 'token', '" + token + "') ON DUPLICATE KEY UPDATE property_value = '" + token + "'";

            queryRaw(sql, function (result) {

                console.log(result[0]);

                res.status(200).json({token: token, username: user[0][0].username});

            })

        }

    });

})

app.get('/data/person.json', function (req, res) {
    res.sendFile(__dirname + '/data/person.json');
});

app.get('/data/modules.json', function (req, res) {
    res.sendFile(__dirname + '/data/modules.json');
});

app.get('/district_query', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT district.name FROM district LEFT OUTER JOIN region ON district.region_id = region.region_id " +
        "WHERE region.name = '" + query.region + "' AND district.name LIKE '" + (query.district ?
        query.district : "") + "%'";

    queryRaw(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            var district = data[0][i];

            collection.push(district.name);

        }

        var result = "<li>" + collection.join("</li><li>") + "</li>";

        res.send(result);

    })

});

app.get('/ta_query', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT traditional_authority.name FROM traditional_authority LEFT OUTER JOIN district ON " +
        "traditional_authority.district_id = district.district_id WHERE district.name = '" + query.district +
        "' AND traditional_authority.name LIKE '" + (query.ta ? query.ta : "") + "%'";

    queryRaw(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            var ta = data[0][i];

            collection.push(ta.name);

        }

        var result = "<li>" + collection.join("</li><li>") + "</li>";

        res.send(result);

    })

});

app.get('/village_query', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT village.name FROM village LEFT OUTER JOIN traditional_authority ON " +
        "village.traditional_authority_id = traditional_authority.traditional_authority_id LEFT OUTER JOIN district ON " +
        "traditional_authority.district_id = district.district_id WHERE district.name = '" + query.district +
        "' AND traditional_authority.name = '" + query.ta + "' AND village.name LIKE '" +
        (query.village ? query.village : "") + "%'";

    queryRaw(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            var ta = data[0][i];

            collection.push(ta.name);

        }

        var result = "<li>" + collection.join("</li><li>") + "</li>";

        res.send(result);

    })

});

app.get('/fnames_query', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT DISTINCT given_name AS name FROM person_name WHERE given_name LIKE '" +
        (query.name ? query.name : "") + "%'";

    queryRaw(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            var name = data[0][i];

            collection.push(name.name);

        }

        var result = "<li>" + collection.join("</li><li>") + "</li>";

        res.send(result);

    })

});

app.get('/lnames_query', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT DISTINCT family_name AS name FROM person_name WHERE family_name LIKE '" +
        (query.name ? query.name : "") + "%'";

    queryRaw(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            var name = data[0][i];

            collection.push(name.name);

        }

        var result = "<li>" + collection.join("</li><li>") + "</li>";

        res.send(result);

    })

});

app.post('/save_patient', function (req, res) {

    console.log(req.body.data);

    var data = req.body.data;

    var npid;

    var person_id;

    var patient_id;

    var sql = "INSERT INTO person (gender, birthdate, birthdate_estimated, creator, date_created, uuid) VALUES ('" +
        data["Gender"] + "', '" + data["Date of birth"] + "', '" + data["Birthdate Estimated"] + "', " +
        "(SELECT user_id FROM users WHERE username = '" + data["User ID"] + "'), NOW(), '" + uuid.v1() + "')";

    queryRaw(sql, function (person) {

        person_id = person[0].insertId;

        console.log(person[0].insertId);

        var sql = "INSERT INTO person_address (person_id, address1, address2, city_village, state_province, " +
            " creator, date_created, county_district, neighborhood_cell, township_division, uuid) VALUES ('" +
            person_id + "', '" +
            (data['Closest Landmark'] ? data['Closest Landmark'] : "") + "', '" +
            (data['Home District'] ? data['Home District'] : "") + "', '" +
            (data['Current Village'] ? data['Current Village'] : "") + "', '" +
            (data['Current District'] ? data['Current District'] : "") + "', " +
            "(SELECT user_id FROM users WHERE username = '" + data["User ID"] + "')," +
            " NOW(), '" +
            (data['Home T/A'] ? data['Home T/A'] : "") + "', '" +
            (data['Home Village'] ? data['Home Village'] : "") + "', '" +
            (data['Current T/A'] ? data['Current T/A'] : "") + "', '" +
            uuid.v1() +
            "')";

        queryRaw(sql, function (address) {

            var address_id = address[0].insertId;

            console.log(address_id);

            var sql = "INSERT INTO person_name (person_id, given_name, middle_name, family_name, creator, date_created, uuid) VALUES ('" +
                person_id + "', '" + data["First Name"] + "', '" + (data["Middle Name"] ? data["Middle Name"] : "") + "', '" +
                data["Last Name"] + "', " + "(SELECT user_id FROM users WHERE username = '" + data["User ID"] +
                "'), NOW(), '" + uuid.v1() + "')";

            queryRaw(sql, function (name) {

                var sql = "INSERT INTO patient (patient_id, creator, date_created) VALUES ('" +
                    person_id + "', (SELECT user_id FROM users WHERE username = '" + data["User ID"] + "'), NOW())";

                queryRaw(sql, function (patient) {

                    patient_id = patient[0].insertId;

                    console.log(patient_id);

                    generateId(patient_id, data["User ID"], (data["Location"] != undefined ? data["Location"] : "Unknown"),
                        function (response) {

                            npid = response;

                            res.send(npid);

                        });

                })

            });

        })

    });

});

app.post('/updateUser', function (req, res) {

    console.log(req.body);

    var data = req.body;

    var rString = randomstring.generate(12);

    var salt = rString;

    var password = encrypt(req.body.Password, salt);

    var person_id;

    sql = "SELECT user_id FROM users WHERE username = '" + req.body["Username"] + "'";

    queryRaw(sql, function (verification) {

        if (verification[0].length > 0) {

            res.send("Username already taken!");

        } else {

            var sql = "INSERT INTO person (gender, birthdate, birthdate_estimated, creator, date_created, uuid) VALUES ('" +
                req.body["Gender"] + "', '" + req.body["Date of Birth"] + "', '" + req.body["Estimated"] + "', " +
                "(SELECT user_id FROM users WHERE username = '" + (req.body["User ID"] ? req.body["User ID"] : "admin" ) +
                "'), NOW(), '" + uuid.v1() + "')";

            queryRaw(sql, function (person) {

                person_id = person[0].insertId;

                console.log(person[0].insertId);


                var sql = "INSERT INTO person_name (person_id, given_name, family_name, creator, date_created, uuid) VALUES ('" +
                    person_id + "', '" + req.body["First Name"] + "', '" + req.body["Last Name"] + "', " +
                    "(SELECT user_id FROM users WHERE username = '" + (req.body["User ID"] != undefined ? req.body["User ID"] : "admin" ) +
                    "'), NOW(), '" + uuid.v1() + "')";

                queryRaw(sql, function (name) {

                    sql = "SELECT user_id FROM users WHERE username = '" + (req.body["User ID"] ? req.body["User ID"] : "admin" ) + "'"

                    queryRaw(sql, function (updater) {

                        console.log(updater[0][0].user_id);

                        var sql = "INSERT INTO users (system_id, username, password, salt, creator, date_created, person_id, uuid) VALUES ('" +
                            req.body["Username"] + "', '" + req.body["Username"] + "', '" + password + "', '" + salt + "', '" +
                            updater[0][0].user_id + "', NOW(), '" + person_id + "', '" + uuid.v1() + "')";

                        queryRaw(sql, function (user) {

                            console.log(user);

                            res.send("User added!");

                        });

                    });

                });

            });

        }

    });

})

app.get('/search_for_patient', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    var sql = "SELECT person.person_id, family_name, given_name, birthdate, birthdate_estimated, gender, identifier, " +
        "(SELECT name FROM patient_identifier_type WHERE patient_identifier_type_id = " +
        "identifier_type) AS idtype, (SELECT city_village FROM person_address WHERE person_address.person_id = " +
        "person.person_id AND voided = 0 LIMIT 1) AS city_village FROM person_name LEFT OUTER JOIN person ON person.person_id = " +
        "person_name.person_id LEFT OUTER JOIN patient_identifier ON patient_identifier.patient_id = person.person_id " +
        "WHERE patient_identifier.voided = 0 AND person_name.voided = 0 AND person.voided = 0 AND family_name = '" +
        (query.last_name ? query.last_name : "") + "' AND given_name = '" + (query.first_name ? query.first_name : "") +
        "' AND gender = '" + (query.gender ? query.gender : "") + "' LIMIT " + lowerLimit + ", " + pageSize;

    console.log(sql);

    queryRaw(sql, function (data) {

        var collection = {};

        var keys = [];

        for (var i = 0; i < data[0].length; i++) {

            var person = data[0][i];

            if (!collection[person.person_id]) {

                collection[person.person_id] = {};

                keys.push(person.person_id);

            }

            collection[person.person_id]["First Name"] = person.given_name;

            collection[person.person_id]["Last Name"] = person.family_name;

            collection[person.person_id]["Gender"] = person.gender;

            collection[person.person_id]["Estimated"] = person.birthdate_estimated;

            collection[person.person_id]["Date of Birth"] = person.birthdate;

            if (!collection[person.person_id]["Identifiers"]) {

                collection[person.person_id]["Identifiers"] = {};

            }

            if (!collection[person.person_id]["Addresses"]) {

                collection[person.person_id]["Addresses"] = {};

            }

            collection[person.person_id]["Addresses"]["Current Residence"] = person.city_village;

            collection[person.person_id]["Identifiers"][person.idtype] = person.identifier;

        }

        var results = [];

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            var entry = {
                "names": {
                    "given_name": collection[key]["First Name"],
                    "family_name": collection[key]["Last Name"]
                },
                "gender": collection[key]["Gender"],
                "national_id": (collection[key]["Identifiers"]["National id"] ?
                    collection[key]["Identifiers"]["National id"] : ((Object.keys(collection[key]["Identifiers"]).length > 0) ?
                    collection[key]["Identifiers"][Object.keys(collection[key]["Identifiers"])[0]] : "")),
                "patient": {
                    "identifiers": collection[key]["Identifiers"]
                },
                "addresses": {
                    "current_village": collection[key]["Addresses"]["Current Residence"]
                },
                "age": getAge(collection[key]["Date of Birth"], collection[key]["Estimated"])
            }

            results.push(entry);

        }

        res.status(200).json(results);

    })

})

app.get('/test_id', function (req, res) {

    generateId(24, "admin", "Unknown", function (response) {

        console.log(response);

        res.send(response);

    });

})

app.get('/roles', function (req, res) {

    var roles = ["Counselor", "Supervisor", "Admin"];

    var result = "<li>" + roles.join("</li><li>") + "</li>";

    res.send(result);

})

app.get('/stock_list', function (req, res) {

    var sql = "SELECT stock.stock_id, name, SUM(receipt_quantity) receipt_quantity, SUM(dispatch_quantity) " +
        "dispatch_quantity, reorder_level FROM stock LEFT OUTER JOIN receipt ON receipt.stock_id = stock.stock_id LEFT " +
        "OUTER JOIN dispatch ON dispatch.stock_id = stock.stock_id GROUP BY stock.stock_id";

    queryRawStock(sql, function (data) {

        res.send(data[0]);

    })

})

app.get('/stock_categories', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT name FROM category WHERE name LIKE '" + query.category + "%'";

    queryRawStock(sql, function (data) {

        var collection = [];

        console.log(data[0]);

        for (var i = 0; i < data[0].length; i++) {

            collection.push(data[0][i].name);

        }

        var result = "<li>" + collection.sort().join("</li><li>") + "</li>";

        res.send(result);

    })

})

app.get('/stock_items', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT stock.name FROM stock LEFT OUTER JOIN category ON stock.category_id = category.category_id WHERE " +
        "category.name = '" + query.category + "' AND stock.name LIKE '" + query.item_name + "%'";

    queryRawStock(sql, function (data) {

        var collection = [];

        console.log(data[0]);

        for (var i = 0; i < data[0].length; i++) {

            collection.push(data[0][i].name);

        }

        var result = "<li>" + collection.sort().join("</li><li>") + "</li>";

        res.send(result);

    })

})

app.get('/stock_search', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT stock.stock_id, stock.name AS item_name, description, category.name AS category_name, " +
        "COALESCE(SUM(receipt_quantity),0) receipt_quantity, " +
        "COALESCE(SUM(dispatch_quantity),0) dispatch_quantity, reorder_level FROM stock LEFT OUTER JOIN category ON " +
        "category.category_id = stock.category_id LEFT OUTER JOIN receipt ON receipt.stock_id = stock.stock_id LEFT " +
        "OUTER JOIN dispatch ON dispatch.stock_id = stock.stock_id " + (query.category && query.item_name ?
        "WHERE category.name = '" + query.category + "' AND stock.name = '" + query.item_name + "'" : "") +
        " GROUP BY stock.stock_id";

    console.log(sql);

    queryRawStock(sql, function (data) {

        var collection = [];

        console.log(data[0]);

        for (var i = 0; i < data[0].length; i++) {

            var entry = {
                stock_id: data[0][i].stock_id,
                item_name: data[0][i].item_name,
                category: data[0][i].category_name,
                description: data[0][i].description,
                in_stock: (parseInt(data[0][i].receipt_quantity) - parseInt(data[0][i].dispatch_quantity)),
                last_order_size: (data[0][i].last_order_size ? data[0][i].last_order_size : 0),
                avg_dispatch_per_day: 0,
                re_order_level: data[0][i].reorder_level
            }

            collection.push(entry);

        }

        // var collection = (categories[query.category] || []);

        res.status(200).json(collection);

    })

})

app.post('/save_item', function (req, res) {

    var data = req.body.data;

    console.log(Object.keys(data));

    switch (data.datatype) {

        case "receive":

            receiveStock(data, res);

            break;

        case "stock":

            saveStock(data, res);

            break;

        case 'dispatch':

            dispatchStock(data, res);

            break;

        case "transfer":

            transferStock(data, res);

            break;

    }

})

app.get('/patient/:id', function (req, res) {
    res.sendFile(__dirname + '/patient.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

portfinder.basePort = 3014;

portfinder.getPort(function (err, port) {

    server.listen(port, function () {
        console.log("✔ Server running on port %d in %s mode", port, app.get('env'));
    });

});