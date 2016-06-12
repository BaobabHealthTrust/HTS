/**
 * Created by chimwemwe on 6/7/16.
 */

"use strict"

var tmrControl1SecsCount = 0;
var tmrControl1MinsCount = 0;
var tmrControl1Hnd;

var tmrControl2SecsCount = 0;
var tmrControl2MinsCount = 0;
var tmrControl2Hnd;

function getCookie(cname) {

    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";

}

function getAge(birthdate, estimated) {

    var age;

    if ((new Date(birthdate)) === "Invalid Date") {

        return ["???", undefined, undefined];

    }

    if ((((new Date()) - (new Date(birthdate))) / (365 * 24 * 60 * 60 * 1000)) > 1) {

        var num = Math.round((((new Date()) - (new Date(birthdate))) / (365 * 24 * 60 * 60 * 1000)), 0);

        age = [num, num + "Y", "Y"];

    } else if ((((new Date()) - (new Date(birthdate))) / (30 * 24 * 60 * 60 * 1000)) > 1) {

        var num = Math.round((((new Date()) - (new Date(birthdate))) / (30 * 24 * 60 * 60 * 1000)), 0);

        age = [num, num + "M", "M"];

    } else if ((((new Date()) - (new Date(birthdate))) / (7 * 24 * 60 * 60 * 1000)) > 1) {

        var num = Math.round((((new Date()) - (new Date(birthdate))) / (7 * 24 * 60 * 60 * 1000)), 0);

        age = [num, num + "W", "W"];

    } else if ((((new Date()) - (new Date(birthdate))) / (24 * 60 * 60 * 1000)) > 1) {

        var num = Math.round((((new Date()) - (new Date(birthdate))) / (24 * 60 * 60 * 1000)), 0);

        age = [num, num + "D", "D"];

    } else if ((((new Date()) - (new Date(birthdate))) / (60 * 60 * 1000)) > 1) {

        var num = Math.round((((new Date()) - (new Date(birthdate))) / (60 * 60 * 1000)), 0);

        age = [num, num + "H", "H"];

    } else {

        var num = "";

        age = [num, num, num];

    }

    age[0] = (estimated != undefined && parseInt(estimated) == 1 ? "~" + age[0] : age[0]);

    return age;

}

function calculateAge() {

    if (__$("birthdate")) {

        var age = getAge(__$("birthdate").value.trim());

        if (__$("age")) {

            __$("age").value = age[1];

        }

        var ageGroup = "";

        switch (age[2]) {

            case "Y":

                if (age[0] <= 14) {

                    ageGroup = "1-14 years";

                } else if (age[0] <= 24) {

                    ageGroup = "15-24 years";

                } else if (age[0] > 24) {

                    ageGroup = "25+ years";

                }

                break;

            case "M":
            case "W":
            case "D":
            default:

                if (age[0] > 11) {

                    ageGroup = "1-14 years";

                } else {

                    ageGroup = "0-11 months";

                }

                break;

        }

        if (__$("age_group")) {

            __$("age_group").value = ageGroup;

        }

        if (age[2] == "Y" && age[0] >= 10 && age[0] <= 45) {

            if (__$("pregnant")) {

                __$("pregnant").setAttribute("condition",
                    "__$('gender').value.trim().toLowerCase() == 'female'");

            }

        } else if (__$("pregnant")) {

            __$("pregnant").setAttribute("condition", "false");

            __$("pregnant").value = "";

        }

    }

}

function updatePregnancy() {

    if (__$("sex_or_pregnancy") && __$("gender") && __$("pregnant")) {

        var gender = __$("gender").value.trim();

        var pregnant = __$("pregnant").value.trim();

        var status = "";

        if (gender.trim().toLowerCase() == "female" && pregnant.trim().toLowerCase() == "yes") {

            status = "FP";

        } else if (gender.trim().toLowerCase() == "female") {

            status = "FNP";

        } else {

            status = "M";

        }

        __$("sex_or_pregnancy").value = status;

    }

    if (__$("inputFrame" + tstCurrentPage)) {

        // __$("inputFrame" + tstCurrentPage).innerHTML = "";

        __$("inputFrame" + tstCurrentPage).style.overflow = "auto";

        var table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.margin = "auto";
        table.style.marginTop = "20px";
        table.style.color = "#333";
        table.cellPadding = "10px";

        __$("inputFrame" + tstCurrentPage).appendChild(table);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 2;

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = "Sex/Pregnancy";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.colSpan = 3;
        th.style.padding = "10px";

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Age";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.style.borderBottom = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.rowSpan = 2;
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Age Group";
        th.style.borderTop = "3px solid #333";
        th.colSpan = 4;
        th.style.padding = "10px";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderLeft = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 2;

        tr.appendChild(td);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Male", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Female<i style='color: #eee'>_</i>Non-Preg.", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Female<i style='color: #eee'>_</i>Pregnant", th);


        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("0-11<i style='color: #eee'>_</i>months", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("1-14<i style='color: #eee'>_</i>years", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("15-24<i style='color: #eee'>_</i>years", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";

        tr.appendChild(th);

        verticalText("25+<i style='color: #eee'>_</i>years", th);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.style.borderBottom = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("M", __$("sex_or_pregnancy").value.trim(), th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("FNP", __$("sex_or_pregnancy").value.trim(), th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("FP", __$("sex_or_pregnancy").value.trim(), th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";
        th.style.color = "blue";

        tr.appendChild(th);

        addDiv(__$("age").value, "", th, true);

        var groupMapping = {
            "0-11 months": "A",
            "1-14 years": "B",
            "15-24 years": "C",
            "25+ years": "D"
        };

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("A", groupMapping[__$("age_group").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("B", groupMapping[__$("age_group").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("C", groupMapping[__$("age_group").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("D", groupMapping[__$("age_group").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.innerHTML = "&nbsp;";
        th.colSpan = 3;

        tr.appendChild(th);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.innerHTML = "&nbsp;";
        th.colSpan = 4;

        tr.appendChild(th);

    }

}

function addDiv(text, checkText, parent, bold) {

    var div = document.createElement("div");
    div.style.paddingTop = "10px";
    div.style.borderRadius = "30px";
    div.style.width = "40px";
    div.style.height = "30px";
    div.style.border = (text.trim().length > 0 && text.trim().toLowerCase() == checkText.trim().toLowerCase() ?
        "2px solid red" : "none");
    div.style.textAlign = "center";
    div.style.verticalAlign = "middle";
    div.innerHTML = text;
    div.style.fontWeight = (bold ? "bold" : "normal");

    parent.appendChild(div);

}

function verticalText(text, parent) {

    if (!parent)
        return;

    var div = document.createElement("div");
    div.style.height = "120px";
    div.style.fontSize = "12px";
    div.style.width = "30px";

    parent.appendChild(div);

    var child = document.createElement("div");
    child.style.transform = "rotate(-90deg)";
    child.style.transformOrigin = "right bottom 0";
    child.style.marginLeft = "-65px";

    child.innerHTML = text;

    div.appendChild(child);

}

function updateTimeSinceLastTest() {

    if (__$("time_since_last_test") && __$("time_since_last_test_date")) {

        var age = getAge(__$("time_since_last_test_date").value.trim());

        if (__$("time_since_last_test")) {

            __$("time_since_last_test").value = age[1];

        }

    }

}

function showHTSVisitSummary() {

    if (__$("inputFrame" + tstCurrentPage)) {

        __$("inputFrame" + tstCurrentPage).style.overflow = "auto";

        var table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.margin = "auto";
        table.style.marginTop = "20px";
        table.style.color = "#333";
        table.cellPadding = "10px";

        __$("inputFrame" + tstCurrentPage).appendChild(table);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 2;

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = "HTC Access Type";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.colSpan = 3;
        th.style.padding = "10px";
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Last HIV Test";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.colSpan = 5;
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var th = document.createElement("td");
        th.innerHTML = "<b>Time<br/>Since Last<br/>Test</b><br/><br/><span style='font-size: 12px;'>No. of<br/>Days" +
            "<br/>Weeks<br/>Months or<br/>Years</span>";
        th.style.borderTop = "3px solid #333";
        th.style.borderBottom = "1px solid #333";
        th.style.padding = "10px";
        th.rowSpan = 2;
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderLeft = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "<b>Partner Present</b><br/><span style='font-size: 11px;'>at this session</span>";
        td.style.width = "30px";
        td.style.height = "50px";
        td.align = "center";
        td.colSpan = 2;

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 2;

        tr.appendChild(td);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Routine<i style='color: #eee'>_</i>HTC<i style='color: #eee'>_</i>within Health Service", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Comes<i style='color: #eee'>_</i>with<i style='color: #eee'>_</i>HTC Family<i style='color: #eee'>_</i>Ref.<i style='color: #eee'>_</i>Slip", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";

        tr.appendChild(th);

        verticalText("Other<i style='color: #eee'>_</i>(VCT, etc.)<i style='color: #eee'>________________________</i>", th);


        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Never Tested", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Last Negative", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Last Positive", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";

        tr.appendChild(th);

        verticalText("Last<i style='color: #eee'>_</i>Expos.<i style='color: #eee'>_</i>Infant", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";
        th.style.borderRight = "1px solid #333";

        tr.appendChild(th);

        verticalText("Last Inconclusive", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";
        th.style.borderLeft = "1px solid #333";

        tr.appendChild(th);

        verticalText("No", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";
        th.style.borderRight = "1px solid #333";

        tr.appendChild(th);

        verticalText("Yes", th);


        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.style.borderBottom = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

        var HATMapping = {
            "Routine HTC within Health Service": "PITC",
            "Comes with HTC Family Reference Slip": "FRS",
            "Other (VCT, etc.)": "Oth"
        };

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("PITC", HATMapping[__$("htc_acc_type").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("FRS", HATMapping[__$("htc_acc_type").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("Oth", HATMapping[__$("htc_acc_type").value.trim()], th);

        var LHTMapping = {
            "Never Tested": "LNev",
            "Last Negative": "L-",
            "Last Positive": "L+",
            "Last Exposed Infant": "LEx",
            "Last Inconclusive": "LIn"
        };

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("LNev", LHTMapping[__$("last_hiv_test").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("L-", LHTMapping[__$("last_hiv_test").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("L+", LHTMapping[__$("last_hiv_test").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("LEx", LHTMapping[__$("last_hiv_test").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("LIn", LHTMapping[__$("last_hiv_test").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";
        th.style.color = "blue";

        tr.appendChild(th);

        addDiv(__$("time_since_last_test").value, "", th, true);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("N", __$("partner_present").value.trim().substring(0, 1).toUpperCase(), th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("Y", __$("partner_present").value.trim().substring(0, 1).toUpperCase(), th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

    }

}

function showDetailsSummary() {


}

function setAjaxUrl(pos) {

    switch (pos) {

        case 0:

            if (__$("district")) {

                __$("district").setAttribute("ajaxURL", "/district_query?region=" + __$("touchscreenInput" +
                    tstCurrentPage).value.trim() + "&district=");

            }

            break;

        case 1:

            if (__$('ta')) {

                __$('ta').setAttribute('ajaxURL', '/ta_query?district=' + __$('touchscreenInput' +
                    tstCurrentPage).value + '&ta=');

            }

            break;

        case 2:

            if (__$('village')) {

                __$('village').setAttribute('ajaxURL', '/village_query?district=' + __$('district').value.trim() +
                    '&ta=' + __$('touchscreenInput' + tstCurrentPage).value + '&village=');

            }

            break;

        case 3:

            if (__$("fp_item_name1")) {

                __$('fp_item_name1').setAttribute('ajaxURL', '/stock_items?category=' + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + '&item_name=');

            }

            break;

        case 4:

            if (__$("fp_lot_number1")) {

                __$('fp_lot_number1').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie("username") +
                    "&item_name=" + __$('touchscreenInput' + tstCurrentPage).value.trim() + "&batch=");

            }

            break;

        case 5:

            if (__$("fp_item_name2")) {

                __$('fp_item_name2').setAttribute('ajaxURL', '/stock_items?category=' + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + '&item_name=');

            }

            break;

        case 6:

            if (__$("fp_lot_number2")) {

                __$('fp_lot_number2').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie("username") +
                    "&item_name=" + __$('touchscreenInput' + tstCurrentPage).value.trim() + "&batch=");

            }

            break;

        case 7:

            if (__$("im_item_name1")) {

                __$('im_item_name1').setAttribute('ajaxURL', '/stock_items?category=' + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + '&item_name=');

            }

            break;

        case 8:

            if (__$("im_lot_number1")) {

                __$('im_lot_number1').setAttribute('ajaxURL', '/available_batches_to_user?userId=' +
                    __$("im_tester").value.trim() + "&item_name=" + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + "&batch=");

            }

            break;

        case 9:

            if (__$("im_item_name2")) {

                __$('im_item_name2').setAttribute('ajaxURL', '/stock_items?category=' + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + '&item_name=');

            }

            break;

        case 10:

            if (__$("im_lot_number2")) {

                __$('im_lot_number2').setAttribute('ajaxURL', '/available_batches_to_user?userId=' +
                    __$("im_tester").value.trim() + "&item_name=" + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + "&batch=");

            }

            break;

    }


}

function saveConsumption(dispatch_id) {

    var patient_id = getCookie("client_identifier");

    var consumption_type = "Normal use";
    var consumption_quantity = 1;
    var who_consumed = patient_id;
    var date_consumed = (getCookie("today").trim().length > 0 ? getCookie("today") :
        (new Date()).format("YYYY-mm-dd HH:MM:SS"));
    var reason_for_consumption = "Normal use";
    var location = getCookie("location");
    var userId = getCookie("username");

    var data = {
        data: {
            consumption_type: consumption_type,
            dispatch_id: dispatch_id,
            consumption_quantity: consumption_quantity,
            who_consumed: who_consumed,
            date_consumed: date_consumed,
            reason_for_consumption: reason_for_consumption,
            location: location,
            userId: userId,
            datatype: "consumption"
        }
    }

    ajaxPostRequest("/save_item", data, function (result) {

        console.log(result);

    })

}

function ajaxPostRequest(url, data, callback) {

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {

        if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
            httpRequest.status == 304)) {

            if (httpRequest.responseText.trim().length > 0) {
                var result = httpRequest.responseText;

                callback(result);

            } else {

                callback(undefined);

            }

        }

    };
    try {
        httpRequest.open("POST", url, true);
        httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        httpRequest.send(JSON.stringify(data));
    } catch (e) {
    }

}

function evalCondition(pos) {

    var result = false;

    switch (pos) {

        case 0:

            if (__$("consent").value == "Yes" && ( (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative") ||
                (decodeURIComponent(getCookie("LastHIVTest")) == "Last Inconclusive" ||
                    decodeURIComponent(getCookie("LastHIVTest")) == "Last Positive" ||
                    decodeURIComponent(getCookie("LastHIVTest")) == "Last Exposed Infant") )) {

                result = true;

            }

            break;

        case 1:

            if (__$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")) {

                result = true;

            }

            break;

        case 2:

            if (__$("consent").value == "Yes" && ( ((decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative") &&
                __$("fp_test1_result").value == "+") || (decodeURIComponent(getCookie("LastHIVTest")) == "Last Inconclusive" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Positive" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Exposed Infant") )) {

                result = true;

            }

            break;

        case 3:

            if (__$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative") && __$("fp_test1_result").value == "+") {

                result = true;

            }

            break;

        case 4:

            if (__$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Last Inconclusive" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Positive" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Exposed Infant")) {

                result = true;

            }

            break;

        case 5:

            if (__$("consent").value == "Yes" && ( ((decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" ||
                decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative") &&
                __$("fp_test2_result").value.trim().length > 0 && __$("fp_test1_result").value !=
                __$("fp_test2_result").value) || (decodeURIComponent(getCookie("LastHIVTest")) == "Last Positive" &&
                (__$("fp_test1_result").value.trim().length > 0 && __$("fp_test2_result").value.trim().length > 0 &&
                    __$("fp_test1_result").value != __$("fp_test2_result").value)) )) {

                result = true;

            }

            break;

    }

    return result;

}

function loadPassParallelTests(test1Target, test1TimeTarget, test2Target, test2TimeTarget) {

    if (!test1Target || !test1TimeTarget || !test2Target || !test2TimeTarget) {

        return;

    }

    tmrControl1SecsCount = 0;
    tmrControl1MinsCount = 0;
    tmrControl2SecsCount = 0;
    tmrControl2MinsCount = 0;

    if (__$("nextButton")) {

        var currentClass = __$("nextButton").className;

        __$("nextButton").className = currentClass.replace(/blue|green/i, "gray");

    }

    var mainTable = document.createElement("table");
    mainTable.style.margin = "auto";

    if (__$("inputFrame" + tstCurrentPage)) {

        __$("inputFrame" + tstCurrentPage).appendChild(mainTable);

    }

    var mainRow = document.createElement("tr");

    mainTable.appendChild(mainRow);

    var mainTd1 = document.createElement("td");
    mainTd1.style.paddingRight = "20px";

    mainRow.appendChild(mainTd1);

    var mainTd2 = document.createElement("td");
    mainTd2.style.paddingLeft = "20px";

    mainRow.appendChild(mainTd2);

    var table = document.createElement("table");
    table.style.margin = "auto";
    table.border = 0;

    mainTd1.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    td.style.borderRadius = "10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px inset #3c60b1";
    div.style.borderRadius = "calc(50vh - 150px)";
    div.style.width = "calc(100vh - 300px)";
    div.id = "tmrControl1";
    div.style.height = "calc(100vh - 300px)";
    div.style.margin = "auto";
    div.style.textAlign = "center";
    div.style.verticalAlign = "middle";
    div.style.display = "table-cell";
    div.innerHTML = "00:00";
    div.style.fontSize = "20vh";
    div.style.color = "#3c60b1";
    div.style.backgroundColor = "#fff";
    div.style.zIndex = 100;

    td.appendChild(div);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.colSpan = 3;

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "blue";
    btn.innerHTML = "Start";
    btn.style.cssFloat = "right";
    btn.style.fontSize = "5vh !important";
    btn.style.marginTop = "-60px";
    btn.style.marginRight = "5px";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        var currentClass = __$("nextButton").className;

        this.className = currentClass.replace(/blue|green/i, "gray");

        tmrControl1Hnd = setInterval(function () {

            tmrControl1SecsCount++;

            if (tmrControl1SecsCount == 60) {

                tmrControl1SecsCount = 0;

                tmrControl1MinsCount++;

            }

            var time = padZeros(tmrControl1MinsCount, 2) + ":" + padZeros(tmrControl1SecsCount, 2);

            if (__$("tmrControl1")) {

                __$("tmrControl1").innerHTML = time;

            }

        }, 1000);

        if (__$("btnTest1Nve")) {

            var currentClass = __$("btnTest1Nve").className;

            __$("btnTest1Nve").className = currentClass.replace(/gray/i, "blue");

        }

        if (__$("btnTest1Pve")) {

            var currentClass = __$("btnTest1Pve").className;

            __$("btnTest1Pve").className = currentClass.replace(/gray/i, "blue");

        }

    }

    td.appendChild(btn);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.innerHTML = "Test 1 Result";
    td.style.fontSize = "5vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "gray";
    btn.innerHTML = "-";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest1Nve";
    btn.setAttribute("target", test1Target.id);
    btn.setAttribute("timeTarget", test1TimeTarget.id);
    btn.setAttribute("target2", test2Target.id);
    btn.setAttribute("timeTarget2", test2TimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        clearInterval(tmrControl1Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "-";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).value = (tmrControl1MinsCount + (tmrControl1SecsCount / 60)).toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "gray";
    btn.innerHTML = "+";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest1Pve";
    btn.setAttribute("target", test1Target.id);
    btn.setAttribute("timeTarget", test1TimeTarget.id);
    btn.setAttribute("target2", test2Target.id);
    btn.setAttribute("timeTarget2", test2TimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        clearInterval(tmrControl1Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "+";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).value = (tmrControl1MinsCount + (tmrControl1SecsCount / 60)).toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

    }

    td.appendChild(btn);

    var table = document.createElement("table");
    table.style.margin = "auto";
    table.border = 0;

    mainTd2.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    td.style.borderRadius = "10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px inset #3c60b1";
    div.style.borderRadius = "calc(50vh - 150px)";
    div.style.width = "calc(100vh - 300px)";
    div.id = "tmrControl2";
    div.style.height = "calc(100vh - 300px)";
    div.style.margin = "auto";
    div.style.textAlign = "center";
    div.style.verticalAlign = "middle";
    div.style.display = "table-cell";
    div.innerHTML = "00:00";
    div.style.fontSize = "20vh";
    div.style.color = "#3c60b1";
    div.style.backgroundColor = "#fff";
    div.style.zIndex = 100;

    td.appendChild(div);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.colSpan = 3;

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "blue";
    btn.innerHTML = "Start";
    btn.style.cssFloat = "left";
    btn.style.fontSize = "5vh !important";
    btn.style.marginTop = "-60px";
    btn.style.marginLeft = "5px";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        var currentClass = __$("nextButton").className;

        this.className = currentClass.replace(/blue|green/i, "gray");

        tmrControl2Hnd = setInterval(function () {

            tmrControl2SecsCount++;

            if (tmrControl2SecsCount == 60) {

                tmrControl2SecsCount = 0;

                tmrControl2MinsCount++;

            }

            var time = padZeros(tmrControl2MinsCount, 2) + ":" + padZeros(tmrControl2SecsCount, 2);

            if (__$("tmrControl2")) {

                __$("tmrControl2").innerHTML = time;

            }

        }, 1000);

        if (__$("btnTest2Nve")) {

            var currentClass = __$("btnTest2Nve").className;

            __$("btnTest2Nve").className = currentClass.replace(/gray/i, "blue");

        }

        if (__$("btnTest2Pve")) {

            var currentClass = __$("btnTest2Pve").className;

            __$("btnTest2Pve").className = currentClass.replace(/gray/i, "blue");

        }

    }

    td.appendChild(btn);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.innerHTML = "Test 2 Result";
    td.style.fontSize = "5vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "gray";
    btn.innerHTML = "-";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest2Nve";
    btn.setAttribute("target", test2Target.id);
    btn.setAttribute("timeTarget", test2TimeTarget.id);
    btn.setAttribute("target2", test1Target.id);
    btn.setAttribute("timeTarget2", test1TimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        clearInterval(tmrControl2Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "-";

        }

        if (__$("touchscreenInput" + tstCurrentPage)) {

            __$("touchscreenInput" + tstCurrentPage).value = "-";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).value = (tmrControl2MinsCount + (tmrControl2SecsCount / 60)).toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "gray";
    btn.innerHTML = "+";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest2Pve";
    btn.setAttribute("target", test2Target.id);
    btn.setAttribute("timeTarget", test2TimeTarget.id);
    btn.setAttribute("target2", test1Target.id);
    btn.setAttribute("timeTarget2", test1TimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        clearInterval(tmrControl2Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "+";

        }

        if (__$("touchscreenInput" + tstCurrentPage)) {

            __$("touchscreenInput" + tstCurrentPage).value = "+";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).value = (tmrControl2MinsCount + (tmrControl2SecsCount / 60)).toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

    }

    td.appendChild(btn);

}

function loadSerialTest(testTarget, testTimeTarget) {

    if (!testTarget || !testTimeTarget) {

        return;

    }

    tmrControl1SecsCount = 0;
    tmrControl1MinsCount = 0;

    if (__$("nextButton")) {

        var currentClass = __$("nextButton").className;

        __$("nextButton").className = currentClass.replace(/blue|green/i, "gray");

    }

    var table = document.createElement("table");
    table.style.margin = "auto";
    table.border = 0;

    if (__$("inputFrame" + tstCurrentPage)) {

        __$("inputFrame" + tstCurrentPage).appendChild(table);

    }

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    td.style.borderRadius = "10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px inset #3c60b1";
    div.style.borderRadius = "calc(50vh - 150px)";
    div.style.width = "calc(100vh - 300px)";
    div.id = "tmrControl1";
    div.style.height = "calc(100vh - 300px)";
    div.style.margin = "auto";
    div.style.textAlign = "center";
    div.style.verticalAlign = "middle";
    div.style.display = "table-cell";
    div.innerHTML = "00:00";
    div.style.fontSize = "20vh";
    div.style.color = "#3c60b1";
    div.style.backgroundColor = "#fff";
    div.style.zIndex = 100;

    td.appendChild(div);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.colSpan = 3;

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "blue";
    btn.innerHTML = "Start";
    btn.style.cssFloat = "right";
    btn.style.fontSize = "5vh !important";
    btn.style.marginTop = "-60px";
    btn.style.marginRight = "5px";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        var currentClass = __$("nextButton").className;

        this.className = currentClass.replace(/blue|green/i, "gray");

        tmrControl1Hnd = setInterval(function () {

            tmrControl1SecsCount++;

            if (tmrControl1SecsCount == 60) {

                tmrControl1SecsCount = 0;

                tmrControl1MinsCount++;

            }

            var time = padZeros(tmrControl1MinsCount, 2) + ":" + padZeros(tmrControl1SecsCount, 2);

            if (__$("tmrControl1")) {

                __$("tmrControl1").innerHTML = time;

            }

        }, 1000);

        if (__$("btnTest1Nve")) {

            var currentClass = __$("btnTest1Nve").className;

            __$("btnTest1Nve").className = currentClass.replace(/gray/i, "blue");

        }

        if (__$("btnTest1Pve")) {

            var currentClass = __$("btnTest1Pve").className;

            __$("btnTest1Pve").className = currentClass.replace(/gray/i, "blue");

        }

    }

    td.appendChild(btn);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.innerHTML = "Test Result";
    td.style.fontSize = "5vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "gray";
    btn.innerHTML = "-";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest1Nve";
    btn.setAttribute("target", testTarget.id);
    btn.setAttribute("timeTarget", testTimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        clearInterval(tmrControl1Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "-";

        }

        if (__$("touchscreenInput" + tstCurrentPage)) {

            __$("touchscreenInput" + tstCurrentPage).value = "-";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).value = (tmrControl1MinsCount + (tmrControl1SecsCount / 60)).toFixed(2);

        }

        if (__$("nextButton")) {

            var currentClass = __$("nextButton").className;

            __$("nextButton").className = currentClass.replace(/gray/i, "green");

        }

    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = "gray";
    btn.innerHTML = "+";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest1Pve";
    btn.setAttribute("target", testTarget.id);
    btn.setAttribute("timeTarget", testTimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        clearInterval(tmrControl1Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "+";

        }

        if (__$("touchscreenInput" + tstCurrentPage)) {

            __$("touchscreenInput" + tstCurrentPage).value = "+";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).value = (tmrControl1MinsCount + (tmrControl1SecsCount / 60)).toFixed(2);

        }

        if (__$("nextButton")) {

            var currentClass = __$("nextButton").className;

            __$("nextButton").className = currentClass.replace(/gray/i, "green");

        }

    }

    td.appendChild(btn);

}

function activateNavBtn() {

    if (__$("nextButton")) {

        var currentClass = __$("nextButton").className;

        __$("nextButton").className = currentClass.replace(/gray/i, "green");

    }

    decodeResult(decodeURIComponent(getCookie("LastHIVTest")), decodeURIComponent(getCookie("AgeGroup")),
        __$("fp_test1_result").value.trim(), __$("fp_test2_result").value.trim(), __$("im_test1_result").value.trim(),
        __$("im_test2_result").value.trim(), __$("outcome_summary"), __$("result_given_to_client"));

}

function decodeResult(lastHIVTestResult, ageGroup, fpTest1Result, fpTest2Result, imTest1Result, imTest2Result,
                      outcomeControl, resultGivenControl) {

    if (!lastHIVTestResult || !ageGroup || !fpTest1Result || !outcomeControl || !resultGivenControl)
        return;

    var outcome = "";
    var result = "";

    switch (lastHIVTestResult.trim().toLowerCase()) {

        case "never tested":
        case "last negative":

            if (fpTest1Result.trim() == "-" && fpTest2Result.trim().length <= 0 && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                outcome = "Single Negative";

                result = "New Negative";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "+" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Positive";

                result = (ageGroup == "0-11 months" ? "New Exposed Infant" : "New Positive");

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && imTest1Result.trim() == "-" &&
                imTest2Result.trim() == "-") {

                outcome = "Test 1 & Test 2 Negative";

                result = "New Negative";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && imTest1Result.trim() == "+" &&
                imTest2Result.trim() == "+") {

                outcome = "Test 1 & Test 2 Positive";

                result = (ageGroup == "0-11 months" ? "New Exposed Infant" : "New Positive");

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && ((imTest1Result.trim() == "-" &&
                imTest2Result.trim() == "+") || (imTest1Result.trim() == "+" && imTest2Result.trim() == "-"))) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "New Inconclusive";

            }

            break;
        case "last positive":
        case "last exposed infant":

            if (fpTest1Result.trim() == "-" && fpTest2Result.trim() == "-" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Negative";

                result = "Inconclusive";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "+" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Positive";

                result = "Confirmed Positive";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && ((imTest1Result.trim() == "-" &&
                imTest2Result.trim() == "+") || (imTest1Result.trim() == "-" && imTest2Result.trim() == "-") ||
                (imTest1Result.trim() == "+" && imTest2Result.trim() == "-"))) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "Inconclusive";

            } else if (((fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-") || (fpTest1Result.trim() == "-" &&
                fpTest2Result.trim() == "+")) && imTest1Result.trim() == "+" && imTest2Result.trim() == "+") {

                outcome = "Test 1 & Test 2 Positive";

                result = "Confirmed Positive";

            }

            break;
        case "last inconclusive":

            if (fpTest1Result.trim() == "-" && fpTest2Result.trim() == "-" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Negative";

                result = "New Negative";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "+" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Positive";

                result = "Confirmed Positive";

            } else if (((fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-") || (fpTest1Result.trim() == "-" &&
                fpTest2Result.trim() == "+")) && imTest1Result.trim().length <= 0 && imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "Inconclusive";

            }

            break;

    }

    outcomeControl.value = outcome;

    resultGivenControl.value = result;

}

function showHIVTestingSummary() {

    if (__$("inputFrame" + tstCurrentPage)) {

        __$("inputFrame" + tstCurrentPage).style.overflow = "auto";

        var table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.margin = "auto";
        table.style.marginTop = "20px";
        table.style.color = "#333";
        table.cellPadding = "10px";
        table.border = 0;

        __$("inputFrame" + tstCurrentPage).appendChild(table);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 7;

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = "HIV Rapid Test Outcomes";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.colSpan = 8;
        th.style.padding = "10px";
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Outcome Summary";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.colSpan = 5;
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Result Given to Client";
        th.style.borderTop = "3px solid #333";
        th.style.padding = "10px";
        th.colSpan = 6;
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderLeft = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 7;

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.colSpan = 8;
        td.rowSpan = 4;
        td.style.padding = "0px";

        tr.appendChild(td);

        var tableKit = document.createElement("table");
        tableKit.width = "100%";
        tableKit.style.borderCollapse = "collapse";
        tableKit.style.fontSize = "12px";
        tableKit.cellPadding = "10";

        td.appendChild(tableKit);

        var trKit = document.createElement("tr");

        tableKit.appendChild(trKit);

        var tdKit = document.createElement("td");
        tdKit.innerHTML = "&nbsp;";
        tdKit.style.width = "40px";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.borderBottom = "1px solid #333";
        tdKit.innerHTML = "Test 1";
        tdKit.align = "center";
        tdKit.style.fontStyle = "italic";
        tdKit.style.fontSize = "12px";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.borderBottom = "1px solid #333";
        tdKit.style.borderRight = "1px solid #333";
        tdKit.innerHTML = "Test 2";
        tdKit.align = "center";
        tdKit.style.fontStyle = "italic";
        tdKit.style.fontSize = "12px";
        tdKit.style.borderRight = "none";

        trKit.appendChild(tdKit);

        var trKit = document.createElement("tr");

        tableKit.appendChild(trKit);

        var tdKit = document.createElement("td");
        tdKit.innerHTML = "Kit";
        tdKit.style.fontSize = "12px";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.border = "1px solid #333";
        tdKit.innerHTML = (__$("fp_item_name1") ? __$("fp_item_name1").value.trim() : "");
        tdKit.style.fontWeight = "bold";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.border = "1px solid #333";
        tdKit.innerHTML = (__$("fp_item_name2") ? __$("fp_item_name2").value.trim() : "");
        tdKit.style.fontWeight = "bold";
        tdKit.style.borderRight = "none";

        trKit.appendChild(tdKit);

        var trKit = document.createElement("tr");

        tableKit.appendChild(trKit);

        var tdKit = document.createElement("td");
        tdKit.innerHTML = "Lot";
        tdKit.style.fontSize = "12px";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.border = "1px solid #333";
        tdKit.innerHTML = (__$("fp_lot_number1") ? __$("fp_lot_number1").value.trim() : "");
        tdKit.style.fontWeight = "bold";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.border = "1px solid #333";
        tdKit.innerHTML = (__$("fp_lot_number2") ? __$("fp_lot_number2").value.trim() : "");
        tdKit.style.fontWeight = "bold";
        tdKit.style.borderRight = "none";

        trKit.appendChild(tdKit);

        var trKit = document.createElement("tr");

        tableKit.appendChild(trKit);

        var tdKit = document.createElement("td");
        tdKit.innerHTML = "Expiry";
        tdKit.style.fontSize = "12px";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.border = "1px solid #333";
        tdKit.innerHTML = (__$("fp_lot_1_expiry") ? __$("fp_lot_1_expiry").value.trim() : "");
        tdKit.style.fontWeight = "bold";

        trKit.appendChild(tdKit);

        var tdKit = document.createElement("td");
        tdKit.style.border = "1px solid #333";
        tdKit.innerHTML = (__$("fp_lot_2_expiry") ? __$("fp_lot_2_expiry").value.trim() : "");
        tdKit.style.fontWeight = "bold";
        tdKit.style.borderRight = "none";

        trKit.appendChild(tdKit);

        var td = document.createElement("td");
        td.colSpan = 2;
        td.align = "center";
        td.style.padding = "2px";
        td.style.borderLeft = "1px solid #333";
        td.rowSpan = 2;
        td.innerHTML = "Only Test 1<br/>Used";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.colSpan = 3;
        td.align = "center";
        td.style.padding = "2px";
        td.rowSpan = 2;
        td.innerHTML = "Test 1 & Test 2<br/>Used ± Repeat";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderLeft = "1px solid #333";
        td.colSpan = 4;
        td.rowSpan = 2;
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px dotted #333";
        td.style.fontSize = "11px";
        td.style.verticalAlign = "top";
        td.style.padding = "2px";
        td.align = "center";
        td.colSpan = 2;
        td.rowSpan = 2;
        td.innerHTML = "Confirmatory<br/>Results for<br/>Clients Last +";

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderLeft = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Single<i style='color: #eee'>_</i>Neg", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Single<i style='color: #eee'>_</i>Pos", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Test<i style='color: #eee'>_</i>1&2<i style='color: #eee'>_</i>Neg", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Test<i style='color: #eee'>_</i>1&2<i style='color: #eee'>_</i>Pos", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Test<i style='color: #eee'>_</i>1&2<i style='color: #eee'>_</i>disc.", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderLeft = "1px solid #333";

        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("New<i style='color: #eee'>_</i>Negative", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("New<i style='color: #eee'>_</i>Positive", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("New<i style='color: #eee'>_</i>Exp.<i style='color: #eee'>_</i>Infant", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("New<i style='color: #eee'>_</i>Inconclusive", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Conf.<i style='color: #eee'>_</i>Positive", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 4;

        tr.appendChild(td);

        verticalText("Inconclusive", td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.colSpan = 4;
        td.align = "center";
        td.innerHTML = "First Pass"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.colSpan = 4;
        td.align = "center";
        td.innerHTML = "Immediate Repeat"

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";
        tr.style.fontWeight = "bold";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 1"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 2"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 1"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 2"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 1"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 2"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 1"

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 2"

        tr.appendChild(td);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("-", __$("fp_test1_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("+", __$("fp_test1_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("-", __$("fp_test2_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("+", __$("fp_test2_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("-", __$("im_test1_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("+", __$("im_test1_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("-", __$("im_test2_result").value.trim(), td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("+", __$("im_test2_result").value.trim(), td);

        var outcomes = {
            "Single Negative": "-",
            "Single Positive": "+",
            "Test 1 & Test 2 Negative": "--",
            "Test 1 & Test 2 Positive": "++",
            "Test 1 & Test 2 Discordant": "Disc",
            "":""
        };

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("-", outcomes[__$("outcome_summary").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("+", outcomes[__$("outcome_summary").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("--", outcomes[__$("outcome_summary").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("++", outcomes[__$("outcome_summary").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("Disc", outcomes[__$("outcome_summary").value.trim()], td);

        var results = {
            "New Negative": "N-",
            "New Positive": "N+",
            "New Exposed Infant": "N<span style='font-size: 10px'>Ex</span>",
            "New Inconclusive":"N<span style='font-size: 10px'>In</span>",
            "Confirmed Positive":"C+",
            "Inconclusive":"C<span style='font-size: 10px'>In</span>",
            "":""
        };

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("N-", results[__$("result_given_to_client").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("N+", results[__$("result_given_to_client").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("N<span style='font-size: 10px'>Ex</span>", results[__$("result_given_to_client").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("N<span style='font-size: 10px'>In</span>", results[__$("result_given_to_client").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("C+", results[__$("result_given_to_client").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("C<span style='font-size: 10px'>In</span>", results[__$("result_given_to_client").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

    }

}
