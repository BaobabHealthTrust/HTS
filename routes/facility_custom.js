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

module.exports = function (router) {

    router.route("/")
        .get(function (req, res) {

            res.status(200).json({});

        });

     router.route("/facilities").get(function(req, res){

	    var url_parts = url.parse(req.url, true);

	    var query = url_parts.query;

	    console.log(__dirname + "/../public/data/facilities.json");

	    var facilities = require(__dirname + "/../public/data/facilities.json");

	    var results = [];

	    for(var i = 0; i < facilities.length; i++) {

	        var facility = facilities[i];

	        if(facility.toLowerCase().match("^" + query.name.toLowerCase())) {

	            results.push(facility);

	        }

	    }

	    var sql = "SELECT name FROM relocation_facility";

	    queryRawStock(sql, function (data) {

	        for (var i = 0; i < data[0].length; i++) {

	            if (!data[0][i].name)
	                continue;

	            results.push(data[0][i].name)


	        }

	        res.send("<li>" + results.join("</li><li>") + "</li>");

	    })

	});

	router.route("/relocation_facility_list").get(function(req, res){

	    var sql = "SELECT * FROM relocation_facility";

	    queryRawStock(sql, function (data) {

	        var results = []

	        for (var i = 0; i < data[0].length; i++) {

	            if (!data[0][i].name)
	                continue;

	            var entry = {
	                            id: data[0][i].facility_id,
	                            name: data[0][i].name,
	                            region : data[0][i].region,
	                            district: data[0][i].district


	            }

	            results.push(entry)


	        }

	        res.send(results);

	    })

	});

	router.route("/delete_facility").post(function(req,res){

    var data = req.body.data;

	    var sql = "DELETE FROM relocation_facility WHERE facility_id ="+data.id ;


	    queryRawStock(sql, function (batch) {

	                res.status(200).json({message: "Facility Deleted!"});

	    });

	});

    return router;

}
