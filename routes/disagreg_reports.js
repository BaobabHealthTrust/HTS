var url = require('url');

function queryRawQualityControl(sql, callback) {

    var config = require(__dirname +"/../config/database.data");

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

    var config = require(__dirname + "/../config/database.data");

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

module.exports = function (router) {

    var client = require("node-rest-client").Client;
    var async = require("async");

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

                if (format.match(/YYYY\-mm\-dd\sHH\:\MM\:SS/)) {

                    result = date.getFullYear() + "-" + padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                        padZeros(date.getDate(), 2) + " " + padZeros(date.getHours(), 2) + ":" +
                        padZeros(date.getMinutes(), 2) + ":" + padZeros(date.getSeconds(), 2);

                } else if (format.match(/YYYY\-mm\-dd/)) {

                    result = date.getFullYear() + "-" + padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                        padZeros(date.getDate(), 2);

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

    function leapYear(year) {

        var yr = parseInt(year);

        var result = ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);

        return result;

    }

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

var dom = ({

        host: "http://localhost:3000",
        window: null,
        htcReport: {},
        greaterThanZero: false,
        htcStockReport: {
            test_1: {
                opening: 0,
                receipts: 0,
                clients: 0,
                other: 0,
                losses: 0,
                balance: 0,
                closing: 0,
                difference: 0
            },
            test_2: {
                opening: 0,
                receipts: 0,
                clients: 0,
                other: 0,
                losses: 0,
                balance: 0,
                closing: 0,
                difference: 0
            }
        },

        __$: function (id) {

            return dom.window.document.getElementById(id);

        },

        ajaxRequest: function (url, callback) {

            url = (!dom.host.match(/^http/i) ? "http://" : "") + dom.host + url;

            (new client()).get(url, function (data) {

                callback(data);

            })

        },

    loadFields: function (host, win, startDate, endDate, callback){

            dom.host = host;

            dom.window = win;

            dom.greaterThanZero = false;


            async.series([

               
                    function (err) {

                            if (err)
                                console.log(err.message);

                            if (callback)
                                callback();

                    }

            ])
    }

});

    router.route("/disagreg_site_report")
        .get(function (req, res) {

            var url = require("url");

            var query = url.parse(req.url, true).query;

            var path = require("path");

            var fs = require("fs");

            var jsdom = require("jsdom");

            var template = fs.readFileSync(path.resolve("./public/views/disagregated_report_template.html"), "utf-8")

            jsdom.env(template, [], function (err, window) {

                var host = req.headers.host;

                dom.loadFields(host, window, query.start_date, query.end_date, function () {

                    res.send(window.document.defaultView.document.documentElement.outerHTML);

                })

            });

        });

    return router;

}
