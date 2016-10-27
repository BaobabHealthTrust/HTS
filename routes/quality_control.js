

function queryRawQualityControl(sql, callback) {

    var config = require(__dirname +"/../config/database.json");

    var knex = require('knex')({
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

    knex.raw(sql)
        .then(function (result) {

            callback(result);

        })
        .catch(function (err) {

            console.log(err.message);

            callback(err);

        });

}

function queryRawStock(sql, callback) {

    var config = require(__dirname + "/../config/database.json");

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

function saveQualityTest(data, res){

    if(data.datatype.trim() == "quality_assurance"){

         var sql = "";

        if(data.sample_type.trim().toLowerCase() == "serum"){

            sql = "INSERT INTO quality_assurance (qc_test_date,sample_type,test_kit_name,test_kit_lot_number,sample_name,sample_name_lot_number"+
                      ",control_line_seen,quality_test_result,supervisir_code,interpretation,provider_id,outcome,date_created) VALUES('" +data.qc_testing_date+"' , '"+ data.sample_type +"' , '"+ data.test_kit_name+
                      "' , '"+ data.test_kit_lot_number + "' , '"+ data.serum_name + "' , '"+ data.serum_lot_number + 
                      "' , '"+ data.control_line_seen + "' , '"+ data.result +"' , '"+ data.supervisor_code + "' , '"+ data.interpretation + "' , '"+ data.provider_id + "' , '"+ data.outcome +  "',CURRENT_TIMESTAMP())";

        }
        else if(data.sample_type.trim().toLowerCase() == "dts"){

            sql = "INSERT INTO quality_assurance (qc_test_date,sample_type,test_kit_name,test_kit_lot_number,test_kit_expiry_date,sample_name,sample_name_lot_number,sample_expiry_date"+
                      ",control_line_seen,quality_test_result,supervisor_code,interpretation,provider_id,outcome,created_by,date_created) VALUES('"+data.qc_testing_date+"' , '"+ data.sample_type +"' , '"+ data.test_kit_name+
                      "' , '"+ data.test_kit_lot_number+ "' , '"+ data.test_kit_expiry_date + "' , '"+ data.dts_name + "' , '"+ data.dts_lot_number +  "' , '"+ data.dts_expiry_date +
                      "' , '"+ data.control_line_seen + "' , '"+ data.result +"' , '"+ data.supervisor_code + "' , '"+ data.interpretation + "' , '"+ data.provider_id + "' , '"+ data.outcome + "' , '"+ data.user+ "',CURRENT_TIMESTAMP())";

        }


        var test_kit_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '"+data.test_kit_lot_number+"' ORDER BY dispatch_id LIMIT 1";

        var consumption_kit_query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                                "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                                "consumption_type WHERE name = 'Quality Control'), (" + test_kit_dispatch_id_query + "), '" +
                                1 + "', 'Quality Test', '" + data.qc_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.user+ "')";

         queryRawStock(consumption_kit_query, function (batch) {

            console.log("Kit Consumption Query");

        });                        


        var sample_dispatch_id_query = "SELECT dispatch_id FROM dispatch WHERE batch_number = '"+data.dts_lot_number+"' ORDER BY dispatch_id LIMIT 1";


        var consumption_sample__query = "INSERT INTO consumption (consumption_type_id, dispatch_id, consumption_quantity, who_consumed, " +
                                "date_consumed, reason_for_consumption, location, date_created, creator) VALUES ((SELECT consumption_type_id FROM " +
                                "consumption_type WHERE name = 'Quality Control'), (" + sample_dispatch_id_query + "), '" +
                                1 + "', 'Quality Test', '" + data.qc_testing_date + "', 'Quality Control', '" + data.location + "', NOW(), '" + data.user+ "')";

         queryRawStock(consumption_sample__query, function (batch) {

            console.log("Sample Consumption Query");

        });



        queryRawQualityControl(sql, function (batch) {

        		console.log("Quality test Done");

                res.status(200).json({message: "Quality test Done!"});

        });

    }

}

module.exports = function (router) {

    router.route("/")
        .get(function (req, res) {

            res.status(200).json({});

        });


    router.route('/save_quality_control_test/').post(function (req, res) {

	    var data = req.body;

	    switch (data.datatype) {

	            case "quality_assurance": 

	                saveQualityTest(data, res);
	                
	                break;

	    }


	});

    router.route('/quality_control_test_approval/').get(function supervisorApproval(data, res){

        var sql = "SELECT quality_assurance.qc_test_date AS date, quality_assurance.sample_name AS dts_type, quality_assurance.sample_name_lot_number AS dts_lot_number, quality_assurance.test_kit_name AS test_kit_name, quality_assurance.test_kit_lot_number AS test_kit_lot_number, quality_assurance.control_line_seen AS control_line_seen, quality_assurance.quality_test_result, quality_assurance.outcome AS outcome, quality_assurance.interpretation AS interpretation, quality_assurance.voided AS voided from htc_quality_control.quality_assurance WHERE quality_assurance.voided = 0;";
        results = []

        queryRawStock(sql, function (data) {

            for (var i = 0; i < data[0].length; i++) {

                if (!data[0][i])
                    continue;

                results.push(data[0][i])


            }

            res.send(results);

        })

    });

    return router;

}


