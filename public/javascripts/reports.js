/**
 * Created by chimwemwe on 6/14/16.
 */

var htcReport = {};
var htcStockReport = {};
var greaterThanZero = false;

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

function ajaxRequest(url, callback) {

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {

        if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
            httpRequest.status == 304)) {

            if (httpRequest.responseText.trim().length > 0) {
                var result = JSON.parse(httpRequest.responseText);

                callback(result);

            } else {

                callback(undefined);

            }

        }

    };
    try {
        httpRequest.open("GET", url, true);
        httpRequest.send(null);
    } catch (e) {
    }

}

function __$(id) {

    return document.getElementById(id);

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

function leapYear(year) {

    var yr = parseInt(year);

    var result = ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);

    return result;

}

function loadFields() {

    greaterThanZero = false;

    if (__$("lblClientsServed") && !greaterThanZero) {

        __$("lblClientsServed").innerHTML = "No";

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

    var mYear = window.location.href.match(/year\=([^&]+)/i);

    var mMonth = window.location.href.match(/month\=([^&]+)/i);

    if (!mYear && !mMonth) {

        if (__$("lblYear")) {

            __$("lblYear").innerHTML = (window.parent.__$("year") ? window.parent.__$("year").value : "&nbsp;");

        }

        if (__$("lblMonth")) {

            __$("lblMonth").innerHTML = months[(window.parent.__$("month") ? window.parent.__$("month").value : "")];

        }

        if (__$("month-year")) {

            __$("month-year").innerHTML = months[(window.parent.__$("month") ? window.parent.__$("month").value : "")] +
                "<br/>" + (window.parent.__$("year") ? window.parent.__$("year").value : "&nbsp;");

        }

        var month = (window.parent.__$("month") ? window.parent.__$("month").value : padZeros((new Date()).getMonth(), 2));

        var year = (window.parent.__$("year") ? window.parent.__$("year").value : (new Date()).getFullYear());

    } else {

        if (__$("lblYear")) {

            __$("lblYear").innerHTML = (mYear ? mYear[1] : "&nbsp;");

        }

        if (__$("lblMonth")) {

            __$("lblMonth").innerHTML = months[(mMonth ? mMonth[1] : "")];

        }

        if (__$("month-year")) {

            __$("month-year").innerHTML = months[(mMonth ? mMonth[1] : "")] + "<br/>" + (mYear ? mYear[1] : "&nbsp;");

        }

        var month = (mMonth ? mMonth[1] : padZeros((new Date()).getMonth(), 2));

        var year = (mYear ? mYear[1] : (new Date()).getFullYear());

    }


    ajaxRequest("/facility", function (json) {

        if (__$("lblFacility")) {

            __$("lblFacility").innerHTML = json.facility;

        }

    });

    ajaxRequest("/location", function (json) {

        if (__$("lblLocation")) {

            __$("lblLocation").innerHTML = json.location;

        }

    });

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

    htcReport = {
        "sex_pregnancy": {total: 0},
        "age_group": {total: 0},
        "htc_access_type": {total: 0},
        "last_hiv_test": {total: 0},
        "partner_present": {total: 0},
        "outcome_summary": {total: 0},
        "result_given_to_client": {total: 0}
    };

    ajaxRequest("/reports/report_q_sex_pregnancy_m?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("M")) {

            __$("M").innerHTML = json.count;

        }

        htcReport.sex_pregnancy["M"] = json.count;

        updateTotals("sex_pregnancy");

    });

    ajaxRequest("/reports/report_q_sex_pregnancy_fnp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("FNP")) {

            __$("FNP").innerHTML = json.count;

        }

        htcReport.sex_pregnancy["FNP"] = json.count;

        updateTotals("sex_pregnancy");

    });

    ajaxRequest("/reports/report_q_sex_pregnancy_fp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("FP")) {

            __$("FP").innerHTML = json.count;

        }

        htcReport.sex_pregnancy["FP"] = json.count;

        updateTotals("sex_pregnancy");

    });

    ajaxRequest("/reports/report_q_last_hiv_test_lnev?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("LNEV")) {

            __$("LNEV").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LNEV"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/reports/report_q_last_hiv_test_ln?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("LN")) {

            __$("LN").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LN"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/reports/report_q_last_hiv_test_lp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("LP")) {

            __$("LP").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LP"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/reports/report_q_last_hiv_test_lex?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("LEX")) {

            __$("LEX").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LEX"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/reports/report_q_last_hiv_test_lin?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("LIN")) {

            __$("LIN").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LIN"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/reports/report_q_outcome_summary_n?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("N")) {

            __$("N").innerHTML = json.count;

        }

        htcReport.outcome_summary["N"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/reports/report_q_outcome_summary_p?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("P")) {

            __$("P").innerHTML = json.count;

        }

        htcReport.outcome_summary["P"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/reports/report_q_outcome_summary_t12n?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("T12N")) {

            __$("T12N").innerHTML = json.count;

        }

        htcReport.outcome_summary["T12N"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/reports/report_q_outcome_summary_t12p?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("T12P")) {

            __$("T12P").innerHTML = json.count;

        }

        htcReport.outcome_summary["T12P"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/reports/report_q_outcome_summary_t12d?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("T12D")) {

            __$("T12D").innerHTML = json.count;

        }

        htcReport.outcome_summary["T12D"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/reports/report_q_age_group_0_11m?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("0_11M")) {

            __$("0_11M").innerHTML = json.count;

        }

        htcReport.age_group["0_11M"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/reports/report_q_age_group_1_14y?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("1_14Y")) {

            __$("1_14Y").innerHTML = json.count;

        }

        htcReport.age_group["1_14Y"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/reports/report_q_age_group_15_24y?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("15_24Y")) {

            __$("15_24Y").innerHTML = json.count;

        }

        htcReport.age_group["15_24Y"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/reports/report_q_age_group_25p?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("25P")) {

            __$("25P").innerHTML = json.count;

        }

        htcReport.age_group["25P"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/reports/report_q_partner_present_yes?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("PPY")) {

            __$("PPY").innerHTML = json.count;

        }

        htcReport.partner_present["PPY"] = json.count;

        updateTotals("partner_present");

    });

    ajaxRequest("/reports/report_q_partner_present_no?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("PPN")) {

            __$("PPN").innerHTML = json.count;

        }

        htcReport.partner_present["PPN"] = json.count;

        updateTotals("partner_present");

    });

    ajaxRequest("/reports/report_q_result_given_to_client_nn?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("RGTCNN")) {

            __$("RGTCNN").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNN"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/reports/report_q_result_given_to_client_np?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("RGTCNP")) {

            __$("RGTCNP").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNP"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/reports/report_q_result_given_to_client_nex?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("RGTCNEX")) {

            __$("RGTCNEX").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNEX"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/reports/report_q_result_given_to_client_ni?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("RGTCNI")) {

            __$("RGTCNI").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNI"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/reports/report_q_result_given_to_client_cp?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("RGTCCP")) {

            __$("RGTCCP").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCCP"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/reports/report_q_result_given_to_client_in?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("RGTCIN")) {

            __$("RGTCIN").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCIN"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/reports/report_q_partner_htc_slips_given_slips?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("PHSG")) {

            __$("PHSG").innerHTML = json.count;

        }

    });

    ajaxRequest("/reports/report_q_htc_access_type_pitc?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("PITC")) {

            __$("PITC").innerHTML = json.count;

        }

        htcReport.htc_access_type["PITC"] = json.count;

        updateTotals("htc_access_type");

    });

    ajaxRequest("/reports/report_q_htc_access_type_frs?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("FRS")) {

            __$("FRS").innerHTML = json.count;

        }

        htcReport.htc_access_type["FRS"] = json.count;

        updateTotals("htc_access_type");

    });

    ajaxRequest("/reports/report_q_htc_access_type_vct?start_date=" + startDate + "&end_date=" + endDate, function (json) {

        if (__$("VCT")) {

            __$("VCT").innerHTML = json.count;

        }

        htcReport.htc_access_type["VCT"] = json.count;

        updateTotals("htc_access_type");

    });

    if (!mYear && !mMonth) {

        var month = (window.parent.__$("month") ? window.parent.__$("month").value : padZeros((new Date()).getMonth(), 2));

        var year = (window.parent.__$("year") ? window.parent.__$("year").value : (new Date()).getFullYear());

    } else {

        var month = mMonth[1];

        var year = mYear[1];

    }

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

    htcStockReport = {
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
    }

    ajaxRequest("/reports/test_1_kit_name?start_date=" + stockStartDate + "&end_date=" + stockEndDate, function (json) {

        if (__$("test_1_kit_name")) {

            __$("test_1_kit_name").innerHTML = json.name;

        }

        ajaxRequest("/reports/total_in_rooms_at_month_start?start_date=" + stockStartDate + "&end_date=" + startDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_1_opening")) {

                __$("test_1_opening").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_1.opening = json.total;

            updateStockTotals("test_1");

        });

        ajaxRequest("/reports/total_tests_received_during_month?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_1_receipts")) {

                __$("test_1_receipts").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_1.receipts = json.total;

            updateStockTotals("test_1");

        });

        ajaxRequest("/reports/total_tests_used_for_testing_clients?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_1_used_for_clients")) {

                __$("test_1_used_for_clients").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_1.clients = json.total;

            updateStockTotals("test_1");

        });

        ajaxRequest("/reports/total_other_tests?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_1_for_other")) {

                __$("test_1_for_other").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_1.other = json.total;

            updateStockTotals("test_1");

        });

        ajaxRequest("/reports/total_disposals?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_1_disposals")) {

                __$("test_1_disposals").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_1.losses = json.total;

            updateStockTotals("test_1");

        });

        ajaxRequest("/reports/total_in_rooms_at_month_end?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_1_in_rooms")) {

                __$("test_1_in_rooms").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_1.closing = json.total;

            updateStockTotals("test_1");

        });

    });

    ajaxRequest("/reports/test_2_kit_name?start_date=" + stockStartDate + "&end_date=" + stockEndDate, function (json) {

        if (__$("test_2_kit_name")) {

            __$("test_2_kit_name").innerHTML = json.name;

        }

        ajaxRequest("/reports/total_in_rooms_at_month_start?start_date=" + stockStartDate + "&end_date=" + startDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_2_opening")) {

                __$("test_2_opening").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_2.opening = json.total;

            updateStockTotals("test_2");

        });

        ajaxRequest("/reports/total_tests_received_during_month?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_2_receipts")) {

                __$("test_2_receipts").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_2.receipts = json.total;

            updateStockTotals("test_2");

        });

        ajaxRequest("/reports/total_tests_used_for_testing_clients?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_2_used_for_clients")) {

                __$("test_2_used_for_clients").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_2.clients = json.total;

            updateStockTotals("test_2");

        });

        ajaxRequest("/reports/total_other_tests?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_2_for_other")) {

                __$("test_2_for_other").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_2.other = json.total;

            updateStockTotals("test_2");

        });

        ajaxRequest("/reports/total_disposals?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_2_disposals")) {

                __$("test_2_disposals").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_2.losses = json.total;

            updateStockTotals("test_2");

        });

        ajaxRequest("/reports/total_in_rooms_at_month_end?start_date=" + startDate + "&end_date=" + endDate + "&item_name=" +
            encodeURIComponent(json.name), function (json) {

            if (__$("test_2_in_rooms")) {

                __$("test_2_in_rooms").innerHTML = numberWithCommas(json.total);

            }

            htcStockReport.test_2.closing = json.total;

            updateStockTotals("test_2");

        });

    });

}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function updateTotals(category) {

    if (!htcReport[category])
        return;

    var keys = Object.keys(htcReport[category]);

    keys.splice(keys.indexOf("total"), 1);

    var sum = 0;

    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];

        sum += parseInt(htcReport[category][key]);

    }

    if (__$(category)) {

        __$(category).innerHTML = sum;

    }

    if (sum > 0) {

        greaterThanZero = true;

    }

    if (__$("lblClientsServed") && greaterThanZero) {

        __$("lblClientsServed").innerHTML = "Yes";

    }

}

/*
 test_1: {
 opening: 0,
 receipts: 0,
 clients: 0,
 other: 0,
 losses: 0,
 balance: 0,
 closing: 0,
 difference: 0
 }
 */

function updateStockTotals(category) {

    if (!htcStockReport[category])
        return;


    var sum = 0;

    sum = htcStockReport[category].opening + htcStockReport[category].receipts;

    var balance = sum - htcStockReport[category].clients - htcStockReport[category].other - htcStockReport[category].losses;

    var difference = balance - htcStockReport[category].closing;

    if (__$(category + "_balance")) {

        __$(category + "_balance").innerHTML = numberWithCommas(balance);

    }

    if (__$(category + "_difference")) {

        __$(category + "_difference").innerHTML = numberWithCommas(difference);

    }

}

loadFields();