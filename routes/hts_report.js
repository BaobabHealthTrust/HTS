module.exports = function (router) {

        var async = require('async');
        var url = require('url');

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

        }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getID(identifier) {

        var sql = " SELECT patient_id FROM patient_identifier WHERE identifier='" + identifier + "'";

        var patient_id;

        queryRaw(sql, function (data) {

            patient_id = adata[0];

        });
    }

    router.route("/quarters")
        .get(function (req, res) {

            var list = [];

            var year = (new Date()).getFullYear();

            for (var i = 0; i < 4; i++) {

                var thisYr = year - i;

                var quarterGroups = ["Q1", "Q2", "Q3", "Q4"];

                for (var j = 3; j >= 0; j--) {

                    if (thisYr == year && Math.floor((new Date()).getMonth() / 3) < j)
                        continue;

                    var thisQtr = thisYr + " " + quarterGroups[j];

                    list.push(thisQtr);

                }

            }

            res.send("<li>" + list.join("</li><li>") + "</li>");

        });

    router.route("/patient_stats")
        .get(function (req, res) {

            var url_parts = url.parse(req.url, true);

            var query = url_parts.query;

            var today = (query.date ? (new Date(query.date)) : (new Date())).format("YYYY-mm-dd");

            var program = (query.program ? query.program : "");

            console.log(today);

            var results = {
                today: {},
                month: {},
                year: {}
            };

            async.series([
                function (callback) {

                    var sql = "SELECT encounter_type.name AS ename, COUNT(encounter_id) AS total, program.name AS pname, encounter.encounter_datetime FROM encounter_type LEFT OUTER JOIN encounter ON encounter.encounter_type = encounter_type.encounter_type_id LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id GROUP BY ename, encounter.encounter_datetime HAVING DATE(encounter.encounter_datetime) = DATE('" + today + "') AND ename IN ('VITALS', 'APPOINTMENT', 'TREATMENTS', 'VDRL STATUS','EPILEPSY VISIT', 'EPILEPSY PATIENT OVERVIEW', 'HIV/ART STATUS') AND pname IN ('" + program + "', 'CROSS-CUTTING PROGRAM')";

                    console.log(sql);

                    queryRaw(sql, function (data) {

                        var json = {};

                        if (data[0].length > 0) {

                            for (var i = 0; i < data[0].length; i++) {
                                console.log(data[0][i]);

                                //json[data[0][i].ename] = data[0][i].total;

                                results.today[data[0][i].ename] = data[0][i].total;


                            }

                        }

                        callback();

                    })

                },
                function (callback) {

                    var sql = "SELECT encounter_type.name AS ename, COUNT(encounter_id) AS total, program.name AS pname, encounter.encounter_datetime FROM encounter_type LEFT OUTER JOIN encounter ON encounter.encounter_type = encounter_type.encounter_type_id LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id GROUP BY ename, encounter.encounter_datetime HAVING month(encounter.encounter_datetime) = month('" + today + "') AND year(encounter_datetime) = year('" + today + "') AND ename IN ('VITALS', 'APPOINTMENT', 'TREATMENTS', 'VDRL STATUS','EPILEPSY VISIT', 'EPILEPSY PATIENT OVERVIEW', 'HIV/ART STATUS') AND pname IN ('" + program + "', 'CROSS-CUTTING PROGRAM')";

                    console.log(sql);

                    queryRaw(sql, function (data) {

                        var json = {};

                        if (data[0].length > 0) {

                            for (var i = 0; i < data[0].length; i++) {
                                console.log(data[0][i]);

                                //json[data[0][i].ename] = data[0][i].total;

                                results.month[data[0][i].ename] = data[0][i].total;


                            }

                        }

                        callback();

                    })

                },
                function (callback) {

                    var sql = "SELECT encounter_type.name AS ename, COUNT(encounter_id) AS total, program.name AS pname, encounter.encounter_datetime FROM encounter_type LEFT OUTER JOIN encounter ON encounter.encounter_type = encounter_type.encounter_type_id LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id GROUP BY ename, encounter.encounter_datetime HAVING year(encounter.encounter_datetime) = year('" + today + "') AND ename IN ('VITALS', 'APPOINTMENT', 'TREATMENTS', 'VDRL STATUS','EPILEPSY VISIT', 'EPILEPSY PATIENT OVERVIEW', 'HIV/ART STATUS') AND pname IN ('" + program + "', 'CROSS-CUTTING PROGRAM')";

                    console.log(sql);

                    queryRaw(sql, function (data) {

                        var json = {};

                        if (data[0].length > 0) {

                            for (var i = 0; i < data[0].length; i++) {
                                console.log(data[0][i]);

                                //json[data[0][i].ename] = data[0][i].total;

                                results.year[data[0][i].ename] = data[0][i].total;


                            }

                        }

                        callback();

                    })

                },

                function (callback) {

                    var sql = "SELECT encounter_type.name AS ename, COUNT(encounter_id) AS total, program.name AS pname, encounter.encounter_datetime FROM encounter_type LEFT OUTER JOIN encounter ON encounter.encounter_type = encounter_type.encounter_type_id LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id GROUP BY ename, encounter.encounter_datetime HAVING DATE(encounter.encounter_datetime) = DATE('" + today + "') AND ename IN ('VITALS', 'APPOINTMENT', 'TREATMENTS', 'ASTHMA VISIT', 'HIV/ART STATUS') AND pname IN ('" + program + "', 'CROSS-CUTTING PROGRAM')";

                    console.log(sql);

                    queryRaw(sql, function (data) {

                        var json = {};

                        if (data[0].length > 0) {

                            for (var i = 0; i < data[0].length; i++) {
                                console.log(data[0][i]);

                                //json[data[0][i].ename] = data[0][i].total;

                                results.today[data[0][i].ename] = data[0][i].total;


                            }

                        }

                        callback();

                    })

                },

                function (callback) {

                    var sql = "SELECT encounter_type.name AS ename, COUNT(encounter_id) AS total, program.name AS pname, encounter.encounter_datetime FROM encounter_type LEFT OUTER JOIN encounter ON encounter.encounter_type = encounter_type.encounter_type_id LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id GROUP BY ename, encounter.encounter_datetime HAVING month(encounter.encounter_datetime) = month('" + today +
                        "') AND year(encounter_datetime) = year('" + today + "') AND ename IN ('VITALS', 'APPOINTMENT', 'TREATMENTS', 'ASTHMA VISIT', 'HIV/ART STATUS') AND pname IN ('" + program + "', 'CROSS-CUTTING PROGRAM')";

                    console.log(sql);

                    queryRaw(sql, function (data) {

                        var json = {};

                        if (data[0].length > 0) {

                            for (var i = 0; i < data[0].length; i++) {
                                console.log(data[0][i]);

                                //json[data[0][i].ename] = data[0][i].total;

                                results.today[data[0][i].ename] = data[0][i].total;


                            }

                        }

                        callback();

                    })

                },

                function (callback) {

                    var sql = "SELECT encounter_type.name AS ename, COUNT(encounter_id) AS total, program.name AS pname, encounter.encounter_datetime FROM encounter_type LEFT OUTER JOIN encounter ON encounter.encounter_type = encounter_type.encounter_type_id LEFT OUTER JOIN patient_program ON patient_program.patient_program_id = encounter.patient_program_id LEFT OUTER JOIN program ON program.program_id = patient_program.program_id GROUP BY ename, encounter.encounter_datetime HAVING year(encounter.encounter_datetime) = year('" + today + "') AND ename IN ('VITALS', 'APPOINTMENT', 'TREATMENTS', 'ASTHMA VISIT', 'HIV/ART STATUS') AND pname IN ('" + program + "', 'CROSS-CUTTING PROGRAM')";

                    console.log(sql);

                    queryRaw(sql, function (data) {

                        var json = {};

                        if (data[0].length > 0) {

                            for (var i = 0; i < data[0].length; i++) {
                                console.log(data[0][i]);

                                //json[data[0][i].ename] = data[0][i].total;

                                results.today[data[0][i].ename] = data[0][i].total;


                            }

                        }

                        callback();

                    })

                }

            ], function (err) {

                if (err)
                    console.log(err);

                res.status(200).json(results);

            })

        });

    return router;

}