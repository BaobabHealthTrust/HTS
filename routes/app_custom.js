var url = require('url');

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

function queryRaw(sql, callback) {

    var config = require(__dirname + "/../config/database.json");

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

module.exports = function (router) {

    router.route("/")
        .get(function (req, res) {

            res.status(200).json({});

        });

    router.route("/month").get(function(req,res){

        var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                "October", "November", "December","Unknown"];

        var result = "";

        for(var i = 0 ; i < monthList.length ; i++){

            result = result + "<li>"+monthList[i]+"</li>"

        }

        res.send(result);

    });

    router.route("/roles").get(function (req, res) {

            var sql = "SELECT role FROM role WHERE role IN ('Admin','HTS Focal Person','Counselor')";

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

    router.route('/hts_users').get(function(req, res){

            var sql = " SELECT username, CONCAT(given_name, ' ', family_name) as name , attribute.hts_id "+
                      " FROM users INNER JOIN person_name ON person_name.person_id = users.person_id INNER JOIN "+
                      " (SELECT person_attribute.person_id as person_id , person_attribute.value as hts_id FROM `person_attribute` "+
                      " WHERE `person_attribute_type_id` = (SELECT `person_attribute_type_id` FROM `person_attribute_type` WHERE `name` = 'HTS Provider ID')) attribute "+
                      " ON person_name.person_id = attribute.person_id ";

            var result = "";

            console.log(sql);

            queryRaw(sql, function (data) {

                for (var i = 0; i < data[0].length; i++) {


                    result += "<li tstValue = '"+data[0][i].username+"'  >"+ data[0][i].name +" ( "+ data[0][i].username +" ) </li>";
                    

                }


                res.send(result);

            });


    });

    router.route('/user_attributes/:username').get(function(req,res){

            var username = req.params.username;

            var sql = " SELECT username, given_name as first_name,  family_name as last_name, attribute.hts_id as provider_id "+
                      " FROM users INNER JOIN person_name ON person_name.person_id = users.person_id INNER JOIN "+
                      " (SELECT person_attribute.person_id as person_id , person_attribute.value as hts_id FROM `person_attribute` "+
                      " WHERE `person_attribute_type_id` = (SELECT `person_attribute_type_id` FROM `person_attribute_type` WHERE `name` = 'HTS Provider ID')) attribute "+
                      " ON person_name.person_id = attribute.person_id WHERE username ='"+username+"' LIMIT 1";


            console.log(sql);

            queryRaw(sql, function (data) {

                if(data[0][0]){

                        res.send(data[0][0])


                }


                ;

            });

    });

    return router;

}
