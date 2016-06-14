/**
 * Created by chimwemwe on 6/14/16.
 */

var htcReport = {};

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

function loadFields() {

    htcReport = {
        "sex_pregnancy": {total: 0},
        "age_group": {total: 0},
        "htc_access_type": {total: 0},
        "last_hiv_test": {total: 0},
        "partner_present": {total: 0},
        "outcome_summary": {total: 0},
        "result_given_to_client": {total: 0}
    };

    ajaxRequest("/report_q_sex_pregnancy_m", function (json) {

        if (__$("M")) {

            __$("M").innerHTML = json.count;

        }

        htcReport.sex_pregnancy["M"] = json.count;

        updateTotals("sex_pregnancy");

    });

    ajaxRequest("/report_q_sex_pregnancy_fnp", function (json) {

        if (__$("FNP")) {

            __$("FNP").innerHTML = json.count;

        }

        htcReport.sex_pregnancy["FNP"] = json.count;

        updateTotals("sex_pregnancy");

    });

    ajaxRequest("/report_q_sex_pregnancy_fp", function (json) {

        if (__$("FP")) {

            __$("FP").innerHTML = json.count;

        }

        htcReport.sex_pregnancy["FP"] = json.count;

        updateTotals("sex_pregnancy");

    });

    ajaxRequest("/report_q_last_hiv_test_lnev", function (json) {

        if (__$("LNEV")) {

            __$("LNEV").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LNEV"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/report_q_last_hiv_test_ln", function (json) {

        if (__$("LN")) {

            __$("LN").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LN"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/report_q_last_hiv_test_lp", function (json) {

        if (__$("LP")) {

            __$("LP").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LP"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/report_q_last_hiv_test_lex", function (json) {

        if (__$("LEX")) {

            __$("LEX").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LEX"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/report_q_last_hiv_test_lin", function (json) {

        if (__$("LIN")) {

            __$("LIN").innerHTML = json.count;

        }

        htcReport.last_hiv_test["LIN"] = json.count;

        updateTotals("last_hiv_test");

    });

    ajaxRequest("/report_q_outcome_summary_n", function (json) {

        if (__$("N")) {

            __$("N").innerHTML = json.count;

        }

        htcReport.outcome_summary["N"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/report_q_outcome_summary_p", function (json) {

        if (__$("P")) {

            __$("P").innerHTML = json.count;

        }

        htcReport.outcome_summary["P"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/report_q_outcome_summary_t12n", function (json) {

        if (__$("T12N")) {

            __$("T12N").innerHTML = json.count;

        }

        htcReport.outcome_summary["T12N"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/report_q_outcome_summary_t12p", function (json) {

        if (__$("T12P")) {

            __$("T12P").innerHTML = json.count;

        }

        htcReport.outcome_summary["T12P"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/report_q_outcome_summary_t12d", function (json) {

        if (__$("T12D")) {

            __$("T12D").innerHTML = json.count;

        }

        htcReport.outcome_summary["T12D"] = json.count;

        updateTotals("outcome_summary");

    });

    ajaxRequest("/report_q_age_group_0_11m", function (json) {

        if (__$("0_11M")) {

            __$("0_11M").innerHTML = json.count;

        }

        htcReport.age_group["0_11M"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/report_q_age_group_1_14y", function (json) {

        if (__$("1_14Y")) {

            __$("1_14Y").innerHTML = json.count;

        }

        htcReport.age_group["1_14Y"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/report_q_age_group_15_24y", function (json) {

        if (__$("15_24Y")) {

            __$("15_24Y").innerHTML = json.count;

        }

        htcReport.age_group["15_24Y"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/report_q_age_group_25p", function (json) {

        if (__$("25P")) {

            __$("25P").innerHTML = json.count;

        }

        htcReport.age_group["25P"] = json.count;

        updateTotals("age_group");

    });

    ajaxRequest("/report_q_partner_present_yes", function (json) {

        if (__$("PPY")) {

            __$("PPY").innerHTML = json.count;

        }

        htcReport.partner_present["PPY"] = json.count;

        updateTotals("partner_present");

    });

    ajaxRequest("/report_q_partner_present_no", function (json) {

        if (__$("PPN")) {

            __$("PPN").innerHTML = json.count;

        }

        htcReport.partner_present["PPN"] = json.count;

        updateTotals("partner_present");

    });

    ajaxRequest("/report_q_result_given_to_client_nn", function (json) {

        if (__$("RGTCNN")) {

            __$("RGTCNN").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNN"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/report_q_result_given_to_client_np", function (json) {

        if (__$("RGTCNP")) {

            __$("RGTCNP").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNP"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/report_q_result_given_to_client_nex", function (json) {

        if (__$("RGTCNEX")) {

            __$("RGTCNEX").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNEX"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/report_q_result_given_to_client_ni", function (json) {

        if (__$("RGTCNI")) {

            __$("RGTCNI").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCNI"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/report_q_result_given_to_client_cp", function (json) {

        if (__$("RGTCCP")) {

            __$("RGTCCP").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCCP"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/report_q_result_given_to_client_in", function (json) {

        if (__$("RGTCIN")) {

            __$("RGTCIN").innerHTML = json.count;

        }

        htcReport.result_given_to_client["RGTCIN"] = json.count;

        updateTotals("result_given_to_client");

    });

    ajaxRequest("/report_q_partner_htc_slips_given_slips", function (json) {

        if (__$("PHSG")) {

            __$("PHSG").innerHTML = json.count;

        }

    });

    ajaxRequest("/report_q_htc_access_type_pitc", function (json) {

        if (__$("PITC")) {

            __$("PITC").innerHTML = json.count;

        }

        htcReport.htc_access_type["PITC"] = json.count;

        updateTotals("htc_access_type");

    });

    ajaxRequest("/report_q_htc_access_type_frs", function (json) {

        if (__$("FRS")) {

            __$("FRS").innerHTML = json.count;

        }

        htcReport.htc_access_type["FRS"] = json.count;

        updateTotals("htc_access_type");

    });

    ajaxRequest("/report_q_htc_access_type_vct", function (json) {

        if (__$("VCT")) {

            __$("VCT").innerHTML = json.count;

        }

        htcReport.htc_access_type["VCT"] = json.count;

        updateTotals("htc_access_type");

    });

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

    if(__$(category)) {

        __$(category).innerHTML = sum;

    }

}

loadFields();