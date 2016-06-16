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

app.set('views', __dirname + '/views');
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

        // Year runs from July 1 to June 30
        var yr = ((new Date()).getMonth() < 6 ? (new Date()).getFullYear() - 1 : ((new Date()).getFullYear()));

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

                sql = "INSERT INTO global_property (property, property_value, uuid) VALUES ('htc.id.counter." + yr + "', '" +
                    nextId + "', '" + uuid.v1() + "')"; // ON DUPLICATE KEY UPDATE property = 'htc.id.counter." + yr + "'";

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

            console.log(JSON.stringify(data));

            saveData(data, function (unathorized) {

                if (unathorized) {

                    nsp[custom.id].emit('kickout ' + data.data.patient_id, 'Unathorized connection detected. Locking ' +
                        data.data.patient_id + '!');

                    return;

                }

                // if (people[data.data.patient_id])
                //    people[data.data.patient_id].data.programs = {};

                isDirty[data.data.patient_id] = true;

                // console.log(JSON.stringify(people[data.data.patient_id].data.programs));

                updateUserView({id: data.data.patient_id});

            });

        })

        socket.on('void', function (data) {

            console.log(JSON.stringify(data));

            voidConcept(data, function (unathorized) {

                if (unathorized) {

                    nsp[custom.id].emit('kickout ' + data.data.patient_id, 'Unathorized connection detected. Locking ' +
                        data.data.patient_id + '!');

                    return;

                }

                isDirty[data.patient_id] = true;

                updateUserView({id: data.patient_id});

            });

        })

        socket.on('relationship', function (data) {

            console.log(JSON.stringify(data));

            saveRelationship(data, function (unathorized) {

                if (unathorized) {

                    nsp[custom.id].emit('kickout ' + data.data.patient_id, 'Unathorized connection detected. Locking ' +
                        data.data.patient_id + '!');

                    return;

                }
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

function saveRelationship(params, callback) {

    var data = params.data;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return callback(true);

        }

        console.log(data);

        var person_id;

        var relation_id;

        var relationship_type_id;

        var reverse_relationship_type_id;

        async.series([

            function (iCallback) {

                var relationship = data.relationship_type.split(" - ");

                var sql = "SELECT relationship_type_id FROM relationship_type WHERE a_is_to_b = '" + relationship[0].trim() +
                    "' AND b_is_to_a = '" + relationship[1].trim() + "'";

                console.log(sql);

                queryRaw(sql, function (relationshipType) {

                    console.log(relationshipType[0][0].relationship_type_id);

                    relationship_type_id = relationshipType[0][0].relationship_type_id;

                    var sql = "SELECT relationship_type_id FROM relationship_type WHERE a_is_to_b = '" + relationship[1].trim() +
                        "' AND b_is_to_a = '" + relationship[0].trim() + "'";

                    console.log(sql);

                    queryRaw(sql, function (reverseRelationshipType) {

                        console.log(reverseRelationshipType[0][0].relationship_type_id);

                        reverse_relationship_type_id = reverseRelationshipType[0][0].relationship_type_id;

                        iCallback();

                    });

                });

            },

            function (iCallback) {

                if (!data.relation_id || (data.relation_id && data.relation_id.trim().length <= 0)) {

                    var sql = "INSERT INTO person (gender, creator, date_created, uuid) VALUES ('" +
                        data.gender.substring(0, 1).toUpperCase() + "', (SELECT user_id FROM users WHERE username = '" +
                        data.userId + "'), NOW(), '" + uuid.v1() + "')";

                    console.log(sql);

                    queryRaw(sql, function (person) {

                        person_id = person[0].insertId;

                        var sql = "INSERT INTO person_name (person_id, given_name, family_name, creator, date_created, " +
                            "uuid) VALUES ('" + person_id + "', '" + data.first_name + "', '" + data.last_name + "', " +
                            "(SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW(), '" + uuid.v1() + "')";

                        console.log(sql);

                        queryRaw(sql, function (name) {

                            var sql = "INSERT INTO person_address (person_id, creator, date_created, uuid) VALUES ('" + person_id +
                                "', " + "(SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW(), '" + uuid.v1() + "')";

                            console.log(sql);

                            queryRaw(sql, function (address) {

                                var sql = "INSERT INTO patient (patient_id, creator, date_created) VALUES ('" +
                                    person_id + "', (SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW())";

                                console.log(sql);

                                queryRaw(sql, function (patient) {

                                    relation_id = patient[0].insertId;

                                    console.log(relation_id);

                                    generateId(relation_id, data.userId, (data.location != undefined ? data.location : "Unknown"),
                                        function (response) {

                                            var npid = response;

                                            iCallback();

                                        });

                                });

                            });

                        });

                    });

                } else {

                    var sql = "SELECT patient_id FROM patient_identifier WHERE identifier = '" + data.relation_id.trim() + "'";

                    console.log(sql);

                    queryRaw(sql, function (patient) {

                        relation_id = patient[0][0].patient_id;

                        iCallback();

                    });

                }

            },

            function (iCallback) {

                var sql = "SELECT patient_id FROM patient_identifier WHERE identifier = '" + data.patient_id.trim() + "'";

                console.log(sql);

                queryRaw(sql, function (patient) {

                    person_id = patient[0][0].patient_id;

                    iCallback();

                });

            },

            function (iCallback) {

                var sql = "INSERT INTO relationship (person_a, relationship, person_b, creator, date_created, uuid) VALUES (" +
                    "'" + person_id + "', '" + relationship_type_id + "', '" + relation_id + "', " +
                    "(SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW(), '" + uuid.v1() + "')";

                console.log(sql);

                queryRaw(sql, function (relationship) {

                    console.log(relationship[0].insertId);

                    var sql = "INSERT INTO relationship (person_a, relationship, person_b, creator, date_created, uuid) VALUES (" +
                        "'" + relation_id + "', '" + reverse_relationship_type_id + "', '" + person_id + "', " +
                        "(SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW(), '" + uuid.v1() + "')";

                    console.log(sql);

                    queryRaw(sql, function (relationship) {

                        iCallback();

                    });

                });

            }

        ], function () {

            callback();

        })

    });

}

function voidConcept(data, callback) {

    loggedIn(data.data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return callback(true);

        }

        console.log(Object.keys(data));

        var sql = "SELECT encounter_id FROM obs WHERE voided = 0 AND uuid = '" + data.uuid + "'";

        queryRaw(sql, function (encounter) {

            var sql = "UPDATE obs SET voided = 1, voided_by = (SELECT user_id FROM users WHERE username = '" + data.username +
                "'), date_voided = NOW(), void_reason = 'Patient dashboard data void.' WHERE uuid = '" + data.uuid + "'";

            queryRaw(sql, function (obs) {

                console.log(obs);

                var sql = "SELECT COUNT(obs_id) AS total FROM obs WHERE voided = 0 AND encounter_id = '" +
                    encounter[0][0].encounter_id + "'";

                console.log(sql);

                queryRaw(sql, function (total) {

                    console.log(total);

                    if (total[0][0].total <= 0) {

                        var sql = "UPDATE encounter SET voided = 1, void_reason = 'No more existing active obs', " +
                            "voided_by = (SELECT user_id FROM users WHERE username = '" + data.username +
                            "'), date_voided = NOW() WHERE encounter_id = '" + encounter[0][0].encounter_id + "'";

                        console.log(sql);

                        queryRaw(sql, function (encounter) {

                            callback();

                        });

                    } else {

                        callback();

                    }

                })

            });

        });

    });

}

function saveData(data, callback) {

    loggedIn(data.data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return callback(true);

        }

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
                    "patient_program.program_id WHERE patient_id = '" + patient_id + "' AND voided = 0 AND program.name = '" +
                    data.data.program + "'";

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
                        data.data.program + "'), NOW(), (SELECT user_id FROM users WHERE username = '" + data.data.userId +
                        "'), NOW(), '" + uuid.v1() + "', (SELECT location_id FROM location WHERE name = '" +
                        (data.data.location ? data.data.location : "Unknown") + "'))";

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
                    " WHERE name = '" + data.data.encounter_type + "'), '" + patient_id + "', (SELECT user_id FROM users " +
                    "WHERE username = '" + data.data.userId + "'), (SELECT location_id FROM location WHERE name = '" +
                    (data.data.location ? data.data.location : "Unknown") + "'), NOW(), (SELECT user_id FROM users WHERE " +
                    "username = '" + data.data.userId + "'), NOW(), '" + uuid.v1() + "', '" + patient_program_id + "')";

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
                            "WHERE name = '" + concept + "' AND voided = 0 LIMIT 1), '" + encounter_id + "', NOW(), " +
                            "(SELECT location_id FROM location WHERE name = '" + (data.data.location ? data.data.location :
                            "Unknown") + "'), '" + data.data.obs[group][concept] + "', (SELECT user_id FROM users WHERE username = '" +
                            data.data.userId + "'), NOW(), '" + uuid.v1() + "')";

                        queryRaw(sql, function (res) {

                            console.log(concept.trim().toLowerCase());

                            if (concept.trim().toLowerCase() == "age") {

                                var age = String(data.data.obs[group][concept]).match(/^(\d+)([Y|M|W|D|H])/);

                                if (age) {

                                    var number = parseInt(age[1]);

                                    var type = age[2];

                                    var dob;

                                    switch (type) {

                                        case "Y":

                                            dob = (new Date((new Date()).setFullYear((new Date()).getFullYear() -
                                                number))).format("YYYY-mm-dd");

                                            break;

                                        case "M":

                                            dob = (new Date((new Date()).setMonth((new Date()).getMonth() -
                                                number))).format("YYYY-mm-dd");

                                            break;

                                        case "W":

                                            dob = (new Date((new Date()).setDate((new Date()).getDate() -
                                                (number * 7)))).format("YYYY-mm-dd");

                                            break;

                                        case "D":

                                            dob = (new Date((new Date()).setDate((new Date()).getDate() - number))).format("YYYY-mm-dd");

                                            break;

                                        default:

                                            dob = (new Date((new Date()).setHours((new Date()).getHours() - number))).format("YYYY-mm-dd");

                                            break;

                                    }

                                    var sql = "UPDATE person SET birthdate = '" + dob + "', birthdate_estimated = 1 WHERE " +
                                        "person_id = '" + patient_id + "'";

                                    queryRaw(sql, function (res) {

                                        iOCallback();

                                    });

                                } else {

                                    iOCallback();

                                }

                            } else if (concept.trim().toLowerCase() == "sex/pregnancy") {

                                var gender = String(data.data.obs[group][concept]).trim().substring(0, 1).toUpperCase();


                                var sql = "UPDATE person SET gender = '" + gender + "' WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (res) {

                                    iOCallback();

                                });

                            } else if (concept.trim().toLowerCase() == "first name") {

                                var firstName = String(data.data.obs[group][concept]).trim();


                                var sql = "UPDATE person_name SET given_name = '" + firstName + "' WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (res) {

                                    iOCallback();

                                });

                            } else if (concept.trim().toLowerCase() == "family name") {

                                var lastName = String(data.data.obs[group][concept]).trim();


                                var sql = "UPDATE person_name SET family_name = '" + lastName + "' WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (res) {

                                    iOCallback();

                                });

                            } else if (concept.trim().toLowerCase() == "current district") {

                                var currentDistrict = String(data.data.obs[group][concept]).trim();

                                var sql = "SELECT person_address_id FROM person_address WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (address) {

                                    var sql = "UPDATE person_address SET state_province = '" + currentDistrict +
                                        "' WHERE person_id = '" + patient_id + "' AND person_address_id = '" +
                                        address[0][0].person_address_id + "'";

                                    queryRaw(sql, function (res) {

                                        iOCallback();

                                    });
                                });

                            } else if (concept.trim().toLowerCase() == "current t/a") {

                                var currentTA = String(data.data.obs[group][concept]).trim();

                                var sql = "SELECT person_address_id FROM person_address WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (address) {

                                    var sql = "UPDATE person_address SET township_division = '" + currentTA +
                                        "' WHERE person_id = '" + patient_id + "' AND person_address_id = '" +
                                        address[0][0].person_address_id + "'";

                                    queryRaw(sql, function (res) {

                                        iOCallback();

                                    });

                                });

                            } else if (concept.trim().toLowerCase() == "current village") {

                                var currentVillage = String(data.data.obs[group][concept]).trim();

                                var sql = "SELECT person_address_id FROM person_address WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (address) {

                                    var sql = "UPDATE person_address SET city_village = '" + currentVillage +
                                        "' WHERE person_id = '" + patient_id + "' AND person_address_id = '" +
                                        address[0][0].person_address_id + "'";

                                    queryRaw(sql, function (res) {

                                        iOCallback();

                                    });

                                });

                            } else if (concept.trim().toLowerCase() == "closest landmark") {

                                var closestLandmark = String(data.data.obs[group][concept]).trim();

                                var sql = "SELECT person_address_id FROM person_address WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (address) {

                                    var sql = "UPDATE person_address SET address1 = '" + closestLandmark +
                                        "' WHERE person_id = '" + patient_id + "' AND person_address_id = '" +
                                        address[0][0].person_address_id + "'";

                                    queryRaw(sql, function (res) {

                                        iOCallback();

                                    });

                                });

                            } else if (concept.trim().toLowerCase().match(/dispatch\sid/i) && false) {  // TODO: Temporary Lock. May Have to remove the block later

                                var root = concept.trim().toLowerCase();
                                var consumption_type = "Normal use";
                                var dispatch_id = "";
                                var consumption_quantity = 1;
                                var who_consumed = data.data.patient_id;
                                var date_consumed = data.data.today;
                                var reason_for_consumption = "Normal use";
                                var location = data.data.location;
                                var userId = data.data.userId;

                                switch (root) {

                                    case "first pass test kit 1 dispatch id":

                                        dispatch_id = data.data.obs["text"]["First Pass Test Kit 1 Dispatch ID"];

                                        break;

                                    case "first pass test kit 2 dispatch id":

                                        dispatch_id = data.data.obs["text"]["First Pass Test Kit 2 Dispatch ID"];

                                        break;

                                    case "immediate repeat test kit 1 dispatch id":

                                        dispatch_id = data.data.obs["text"]["Immediate Repeat Test Kit 1 Dispatch ID"];
                                        k;

                                    case "immediate repeat test kit 2 dispatch id":

                                        dispatch_id = data.data.obs["text"]["Immediate Repeat Test Kit 2 Dispatch ID"];

                                        break;

                                }

                                var iData = {
                                    consumption_type: consumption_type,
                                    dispatch_id: dispatch_id,
                                    consumption_quantity: consumption_quantity,
                                    who_consumed: who_consumed,
                                    date_consumed: date_consumed,
                                    reason_for_consumption: reason_for_consumption,
                                    location: location,
                                    userId: userId
                                }

                                saveConsumption(iData, undefined, function () {

                                    iOCallback();

                                })

                            } else if (concept.trim().toLowerCase() == "client phone number") {

                                var phoneNumber = String(data.data.obs[group][concept]).trim();

                                var sql = "SELECT person_attribute_id FROM person_attribute WHERE person_id = '" + patient_id + "'";

                                queryRaw(sql, function (attr) {

                                    if (attr[0].length <= 0) {

                                        // TODO: Need to find a way to push a proper user who creates here
                                        var sql = "INSERT INTO person_attribute (person_id, value, person_attribute_type_id, " +
                                            "creator, date_created, uuid) VALUES ('" + patient_id + "', '" + phoneNumber +
                                            "', (SELECT person_attribute_type_id FROM person_attribute_type WHERE name = " +
                                            "'Cell Phone Number' LIMIT 1), (SELECT user_id FROM users LIMIT 1), NOW(), '" +
                                            uuid.v1() + "')";

                                        queryRaw(sql, function (res) {

                                            iOCallback();

                                        });

                                    } else {

                                        var sql = "UPDATE person_attribute SET value = '" + phoneNumber +
                                            "' WHERE person_id = '" + patient_id + "' AND person_attribute_id = '" +
                                            attr[0][0].person_attribute_id + "'";

                                        queryRaw(sql, function (res) {

                                            iOCallback();

                                        });

                                    }

                                });

                            } else {

                                iOCallback();

                            }

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


    });

}

function updateUserView(data) {

    var patient_id;

    var patientProgramIds = {};

    async.series([

        function (callback) {

            if (!people[data.id] || isDirty[data.id]) {

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
                                            UUID: null,
                                            relationships: []
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

            if (people[data.id].data.addresses.length <= 0 || isDirty[data.id]) {

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
                                    UUID: null,
                                    relationships: []
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

            if (!people[data.id].data.gender || isDirty[data.id]) {

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
                                    UUID: null,
                                    relationships: []
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

            if (Object.keys(people[data.id].data.identifiers).length <= 0 || isDirty[data.id]) {

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
                                    UUID: null,
                                    relationships: []
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
                                'encounter_type.encounter_type_id', ['encounter_id', 'encounter_datetime', 'name', 'voided',
                                    'encounter.uuid'],
                                {patient_program_id: program.patient_program_id, voided: 0}, function (encounters) {

                                    console.log(encounters);

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
                                        UUID: null,
                                        relationships: []
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

        },

        function (callback) {

            if (Object.keys(people[data.id].data.relationships).length <= 0 || isDirty[data.id]) {

                var sql = "SELECT CONCAT(given_name, ' ', family_name) AS relative_name, (SELECT identifier FROM " +
                    "patient_identifier WHERE patient_id = person_b LIMIT 1) AS relative_id, b_is_to_a, gender, " +
                    "relationship.uuid AS uuid FROM relationship LEFT OUTER JOIN person_name ON person_name.person_id = " +
                    "relationship.person_b LEFT OUTER JOIN relationship_type ON relationship_type.relationship_type_id " +
                    "= relationship.relationship LEFT OUTER JOIN person ON person.person_id = relationship. person_b " +
                    "WHERE person_a = '" + patient_id + "'";

                queryRaw(sql, function (relationships) {

                    var collection = [];

                    for (var i = 0; i < relationships[0].length; i++) {

                        var relationship = {
                            relative_name: relationships[0][i].relative_name,
                            relative_id: relationships[0][i].relative_id,
                            relative_type: relationships[0][i].b_is_to_a,
                            gender: relationships[0][i].gender,
                            UUID: relationships[0][i].uuid
                        }

                        collection.push(relationship);

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
                                UUID: null,
                                relationships: []
                            }
                        };

                    }

                    console.log(collection);

                    console.log("First time relationships query.");

                    people[data.id].data.relationships = collection;

                    nsp[data.id].emit('demographics',
                        JSON.stringify({relationships: people[data.id].data.relationships }));

                    callback();

                });

            }
            else {

                console.log("Sent existing relationships data");

                nsp[data.id].emit('demographics',
                    JSON.stringify({relationships: people[data.id].data.relationships }));

                callback();

            }

        }

    ], function (err, results) {

        if (err) {

            nsp[data.id].emit('error', err.message);

            console.log(err.message);

        } else {

            nsp[data.id].emit('demographics',
                JSON.stringify({done: true }));

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
        " WHERE o.encounter_id = " + encounter.encounter_id + " AND o.voided = 0";

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

            res.status(200).json({message: "Record updated!"});

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

            res.status(200).json({message: "Record saved!"});

        });

    }

}

function dispatchStock(data, res) {

    if (data.receipt_id) {

        var sql = "UPDATE dispatch SET stock_id = '" + data.stock_id + "', batch_number = '" + data.batch_number +
            "', dispatch_quantity = '" + data.dispatch_quantity + "', dispatch_datetime = '" + data.dispatch_datetime +
            "', dispatch_who_dispatched = '" + data.userId + "dispatch_who_received = '" + (data.dispatch_who_received ?
            data.dispatch_who_received : "") + "', dispatch_who_authorised = '" + (data.dispatch_who_authorised ?
            data.dispatch_who_authorised : "") + "', dispatch_destination = '" + (data.dispatch_destination ?
            data.dispatch_destination : "") + "' WHERE " + "dispatch_id = '" + data.dispatch_id;

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.status(200).json({message: "Record updated!"});

        });

    }
    else {

        var sql = "INSERT INTO dispatch (stock_id, batch_number, dispatch_quantity, dispatch_datetime, dispatch_who_dispatched, " +
            " dispatch_who_received, dispatch_who_authorised, dispatch_destination) VALUES('" +
            data.stock_id + "', '" + data.batch_number + "', '" + data.dispatch_quantity + "', '" +
            data.dispatch_datetime + "', '" + data.userId + "', '" + (data.dispatch_who_received ?
            data.dispatch_who_received : "") + "', '" + (data.dispatch_who_authorised ? data.dispatch_who_authorised :
            "") + "', '" + (data.dispatch_destination ? data.dispatch_destination : "") + "')";

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.status(200).json({message: "Record saved!"});

        });

    }

}

function receiveStock(data, res) {

    if (data.receipt_id) {

        var sql = "UPDATE receipt SET stock_id = '" + data.stock_id + "', batch_number = '" + data.batch_number +
            "', expiry_date = '" + data.expiry_date + "', receipt_quantity = '" + data.receipt_quantity +
            "', receipt_datetime = '" + data.receipt_datetime + "', receipt_who_received = '" + data.userId + "' WHERE " +
            "receipt_id = '" + data.receipt_id;

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.status(200).json({message: "Record updated!"});

        });

    }
    else {

        var sql = "INSERT INTO receipt (stock_id, batch_number, expiry_date, receipt_quantity, receipt_datetime, receipt_who_received) VALUES('" +
            data.stock_id + "', '" + data.batch_number + "', '" + data.expiry_date + "', '" + data.receipt_quantity +
            "', '" + data.receipt_datetime + "', '" + data.userId + "')";

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.status(200).json({message: "Record saved!"});

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

                        if (data.batch_number && data.expiry_date) {

                            sql = "INSERT INTO stock_batch (stock_id, batch_number, expiry_date, date_created, creator) " +
                                "VALUES ('" + stock[0].insertId + "', '" + data.batch_number + "', '" + data.expiry_date +
                                "', NOW(), '" + data.userId + "')";

                            console.log(sql);

                            queryRawStock(sql, function (batch) {

                                res.status(200).json({message: "Item saved!"});

                            });

                        } else {

                            res.status(200).json({message: "Item saved!"});

                        }

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

                    res.status(200).json({message: "Item updated!"});

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

                        if (data.batch_number && data.expiry_date) {

                            sql = "INSERT INTO stock_batch (stock_id, batch_number, expiry_date, date_created, creator) " +
                                "VALUES ('" + stock[0].insertId + "', '" + data.batch_number + "', '" + data.expiry_date +
                                "', NOW(), '" + data.userId + "')";

                            console.log(sql);

                            queryRawStock(sql, function (batch) {

                                res.status(200).json({message: "Item saved!"});

                            });

                        } else {

                            res.status(200).json({message: "Item saved!"});

                        }

                    });

                });

            } else {

                var category_id = category[0][0].category_id;

                var sql = "INSERT INTO stock (name, description, reorder_level, category_id, date_created, creator) VALUES('" +
                    data.item_name + "', '" + (data.description ? data.description : "") + "', '" + data.re_order_level +
                    "', '" + category_id + "', NOW(), '" + data.userId + "')";

                console.log(sql);

                queryRawStock(sql, function (stock) {

                    if (data.batch_number && data.expiry_date) {

                        sql = "INSERT INTO stock_batch (stock_id, batch_number, expiry_date, date_created, creator) " +
                            "VALUES ('" + stock[0].insertId + "', '" + data.batch_number + "', '" + data.expiry_date +
                            "', NOW(), '" + data.userId + "')";

                        console.log(sql);

                        queryRawStock(sql, function (batch) {

                            res.status(200).json({message: "Item saved!"});

                        });

                    } else {

                        res.status(200).json({message: "Item saved!"});

                    }

                });

            }

        });

    }

}

function saveConsumption(data, res, callback) {

    if (data.dispatch_id) {

        if (data.consumption_id) {

            if (data.consumption_type && data.dispatch_id) {

                var sql = "UPDATE consumption SET consumption_type_id = (SELECT consumption_type_id FROM consumption_type " +
                    "WHERE name = '" + data.consumption_type + "'), dispatch_id = '" + data.dispatch_id + "', " +
                    "consumption_quantity = '" + data.consumption_quantity + "', who_consumed = '" + data.who_consumed +
                    "', date_consumed = '" + data.date_consumed + "', " + "reason_for_consumption = '" +
                    data.reason_for_consumption + "', location = '" + data.location + "', date_changed = NOW(), " +
                    "changed_by ='" + data.userId + "' WHERE consumption_id = '" + data.consumption_id + "'";

                console.log(sql);

                queryRawStock(sql, function (batch) {

                    if (callback) {

                        callback();

                    } else {

                        res.status(200).json({message: "Item saved!"});

                    }

                });

            } else {

                if (callback) {

                    callback();

                } else {

                    res.status(200).json({message: "Nothing done!"});

                }

            }

        } else {

            var sql = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                "consumption_type WHERE name = '" + data.consumption_type + "'), '" + +data.dispatch_id + "', '" +
                data.consumption_quantity + "', '" + data.who_consumed + "', '" + data.date_consumed + "', '" +
                data.reason_for_consumption + "', '" + data.location + "', NOW(), '" + data.userId + "')";

            console.log(sql);

            queryRawStock(sql, function (batch) {

                if (callback) {

                    callback();

                } else {

                    res.status(200).json({message: "Item saved!"});

                }

            });

        }

    } else {

        res.status(200).json({message: "Missing dispatch association!"});

    }

}

function saveBatch(data, res) {

    if (data.stock_id) {

        if (data.stock_batch_id) {

            if (data.batch_number || data.expiry_date) {

                var sql = "UPDATE stock_batch SET " + (data.batch_number ? "batch_number = '" + data.batch_number +
                    "' " : "") + (data.batch_number && data.expiry_date ? "," : "") + (data.expiry_date ?
                    " expiry_date = '" + data.expiry_date + "'" : "") + ", date_created, creator) " +
                    "VALUES ('" + data.stock_id + "', '" + data.batch_number + "', '" + data.expiry_date +
                    "', NOW(), '" + data.userId + "')";

                console.log(sql);

                queryRawStock(sql, function (batch) {

                    res.status(200).json({message: "Item saved!"});

                });

            } else {

                res.status(200).json({message: "Nothing done!"});

            }

        } else {

            var sql = "INSERT INTO stock_batch (stock_id, batch_number, expiry_date, date_created, creator) " +
                "VALUES ('" + data.stock_id + "', '" + data.batch_number + "', '" + data.expiry_date +
                "', NOW(), '" + data.userId + "')";

            console.log(sql);

            queryRawStock(sql, function (batch) {

                res.status(200).json({message: "Item saved!"});

            });

        }

    } else {

        res.status(200).json({message: "Missing stock association!"});

    }

}

function loggedIn(token, callback) {

    var sql = "SELECT user_property.user_id, username FROM user_property LEFT OUTER JOIN users ON users.user_id = " +
        "user_property.user_id WHERE property = 'token' AND property_value = '" + token + "'";

    console.log(sql);

    queryRaw(sql, function (user) {

        if (user[0].length > 0) {

            callback(true, user[0][0].user_id, user[0][0].username);

        } else {

            callback(false);

        }

    });

}

app.get('/authentic/:id', function (req, res) {

    loggedIn(req.params.id, function (result, user_id, username) {

        res.status(200).json({loggedIn: result, userId: user_id, username: username});

    })

})

app.get('/logout/:id', function (req, res) {

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

    var sql = "SELECT user_id, username, person_id FROM users WHERE username = '" + data.username + "' AND password = MD5(CONCAT('" +
        data.password + "', salt)) AND retired = 0";

    console.log(sql);

    queryRaw(sql, function (user) {

        if (user[0].length <= 0) {

            res.status(200).json({message: "Access denied!"});

        } else {

            var token = randomstring.generate(12);

            sql = "INSERT INTO user_property (user_id, property, property_value) VALUES('" + user[0][0].user_id +
                "', 'token', '" + token + "') ON DUPLICATE KEY UPDATE property_value = '" + token + "'";

            console.log(sql);

            queryRaw(sql, function (result) {

                sql = "SELECT role, gender, given_name, family_name FROM user_role LEFT OUTER JOIN users ON " +
                    "users.user_id = user_role.user_id LEFT OUTER JOIN person ON person.person_id = users.person_id " +
                    "LEFT OUTER JOIN person_name ON person_name.person_id = person.person_id WHERE users.user_id = '" +
                    user[0][0].user_id + "'";

                console.log(sql);

                queryRaw(sql, function (roles) {

                    console.log(roles[0]);

                    var collection = [];

                    var gender = roles[0][0].gender;

                    var given_name = roles[0][0].given_name;

                    var family_name = roles[0][0].family_name;

                    for (var i = 0; i < roles[0].length; i++) {

                        collection.push(roles[0][i].role);

                    }

                    sql = "SELECT value, name AS attribute FROM person_attribute LEFT OUTER JOIN person_attribute_type " +
                        "ON person_attribute.person_attribute_type_id = person_attribute_type.person_attribute_type_id " +
                        " WHERE person_id = '" + user[0][0].person_id + "'";

                    console.log(sql);

                    queryRaw(sql, function (attrs) {

                        console.log(attrs[0]);

                        var attributes = {};

                        for (var i = 0; i < attrs[0].length; i++) {

                            attributes[attrs[0][i].attribute] = attrs[0][i].value;

                        }

                        res.status(200).json({token: token, username: user[0][0].username, roles: collection,
                            attributes: attributes, gender: gender, given_name: given_name, family_name: family_name});

                    });

                });

            });

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
        (query.name ? query.name : "") + "%' AND given_name != '-'";

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
        (query.name ? query.name : "") + "%' AND family_name != '-'";

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

app.post('/save_dummy_patient', function (req, res) {

    console.log(req.body.data);

    var data = req.body.data;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});

        }

        var npid;

        var person_id;

        var patient_id;

        var sql = "INSERT INTO person (creator, date_created, uuid) VALUES ((SELECT user_id FROM users WHERE username = '" +
            data.userId + "'), NOW(), '" + uuid.v1() + "')";

        queryRaw(sql, function (person) {

            person_id = person[0].insertId;

            var sql = "INSERT INTO person_name (person_id, given_name, family_name, creator, date_created, " +
                "uuid) VALUES ('" + person_id + "', '-', '-', " + "(SELECT user_id FROM users WHERE " +
                "username = '" + data.userId + "'), NOW(), '" + uuid.v1() + "')";

            queryRaw(sql, function (name) {

                var sql = "INSERT INTO person_address (person_id, creator, date_created, uuid) VALUES ('" + person_id +
                    "', " + "(SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW(), '" + uuid.v1() + "')";

                queryRaw(sql, function (address) {

                    var sql = "INSERT INTO patient (patient_id, creator, date_created) VALUES ('" +
                        person_id + "', (SELECT user_id FROM users WHERE username = '" + data.userId + "'), NOW())";

                    queryRaw(sql, function (patient) {

                        patient_id = patient[0].insertId;

                        console.log(patient_id);

                        generateId(patient_id, data.userId, (data.location != undefined ? data.location : "Unknown"),
                            function (response) {

                                npid = response;

                                res.send(npid);

                            });

                    });

                });

            });

        });

    });

});

app.post('/save_patient', function (req, res) {

    console.log(req.body.data);

    var data = req.body.data;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});

        }

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

});

app.post('/updateUser', function (req, res) {

    console.log(req.body);

    var data = req.body;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});

        }

        var rString = randomstring.generate(12);

        var salt = rString;

        var password = encrypt(req.body.password, salt);

        var person_id;

        sql = "SELECT user_id FROM users WHERE username = '" + data.username + "'";

        queryRaw(sql, function (verification) {

            if (verification[0].length > 0) {

                res.status(200).json({message: "Username already taken!"});

            } else {

                var sql = "INSERT INTO person (gender, " + (data.date_of_birth ? "birthdate, birthdate_estimated, " : "") +
                    "creator, date_created, uuid) VALUES ('" + String(data.gender).substring(0, 1) + "', " + (data.date_of_birth ? "'" +
                    data.date_of_birth + "', '" + data.estimated + "', " : "") + " (SELECT user_id FROM users WHERE " +
                    "username = '" + (data.userId ? data.userId : "admin" ) + "'), NOW(), '" + uuid.v1() + "')";

                queryRaw(sql, function (person) {

                    person_id = person[0].insertId;

                    console.log(person[0].insertId);


                    var sql = "INSERT INTO person_name (person_id, given_name, family_name, creator, date_created, uuid) VALUES ('" +
                        person_id + "', '" + data.first_name + "', '" + data.last_name + "', " + "(SELECT user_id FROM " +
                        "users WHERE username = '" + (data.userId != undefined ? data.userId : "admin" ) +
                        "'), NOW(), '" + uuid.v1() + "')";

                    queryRaw(sql, function (name) {

                        sql = "INSERT INTO person_attribute (person_id, value, person_attribute_type_id, creator, " +
                            "date_created, uuid) VALUES ('" + person_id + "', '" + data.hts_provider_id + "', " +
                            "(SELECT person_attribute_type_id FROM person_attribute_type WHERE name = 'HTS Provider ID'), " +
                            "(SELECT user_id FROM users WHERE username = '" + (data.userId ? data.userId : "admin" ) +
                            "'), NOW(), '" + uuid.v1() + "')";

                        queryRaw(sql, function (attr) {

                            console.log(attr[0]);

                            sql = "SELECT user_id FROM users WHERE username = '" + (req.body["User ID"] ? req.body["User ID"] : "admin" ) + "'"

                            queryRaw(sql, function (updater) {

                                console.log(updater[0][0].user_id);

                                var sql = "INSERT INTO users (system_id, username, password, salt, creator, date_created, " +
                                    "person_id, uuid) VALUES ('" + data.username + "', '" + data.username + "', '" +
                                    password + "', '" + salt + "', '" + updater[0][0].user_id + "', NOW(), '" + person_id +
                                    "', '" + uuid.v1() + "')";

                                queryRaw(sql, function (user) {

                                    console.log(user[0].insertId);

                                    var values = "";

                                    for (var i = 0; i < data.roles.length; i++) {

                                        values += (values.trim().length > 0 ? ", " : "") + "('" + user[0].insertId + "', '" +
                                            data.roles[i] + "')";

                                    }

                                    sql = "INSERT INTO user_role (user_id, role) VALUES " + values;

                                    console.log(sql);

                                    queryRaw(sql, function (role) {

                                        console.log(role[0]);

                                        res.status(200).json({message: "User added!"});

                                    });

                                });

                            });

                        });

                    });

                });

            }

        });

    });

})

app.get('/list_locations', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    var sql = "SELECT location.name FROM location_tag LEFT OUTER JOIN location_tag_map ON location_tag.location_tag_id = " +
        "location_tag_map.location_tag_id LEFT OUTER JOIN location ON location.location_id = location_tag_map.location_id " +
        " WHERE location.name LIKE '" + query.name + "%' AND location.retired = 0 AND location_tag.retired = 0 AND " +
        "location_tag.name = 'HTS'";

    console.log(sql);

    queryRaw(sql, function (data) {

        var result = "";

        for (var i = 0; i < data[0].length; i++) {

            var loc = data[0][i];

            result += "<li>" + loc.name + "</li>";

        }

        res.send(result);

    });

})

app.get('/list_users', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    var sql = "SELECT username, given_name, family_name FROM users LEFT OUTER JOIN person_name ON users.person_id = " +
        "person_name.person_id WHERE CONCAT(given_name, ' ', family_name) LIKE '" + query.name + "%' AND retired = 0 " +
        "AND COALESCE(users.person_id,'') != ''";

    console.log(sql);

    queryRaw(sql, function (data) {

        var result = "";

        for (var i = 0; i < data[0].length; i++) {

            var user = data[0][i];

            result += "<li tstValue='" + user.username + "'>" + user.given_name + " " + user.family_name +
                " (" + user.username + ")" + "</li>";

        }

        res.send(result);

    });

})

app.get('/list_usernames', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    var sql = "SELECT username FROM users WHERE username LIKE '" +
        query.username + "%' AND retired = 0 AND COALESCE(person_id,'') != ''";

    console.log(sql);

    queryRaw(sql, function (data) {

        var keys = [];

        for (var i = 0; i < data[0].length; i++) {

            var user = data[0][i];

            keys.push(user.username);

        }

        res.send("<li>" + keys.join("</li><li>") + "</li>");

    });

})

app.get('/search_by_username', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    var sql = "SELECT users.user_id, username, role, gender, birthdate, given_name, family_name FROM users LEFT OUTER " +
        "JOIN user_role ON user_role.user_id = users.user_id LEFT OUTER JOIN person ON person.person_id = " +
        "users.person_id LEFT OUTER JOIN person_name ON person_name.person_id = person.person_id WHERE username LIKE '" +
        query.username + "%' AND COALESCE(family_name,'') != ''";

    console.log(sql);

    queryRaw(sql, function (data) {

        var collection = {};

        var keys = [];

        for (var i = 0; i < data[0].length; i++) {

            var user = data[0][i];

            if (!collection[user.username]) {

                collection[user.username] = {};

                keys.push(user.username);

            }

            if (!collection[user.username]['roles']) {

                collection[user.username]['roles'] = [];

            }

            collection[user.username]['username'] = user.username;

            if (user.role)
                collection[user.username]['roles'].push(user.role);

            collection[user.username]['gender'] = user.gender;

            collection[user.username]['birthdate'] = user.birthdate;

            collection[user.username]['first_name'] = user.given_name;

            collection[user.username]['family_name'] = user.family_name;

        }

        var results = [];

        for (var i = 0; i < keys.length; i++) {

            results.push(collection[keys[i]]);

        }

        res.status(200).json(results);

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

app.post('/activate_user', function (req, res) {

    var data = req.body;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});

        }

        console.log(data);

        var sql = "SELECT user_id FROM users WHERE username = '" + data.username + "'";

        console.log(sql);

        queryRaw(sql, function (user) {

            if (user[0].length > 0) {

                var sql = "SELECT user_id FROM users WHERE username = '" + data.userId + "'";

                console.log(sql);

                queryRaw(sql, function (updater) {

                    console.log(updater[0][0].user_id);

                    var sql = "UPDATE users SET retired = 0, retired_by = NULL, date_retired = NULL, retire_reason = NULL " +
                        " WHERE user_id = '" + user[0][0].user_id + "'";

                    console.log(sql);

                    queryRaw(sql, function (user) {

                        res.status(200).json({message: "User activated!"});

                    });

                });

            } else {

                res.status(200).json({message: "User not found!"});

            }

        });

    });

})

app.post('/block_user', function (req, res) {

    var data = req.body;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});

        }

        console.log(data);

        var sql = "SELECT user_id FROM users WHERE username = '" + data.username + "'";

        console.log(sql);

        queryRaw(sql, function (user) {

            if (user[0].length > 0) {

                var sql = "SELECT user_id FROM users WHERE username = '" + data.userId + "'";

                console.log(sql);

                queryRaw(sql, function (updater) {

                    console.log(updater[0][0].user_id);

                    var sql = "UPDATE users SET retired = 1, retired_by = '" + updater[0][0].user_id +
                        "', date_retired = NOW(), retire_reason ='Blocked user.' WHERE user_id = '" + user[0][0].user_id + "'";

                    console.log(sql);

                    queryRaw(sql, function (user) {

                        res.status(200).json({message: "User blocked!"});

                    });

                });

            } else {

                res.status(200).json({message: "User not found!"});

            }

        });

    });

})

app.get('/users_listing', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    var sql = "SELECT users.user_id, users.retired, person.person_id, username, role, gender, given_name, family_name " +
        "FROM users LEFT OUTER JOIN user_role ON users.user_id = user_role.user_id LEFT OUTER JOIN person ON " +
        "person.person_id = users.person_id LEFT OUTER JOIN person_name ON person_name.person_id = person.person_id " +
        "WHERE COALESCE(password,'') != '' LIMIT " + lowerLimit + ", " + pageSize;

    console.log(sql);

    queryRaw(sql, function (users) {

        console.log(users[0]);

        var collection = {};

        async.each(users[0], function (user, callback) {

            if (!collection[user.username])
                collection[user.username] = {};

            collection[user.username].gender = user.gender;

            collection[user.username].given_name = user.given_name;

            collection[user.username].family_name = user.family_name;

            collection[user.username].active = (user.retired == "0" ? true : false);

            if (!collection[user.username].roles)
                collection[user.username].roles = [];

            if (user.role)
                collection[user.username].roles.push(user.role);

            sql = "SELECT value, name AS attribute FROM person_attribute LEFT OUTER JOIN person_attribute_type " +
                "ON person_attribute.person_attribute_type_id = person_attribute_type.person_attribute_type_id " +
                " WHERE person_id = '" + user.person_id + "'";

            console.log(sql);

            queryRaw(sql, function (attrs) {

                console.log(attrs[0]);

                if (!collection[user.username].attributes)
                    collection[user.username].attributes = {};

                for (var i = 0; i < attrs[0].length; i++) {

                    collection[user.username].attributes[attrs[0][i].attribute] = attrs[0][i].value;

                }

                callback();

            });

        }, function () {

            res.status(200).json(collection);

        })

    });

})

app.get('/roles/:id', function (req, res) {

    var sql = "SELECT role FROM users LEFT OUTER JOIN user_role ON user_role.user_id = users.user_id WHERE username = '" +
        req.params.id + "'";

    var roles = [];

    console.log(sql);

    queryRaw(sql, function (data) {

        for (var i = 0; i < data[0].length; i++) {

            roles.push(data[0][i].role);

        }

        console.log(roles);

        res.status(200).json(roles);

    });

})

app.get('/roles', function (req, res) {

    var sql = "SELECT role FROM role WHERE description LIKE 'HTS%'";

    var roles = [];

    console.log(sql);

    queryRaw(sql, function (data) {

        for (var i = 0; i < data[0].length; i++) {

            roles.push(data[0][i].role);

        }

        var result = "<li>" + roles.join("</li><li>") + "</li>";

        res.send(result);

    });

})

app.get('/stock_list', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var pageSize = 10;

    var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

    //  AND " + "COALESCE(batch_number,'') != ''

    var sql = "SELECT report.stock_id, item_name AS name, description, category_name, SUM(COALESCE(receipt_quantity,0)) " +
        "AS receipt_quantity, SUM(COALESCE(dispatch_quantity,0)) AS dispatch_quantity, stock.reorder_level, " +
        "MIN(dispatch_datetime) AS min_dispatch_date, MAX(dispatch_datetime) AS max_dispatch_date, " +
        "DATEDIFF(MAX(dispatch_datetime), MIN(dispatch_datetime)) AS duration, last_order_size FROM report LEFT OUTER " +
        "JOIN stock ON stock.stock_id = report.stock_id WHERE COALESCE(report.voided,0) = 0 GROUP BY stock.stock_id LIMIT " +
        lowerLimit + ", " + pageSize;

    console.log(sql);

    queryRawStock(sql, function (data) {

        var collection = [];

        for (var i = 0; i < data[0].length; i++) {

            if (!data[0][i].name)
                continue;

            var entry = {
                stock_id: data[0][i].stock_id,
                name: data[0][i].name,
                description: data[0][i].description,
                category: data[0][i].category_name,
                inStock: (data[0][i].receipt_quantity - data[0][i].dispatch_quantity),
                reorder_level: data[0][i].reorder_level,
                avg: (data[0][i].duration > 0 ?
                    (data[0][i].dispatch_quantity / data[0][i].duration) : 0).toFixed(1),
                receipt_quantity: data[0][i].receipt_quantity,
                dispatch_quantity: data[0][i].dispatch_quantity,
                last_order_size: data[0][i].last_order_size
            };

            collection.push(entry);

        }

        res.status(200).json(collection);

    })

})

app.get('/consumption_types', function (req, res) {

    var sql = "SELECT name FROM consumption_type";

    queryRawStock(sql, function (data) {

        var collection = [];

        console.log(data[0]);

        for (var i = 0; i < data[0].length; i++) {

            collection.push(data[0][i].name);

        }

        res.send("<li>" + collection.join("</li><li>") + "</li>");

    });

})

app.get('/available_batches_to_user_summary', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT batch_number, dispatch_id, (SUM(COALESCE(dispatch_quantity,0)) - SUM(COALESCE(consumption_quantity,0))) " +
        "AS available FROM report WHERE COALESCE(batch_number,'') != '' AND item_name = '" +
        query.item_name + "' AND COALESCE(dispatch_who_received,'') = '" + query.userId + "' GROUP BY batch_number " +
        "HAVING available > 0";

    console.log(sql);

    queryRawStock(sql, function (data) {

        var result = {
            inStock: (data[0] && data[0][0].available ? data[0][0].available : 0)
        };

        res.status(200).json(result);

    })

})

app.get('/available_batches_to_user', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT report.batch_number, dispatch_id, receipt.expiry_date, (SUM(COALESCE(dispatch_quantity,0)) - " +
        "SUM(COALESCE(consumption_quantity,0))) AS available FROM report LEFT OUTER JOIN receipt ON report.batch_number " +
        " = receipt.batch_number WHERE COALESCE(report.batch_number,'') != '' AND item_name = '" +
        query.item_name + "' AND COALESCE(dispatch_who_received,'') = '" + query.userId +
        "' AND report.batch_number LIKE '" + (query.batch ? query.batch : "") + "%' GROUP BY report.batch_number " +
        "HAVING available > 0";

    console.log(sql);

    queryRawStock(sql, function (data) {

        var result = "";

        for (var i = 0; i < data[0].length; i++) {

            var expiryCmd = "if(tstFormElements[tstPages[tstCurrentPage]].getAttribute('expiry')) {" +
                "__$(tstFormElements[tstPages[tstCurrentPage]].getAttribute('expiry')).value = '" +
                (data[0][i].expiry_date ? data[0][i].expiry_date.format("YYYY-mm-dd") : "") + "';} ";

            var dispatchCmd = "if(tstFormElements[tstPages[tstCurrentPage]].getAttribute('dispatch')) {" +
                "__$(tstFormElements[tstPages[tstCurrentPage]].getAttribute('dispatch')).value = '" +
                (data[0][i].dispatch_id ? data[0][i].dispatch_id : "") + "';} ";

            result += "<li tstValue='" + data[0][i].batch_number + "' available='" + data[0][i].available +
                "' dispatch_id='" + data[0][i].dispatch_id + "' onclick=\"if(__$('data.dispatch_id')){" +
                "__$('data.dispatch_id').value = '" + data[0][i].dispatch_id + "'} " + expiryCmd + dispatchCmd + " \" >" +
                data[0][i].batch_number + " (" + data[0][i].available + ")" + "</li>";

        }

        res.send(result);

    })

})

app.get('/available_batches', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT batch_number, (SUM(COALESCE(receipt_quantity,0)) - SUM(COALESCE(dispatch_quantity,0))) " +
        "AS available FROM report WHERE COALESCE(batch_number,'') != '' AND item_name = '" +
        query.item_name + "' AND batch_number LIKE '" + (query.batch ? query.batch : "") + "%' GROUP BY batch_number " +
        "HAVING available > 0";

    queryRawStock(sql, function (data) {

        var collection = [];

        console.log(data[0]);

        var result = "";

        for (var i = 0; i < data[0].length; i++) {

            result += "<li tstValue='" + data[0][i].batch_number + "' available='" + data[0][i].available + "'>" +
                data[0][i].batch_number + " (" + data[0][i].available + ")" + "</li>";

        }

        res.send(result);

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

app.get('/items_list', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT stock.stock_id, stock.name FROM stock WHERE stock.name LIKE '" + query.item_name + "%'";

    queryRawStock(sql, function (data) {

        console.log(data[0]);

        var result = "";

        for (var i = 0; i < data[0].length; i++) {

            result += "<li tstValue='" + data[0][i].stock_id + "'>" + data[0][i].name + "</li>";

        }

        res.send(result);

    })

})

app.get('/stock_search', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT report.stock_id, item_name AS name, description, category_name, SUM(COALESCE(receipt_quantity,0)) " +
        "AS receipt_quantity, SUM(COALESCE(dispatch_quantity,0)) AS dispatch_quantity, stock.reorder_level, " +
        "MIN(dispatch_datetime) AS min_dispatch_date, MAX(dispatch_datetime) AS max_dispatch_date, " +
        "DATEDIFF(MAX(dispatch_datetime), MIN(dispatch_datetime)) AS duration, last_order_size FROM report LEFT OUTER " +
        "JOIN stock ON stock.stock_id = report.stock_id " + (query.category && query.item_name ?
        "WHERE category_name = '" + query.category + "' AND COALESCE(report.voided,0) = 0 AND name = '" +
        query.item_name + "'" : "") + " AND COALESCE(batch_number, '') != '' GROUP BY stock.stock_id  HAVING " +
        "dispatch_quantity != 0 AND receipt_quantity != 0";

    console.log(sql);

    queryRawStock(sql, function (data) {

        var collection = [];

        console.log(data[0]);

        for (var i = 0; i < data[0].length; i++) {

            var entry = {
                stock_id: data[0][i].stock_id,
                item_name: data[0][i].name,
                category: data[0][i].category_name,
                description: data[0][i].description,
                in_stock: (parseInt(data[0][i].receipt_quantity) - parseInt(data[0][i].dispatch_quantity)),
                last_order_size: (data[0][i].last_order_size ? data[0][i].last_order_size : 0),
                avg_dispatch_per_day: (data[0][i].duration > 0 ?
                    (data[0][i].dispatch_quantity / data[0][i].duration) : 0).toFixed(1),
                re_order_level: data[0][i].reorder_level,
                last_order_size: data[0][i].last_order_size
            }

            collection.push(entry);

        }

        // var collection = (categories[query.category] || []);

        res.status(200).json(collection);

    })

})

app.post('/save_item', function (req, res) {

    var data = req.body.data;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});

        }

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

            case "batch":

                saveBatch(data, res);

                break;

            case "consumption":

                saveConsumption(data, res);

                break;

        }

    });

})

app.post('/update_password', function (req, res) {

    var data = req.body;

    loggedIn(data.token, function (authentic, user_id, username) {

        if (!authentic) {

            return res.status(200).json({message: "Unauthorized access!"});
            ;

        }

        console.log(data);

        var sql = "SELECT user_id, password, salt FROM users WHERE username = '" + data.userId + "'";

        console.log(sql);

        queryRaw(sql, function (user) {

            if (user[0].length > 0) {

                var oldPassword = encrypt(data['currentPassword'], user[0][0].salt);

                if (oldPassword == user[0][0].password) {

                    var newPassword = encrypt(data['newPassword'], user[0][0].salt);

                    var sql = "UPDATE users SET password = '" + newPassword + "' WHERE username = '" + data.userId + "'";

                    console.log(sql);

                    queryRaw(sql, function (user) {

                        res.status(200).json({message: "Password updated!"});

                    });

                } else {

                    res.status(200).json({message: "Wrong password!"});

                }

            } else {

                res.status(200).json({message: "User not found!"});

            }

        });

    });

})

app.get('/report_q_sex_pregnancy_m', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(sex_pregnancy) AS total FROM htc_report WHERE COALESCE(sex_pregnancy,'') = 'M' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_sex_pregnancy_fnp', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(sex_pregnancy) AS total FROM htc_report WHERE COALESCE(sex_pregnancy,'') = 'FNP' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_sex_pregnancy_fp', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(sex_pregnancy) AS total FROM htc_report WHERE COALESCE(sex_pregnancy,'') = 'FP' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_last_hiv_test_lnev', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Never Tested' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_last_hiv_test_ln', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Negative' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_last_hiv_test_lp', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Positive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_last_hiv_test_lex', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Exposed Infant' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_last_hiv_test_lin', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Inconclusive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_outcome_summary_n', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Single Negative' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_outcome_summary_p', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Single Positive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_outcome_summary_t12n', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Test 1 & 2 Negative' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_outcome_summary_t12p', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Test 1 & 2 Positive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_outcome_summary_t12d', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Test 1 & 2 Discordant' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_age_group_0_11m', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '0-11 months' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_age_group_1_14y', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '1-14 years' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_age_group_15_24y', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '15-24 years' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_age_group_25p', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '25+ years' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_partner_present_yes', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(partner_present) AS total FROM htc_report WHERE COALESCE(partner_present,'') = 'Yes' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_partner_present_no', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(partner_present) AS total FROM htc_report WHERE COALESCE(partner_present,'') = 'No' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_result_given_to_client_nn', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Negative' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_result_given_to_client_np', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Positive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_result_given_to_client_nex', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Exposed Infant' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_result_given_to_client_ni', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Inconclusive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_result_given_to_client_cp', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'Confirmed Positive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_result_given_to_client_in', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'Inconclusive' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_partner_htc_slips_given_slips', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT SUM(partner_htc_slips_given) AS total FROM htc_report WHERE COALESCE(partner_htc_slips_given,'') != '' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_htc_access_type_pitc', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(htc_access_type) AS total FROM htc_report WHERE COALESCE(htc_access_type,'') = 'Routine HTS within Health Service' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_htc_access_type_frs', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(htc_access_type) AS total FROM htc_report WHERE COALESCE(htc_access_type,'') = 'Comes with HTS Family Reference Slip' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/report_q_htc_access_type_vct', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT COUNT(htc_access_type) AS total FROM htc_report WHERE COALESCE(htc_access_type,'') = 'Other (VCT, etc.)' " +
        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
        (query.end_date ? " AND DATE(obs_datetime)) <= DATE('" + query.end_date + "')" : "");

    console.log(sql);

    queryRaw(sql, function (data) {

        res.status(200).json({count: data[0][0].total});

    });

})

app.get('/relationship_types', function (req, res) {

    var url_parts = url.parse(req.url, true);

    var query = url_parts.query;

    var sql = "SELECT relationship_type_id, CONCAT(a_is_to_b, ' - ', b_is_to_a) AS relation FROM relationship_type " +
        "WHERE CONCAT(a_is_to_b, ' -> ', b_is_to_a) LIKE '" + query.type + "%' AND a_is_to_b IN ('Sibling', 'Parent', " +
        "'Aunt/Uncle', 'Child', 'Spouse/Partner', 'Other')";

    console.log(sql);

    queryRaw(sql, function (data) {

        var result = "";

        for (var i = 0; i < data[0].length; i++) {

            // result += "<li tstValue='" + data[0][i].relationship_type_id + "'>" + data[0][i].relation + "</li>";

            result += "<li>" + data[0][i].relation + "</li>";

        }

        res.send(result);

    });

})

app.get('/patient/:id', function (req, res) {
    res.sendFile(__dirname + '/public/views/patient.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});

portfinder.basePort = 3014;

portfinder.getPort(function (err, port) {

    server.listen(port, function () {
        console.log("✔ Server running on port %d in %s mode", port, app.get('env'));
    });

});