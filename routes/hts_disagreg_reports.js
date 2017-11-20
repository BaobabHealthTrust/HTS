module.exports = function (router) {

    var async = require('async');
    var url = require('url');
    var connection = require("../config/database.json");
    var fs = require("fs");
    var database = connection.database;

    if (Object.getOwnPropertyNames(Date.prototype).indexOf("format") < 0) {

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

        // added for printing purposes, can be removed if later realised not to be neccessary. Mar 24th, 17
        knex.destroy(sql);    

    }

    router.route("/unknown_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/unknown_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/unknown_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/unknown_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/unknown_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1to9_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1to9_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1to9_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1to9_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/10to14_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/10to14_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/10to14_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/10to14_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/10to14_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/15to19_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/15to19_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/15to19_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/15to19_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/20to24_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/20to24_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/20to24_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/20to24_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/25to29_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/25to29_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/25to29_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/25to29_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/30to34_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/30to34_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/30to34_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/30to34_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/35to39_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/35to39_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/35to39_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/35to39_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/40to49_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/40to49_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/40to49_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/40to49_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/50plus_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/50plus_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/50plus_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/50plus_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Inpatient' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/under_5_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Pediatric' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/under_5_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Pediatric' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/under_5_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Pediatric' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/under_5_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Pediatric' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/under_5_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Pediatric' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/mf_under_5_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Malnutrition Facilities' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/mf_under_5_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Malnutrition Facilities' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/mf_under_5_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Malnutrition Facilities' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/mf_under_5_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Malnutrition Facilities' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/mf_under_5_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC Malnutrition Facilities' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 5 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_lessthan1_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_lessthan1_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_lessthan1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_1to9_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_1to9_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_10to14_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_10to14_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_10to14_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_15to19_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_15to19_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_20to24_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_20to24_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_25to29_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_25to29_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_30to34_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_30to34_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_35to39_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_35to39_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_40to49_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_40to49_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_50plus_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_50plus_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/anc_50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC ANC only' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_unknown_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_unknown_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_unknown_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_unknown_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_unknown_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_lessthan1_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_lessthan1_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_lessthan1_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_lessthan1_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_lessthan1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_1to9_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_1to9_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_1to9_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_1to9_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_10to14_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_10to14_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_10to14_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_10to14_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_10to14_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_15to19_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_15to19_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_15to19_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_15to19_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_20to24_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_20to24_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_20to24_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_20to24_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_25to29_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_25to29_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_25to29_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_25to29_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_30to34_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_30to34_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_30to34_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_30to34_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_35to39_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_35to39_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_35to39_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_35to39_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_40to49_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_40to49_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_40to49_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_40to49_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_50plus_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_50plus_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_50plus_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_50plus_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/tb_50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'PITC TB' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });


    router.route("/vmmc_lessthan1_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_lessthan1_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_lessthan1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_1to9_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_1to9_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_15to19_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_15to19_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_20to24_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_20to24_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_25to29_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_25to29_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_30to34_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_30to34_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_35to39_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_35to39_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_40to49_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_40to49_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });
        
    router.route("/vmmc_50plus_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_50plus_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vmmc_50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'VMMC Services' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_unknown_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_unknown_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_unknown_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_unknown_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_unknown_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_lessthan1_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_lessthan1_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_lessthan1_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_lessthan1_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_lessthan1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_1to9_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_1to9_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_1to9_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_1to9_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_10to14_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_10to14_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_10to14_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_10to14_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_10to14_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_15to19_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_15to19_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_15to19_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_15to19_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_20to24_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_20to24_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_20to24_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_20to24_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_25to29_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_25to29_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_25to29_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_25to29_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_30to34_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_30to34_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_30to34_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_30to34_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_35to39_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_35to39_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_35to39_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_35to39_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_40to49_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_40to49_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_40to49_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_40to49_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_50plus_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_50plus_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_50plus_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_50plus_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/pitc_50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN obs AS obs3 ON obs1.person_id = obs3.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8547 AND obs3.concept_id = 8492 " + 
                      "AND obs1.value_text = 'Routine HTS (PITC) within Health Service' " + 
                      "AND obs2.value_text = 'Other PITC' AND obs3.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_unknown_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_unknown_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_unknown_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_unknown_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_unknown_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_lessthan1_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_lessthan1_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_lessthan1_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_lessthan1_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_lessthan1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " +  
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_1to9_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_1to9_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_1to9_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_1to9_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_10to14_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_10to14_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_10to14_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_10to14_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_10to14_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_15to19_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_15to19_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_15to19_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_15to19_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_20to24_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_20to24_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_20to24_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_20to24_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_25to29_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_25to29_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_25to29_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_25to29_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_30to34_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_30to34_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_30to34_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_30to34_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " +
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_35to39_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_35to39_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_35to39_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_35to39_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_40to49_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_40to49_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_40to49_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_40to49_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_50plus_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_50plus_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_50plus_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_50plus_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/vct_50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_unknown_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_unknown_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_unknown_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_unknown_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_unknown_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_lessthan1_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_lessthan1_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_lessthan1_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_lessthan1_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_lessthan1_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative', 'New Exposed Infant') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) < 1 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });











    router.route("/it_1to9_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_1to9_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_1to9_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_1to9_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_1to9_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender IN('M', 'F') AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 1 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 9 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });



    router.route("/it_10to14_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_10to14_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_10to14_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_10to14_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_10to14_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 10 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 14 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_15to19_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_15to19_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_15to19_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_15to19_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_15to19_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 15 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 19 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_20to24_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_20to24_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_20to24_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_20to24_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_20to24_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 20 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 24 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_25to29_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_25to29_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_25to29_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_25to29_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_25to29_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 25 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 29 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_30to34_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_30to34_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_30to34_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_30to34_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_30to34_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 30 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 34 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_35to39_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_35to39_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_35to39_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_35to39_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_35to39_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 35 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 39 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_40to49_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_40to49_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_40to49_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Other (VCT, etc.)' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_40to49_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_40to49_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) >= 40 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 49 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_50plus_positive_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_50plus_positive_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_50plus_negative_male")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " + 
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_50plus_negative_female")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'F' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text = 'New Negative' " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/it_50plus_total")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var result = 0;

            var sql = "SELECT COUNT(DISTINCT(obs1.person_id)) AS total FROM " + database + ".obs AS obs1 " + 
                      "LEFT OUTER JOIN obs AS obs2 ON obs1.person_id = obs2.person_id " + 
                      "LEFT OUTER JOIN person ON obs1.person_id = person.person_id " + 
                      "LEFT OUTER JOIN patient_program ON obs1.person_id = patient_program.patient_id " + 
                      "WHERE patient_program.patient_id IN(SELECT pp.patient_id FROM patient_program pp " + 
                      "WHERE pp.program_id = 18) AND person.gender = 'M' AND obs1.concept_id = 8460 " + 
                      "AND obs2.concept_id = 8492 AND obs1.value_text = 'Comes with HTS Family Reference Slip' " + 
                      "AND obs2.value_text IN('New Positive', 'Confirmatory Positive', 'New Negative') " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) > 49 " + 
                      "AND (year(patient_program.date_enrolled) - year(person.birthdate)) <= 120 " +
                      "AND obs1.voided = 0 AND person.voided = 0 AND patient_program.voided = 0 " + 
                      "AND Date(obs1.obs_datetime) >='"+query.start_date+"' " + 
                      "AND Date(obs1.obs_datetime) <='"+query.end_date+"'"

        console.log(sql)

            queryRaw(sql, function(data){

                console.log(data[0][0]["total"]);

                res.send(data[0][0]);
            });

        });

    router.route("/site")
      .get(function(req,res){
          var site = require(__dirname + "/../config/site.json");
          res.send([site.facility])
    });

    return router;

}