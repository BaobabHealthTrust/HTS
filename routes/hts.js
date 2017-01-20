module.exports = function (router) {

    var async = require("async");
    var uuid = require("node-uuid");

    var config = require(__dirname + "/../config/database.json");

    var knex = require("knex")({
        client: "mysql",
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

    function queryRaw(sql, callback) {

        knex.raw(sql)
            .then(function (result) {

                callback(result);

            })
            .catch(function (err) {

                console.log("$: " + err.message);

                callback(err);

            });

    }

    function loggedIn(token, callback) {

        var sql = "SELECT user_property.user_id, username FROM user_property LEFT OUTER JOIN users ON users.user_id = " +
            "user_property.user_id WHERE property = \"token\" AND property_value = \"" + token + "\"";

        console.log(sql);

        queryRaw(sql, function (user) {

            if (user && user[0].length > 0) {

                callback(true, user[0][0].user_id, user[0][0].username);

            } else {

                callback(false);

            }

        });

    }

    router.route("/save_obs")
        .post(function (req, res) {

            var data = req.body.data;

            loggedIn(data.token, function (authentic, user_id, username) {

                if (!authentic) {

                    return res.status(401).json({message: "Unauthorized access!"});

                }

                if (!data.program || !data.encounter || !data.concept || !data.value || !data.patient_id)
                    return res.status(406).json({message: "Missing required input data"});

                console.log(data);

                var patient_id, encounter_id, encounter_type_id, concept_id, patient_program_id;

                data.program = "HTS PROGRAM";

                async.series([

                    function(callback) {

                        var sql = "SELECT patient_id FROM patient_identifier WHERE identifier = '" + data.patient_id + "'";

                        console.log(sql);

                        queryRaw(sql, function(patient) {

                            if(patient && patient[0].length > 0) {

                                patient_id = patient[0][0].patient_id;

                            }

                            callback();

                        })

                    },

                    function(callback) {

                        if(!patient_id)
                            return callback();

                        var sql = "SELECT encounter_type_id FROM encounter_type WHERE name = '" + data.encounter + "'";

                        console.log(sql);

                        queryRaw(sql, function(encounter) {

                            if(encounter && encounter[0].length > 0) {

                                encounter_type_id = encounter[0][0].encounter_type_id;

                            }

                            callback();

                        })

                    },

                    function (icallback) {

                        if(!patient_id)
                            return icallback();

                        var sql = "SELECT patient_program_id FROM patient_program LEFT OUTER JOIN program ON program.program_id = " +
                            "patient_program.program_id WHERE patient_id = \"" + patient_id + "\" AND voided = 0 AND program.name = \"" +
                            data.program + "\"";

                        console.log(sql);

                        queryRaw(sql, function (res) {

                            if (res[0].length > 0)
                                patient_program_id = res[0][0].patient_program_id;

                            icallback();

                        });

                    },

                    function (icallback) {

                        if(!patient_id)
                            return icallback();

                        if (!patient_program_id) {

                            var sql = "INSERT INTO patient_program (patient_id, program_id, date_enrolled, creator, date_created, " +
                                "uuid, location_id) VALUES (\"" + patient_id + "\", (SELECT program_id FROM program WHERE name = \"" +
                                data.program + "\"), NOW(), \"" + user_id + "\", NOW(), \"" + uuid.v1() + "\", (SELECT location_id FROM location WHERE name = \"" +
                                (data.location ? data.location : "Unknown") + "\"))";

                            console.log(sql);

                            queryRaw(sql, function (res) {

                                var sql = "SELECT patient_program_id FROM patient_program LEFT OUTER JOIN program ON program.program_id = " +
                                    "patient_program.program_id WHERE patient_id = \"" + patient_id +
                                    "\" AND voided = 0 AND program.name = \"" + data.program + "\"";

                                console.log(sql);

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

                    function(callback) {

                        if(!encounter_type_id)
                            return callback();

                        var sql = "INSERT INTO encounter (encounter_type, patient_id, provider_id, encounter_datetime, " +
                            "creator, date_created, voided, uuid, patient_program_id) VALUES (\"" + encounter_type_id +
                            "\", \"" + patient_id + "\", \"" + user_id + "\", NOW(), \"" + user_id + "\", NOW(), 0, \"" +
                            uuid.v1() + "\", \"" + patient_program_id + "\")";

                        console.log(sql);

                        queryRaw(sql, function(encounter) {

                            if(encounter && encounter[0]) {

                                encounter_id = encounter[0].insertId;

                            }

                            callback();

                        })

                    },

                    function(callback) {

                        if(!encounter_id)
                            return callback();

                        var sql = "SELECT concept_id FROM concept_name WHERE name = \"" + data.concept + "\"";

                        console.log(sql);

                        queryRaw(sql, function(concept) {

                            if(concept && concept[0].length > 0) {

                                concept_id = concept[0][0].concept_id;

                            }

                            callback();

                        })

                    },

                    function(callback) {

                        if(!concept_id)
                            return callback();

                        var sql = "INSERT INTO obs (person_id, concept_id, encounter_id, obs_datetime, value_text, creator, " +
                            "date_created, voided, uuid) VALUES (\"" + patient_id + "\", \"" + concept_id + "\", \"" + encounter_id +
                            "\", NOW(), \"" + data.value + "\", \"" + user_id + "\", NOW(), 0, \"" + uuid.v1() + "\")";

                        console.log(sql);

                        queryRaw(sql, function(obs) {

                            if(obs && obs[0])
                                console.log(obs[0].insertId);

                            callback();

                        })

                    }

                ], function (err) {

                    if (err)
                        res.status(400).json({error: true, message: err.message});
                    else
                        res.status(200).json({message: "OK"});

                })

            });

        });

    return router;

}
