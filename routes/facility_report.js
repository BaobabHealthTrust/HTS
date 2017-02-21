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

        updateTotals: function (category) {

            if (!dom.htcReport[category])
                return;

            var keys = Object.keys(dom.htcReport[category]);

            keys.splice(keys.indexOf("total"), 1);

            var sum = 0;

            for (var i = 0; i < keys.length; i++) {

                var key = keys[i];

                sum += parseInt(dom.htcReport[category][key]);

            }

            if (dom.__$(category)) {

                dom.__$(category).innerHTML = sum;

            }

            if (sum > 0) {

                dom.greaterThanZero = true;

            }

            if (dom.__$("lblClientsServed") && dom.greaterThanZero) {

                dom.__$("lblClientsServed").innerHTML = "Yes";

            }

        },

        updateStockTotals: function (category) {

            if (!dom.htcStockReport[category])
                return;


            var sum = 0;

            sum = dom.htcStockReport[category].opening + dom.htcStockReport[category].receipts;

            var balance = sum - dom.htcStockReport[category].clients - dom.htcStockReport[category].other - dom.htcStockReport[category].losses;

            var difference = balance - dom.htcStockReport[category].closing;

            if (dom.__$(category + "_balance")) {

                dom.__$(category + "_balance").innerHTML = numberWithCommas(balance);

            }

            if (dom.__$(category + "_difference")) {

                dom.__$(category + "_difference").innerHTML = numberWithCommas(difference);

            }

        },

        loadFields: function (host, win, gYear, gMonth, callback) {

            dom.host = host;

            dom.window = win;

            dom.greaterThanZero = false;

            if (dom.__$("lblClientsServed") && !dom.greaterThanZero) {

                dom.__$("lblClientsServed").innerHTML = "No";

            }

            var months = {
                "01": "January",
                "02": "February",
                "03": "March",
                "04": "April",
                "05": "May",
                "06": "June",
                "07": "July",
                "08": "August",
                "09": "September",
                "10": "October",
                "11": "November",
                "12": "December",
                "": "&nbsp;"
            }

            if (dom.__$("lblYear")) {

                dom.__$("lblYear").innerHTML = (gYear ? gYear : "&nbsp;");

            }

            if (dom.__$("lblMonth")) {

                dom.__$("lblMonth").innerHTML = months[(gMonth ? gMonth : "")];

            }

            if (dom.__$("month-year")) {

                dom.__$("month-year").innerHTML = months[(gMonth ? gMonth : "")] + "<br/>" + (gYear ? gYear : "&nbsp;");

            }

            var month = (gMonth ? gMonth : padZeros((new Date()).getMonth(), 2));

            var year = (gYear ? gYear : (new Date()).getFullYear());

            var startDate = (year + "-" + month + "-01");

            var lastDate = {
                "01": 31,
                "02": (leapYear(year) ? 29 : 28),
                "03": 31,
                "04": 30,
                "05": 31,
                "06": 30,
                "07": 31,
                "08": 31,
                "09": 30,
                "10": 31,
                "11": 30,
                "12": 31
            }

            var endDate = (year + "-" + month + "-" + lastDate[month]);

            dom.htcReport = {
                "sex_pregnancy": {total: 0},
                "age_group": {total: 0},
                "htc_access_type": {total: 0},
                "last_hiv_test": {total: 0},
                "partner_present": {total: 0},
                "outcome_summary": {total: 0},
                "result_given_to_client": {total: 0}
            };

            var stockStartDate = (new Date(year + "-" + month + "-01"));

            stockStartDate = (new Date(stockStartDate.setMonth(stockStartDate.getMonth() - 6))).format("YYYY-mm-dd");

            var lastDate = {
                "01": 31,
                "02": (leapYear(year) ? 29 : 28),
                "03": 31,
                "04": 30,
                "05": 31,
                "06": 30,
                "07": 31,
                "08": 31,
                "09": 30,
                "10": 31,
                "11": 30,
                "12": 31
            }

            var stockEndDate = (year + "-" + month + "-" + lastDate[month]);

            var testKit1Name, testKit2Name;

            async.series([

                function (iCallback) {

                    dom.ajaxRequest("/facility", function (json) {

                        console.log(json);

                        if (dom.__$("lblFacility")) {

                            dom.__$("lblFacility").innerHTML = json.facility;

                        }

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/location", function (json) {

                        if (dom.__$("lblLocation")) {

                            dom.__$("lblLocation").innerHTML = json.location;

                        }

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_sex_pregnancy_m?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("M")) {

                            dom.__$("M").innerHTML = json.count;

                        }

                        dom.htcReport.sex_pregnancy["M"] = json.count;

                        dom.updateTotals("sex_pregnancy");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_sex_pregnancy_fnp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("FNP")) {

                            dom.__$("FNP").innerHTML = json.count;

                        }

                        dom.htcReport.sex_pregnancy["FNP"] = json.count;

                        dom.updateTotals("sex_pregnancy");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_sex_pregnancy_fp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("FP")) {

                            dom.__$("FP").innerHTML = json.count;

                        }

                        dom.htcReport.sex_pregnancy["FP"] = json.count;

                        dom.updateTotals("sex_pregnancy");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_last_hiv_test_lnev?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("LNEV")) {

                            dom.__$("LNEV").innerHTML = json.count;

                        }

                        dom.htcReport.last_hiv_test["LNEV"] = json.count;

                        dom.updateTotals("last_hiv_test");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_last_hiv_test_ln?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("LN")) {

                            dom.__$("LN").innerHTML = json.count;

                        }

                        dom.htcReport.last_hiv_test["LN"] = json.count;

                        dom.updateTotals("last_hiv_test");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_last_hiv_test_lp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("LP")) {

                            dom.__$("LP").innerHTML = json.count;

                        }

                        dom.htcReport.last_hiv_test["LP"] = json.count;

                        dom.updateTotals("last_hiv_test");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_last_hiv_test_lex?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("LEX")) {

                            dom.__$("LEX").innerHTML = json.count;

                        }

                        dom.htcReport.last_hiv_test["LEX"] = json.count;

                        dom.updateTotals("last_hiv_test");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_last_hiv_test_lin?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("LIN")) {

                            dom.__$("LIN").innerHTML = json.count;

                        }

                        dom.htcReport.last_hiv_test["LIN"] = json.count;

                        dom.updateTotals("last_hiv_test");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_outcome_summary_n?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("N")) {

                            dom.__$("N").innerHTML = json.count;

                        }

                        dom.htcReport.outcome_summary["N"] = json.count;

                        dom.updateTotals("outcome_summary");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_outcome_summary_p?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("P")) {

                            dom.__$("P").innerHTML = json.count;

                        }

                        dom.htcReport.outcome_summary["P"] = json.count;

                        dom.updateTotals("outcome_summary");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_outcome_summary_t12n?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("T12N")) {

                            dom.__$("T12N").innerHTML = json.count;

                        }

                        dom.htcReport.outcome_summary["T12N"] = json.count;

                        dom.updateTotals("outcome_summary");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_outcome_summary_t12p?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("T12P")) {

                            dom.__$("T12P").innerHTML = json.count;

                        }

                        dom.htcReport.outcome_summary["T12P"] = json.count;

                        dom.updateTotals("outcome_summary");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_outcome_summary_t12d?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("T12D")) {

                            dom.__$("T12D").innerHTML = json.count;

                        }

                        dom.htcReport.outcome_summary["T12D"] = json.count;

                        dom.updateTotals("outcome_summary");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_age_group_0_11m?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("0_11M")) {

                            dom.__$("0_11M").innerHTML = json.count;

                        }

                        dom.htcReport.age_group["0_11M"] = json.count;

                        dom.updateTotals("age_group");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_age_group_1_14y?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("1_14Y")) {

                            dom.__$("1_14Y").innerHTML = json.count;

                        }

                        dom.htcReport.age_group["1_14Y"] = json.count;

                        dom.updateTotals("age_group");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_age_group_15_24y?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("15_24Y")) {

                            dom.__$("15_24Y").innerHTML = json.count;

                        }

                        dom.htcReport.age_group["15_24Y"] = json.count;

                        dom.updateTotals("age_group");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_age_group_25p?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("25P")) {

                            dom.__$("25P").innerHTML = json.count;

                        }

                        dom.htcReport.age_group["25P"] = json.count;

                        dom.updateTotals("age_group");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_partner_present_yes?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("PPY")) {

                            dom.__$("PPY").innerHTML = json.count;

                        }

                        dom.htcReport.partner_present["PPY"] = json.count;

                        dom.updateTotals("partner_present");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_partner_present_no?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("PPN")) {

                            dom.__$("PPN").innerHTML = json.count;

                        }

                        dom.htcReport.partner_present["PPN"] = json.count;

                        dom.updateTotals("partner_present");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_result_given_to_client_nn?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("RGTCNN")) {

                            dom.__$("RGTCNN").innerHTML = json.count;

                        }

                        dom.htcReport.result_given_to_client["RGTCNN"] = json.count;

                        dom.updateTotals("result_given_to_client");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_result_given_to_client_np?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("RGTCNP")) {

                            dom.__$("RGTCNP").innerHTML = json.count;

                        }

                        dom.htcReport.result_given_to_client["RGTCNP"] = json.count;

                        dom.updateTotals("result_given_to_client");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_result_given_to_client_nex?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("RGTCNEX")) {

                            dom.__$("RGTCNEX").innerHTML = json.count;

                        }

                        dom.htcReport.result_given_to_client["RGTCNEX"] = json.count;

                        dom.updateTotals("result_given_to_client");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_result_given_to_client_ni?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("RGTCNI")) {

                            dom.__$("RGTCNI").innerHTML = json.count;

                        }

                        dom.htcReport.result_given_to_client["RGTCNI"] = json.count;

                        dom.updateTotals("result_given_to_client");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_result_given_to_client_cp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("RGTCCP")) {

                            dom.__$("RGTCCP").innerHTML = json.count;

                        }

                        dom.htcReport.result_given_to_client["RGTCCP"] = json.count;

                        dom.updateTotals("result_given_to_client");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_result_given_to_client_in?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("RGTCIN")) {

                            dom.__$("RGTCIN").innerHTML = json.count;

                        }

                        dom.htcReport.result_given_to_client["RGTCIN"] = json.count;

                        dom.updateTotals("result_given_to_client");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_partner_htc_slips_given_slips?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("PHSG")) {

                            dom.__$("PHSG").innerHTML = json.count;

                        }

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_htc_access_type_pitc?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("PITC")) {

                            dom.__$("PITC").innerHTML = json.count;

                        }

                        dom.htcReport.htc_access_type["PITC"] = json.count;

                        dom.updateTotals("htc_access_type");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_htc_access_type_frs?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("FRS")) {

                            dom.__$("FRS").innerHTML = json.count;

                        }

                        dom.htcReport.htc_access_type["FRS"] = json.count;

                        dom.updateTotals("htc_access_type");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/report_q_htc_access_type_vct?start_date=" + startDate + "&end_date=" + endDate, function (json) {

                        if (dom.__$("VCT")) {

                            dom.__$("VCT").innerHTML = json.count;

                        }

                        dom.htcReport.htc_access_type["VCT"] = json.count;

                        dom.updateTotals("htc_access_type");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/test_1_kit_name?start_date=" + stockStartDate + "&end_date=" + stockEndDate, function (json) {

                        if (dom.__$("test_1_kit_name")) {

                            dom.__$("test_1_kit_name").innerHTML = json.name;

                            testKit1Name = json.name;

                        }

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_in_rooms_at_month_start?start_date=" + stockStartDate + "&end_date=" + startDate + "&item_name=" +
                        encodeURIComponent(testKit1Name), function (json) {

                        if (dom.__$("test_1_opening")) {

                            dom.__$("test_1_opening").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_1.opening = json.total;

                        dom.updateStockTotals("test_1");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_tests_received_during_month?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit1Name), function (json) {

                        if (dom.__$("test_1_receipts")) {

                            dom.__$("test_1_receipts").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_1.receipts = json.total;

                        dom.updateStockTotals("test_1");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_tests_used_for_testing_clients?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit1Name), function (json) {

                        if (dom.__$("test_1_used_for_clients")) {

                            dom.__$("test_1_used_for_clients").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_1.clients = json.total;

                        dom.updateStockTotals("test_1");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_other_tests?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit1Name), function (json) {

                        if (dom.__$("test_1_for_other")) {

                            dom.__$("test_1_for_other").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_1.other = json.total;

                        dom.updateStockTotals("test_1");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_disposals?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit1Name), function (json) {

                        if (dom.__$("test_1_disposals")) {

                            dom.__$("test_1_disposals").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_1.losses = json.total;

                        dom.updateStockTotals("test_1");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_in_rooms_at_month_end?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit1Name), function (json) {

                        if (dom.__$("test_1_in_rooms")) {

                            dom.__$("test_1_in_rooms").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_1.closing = json.total;

                        dom.updateStockTotals("test_1");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/test_2_kit_name?start_date=" + stockStartDate + "&end_date=" + stockEndDate, function (json) {

                        if (dom.__$("test_2_kit_name")) {

                            dom.__$("test_2_kit_name").innerHTML = json.name;

                            testKit2Name = json.name;

                        }

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_in_rooms_at_month_start?start_date=" + stockStartDate + "&end_date=" + startDate + "&item_name=" +
                        encodeURIComponent(testKit2Name), function (json) {

                        if (dom.__$("test_2_opening")) {

                            dom.__$("test_2_opening").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_2.opening = json.total;

                        dom.updateStockTotals("test_2");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_tests_received_during_month?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit2Name), function (json) {

                        if (dom.__$("test_2_receipts")) {

                            dom.__$("test_2_receipts").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_2.receipts = json.total;

                        dom.updateStockTotals("test_2");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_tests_used_for_testing_clients?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit2Name), function (json) {

                        if (dom.__$("test_2_used_for_clients")) {

                            dom.__$("test_2_used_for_clients").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_2.clients = json.total;

                        dom.updateStockTotals("test_2");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_other_tests?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit2Name), function (json) {

                        if (dom.__$("test_2_for_other")) {

                            dom.__$("test_2_for_other").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_2.other = json.total;

                        dom.updateStockTotals("test_2");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_disposals?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit2Name), function (json) {

                        if (dom.__$("test_2_disposals")) {

                            dom.__$("test_2_disposals").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_2.losses = json.total;

                        dom.updateStockTotals("test_2");

                        iCallback();

                    });

                },

                function (iCallback) {

                    dom.ajaxRequest("/reports/total_in_rooms_at_month_end?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
                        encodeURIComponent(testKit2Name), function (json) {

                        if (dom.__$("test_2_in_rooms")) {

                            dom.__$("test_2_in_rooms").innerHTML = numberWithCommas(json.total);

                        }

                        dom.htcStockReport.test_2.closing = json.total;

                        dom.updateStockTotals("test_2");

                        iCallback();

                    });

                }

            ], function (err) {

                if (err)
                    console.log(err.message);

                if (callback)
                    callback();

            })

        }

    });

    router.route("/site_report")
        .get(function (req, res) {

            var url = require("url");

            var query = url.parse(req.url, true).query;

            var path = require("path");

            var fs = require("fs");

            var jsdom = require("jsdom");

            var template = fs.readFileSync(path.resolve("./public/views/site_report_template.html"), "utf-8")

            jsdom.env(template, [], function (err, window) {

                var host = req.headers.host;

                dom.loadFields(host, window, query.year, query.month, function () {

                    res.send(window.document.defaultView.document.documentElement.outerHTML);

                })

            });

        });

    return router;

}
