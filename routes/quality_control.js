

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

function  saveProficiency(data,res){

    var date_created = new Date();

    console.log(date_created.format());


    var insert_proficiency = "INSERT INTO proficiency_test(proficiency_test_date,phone_number,first_name,last_name,"+
                                 "pt_panel_lot_number,test_kit_1_name,test_kit_1_lot_number,test_kit_1_expiry,test_kit_2_name, test_kit_2_lot_number,"+
                                 "test_kit_2_expiry, created_by, date_created) "+
                                 "VALUES('"+ data.proficiency_testing_date +"','"+data.phone_number+"','"+data.first_name+"','"+data.last_name+"','"+
                                 data.pt_panel_lot_number+"','"+data.test1_kit_name+"','"+data.lot_number1+"','"+data.test1_expiry_date+"','"+data.test2_kit_name+"','"+
                                 data.lot_number2+"','"+data.test2_expiry_date+"','"+data.userId +"',cast('"+date_created.format('YYYY-mm-dd')+"' as datetime))"

    console.log(insert_proficiency);

     queryRawQualityControl(insert_proficiency, function (batch) {

                console.log("Insert Proficiency test Record");
    });

     var get_pt_record = "SELECT pid FROM proficiency_test WHERE proficiency_test_date = '"+ data.proficiency_testing_date + "' AND pt_panel_lot_number = '"+
                          data.pt_panel_lot_number + "' AND test_kit_1_name = '" + data.test1_kit_name + "' AND test_kit_1_lot_number = '"+ data.lot_number1
                          +"' AND test_kit_1_expiry = '"+data.test1_expiry_date +"' AND test_kit_2_name = '"+ data.test2_kit_name +"' AND test_kit_2_lot_number = '" 
                          +  data.lot_number2 + "' AND test_kit_2_expiry = '"+ data.test2_expiry_date + "' AND date_created = CAST('"+date_created.format('YYYY-mm-dd')
                          +"' as datetime) ORDER BY pid DESC LIMIT 1";

   for(var i = 0 ; i < 5 ; i++){

            var result_query = "INSERT INTO proficiency_test_result (pid,first_pass_test_1,first_pass_test_1_time,first_pass_test_2,first_pass_test_2_time"+
                               ",im_pass_test_1,im_pass_test_1_time,im_pass_test_2,im_pass_test_2_time,final_result) "+
                               "VALUES(("+get_pt_record+"),'"+eval('data.test_1_'+i) +"','"+eval('data.test_1_'+i+'_time')+"','"+eval('data.test_2_'+i)+"','"+eval('data.test_2_'+i+'_time')
                               +"','"+eval('data.im_1_'+i)+"','"+eval('data.im_1_'+i+'_time')+"','"+eval('data.im_2_'+i)+"','"+eval('data.im_2_'+i+'_time')+"','"+eval('data.final_result_'+i)+"')"


              queryRawQualityControl(result_query, function (batch) {

                            console.log("Insert Proficiency test Result");
              });

   }

    res.status(200).json({message: "Proficiency test Done!"});


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
    router.route("/proficiency_test/").post(function(req,res){

        var data = req.body;

        if(data.datatype == "proficiency_test"){

            saveProficiency(data,res);

        }

    });

    router.route('/quality_control_test_approval/').get(function (data, res){

        var sql = "SELECT quality_assurance.quality_assurance_test_id AS test_id, quality_assurance.qc_test_date AS date, quality_assurance.sample_name AS dts_type, quality_assurance.sample_name_lot_number "+
                   "AS dts_lot_number, quality_assurance.test_kit_name AS test_kit_name, quality_assurance.test_kit_lot_number AS test_kit_lot_number, "+
                   "quality_assurance.control_line_seen AS control_line_seen, quality_assurance.quality_test_result, quality_assurance.outcome AS outcome, "+
                   "quality_assurance.interpretation AS interpretation, quality_assurance.voided AS voided from htc_quality_control.quality_assurance WHERE quality_assurance.voided = 0;";
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

    router.route('/proficiency_test_approval/').get(function(data, res){

        var sql = "SELECT * FROM proficiency_test WHERE approved  =''";

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

    router.route("/proficiency_test_result/:id").get(function(data, res){


         var sql = "SELECT * FROM proficiency_test_result WHERE pid = '"+data.params.id+"' AND official_result =''";

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

    return router;

}


