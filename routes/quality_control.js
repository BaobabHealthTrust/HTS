var async = require("async");

var config = require(__dirname + "/../config/database.json");

var knexSTD = require("knex")({
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

var knexQC = require('knex')({
    client: 'mysql',
    connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.qualityControlDatabase
    },
    pool: {
        min: 0,
        max: 500
    }
});

var knexSTC = require('knex')({
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

function queryRawQualityControl(sql, callback) {

    knexQC.raw(sql)
        .then(function (result) {

            callback(result);

        })
        .catch(function (err) {

            console.log(err.message);

            callback(err);

        });

}

function queryRawStock(sql, callback) {

    knexSTC.raw(sql)
        .then(function (result) {

            callback(result);

        })
        .catch(function (err) {

            console.log(err.message);

            callback(err);

        });

}

function queryRaw(sql, callback) {

    knexSTD.raw(sql)
        .then(function (result) {

            callback(result);

        })
        .catch(function (err) {

            console.log(err.message);

            callback(err);

        });

}

function saveQualityTest(data, res) {

    if (data.datatype.trim() == "quality_assurance") {

        async.series([
            function (icallback) {

                var test_kit_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '" + data.test_kit_lot_number + "' ORDER BY dispatch_id LIMIT 1";

                var consumption_kit_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                    "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                    "consumption_type WHERE name = 'Quality Control'), (" + test_kit_dispatch_id_query + "), '" +
                    2 + "', 'Quality Test', '" + data.qc_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.hts_provider + "')";


                queryRawStock(consumption_kit_query, function (batch) {

                    console.log("Kit Consumption Query");

                });

                var dts_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '" + data.dts_1_lot_number + "' ORDER BY dispatch_id LIMIT 1";

                var consumption_dts_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                    "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                    "consumption_type WHERE name = 'Quality Control'), (" + dts_dispatch_id_query + "), '" +
                    1 + "', 'Quality Test', '" + data.qc_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.hts_provider + "')";

                queryRawStock(consumption_dts_query, function (batch) {

                    console.log("DTS 1 Consumption Query");

                });

                var dts_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '" + data.dts_2_lot_number + "' ORDER BY dispatch_id LIMIT 1";

                var consumption_dts_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                    "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                    "consumption_type WHERE name = 'Quality Control'), (" + dts_dispatch_id_query + "), '" +
                    1 + "', 'Quality Test', '" + data.qc_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.hts_provider + "')";

                queryRawStock(consumption_dts_query, function (batch) {

                    console.log("DTS 2 Consumption Query");

                });

                icallback();

            },
            function (icallback) {

                for (var i = 1; i < 3; i++) {

                    var sql = "INSERT INTO quality_assurance (qc_test_date,sample_type,test_kit_name,test_kit_lot_number,test_kit_expiry_date,sample_name,sample_lot_number,sample_expiry_date" +
                        ",control_line_seen,time,quality_test_result,interpretation,hts_provider,outcome,created_by,date_created) VALUES('" + data.qc_testing_date + "' , '" + data.sample_type + "' , '" + data.test_kit_name +
                        "' , '" + data.test_kit_lot_number + "' , '" + data.test_kit_expiry_date + "' , '" + eval('data.dts_name' + i) + "' , '" + eval('data.dts_' + i + '_lot_number') + "' , '" + eval('data.dts_' + i + '_expiry_date') +
                        "' , '" + eval('data.control_' + i + '_line_seen') + "' , '" + eval('data.timer_' + i) + "' , '" + eval('data.result_' + i) + "' , '" + (eval(' data.interpretation_' + i) ? eval(' data.interpretation_' + i) : "") + "' , '" + data.hts_provider + "' , '" + eval('data.outcome_' + i) + "' , '" + data.userId + "',CURRENT_TIMESTAMP())";


                    queryRawQualityControl(sql, function (batch) {

                        console.log("Quality test Done " + i);

                    });

                }

            }

        ])

        res.status(200).json({message: "Quality test Done!"});

    }

}

function saveProficiency(data, res) {

    var date_created = new Date();

    async.series([

        function (icallback) {

            var insert_proficiency = "INSERT INTO proficiency_test(proficiency_test_date,phone_number,first_name,last_name," +
                "pt_panel_lot_number,test_kit_1_name,test_kit_1_lot_number,test_kit_1_expiry,test_kit_2_name, test_kit_2_lot_number," +
                "test_kit_2_expiry, created_by, date_created,hts_provider_id) " +
                "VALUES('" + data.proficiency_testing_date + "','" + data.phone_number + "','" + data.first_name + "','" + data.last_name + "','" +
                data.pt_panel_lot_number + "','" + data.test1_kit_name + "','" + data.lot_number1 + "','" + data.test1_expiry_date + "','" + data.test2_kit_name + "','" +
                data.lot_number2 + "','" + data.test2_expiry_date + "','" + data.userId + "',cast('" + date_created.format('YYYY-mm-dd') + "' as datetime),'" + data.provider_id + "')"

            console.log(insert_proficiency);

            queryRawQualityControl(insert_proficiency, function (batch) {

                console.log("Insert Proficiency test Record");

                icallback();
            });

        },
        function (icallback) {

            var get_pt_record = "SELECT pid FROM proficiency_test WHERE proficiency_test_date = '" + data.proficiency_testing_date + "' AND pt_panel_lot_number = '" +
                data.pt_panel_lot_number + "' AND test_kit_1_name = '" + data.test1_kit_name + "' AND test_kit_1_lot_number = '" + data.lot_number1
                + "' AND test_kit_1_expiry = '" + data.test1_expiry_date + "' AND test_kit_2_name = '" + data.test2_kit_name + "' AND test_kit_2_lot_number = '"
                + data.lot_number2 + "' AND test_kit_2_expiry = '" + data.test2_expiry_date + "' AND date_created = CAST('" + date_created.format('YYYY-mm-dd')
                + "' as datetime) ORDER BY pid DESC LIMIT 1";

            for (var i = 0; i < 5; i++) {

                console.log(i + "\n");

                var result_query = "INSERT INTO proficiency_test_result (pid,panel_number,first_pass_test_1,first_pass_test_1_time,first_pass_test_2,first_pass_test_2_time" +
                    ",im_pass_test_1,im_pass_test_1_time,im_pass_test_2,im_pass_test_2_time,final_result) " +
                    "VALUES((" + get_pt_record + "),'" + (i + 1) + "','" + eval('data.test_1_' + i) + "','" + eval('data.test_1_' + i + '_time') + "','" + eval('data.test_2_' + i) + "','" + eval('data.test_2_' + i + '_time')
                    + "','" + eval('data.im_1_' + i) + "','" + eval('data.im_1_' + i + '_time') + "','" + eval('data.im_2_' + i) + "','" + eval('data.im_2_' + i + '_time') + "','" + eval('data.final_result_' + i) + "')"

                queryRawQualityControl(result_query, function (batch) {

                    console.log("Insert Proficiency test Result");


                });

            }

            icallback();

        },

        function (icallback) {

            var pt_panel_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '" + data.pt_panel_lot_number + "' ORDER BY dispatch_id LIMIT 1";

            var consumption_pt_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                "consumption_type WHERE name = 'Quality Control'), (" + pt_panel_dispatch_id_query + "), '" +
                1 + "', 'Quality Test', '" + data.proficiency_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.tester + "')";

            queryRawStock(consumption_pt_query, function (batch) {

                console.log("PT Consumption Query");

            });

            if (data.test_1_consumption_quantity > 0) {

                var test_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '" + data.lot_number1 + "' ORDER BY dispatch_id LIMIT 1";

                var consumption_test_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                    "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                    "consumption_type WHERE name = 'Quality Control'), (" + test_dispatch_id_query + "), '" +
                    data.test_1_consumption_quantity + "', 'Quality Test', '" + data.proficiency_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.tester + "')";

                queryRawStock(consumption_test_query, function (batch) {

                    console.log("Test 1 Consumption Query");

                });

            }

            if (data.test_2_consumption_quantity > 0) {

                var test_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '" + data.lot_number2 + "' ORDER BY dispatch_id LIMIT 1";

                var consumption_test_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                    "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                    "consumption_type WHERE name = 'Quality Control'), (" + test_dispatch_id_query + "), '" +
                    data.test_2_consumption_quantity + "', 'Quality Test', '" + data.proficiency_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.tester + "')";

                queryRawStock(consumption_test_query, function (batch) {

                    console.log("Test 2 Consumption Query");

                });

            }

            icallback();

        },

        function (icallback) {

            res.status(200).json({message: "Proficiency test Done!"});

            var check_official_result = "SELECT * FROM proficiency_test_official_result WHERE pt_panel_lot_number = '" + data.pt_panel_lot_number + "'";

            queryRawQualityControl(check_official_result, function (result) {

                if (!result[0][0])
                    return

                console.log("Insert Proficiency test Record");

                updatePTScores(result[0][0]);

            });

        }

    ]);

}

function updatePTScores(data) {

    var select_ptid = "SELECT  DISTINCT pid FROM proficiency_test WHERE pt_panel_lot_number = '" + data.pt_panel_lot_number + "'";

    queryRawQualityControl(select_ptid, function (ptids) {

        for (var i = 0; i < ptids[0].length; i++) {

            if (!ptids[0][i])
                continue;

            var score = 0;

            var proficiency_test_id = ptids[0][i].pid;

            async.series([

                function (icallback) {

                    var sql = "SELECT * FROM `proficiency_test_result` WHERE pid ='" + proficiency_test_id + "' ORDER BY panel_number";

                    queryRawQualityControl(sql, function (result) {

                        if (data.pt_panel_result_0) {

                            for (var j = 0; j < result[0].length; j++) {

                                var test_result = result[0][j].final_result;

                                if (test_result.trim() == "+" && eval("data.pt_panel_result_" + j).trim().toLowerCase().match("positive")) {

                                    score++;

                                } else if (test_result.trim() == "-" && eval("data.pt_panel_result_" + j).trim().toLowerCase().match("negative")) {

                                    score++;

                                }

                                var update_official_column = "UPDATE proficiency_test_result SET official_result = '" + eval("data.pt_panel_result_" + j).trim() + "' WHERE pid ='" + proficiency_test_id
                                    + "' AND panel_number = '" + (j + 1) + "'";

                                queryRawQualityControl(update_official_column, function (result) {

                                    console.log("updated Specific Providers Official Result");

                                });

                            }

                        } else if (data.panel_1) {

                            for (var j = 0; j < result[0].length; j++) {

                                var test_result = result[0][j].final_result;

                                if (test_result.trim() == "+" && eval("data.panel_" + ( j + 1 )).trim().toLowerCase().match("positive")) {

                                    score++;

                                } else if (test_result.trim() == "-" && eval("data.panel_" + ( j + 1 )).trim().toLowerCase().match("negative")) {

                                    score++;

                                }

                                var update_official_column = "UPDATE proficiency_test_result SET official_result = '" + eval("data.panel_" + (j + 1)).trim() + "' WHERE pid ='" + proficiency_test_id
                                    + "' AND panel_number = '" + ( j + 1 ) + "'";

                                queryRawQualityControl(update_official_column, function (result) {

                                    console.log("updated Specific Providers Official Result");

                                });

                            }

                        }

                        icallback();

                    });

                },

                function (icallback) {

                    var percentage = parseInt((parseInt(score) / 5) * 100);

                    score = 0;

                    var sql = "UPDATE `proficiency_test` SET score =" + percentage + " WHERE pid ='" + proficiency_test_id + "'";

                    queryRawQualityControl(sql, function (result) {

                        console.log("Score updated " + percentage + " %");

                        icallback();

                    });

                }

            ]);

        }

    });

}

module.exports = function (router) {

    router.route("/")
        .get(function (req, res) {

            res.status(200).json({});

        });

    router.route('/save_quality_control_test/')
        .post(function (req, res) {

        var data = req.body;

        switch (data.datatype) {

            case "quality_assurance":

                saveQualityTest(data, res);

                break;

        }

    });

    router.route("/proficiency_test/")
        .post(function (req, res) {

        var data = req.body;

        if (data.datatype == "proficiency_test") {

            saveProficiency(data, res);

        }

    });

    router.route('/quality_control_test_approval/')
        .get(function (data, res) {

        var sql = "SELECT * FROM quality_assurance WHERE approval_status IS NULL OR approval_status =''";
        results = []

        queryRawQualityControl(sql, function (data) {

            for (var i = 0; i < data[0].length; i++) {

                if (!data[0][i])
                    continue;

                results.push(data[0][i])

            }

            res.send(results);

        })
    });

    router.route('/quality_control_test_approval_update/')
        .post(function (req, res) {

        var data = req.body;

        var sql = "UPDATE quality_assurance AS quality_assurance " + "SET approval_status = '" + data.approval_status + "',reason_for_approval = '" + data.reason_for_approval + "', comments = comments + 1  WHERE quality_assurance_test_id = '" + data.qc_id + "' ";

        console.log(sql);

        queryRawQualityControl(sql, function (data) {

            res.send("Approval status updated");

        })

    });

    router.route('/proficiency_test_approval/')
        .get(function (data, res) {

        var sql = "SELECT * FROM proficiency_test WHERE approved  ='' AND score != -1";

        results = [];

        queryRawQualityControl(sql, function (data) {

            for (var i = 0; i < data[0].length; i++) {

                if (!data[0][i])
                    continue;

                results.push(data[0][i])

            }

            res.send(results);

        })

    });

    router.route("/proficiency_test_result/:id")
        .get(function (data, res) {

        var sql = "SELECT * FROM proficiency_test_result WHERE pid = '" + data.params.id + "' AND official_result !=''";

        results = [];

        queryRawQualityControl(sql, function (data) {

            for (var i = 0; i < data[0].length; i++) {

                if (!data[0][i])
                    continue;

                results.push(data[0][i])

            }

            res.send(results);

        })

    });

    router.route("/proficiency_test_official_result/")
        .post(function (req, res) {

        var data = req.body;

        var sql = "";

        async.series([
            function (icallback) {

                console.log(data.pt_panel_lot_number);

                var query_official = "SELECT * FROM proficiency_test_official_result WHERE pt_panel_lot_number = '" + data.pt_panel_lot_number + "'";

                queryRawQualityControl(query_official, function (result) {

                    if (!result[0][0]) {

                        sql = "INSERT INTO proficiency_test_official_result(pt_panel_lot_number,panel_1,panel_2,panel_3,panel_4,panel_5,date_created,created_by) " +
                            "VALUES('" + data.pt_panel_lot_number + "','" + data.pt_panel_result_0 + "','" + data.pt_panel_result_1 + "','" + data.pt_panel_result_2 + "','"
                            + data.pt_panel_result_3 + "','" + data.pt_panel_result_4 + "',NOW(),'" + data.userId + "')";

                    } else {

                        sql = "UPDATE proficiency_test_official_result SET panel_1 = '" + data.pt_panel_result_0 + "', panel_2 = '" + data.pt_panel_result_1 +
                            "', panel_3 = '" + data.pt_panel_result_2 + "', panel_4 = '" + data.pt_panel_result_3 + "', panel_5 = '" + data.pt_panel_result_4
                            + "' WHERE pt_panel_lot_number ='" + data.pt_panel_lot_number + "'";
                    }

                    icallback();

                });

            },

            function (icallback) {

                queryRawQualityControl(sql, function (batch) {

                    console.log("Insert Proficiency Official Result");

                    res.status(200).json({message: "Proficiency Official Result Done!"});

                    updatePTScores(data);

                    icallback();

                });

            }])

    });

    router.route("/proficiency_test_action_plan/")
        .post(function (req, res) {

        var data = req.body;

        var sql = "UPDATE proficiency_test SET action_plan ='" + data.action_plan + "', approved = \"No\", " +
            "date_approved = NOW() WHERE pid ='" + data.proficiency_test_id + "'";

        queryRawQualityControl(sql, function (batch) {

            console.log("Action Plan Entered");

            res.status(200).json({message: "Action plan entered!"});

        });

    });

    router.route("/proficiency_test_report/:start_date/:end_date")
        .get(function (req, res) {

        var start_date = req.params.start_date;

        var end_date = req.params.end_date;

        var sql = "SELECT * FROM proficiency_test WHERE  score >= 0 AND DATE(proficiency_test_date) >='" + start_date
            + "' AND DATE(proficiency_test_date) <='" + end_date + "'";

        console.log(sql);

        results = [];

        queryRawQualityControl(sql, function (data) {

            for (var i = 0; i < data[0].length; i++) {

                if (!data[0][i])
                    continue;

                results.push(data[0][i])

            }

            res.send(results);

        })

    });

    router.route("/mark_pt_reviewed/:id")
        .get(function(req, res) {

        var sql = "UPDATE proficiency_test SET approved = \"Yes\", date_approved = NOW() WHERE pid = \"" + req.params.id + "\"";

        queryRawQualityControl(sql, function(data) {

            console.log(Object.keys(data[0]));

            res.status(200).json({result: "OK"});

        })

    })

    return router;

}


