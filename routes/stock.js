var url = require('url');


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


function queryRawQualityControl(sql, callback) {

    var config = require(__dirname + "/../config/database.json");

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
            (data.transfer_location ? data.transfer_location : "") + "')";

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            var sql = "SELECT stock_id FROM dispatch WHERE dispatch_id = '" + data.dispatch_id + "' LIMIT 1";

            console.log(sql);

            queryRawStock(sql, function (dispatch) {

                var stock_id = dispatch[0][0].stock_id;

                console.log(stock_id);

                var sql = "INSERT INTO dispatch (stock_id, batch_number, dispatch_quantity, dispatch_datetime, " +
                    "dispatch_who_dispatched, dispatch_who_received, dispatch_who_authorised, dispatch_destination) " +
                    "VALUES('" + stock_id + "', '" + data.batch_number + "', '" + data.transfer_quantity + "', '" +
                    data.transfer_datetime + "', '" + data.userId + "', '" + (data.transfer_who_received ?
                        data.transfer_who_received : "") + "', '" + (data.transfer_who_authorised ?
                        data.transfer_who_authorised : "") + "', '" + (data.transfer_location ?
                        data.transfer_location : "") + "')";

                console.log(sql);

                queryRawStock(sql, function (dispatch) {

                    var sql = "UPDATE dispatch SET dispatch_quantity = (@cur_quantity := dispatch_quantity) - " +
                        data.transfer_quantity + " WHERE " + "dispatch_id = '" + data.dispatch_id + "'";

                    console.log(sql);

                    queryRawStock(sql, function (result) {

                        console.log(result);

                        res.status(200).json({message: "Record saved!"});

                    });

                });

            });

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
            "', receipt_datetime = '" + data.receipt_datetime + "', receipt_who_received = '" + data.userId + "', origin_facility = '" + data.origin_facility + "' WHERE " +
            "receipt_id = '" + data.receipt_id;

        console.log(sql);

        queryRawStock(sql, function (stock) {

            console.log(stock[0]);

            res.status(200).json({message: "Record updated!"});

        });

    }
    else {

        var sql = "";

        if (!data.expiry_date && data.origin_facility == "Not Captured") {

            sql = "UPDATE receipt SET receipt_quantity = receipt_quantity +" + data.receipt_quantity + " WHERE batch_number = '" + data.batch_number.trim() + "'";


        } else {

            sql = "INSERT INTO receipt (stock_id, batch_number, expiry_date,origin_facility, receipt_quantity, receipt_datetime, receipt_who_received) VALUES('" +
                data.stock_id + "', '" + data.batch_number + "', '" + data.expiry_date + "', '" + data.origin_facility + "', '" + data.receipt_quantity +
                "', '" + data.receipt_datetime + "', '" + data.userId + "')";


        }

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
                        "in_multiples_of = " + (data.in_multiples_of ? data.in_multiples_of : "") + ", " +
                        "reorder_level = '" + data.re_order_level + "', " +
                        "recommended_test_time = '" + data.recommended_test_time + "', " +
                        "window_test_time = '" + data.window_test_time + "', " +
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
                    "in_multiples_of = " + (data.in_multiples_of ? data.in_multiples_of : "") + ", " +
                    "reorder_level = '" + data.re_order_level + "', " +
                    "recommended_test_time = '" + data.recommended_test_time + "', " +
                    "window_test_time = '" + data.window_test_time + "', " +
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

                    var sql = "INSERT INTO stock (name, description,in_multiples_of,recommended_test_time,window_test_time, reorder_level, category_id, date_created, creator) VALUES('" +
                        data.item_name + "', '" + (data.description ? data.description : "") + "', " + (data.in_multiples_of ? data.in_multiples_of : "1") + "," +
                        (data.recommended_test_time ? data.recommended_test_time : "0") + "," + (data.window_test_time ? data.window_test_time : "0") + ",'" + data.re_order_level + "', '" + category_id + "', NOW(), '" + data.userId + "')";

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


                var sql = "INSERT INTO stock (name, description,in_multiples_of,recommended_test_time,window_test_time, reorder_level, category_id, date_created, creator) VALUES('" +
                    data.item_name + "', '" + (data.description ? data.description : "") + "', " + (data.in_multiples_of ? data.in_multiples_of : "1") + "," +
                    (data.recommended_test_time ? data.recommended_test_time : "0") + "," + (data.window_test_time ? data.window_test_time : "0") + ",'" + data.re_order_level + "', '" + category_id + "', NOW(), '" + data.userId + "')";

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

                    console.log(batch);

                    res.status(200).json({message: "Item saved!", consumption_id: batch[0].insertId});

                }

            });

        }

    } else {

        res.status(200).json({message: "Missing dispatch association!"});

    }

}

function reverseConsumption(data, res, callback) {

    if (data.consumption_id) {

        var sql = "DELETE FROM consumption WHERE consumption_id = '" + data.consumption_id + "'";

        console.log(sql);

        queryRawStock(sql, function (batch) {

            if (callback) {

                callback();

            } else {

                res.status(200).json({message: "Consumption reversed!"});

            }

        });

    } else {

        if (callback) {

            callback();

        } else {

            res.status(200).json({message: "Nothing done!"});

        }

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

function saveFacility(data, res) {

    console.log(data);

    if (data.datatype == "add_facility") {

        var sql = "";

        if (data.id) {

            sql = "UPDATE relocation_facility SET name='" + data.name + "',region = '" + data.region + "',district = '" + data.district +
                "',changed_by='" + data.user + "' WHERE facility_id =" + data.id;

        }
        else {

            sql = "INSERT INTO relocation_facility (name,region,district,created_by,date_created) VALUES('" + data.name + "','" + data.region +

                "','" + data.district + "','" + data.user + "',NOW())";
        }

        console.log(sql);

        queryRawStock(sql, function (batch) {

            res.status(200).json({message: "Facility Saved!", add_facility: data.name});

        });
    }

}


module.exports = function (router) {

    router.route("/")
        .get(function (req, res) {

            res.status(200).json({});

        });

    router.route('/get_pack_size/:id').get(function (req, res) {

        var packName = req.params.id;

        var sql = "SELECT in_multiples_of,recommended_test_time,window_test_time FROM stock WHERE stock.voided = 0 AND name = \"" + packName + "\"";

        queryRawStock(sql, function (data) {

            var json = {};

            console.log(data[0][0]);

            if (data[0].length > 0)
                json = {
                    limit: data[0][0].in_multiples_of,
                    id: packName,
                    rec_time: data[0][0].recommended_test_time,
                    window_time: data[0][0].window_test_time
                };

            res.status(200).json(json);

        })

    });

    router.route("/available_kits_by_desctiption/:description").get(function (req, res) {

        var description = req.params.description;

        var sql = "SELECT name, description FROM stock WHERE description ='" + description + "' ORDER BY stock_id ASC LIMIT 1";

        queryRawStock(sql, function (data) {

            var json = {};

            console.log(data[0][0]);

            if (data[0].length > 0)
                json = {description: data[0][0].description, name: data[0][0].name};

            res.status(200).json(json);

        })

    });

    router.route('/stock_list').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var pageSize = 10;

        var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

        var sql = "SELECT stock.stock_id, stock.name AS name, stock.description, category.name AS category_name, SUM(COALESCE(receipt_quantity,0)) " +
            "AS receipt_quantity, SUM(COALESCE(dispatch_quantity,0)) AS dispatch_quantity,stock.in_multiples_of, stock.reorder_level,stock.recommended_test_time, " +
            " stock.window_test_time, MIN(dispatch_datetime) AS min_dispatch_date, MAX(dispatch_datetime) AS max_dispatch_date, " +
            "DATEDIFF(MAX(dispatch_datetime), MIN(dispatch_datetime)) AS duration, last_order_size FROM stock LEFT OUTER " +
            "JOIN report ON stock.stock_id = report.stock_id LEFT OUTER JOIN category ON category.category_id = " +
            "stock.category_id WHERE COALESCE(report.voided,0) = 0 AND stock.voided = 0  GROUP BY stock.stock_id LIMIT " +
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
                    re_order_level: data[0][i].reorder_level,
                    avg: (data[0][i].duration > 0 ?
                        (data[0][i].dispatch_quantity / data[0][i].duration) : 0).toFixed(1),
                    receipt_quantity: data[0][i].receipt_quantity,
                    dispatch_quantity: data[0][i].dispatch_quantity,
                    last_order_size: data[0][i].last_order_size,
                    recommended_test_time: data[0][i].recommended_test_time,
                    window_test_time: data[0][i].window_test_time
                };

                collection.push(entry);

            }

            res.status(200).json(collection);

        })

    });

    router.route('/consumption_types').get(function (req, res) {

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

    router.route('/available_batches_to_user_summary').get(function (req, res) {

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

    router.route('/available_batches_to_user').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var exceptions = (query.exceptions ? JSON.parse(query.exceptions) : null);

        var sql = "SELECT item_name, report.batch_number, dispatch_id, receipt.expiry_date, (SUM(COALESCE(dispatch_quantity,0)) - " +
            "SUM(COALESCE(consumption_quantity,0))) AS available FROM stock LEFT OUTER JOIN report ON stock.stock_id = report.stock_id LEFT OUTER JOIN receipt ON report.batch_number " +
            " = receipt.batch_number WHERE COALESCE(report.batch_number,\"\") != \"\" AND item_name LIKE \"" +
            (query.item_name ? query.item_name : "") + "%\" AND COALESCE(dispatch_who_received,\"\") = \"" + query.userId +
            "\" AND report.batch_number LIKE \"" + (query.batch ? query.batch : "") + "%\" " + (exceptions ?
            " AND NOT item_name IN (\"" + exceptions.join("\", \"") + "\")" : "") + " AND stock.voided = 0 GROUP BY report.batch_number " +
            "HAVING available > 0 ORDER BY receipt.expiry_date ASC";

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
                    (!query.item_name ? data[0][i].item_name + ": " : "") + data[0][i].batch_number + " (" +
                    ((new Date(data[0][i].expiry_date)).format("dd/mm/YYYY")) + " - " +
                    data[0][i].available + ")" + "</li>";

            }

            res.send(result);

        })

    })

    router.route('/batch_numbers_to_user').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var exceptions = (query.exceptions ? JSON.parse(query.exceptions) : null);

        var sql = "SELECT item_name, report.batch_number, dispatch_id, receipt.expiry_date, (SUM(COALESCE(dispatch_quantity,0)) - " +
            "SUM(COALESCE(consumption_quantity,0))) AS available FROM report LEFT OUTER JOIN receipt ON report.batch_number " +
            " = receipt.batch_number WHERE COALESCE(report.batch_number,\"\") != \"\" AND item_name LIKE \"" +
            (query.item_name ? query.item_name : "") + "%\" AND COALESCE(dispatch_who_received,\"\") = \"" + query.userId +
            "\" AND report.batch_number LIKE \"" + (query.batch ? query.batch : "") + "%\" " + (exceptions ?
            " AND NOT item_name IN (\"" + exceptions.join("\", \"") + "\")" : "") + "  AND stock.voided = 0 GROUP BY report.batch_number " +
            "HAVING available > 0 ORDER BY receipt.expiry_date ASC";

        console.log(sql);

        queryRawStock(sql, function (data) {

            var result = {};

            for (var i = 0; i < data[0].length; i++) {

                result[data[0][i].batch_number] = data[0][i].item_name;

            }

            res.send(result);

        })

    })

    router.route('/available_batches').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var sql = "SELECT batch_number, expiry_date, (SUM(COALESCE(receipt_quantity,0)) - SUM(COALESCE(dispatch_quantity,0))) " +
            "AS available FROM stock LEFT OUTER JOIN report ON stock.stock_id = report.stock_id WHERE COALESCE(batch_number,'') != '' AND item_name = '" +
            query.item_name + "' AND batch_number LIKE '" + (query.batch ? query.batch : "") + "%'  AND stock.voided = 0 GROUP BY batch_number " +
            "HAVING available > 0 ORDER BY expiry_date ASC";

        console.log(sql)

        queryRawStock(sql, function (data) {

            var collection = [];

            console.log(data[0]);

            var result = "";

            for (var i = 0; i < data[0].length; i++) {

                result += "<li tstValue='" + data[0][i].batch_number + "' available='" + data[0][i].available + "'>" +
                    data[0][i].batch_number + " (" +
                    ((new Date(data[0][i].expiry_date)).format("dd/mm/YYYY")) + " - " +
                    data[0][i].available + ")" + "</li>";

            }

            res.send(result);

        })

    })

    router.route('/stock_categories').get(function (req, res) {

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

    router.route('/stock_items').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var exceptions = (query.exceptions ? JSON.parse(query.exceptions) : null);

        var description = (query.description ? " AND stock.description ='" + query.description + "'" : "");

        var sql = "SELECT stock.name FROM stock LEFT OUTER JOIN category ON stock.category_id = category.category_id WHERE " +
            "category.name = '" + query.category + "' AND stock.voided = 0 AND stock.name LIKE '" + query.item_name + "%'" + description +
            (exceptions ? " AND NOT stock.name IN (\"" + exceptions.join("\", \"") + "\")" : "");

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

    router.route('/items_list').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var sql = "SELECT stock.stock_id, stock.name FROM stock WHERE stock.voided = 0 AND stock.name LIKE '" + query.item_name + "%'";

        queryRawStock(sql, function (data) {

            console.log(data[0]);

            var result = "";

            for (var i = 0; i < data[0].length; i++) {

                result += "<li tstValue='" + data[0][i].stock_id + "'>" + data[0][i].name + "</li>";

            }

            res.send(result);

        })

    })

    router.route('/stock_search').get(function (req, res) {

        var url_parts = url.parse(req.url, true);

        var query = url_parts.query;

        var pageSize = 10;

        var lowerLimit = (query.page ? (((parseInt(query.page) - 1) * pageSize)) : 0);

        var sql = "SELECT stock.stock_id, stock.name AS item_name, stock.description, category.name AS category_name, SUM(COALESCE(receipt_quantity,0)) " +
            "AS receipt_quantity, SUM(COALESCE(dispatch_quantity,0)) AS dispatch_quantity,stock.in_multiples_of, stock.reorder_level, " +
            "stock.recommended_test_time, MIN(dispatch_datetime) AS min_dispatch_date, MAX(dispatch_datetime) AS max_dispatch_date, " +
            "DATEDIFF(MAX(dispatch_datetime),stock.window_test_time, MIN(dispatch_datetime)) AS duration, last_order_size FROM stock LEFT OUTER " +
            "JOIN report ON stock.stock_id = report.stock_id LEFT OUTER JOIN category ON category.category_id = " +
            "stock.category_id WHERE COALESCE(report.voided,0) = 0 " + (query.category && query.item_name ?
            "AND category.name = '" + query.category + "' AND COALESCE(report.voided,0) = 0 AND stock.voided = 0 AND stock.name = '" +
            query.item_name + "'" : "") + " GROUP BY stock.stock_id LIMIT " +
            lowerLimit + ", " + pageSize;

        console.log(sql);

        queryRawStock(sql, function (data) {

            var collection = [];

            console.log(data[0]);

            for (var i = 0; i < data[0].length; i++) {

                var entry = {
                    stock_id: data[0][i].stock_id,
                    name: data[0][i].item_name,
                    category: data[0][i].category_name,
                    description: data[0][i].description,
                    inStock: (parseInt(data[0][i].receipt_quantity) - parseInt(data[0][i].dispatch_quantity)),
                    last_order_size: (data[0][i].last_order_size ? data[0][i].last_order_size : 0),
                    avg: (data[0][i].duration > 0 ?
                        (data[0][i].dispatch_quantity / data[0][i].duration) : 0).toFixed(1),
                    re_order_level: data[0][i].reorder_level,
                    last_order_size: data[0][i].last_order_size,
                    recommended_test_time: data[0][i].recommended_test_time,
                    window_test_time: data[0][i].window_test_time
                }

                collection.push(entry);

            }

            // var collection = (categories[query.category] || []);

            res.status(200).json(collection);

        })

    })


    router.route('/delete_item').post(function (req, res) {

        var data = req.body.data;

        loggedIn(data.token, function (authentic, user_id, username) {

            if (!authentic) {

                return res.status(200).json({message: "Unauthorized access!"});

            }

            var sql = "UPDATE stock SET stock.voided = 1 WHERE stock_id = '" + data.stock_id + "'";

            console.log(sql);

            queryRawStock(sql, function (data) {

                console.log(data);

                return res.status(200).json({message: "Item deleted!"});

            })

        });

    })

    router.route('/save_item').post(function (req, res) {

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

                case "reverse_consumption":

                    reverseConsumption(data, res);

                    break;

                case "add_facility" :

                    saveFacility(data, res);

                    break;

            }

        });

    })


    return router;

}
