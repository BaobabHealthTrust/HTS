var url = require('url');

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

var knexStock = require('knex')({
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

function queryRaw(sql, callback) {

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

	knexStock.raw(sql)
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


	     router.route('/report_q_sex_pregnancy_m').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(sex_pregnancy) AS total FROM htc_report WHERE COALESCE(sex_pregnancy,'') = 'M' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_sex_pregnancy_fnp').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(sex_pregnancy) AS total FROM htc_report WHERE COALESCE(sex_pregnancy,'') = 'FNP' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_sex_pregnancy_fp').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(sex_pregnancy) AS total FROM htc_report WHERE COALESCE(sex_pregnancy,'') = 'FP' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_last_hiv_test_lnev').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Never Tested' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_last_hiv_test_ln').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Negative' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_last_hiv_test_lp').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Positive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_last_hiv_test_lex').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Exposed Infant' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_last_hiv_test_lin').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(last_hiv_test) AS total FROM htc_report WHERE COALESCE(last_hiv_test,'') = 'Last Inconclusive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_outcome_summary_n').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Single Negative' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_outcome_summary_p').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Single Positive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_outcome_summary_t12n').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Test 1 & Test 2 Negative' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_outcome_summary_t12p').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Test 1 & Test 2 Positive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_outcome_summary_t12d').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(outcome_summary) AS total FROM htc_report WHERE COALESCE(outcome_summary,'') = 'Test 1 & Test 2 Discordant' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_age_group_0_11m').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '0-11 months' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_age_group_1_14y').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '1-14 years' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_age_group_15_24y').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '15-24 years' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_age_group_25p').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(age_group) AS total FROM htc_report WHERE COALESCE(age_group,'') = '25+ years' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_partner_present_yes').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(partner_present) AS total FROM htc_report WHERE COALESCE(partner_present,'') = 'Yes' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_partner_present_no').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(partner_present) AS total FROM htc_report WHERE COALESCE(partner_present,'') = 'No' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_result_given_to_client_nn').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Negative' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_result_given_to_client_np').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Positive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_result_given_to_client_nex').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Exposed Infant' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_result_given_to_client_ni').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'New Inconclusive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_result_given_to_client_cp').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'Confirmatory Positive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_result_given_to_client_in').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(result_given_to_client) AS total FROM htc_report WHERE COALESCE(result_given_to_client,'') = 'Confirmatory Inconclusive' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_partner_htc_slips_given_slips').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT SUM(partner_htc_slips_given) AS total FROM htc_report WHERE COALESCE(partner_htc_slips_given,'') != '' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_htc_access_type_pitc').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(htc_access_type) AS total FROM htc_report WHERE COALESCE(htc_access_type,'') = 'Routine HTS (PITC) within Health Service' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_htc_access_type_frs').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(htc_access_type) AS total FROM htc_report WHERE COALESCE(htc_access_type,'') = 'Comes with HTS Family Reference Slip' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/report_q_htc_access_type_vct').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT COUNT(htc_access_type) AS total FROM htc_report WHERE COALESCE(htc_access_type,'') = 'Other (VCT, etc.)' " +
		        (query.start_date ? " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : "") +
		        (query.end_date ? " AND DATE(obs_datetime) <= DATE('" + query.end_date + "')" : "");

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var total = data[0] && (data[0][0] ? data[0][0].total : 0);

		        console.log(total);

		        res.status(200).json({count: total});

		    });

		})

		router.route('/relationship_types').get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT relationship_type_id, CONCAT(a_is_to_b, ' - ', b_is_to_a) AS relation FROM relationship_type " +
		        "WHERE CONCAT(a_is_to_b, ' -> ', b_is_to_a) LIKE '" + query.type + "%' AND a_is_to_b IN ('Sibling', 'Parent', " +
		        "'Aunt/Uncle', 'Child', 'Spouse/Partner', 'Other')";

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var result = "";

		        for (var i = 0; i < data[0].length; i++) {

		            result += "<li>" + data[0][i].relation + "</li>";

		        }

		        res.send(result);

		    });

		})

		router.route("/user_stats").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT user_id, " + query.field + ", COUNT(obs_id) AS total FROM htc_report WHERE COALESCE(" +
		        query.field + ", '') != '' AND " + query.field + " = '" + query.value + "' AND user_id = (SELECT user_id " +
		        "FROM users WHERE username = '" + query.username + "') " + (query.start_date && query.end_date ?
                " AND DATE(obs_datetime) >= DATE('" + query.start_date + "')" : (query.start_date ? " AND DATE(obs_datetime) = DATE('" +
                query.start_date + "')" : "")) + "" + (query.end_date ? " AND DATE(obs_datetime) <= DATE('" +
		        query.end_date + "')" : "") + " GROUP BY " + query.field + ", user_id";

			console.log("###########################");

		    console.log(sql);

			console.log("###########################");

		    queryRaw(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].total;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/stock_types").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT name FROM stock  WHERE stock.voided = 0";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = [];

		        if (data[0].length > 0) {

		            for (var i = 0; i < data[0].length; i++) {

		                result.push(data[0][i].name);

		            }

		        }

		        res.status(200).json(result);

		    });

		})

		router.route("/used_stock_stats").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var username_filter = (query.username? "AND username ='"+query.username+"'":"")

		    var group_filter = (query.username? "item_name, username":"item_name")

		    var sql = "SELECT item_name, username, SUM(COALESCE(consumption_quantity,0)) " +
		        "AS used FROM report WHERE COALESCE(batch_number,'') != '' AND item_name = '" + query.item_name +
		        "'" + username_filter + " " + (query.start_date ? " AND DATE(transaction_date) >= DATE('" +
		        query.start_date + "')" : "") + "" + (query.end_date ? " AND DATE(transaction_date) <= DATE('" +
		        query.end_date + "')" : "") + " GROUP BY  " + group_filter;

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].used;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/available_stock_stats").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var username_filter = (query.username? "AND username ='"+query.username+"'":"")

		    var group_filter = (query.username? "item_name, username":"item_name")

		    var sql = "SELECT item_name, username, (SUM(COALESCE(dispatch_quantity,0)) - SUM(COALESCE(consumption_quantity,0))) " +
		        "AS available FROM report WHERE COALESCE(batch_number,'') != '' AND item_name = '" + query.item_name +
		        "' " + username_filter + " " + (query.start_date ? " AND DATE(transaction_date) >= DATE('" +
		        query.start_date + "')" : "") + "" + (query.end_date ? " AND DATE(transaction_date) <= DATE('" +
		        query.end_date + "')" : "") + " GROUP BY  " + group_filter +
		        " HAVING available > 0";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].available;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route('/test_1_kit_name').get(function(req, res){

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    console.log(query);

		    var sql = "SELECT DISTINCT value_text FROM obs WHERE obs.concept_id = (SELECT concept_id FROM concept_name " +
		        "WHERE name = 'First Pass Test Kit 1 Name'" + (query.start_date ? " AND DATE(obs_datetime) >= DATE('" +
		        query.start_date + "')" : "") + "" + (query.end_date ? " AND DATE(obs_datetime) <= DATE('" +
		        query.end_date + "')" : "") + " LIMIT 1) LIMIT 1";

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var result = "";

		        if (data[0].length > 0) {

		            result = data[0][0].value_text;

		        }

		        res.status(200).json({name: result});

		    });

		})

		router.route('/test_2_kit_name').get(function(req, res){

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT DISTINCT value_text FROM obs WHERE obs.concept_id = (SELECT concept_id FROM concept_name " +
		        "WHERE name = 'First Pass Test Kit 2 Name'" + (query.start_date ? " AND DATE(obs_datetime) >= DATE('" +
		        query.start_date + "')" : "") + "" + (query.end_date ? " AND DATE(obs_datetime) <= DATE('" +
		        query.end_date + "')" : "") + " LIMIT 1) LIMIT 1";

		    console.log(sql);

		    queryRaw(sql, function (data) {

		        var result = "";

		        if (data[0].length > 0) {

		            result = data[0][0].value_text;

		        }

		        res.status(200).json({name: result});

		    });

		})

		router.route("/total_in_rooms_at_month_start").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT item_name, (SUM(COALESCE(receipt_quantity,0)) - SUM(COALESCE(consumption_quantity,0))) " +
		        "AS available FROM report WHERE COALESCE(batch_number,'') != '' AND item_name = '" + query.item_name +
		        "' " + (query.end_date ? " AND DATE(transaction_date) <= DATE('" + query.end_date + "')" : "") +
		        " GROUP BY item_name HAVING available > 0";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].available;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/total_tests_received_during_month").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT item_name, SUM(receipt_quantity) AS received_quantity FROM report WHERE COALESCE(receipt_quantity,0) " +
		        "> 0 AND item_name = '" + query.item_name + "' " + (query.start_date ? " AND DATE(transaction_date) >= DATE('" +
		        query.start_date + "')" : "") +  (query.end_date ? " AND DATE(transaction_date) <= DATE('" + query.end_date +
		        "')" : "") + " GROUP BY item_name";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].received_quantity;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/total_tests_used_for_testing_clients").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT item_name, COUNT(consumption_type) AS total FROM report WHERE COALESCE(consumption_type,'') = " +
		        "'Normal use' AND item_name = '" + query.item_name + "' " + (query.start_date ? " AND DATE(transaction_date) >= DATE('" +
		        query.start_date + "')" : "") + (query.end_date ? " AND DATE(transaction_date) <= " +
		        "DATE('" + query.end_date + "')" : "") + " GROUP BY item_name";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].total;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/total_other_tests").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT item_name, COUNT(consumption_type) AS total FROM report WHERE COALESCE(consumption_type,'') " +
		        "NOT IN ('Normal use', 'Disposal') AND item_name = '" + query.item_name + "' "  + (query.start_date ?
		        " AND DATE(transaction_date) >= DATE('" + query.start_date + "')" : "")+ (query.end_date ?
		        " AND DATE(transaction_date) <= DATE('" + query.end_date + "')" : "") + " GROUP BY item_name";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].total;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/total_disposals").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT item_name, COUNT(consumption_type) AS total FROM report WHERE COALESCE(consumption_type,'') " +
		        "IN ('Disposal', 'Expired') AND item_name = '" + query.item_name + "' " + (query.start_date ?
		        " AND DATE(transaction_date) >= DATE('" + query.start_date + "')" : "") + (query.end_date ?
		        " AND DATE(transaction_date) <= DATE('" + query.end_date + "')" : "") + " GROUP BY item_name";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].total;

		        }

		        res.status(200).json({total: result});

		    });

		})

		router.route("/total_in_rooms_at_month_end").get(function (req, res) {

		    var url_parts = url.parse(req.url, true);

		    var query = url_parts.query;

		    var sql = "SELECT item_name, (SUM(COALESCE(dispatch_quantity,0)) - SUM(COALESCE(consumption_quantity,0))) " +
		        "AS available FROM report WHERE COALESCE(batch_number,'') != '' AND item_name = '" + query.item_name +
		        "' " + (query.end_date ? " AND DATE(transaction_date) <= DATE('" + query.end_date + "')" : "") +
		        " GROUP BY item_name HAVING available > 0";

		    console.log(sql);

		    queryRawStock(sql, function (data) {

		        var result = 0;

		        if (data[0].length > 0) {

		            result = data[0][0].available;

		        }

		        res.status(200).json({total: result});

		    });

		})


    return router;

}
