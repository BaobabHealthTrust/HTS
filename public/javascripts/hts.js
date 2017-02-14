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
var notUnigold = "hiv";

function __$(id) {
    return document.getElementById(id);
}

var timers_running = {
    "fp_test1": {clicked: true, min: 0, sec: 0},

    "fp_test2": {clicked: true, min: 0, sec: 0},

    "im_test1": {clicked: true, min: 0, sec: 0},

    "im_test2": {clicked: true, min: 0, sec: 0}

}

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

        if (age[2] == "Y" && age[0] >= 12 && age[0] <= 50) {

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

function monthDiff(first, last) {

    var d1 = new Date(first);

    var d2 = new Date(last);

    var months;

    months = (d2.getFullYear() - d1.getFullYear()) * 12;

    months -= d1.getMonth() + 1;

    months += d2.getMonth();

    return months <= 0 ? 0 : months;
}


function getAjaxRequest(url, callback, optionalControl) {

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {

        if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
            httpRequest.status == 304)) {

            if (httpRequest.responseText.trim().length > 0) {
                var result = httpRequest.responseText;

                callback(result, optionalControl);

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

    if (!text || !parent)
        return;

    var div = document.createElement("div");
    div.style.paddingTop = "10px";
    div.style.borderRadius = "30px";
    div.style.width = "40px";
    div.style.height = "30px";
    div.style.border = (text && checkText && text.trim().length > 0 && text.trim().toLowerCase() == checkText.trim().toLowerCase() ?
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
        th.innerHTML = "HTS Access Type";
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

        var th = document.createElement("th");
        th.innerHTML = "Partner Status";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.padding = "10px";
        th.style.verticalAlign = "top";
        th.colSpan = 4;

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Client Risk Category";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.padding = "10px";
        th.style.verticalAlign = "top";
        th.colSpan = 4;

        tr.appendChild(th);

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

        verticalText("Routine<i style='color: #eee'>_</i>HTS<i style='color: #eee'>_</i>within Health Service", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";

        tr.appendChild(th);

        verticalText("Comes<i style='color: #eee'>_</i>with<i style='color: #eee'>_</i>HTS Family<i style='color: #eee'>_</i>Ref.<i style='color: #eee'>_</i>Slip", th);

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

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";


        tr.appendChild(th);

        verticalText("No Partner", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";

        tr.appendChild(th);

        verticalText("HIV Unknown", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";

        tr.appendChild(th);

        verticalText("Partner Neg.", th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.paddingRight = "15px";
        th.style.borderRight = "1px solid #333";

        tr.appendChild(th);

        verticalText("Partner Pos.", th);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";


        tr.appendChild(td);

        verticalText("Low<i style='color: #eee'>_</i>Risk", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";

        tr.appendChild(td);

        verticalText("On-going<i style='color: #eee'>_</i>Risk", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";

        tr.appendChild(td);

        verticalText("High<i style='color: #eee'>_</i>Risk<i style='color: #eee'>_</i>Event<i style='color: #eee'>_</i>" +
            "in<br/>last<i style='color: #eee'>_</i>3<i style='color: #eee'>_</i>months", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        verticalText("Risk<i style='color: #eee'>_</i>assessment<br/>Not<i style='color: #eee'>_</i>Done", td);


        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("td");
        th.style.borderRight = "1px solid #333";
        th.style.borderBottom = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

        var HATMapping = {
            "Routine HTS (PITC) within Health Service": "PITC",
            "Comes with HTS Family Reference Slip": "FRS",
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
        var age = getAge(__$("time_since_last_test_date").value, 0);
        addDiv(age[1], "", th, true);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        //th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        var partner_present = "N";

        if (!noPartnerToday()) {

            partner_present = "Y";

        } else if (__$("partner_present") && __$("partner_present").value) {

            partner_present = __$("partner_present").value.trim().substring(0, 1).toUpperCase();

        }

        addDiv("N", partner_present, th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("Y", partner_present, th);

        var PTSMapping = {
            "No Partner": "NoP",
            "HIV Unknown": "P?",
            "Partner Negative": "P-",
            "Partner Positive": "P+"
        };

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("NoP", PTSMapping[__$("phs").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("P?", PTSMapping[__$("phs").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("P-", PTSMapping[__$("phs").value.trim()], th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.align = "center";
        th.style.borderRight = "1px solid #333";

        tr.appendChild(th);

        addDiv("P+", PTSMapping[__$("phs").value.trim()], th);

        var risksMapping = {
            "Low Risk": "Low",
            "On-going Risk": "Ong",
            "High Risk Event in Last 3 months": "Hi",
            "Risk assessment Not Done": "ND",
            "": ""
        };

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";


        tr.appendChild(td);

        addDiv("Low", risksMapping[__$("risk_category").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";


        tr.appendChild(td);

        addDiv("Ong", risksMapping[__$("risk_category").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("Hi", risksMapping[__$("risk_category").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("ND", risksMapping[__$("risk_category").value.trim()], td);


        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.innerHTML = "&nbsp;";

        tr.appendChild(th);

    }

}

function setAjaxUrl(pos) {

    switch (pos) {

        case -1:

            if (__$("home_district")) {

                __$("home_district").setAttribute("ajaxURL", "/district_query?region=" + __$("touchscreenInput" +
                        tstCurrentPage).value.trim() + "&district=");

            }

            break;

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

                /*First Kit always With description of First Test*/

                __$('fp_item_name1').setAttribute('ajaxURL', '/stock/stock_items?category=' + __$('touchscreenInput' +
                        tstCurrentPage).value.trim() + "&description=" + encodeURIComponent("First Test") + '&item_name=');

            }

            break;

        case 4:

            if (__$("fp_lot_number1")) {

                __$('fp_lot_number1').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' + window.parent.dashboard.getCookie("username") +
                    "&item_name=" + __$('touchscreenInput' + tstCurrentPage).value.trim() + "&batch=");

            }

            break;

        case 5:

            if (__$("fp_item_name2")) {

                var exceptions = encodeURIComponent('["' + __$("fp_item_name1").value + '"]');

                __$('fp_item_name2').setAttribute('ajaxURL', '/stock/stock_items?category=' + __$('touchscreenInput' +
                        tstCurrentPage).value.trim() + "&exceptions=" + exceptions + "&description=" + encodeURIComponent("Second Test") + '&item_name=');

            }

            break;

        case 6:

            if (__$("fp_lot_number2")) {

                var exceptions = encodeURIComponent('["' + __$("fp_item_name1").value + '"]');

                __$('fp_lot_number2').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' + window.parent.dashboard.getCookie("username") +
                    "&item_name=" + __$('touchscreenInput' + tstCurrentPage).value.trim() + "&exceptions=" + exceptions + "&batch=");


            }

            break;

        case 7:

            if (__$("im_item_name1")) {


                __$('im_item_name1').setAttribute('ajaxURL', '/stock/stock_items?category=' + __$('touchscreenInput' +
                        tstCurrentPage).value.trim() + "&description=" + encodeURIComponent("First Test") + '&item_name=');

            }

            break;

        case 8:

            if (__$("im_lot_number1")) {

                __$('im_lot_number1').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                    window.parent.dashboard.getCookie("username") + "&item_name=" + __$('touchscreenInput' +
                        tstCurrentPage).value.trim() + "&batch=");

            }

            break;

        case 9:

            if (__$("im_item_name2")) {

                var exceptions = encodeURIComponent('["' + __$("im_item_name1").value + '"]');

                __$('im_item_name2').setAttribute('ajaxURL', '/stock/stock_items?category=' + __$('touchscreenInput' +
                        tstCurrentPage).value.trim() + "&exceptions=" + exceptions + '&item_name=');

            }

            break;

        case 10:

            if (__$("im_lot_number2")) {

                __$('im_lot_number2').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                    window.parent.dashboard.getCookie("username") + "&item_name=" + __$('touchscreenInput' +
                        tstCurrentPage).value.trim() + "&batch=");

            }

            break;

    }


}

function saveConsumption(dispatch_id, target_id) {

    var patient_id = window.parent.dashboard.getCookie("patient_id");

    var consumption_type = "Normal use";
    var consumption_quantity = 1;
    var who_consumed = patient_id;
    var date_consumed = (window.parent.dashboard.getCookie("today").trim().length > 0 ? window.parent.dashboard.getCookie("today") :
        (new Date()).format("YYYY-mm-dd HH:MM:SS"));
    var reason_for_consumption = "Normal use";
    var location = window.parent.dashboard.getCookie("location");
    var userId = window.parent.dashboard.getCookie("username");

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
            datatype: "consumption",
            token: window.parent.dashboard.getCookie("token")
        }
    }

    ajaxPostRequest("/stock/save_item", data, function (result) {

        var json = JSON.parse(result);

        if (__$(target_id)) {

            __$(target_id).setAttribute("consumption_id", json.consumption_id);

        }

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

var lastHIVStatus = (window.parent.dashboard ? window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
    "PRE TEST COUNSELLING", "Last HIV test") : null);

function evalCondition(pos) {

    customizeCancel("HIV TESTING");

    lastHIVStatus = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "PRE TEST COUNSELLING", "Last HIV test");

    var result = false;

    switch (pos) {

        case -3:

            if (window.parent.dashboard.subscription.timers &&
                window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] &&
                Object.keys(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")]).length > 0 &&
                window.parent.dashboard.$$("im_lot_number1").value.trim().length > 0 && window.parent.dashboard.$$("im_lot_number2").value.trim().length > 0) {

                result = true;

            } else {

                result = false;

            }

            break;

        case -2:

            if (window.parent.dashboard.subscription.timers &&
                window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] &&
                Object.keys(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")]).length > 0 &&
                (typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][window.parent.dashboard.$$("fp_item_name2").value.trim() +
                " " + "First Pass"] != typeof undefined ||
                (typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][window.parent.dashboard.$$("fp_item_name2").value.trim() +
                " " + "First Parallel"] != typeof undefined) ||
                (typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][window.parent.dashboard.$$("fp_item_name2").value.trim() +
                " " + "Immediate Parallel"] != typeof undefined))) {

                result = true;

            } else {

                result = false;

            }

            break;

        case -1:

            if (window.parent.dashboard.subscription.timers &&
                window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] &&
                Object.keys(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")]).length > 0 &&
                (typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][window.parent.dashboard.$$("fp_item_name1").value.trim() +
                " " + "First Pass"] != typeof undefined ||
                (typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][window.parent.dashboard.$$("fp_item_name1").value.trim() +
                " " + "First Parallel"] != typeof undefined) ||
                (typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][window.parent.dashboard.$$("fp_item_name1").value.trim() +
                " " + "Immediate Parallel"] != typeof undefined))) {

                result = false;

            } else {

                result = true;

            }

            break;

        case 0:

            if (__$("consent") && __$("consent").value == "Yes" && ( (lastHIVStatus == "Never Tested" ||
                lastHIVStatus == "Last Negative") ||
                (lastHIVStatus == "Last Inconclusive" ||
                lastHIVStatus == "Last Positive" ||
                lastHIVStatus == "Last Exposed Infant") )) {

                result = true;

            }

            break;

        case 1:

            if (__$("consent") && __$("consent").value == "Yes" && (lastHIVStatus == "Never Tested" ||
                lastHIVStatus == "Last Negative")) {

                result = true;

            }

            break;

        case 2:

            if (__$("consent") && __$("consent").value == "Yes" && ( ((lastHIVStatus == "Never Tested" ||
                lastHIVStatus == "Last Negative") &&
                __$("fp_test1_result").value == "+") || (lastHIVStatus == "Last Inconclusive" ||
                lastHIVStatus == "Last Positive" ||
                lastHIVStatus == "Last Exposed Infant") )) {

                result = true;

            }

            break;

        case 3:

            if (__$("consent") && __$("consent").value == "Yes" && (lastHIVStatus == "Never Tested" ||
                lastHIVStatus == "Last Negative") && __$("fp_test1_result").value == "+") {

                result = true;

            }

            break;

        case 4:

            if (__$("consent") && __$("consent").value == "Yes" && (lastHIVStatus == "Last Inconclusive" ||
                lastHIVStatus == "Last Positive" || lastHIVStatus == "Last Exposed Infant")) {

                result = true;

            }

            break;

        case 5:

            if (__$("consent") && __$("consent").value == "Yes" && ( ((lastHIVStatus == "Never Tested" ||
                lastHIVStatus == "Last Negative") &&
                __$("fp_test2_result").value.trim().length > 0 && __$("fp_test1_result").value !=
                __$("fp_test2_result").value) || (lastHIVStatus == "Last Positive" &&
                (__$("fp_test1_result").value.trim().length > 0 && __$("fp_test2_result").value.trim().length > 0 &&
                __$("fp_test1_result").value != __$("fp_test2_result").value)) )) {

                result = true;

            }

            if (__$("consent") && __$("consent").value == "Yes" && (lastHIVStatus == "Last Exposed Infant"
                && __$("fp_test2_result").value.trim().length > 0 && __$("fp_test1_result").value !=
                __$("fp_test2_result").value)) {


                result = true;
            }

            break;

        case 6:

            if ((String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
                    "HTS CLIENT REGISTRATION", "Sex/Pregnancy")).trim() == "M")) {

                result = true;

            }

            break;

        case 7:

            if (["FP", "FNP"].indexOf((String(window.parent.dashboard.queryActiveObs("HTS PROGRAM",
                    (new Date()).format("YYYY-mm-dd"), "HTS CLIENT REGISTRATION", "Sex/Pregnancy")).trim())) >= 0) {

                result = true;

            }

            break;

    }

    return result;

}

function recommendedTimerForLabels(labels) {

    if (labels[0].length == 0)
        return;

    for (var i = 0; i < labels.length; i++) {

        getAjaxRequest("/stock/get_pack_size/" + encodeURIComponent(labels[i]), function (data) {

            var label_data = JSON.parse(data);

            if (!window.parent.dashboard.data.stock_label_data)
                window.parent.dashboard.data.stock_label_data = {};

            window.parent.dashboard.data.stock_label_data[label_data.id] = {
                rec_time: label_data.rec_time,
                window_time: label_data.window_time
            }

        });

    }

}

function removeParallelTests() {

    if (__$("inputFrame" + tstCurrentPage)) {

        __$("inputFrame" + tstCurrentPage).innerHTML = "";

    }

}

function loadPassParallelTests(test1Target, test1TimeTarget, test2Target, test2TimeTarget, label1, label2, pass) {

    if (!test1Target || !test1TimeTarget || !test2Target || !test2TimeTarget) {

        return;

    }

    tmrControl1SecsCount = 0;
    tmrControl1MinsCount = 0;
    tmrControl2SecsCount = 0;
    tmrControl2MinsCount = 0;

    var loadingForm = false;

    if (__$("nextButton") && test1TimeTarget.getAttribute("startTime") == null) {

        var currentClass = __$("nextButton").className;

        __$("nextButton").className = currentClass.replace(/blue|green/i, "gray");

    }

    var mainTable = document.createElement("table");
    mainTable.id = "timerMainTable";
    mainTable.style.margin = "auto";

    if (__$("inputFrame" + tstCurrentPage)) {

        __$("inputFrame" + tstCurrentPage).innerHTML = "";

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
    table.id = "timeTable1";
    table.style.margin = "auto";
    table.border = 0;

    mainTd1.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    td.style.borderRadius = "g10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px solid #3c60b1";
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
    btn.setAttribute("timeTarget", test1TimeTarget.id);
    btn.setAttribute("label", (label1 ? label1 : "Test1"));
    btn.setAttribute("pass", (pass ? pass : "First Pass"));
    btn.id = "startTimer2.1";

    btn.onmousedown = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        /*
         Makes sense to block back button once timers are rolling because the next sensible move would be
         cancelling if not happy
         */
        if (__$("backButton")) {

            var currentClass = __$("backButton").className;

            __$("backButton").className = currentClass.replace(/blue|green/i, "gray");

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).setAttribute("startTime", (new Date()));

        }

        window.parent.dashboard.startTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

        showMinimizeButton();

        if (!loadingForm) {

            var data = form2js(document.getElementById('data'), undefined, false, undefined, undefined, true);

            window.parent.dashboard.saveTemporaryData("HIV TESTING", data);

        } else {

            loadingForm = false;

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

                var label_data = window.parent.dashboard.data.stock_label_data[label1]

                var window_time = parseInt(label_data.rec_time) + parseInt(label_data.window_time)

                if (tmrControl1MinsCount >= parseInt(label_data.rec_time) && tmrControl1MinsCount < window_time) {

                    __$("tmrControl1").style.color = "green";

                } else if (tmrControl1MinsCount >= window_time) {

                    __$("tmrControl1").style.color = "#d9d8d7";

                }

            }

        }, 1000);

        var target = test1Target.id.split("_")[0] + "_" + test1Target.id.split("_")[1];

        timers_running[target].clicked = false;


        timers_running[target].min = tmrControl1MinsCount;

        timers_running[target].sec = tmrControl1SecsCount;

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

    var test1 = "First";

    if (__$("fp_item_name1").value && __$("fp_item_name1").value != "") {

        test1 = __$("fp_item_name1").value

    }

    if (__$("im_item_name1").value && __$("im_item_name1").value != "") {

        test1 = __$("im_item_name1").value

    }

    td.innerHTML = (label1 ? label1 : test1 + " Test") + " Result " + "<font style='color:green' id='l1_minutes'> </font>";
    td.style.fontSize = "3vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test1TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Non Reactive";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest1Nve";
    btn.setAttribute("target", test1Target.id);
    btn.setAttribute("timeTarget", test1TimeTarget.id);
    btn.setAttribute("target2", test2Target.id);
    btn.setAttribute("timeTarget2", test2TimeTarget.id);
    btn.setAttribute("label", (label1 ? label1 : "Test1"));
    btn.setAttribute("pass", (pass ? pass : "First Pass"));

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        window.parent.dashboard.stopTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

        clearInterval(tmrControl1Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "-";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

                hideMinimizeButton();

            }

        }

        //Disbabling the other button

        __$('btnTest1Nve').className = "green";

        __$('btnTest1Pve').className = "blue";

        var time = __$("tmrControl1").innerHTML;

        if (test1Target.id.trim() == "fp_test1_result") {

            __$("fp_test1_time").setAttribute("condition", true);

            __$("fp_test1_time").value = time;

        }

        if (test1Target.id.trim() == "im_test1_result") {


            __$("im_test1_time").setAttribute("condition", true);

            __$("im_test1_time").value = time;

        }


    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test1TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Reactive";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest1Pve";
    btn.setAttribute("target", test1Target.id);
    btn.setAttribute("timeTarget", test1TimeTarget.id);
    btn.setAttribute("target2", test2Target.id);
    btn.setAttribute("timeTarget2", test2TimeTarget.id);
    btn.setAttribute("label", (label1 ? label1 : "Test1"));
    btn.setAttribute("pass", (pass ? pass : "First Pass"));

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        window.parent.dashboard.stopTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

        clearInterval(tmrControl1Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "+";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

                hideMinimizeButton();

            }

        }

        //Disbabling the other button

        __$('btnTest1Nve').className = "blue";

        __$('btnTest1Pve').className = "green";


        var time = __$("tmrControl1").innerHTML;

        if (test1Target.id.trim() == "fp_test1_result") {

            __$("fp_test1_time").setAttribute("condition", true);

            __$("fp_test1_time").value = time;

        }

        if (test1Target.id.trim() == "im_test1_result") {


            __$("im_test1_time").setAttribute("condition", true);

            __$("im_test1_time").value = time;

        }


    }

    td.appendChild(btn);

    var table = document.createElement("table");
    table.id = "timeTable2";
    table.style.margin = "auto";
    table.border = 0;

    mainTd2.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    //td.style.borderRadius = "10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px solid #3c60b1";
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
    btn.setAttribute("timeTarget", test2TimeTarget.id);
    btn.setAttribute("label", (label2 ? label2 : "Test2"));
    btn.setAttribute("pass", (pass ? pass : "First Pass"));
    btn.id = "startTimer2.2";

    btn.onmousedown = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        /*
         Makes sense to block back button once timers are rolling because the next sensible move would be
         cancelling if not happy
         */
        if (__$("backButton")) {

            var currentClass = __$("backButton").className;

            __$("backButton").className = currentClass.replace(/blue|green/i, "gray");

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).setAttribute("startTime", (new Date()));

        }

        window.parent.dashboard.startTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

        showMinimizeButton();

        if (!loadingForm) {

            var data = form2js(document.getElementById('data'), undefined, false, undefined, undefined, true);

            window.parent.dashboard.saveTemporaryData("HIV TESTING", data);

        } else {

            loadingForm = false;

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

            if (__$("tmrControl2") && window.parent.dashboard.data.stock_label_data &&
                window.parent.dashboard.data.stock_label_data[label2]) {

                __$("tmrControl2").innerHTML = time;

                var label2_data = window.parent.dashboard.data.stock_label_data[label2]

                var window_time = parseInt(label2_data.rec_time) + parseInt(label2_data.window_time)

                if (tmrControl2MinsCount >= parseInt(label2_data.rec_time) && tmrControl2MinsCount < window_time) {

                    __$("tmrControl2").style.color = "green";

                } else if (tmrControl2MinsCount >= window_time) {

                    __$("tmrControl2").style.color = "#d9d8d7";

                }

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

        var target = test2Target.id.split("_")[0] + "_" + test2Target.id.split("_")[1];

        timers_running[target].clicked = false;


        timers_running[target].min = tmrControl2MinsCount;

        timers_running[target].sec = tmrControl2SecsCount;

    }

    td.appendChild(btn);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");

    var test2 = "Second";

    if (__$("fp_item_name2").value && __$("fp_item_name2").value != "") {

        test2 = __$("fp_item_name2").value

    }

    if (__$("im_item_name2").value && __$("im_item_name2").value != "") {

        test2 = __$("im_item_name2").value

    }

    td.innerHTML = (label2 ? label2 : test2 + " Test") + " Result " + "<font style='color:green' id='l2_minutes'></font>";
    td.style.fontSize = "3vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test2TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Non Reactive";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest2Nve";
    btn.setAttribute("target", test2Target.id);
    btn.setAttribute("timeTarget", test2TimeTarget.id);
    btn.setAttribute("target2", test1Target.id);
    btn.setAttribute("timeTarget2", test1TimeTarget.id);
    btn.setAttribute("label", (label2 ? label2 : "Test2"));
    btn.setAttribute("pass", (pass ? pass : "First Pass"));

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        window.parent.dashboard.stopTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

        clearInterval(tmrControl2Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "-";

        }

        if (__$("touchscreenInput" + tstCurrentPage)) {

            __$("touchscreenInput" + tstCurrentPage).value = "-";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

                hideMinimizeButton();

            }

        }

        //Disbabling the other button

        __$('btnTest2Nve').className = "green";

        __$('btnTest2Pve').className = "blue";

        var time = __$("tmrControl2").innerHTML;

        if (test2Target.id.trim() == "fp_test2_result") {

            __$("fp_test2_time").setAttribute("condition", true);

            __$("fp_test2_time").value = time;

        }

        if (test2Target.id.trim() == "im_test2_result") {


            __$("im_test2_time").setAttribute("condition", true);

            __$("im_test2_time").value = time;

        }


    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test2TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Reactive";
    btn.style.fontSize = "5vh !important";
    btn.style.minWidth = "8vh";
    btn.style.minHeight = "5vh";
    btn.id = "btnTest2Pve";
    btn.setAttribute("target", test2Target.id);
    btn.setAttribute("timeTarget", test2TimeTarget.id);
    btn.setAttribute("target2", test1Target.id);
    btn.setAttribute("timeTarget2", test1TimeTarget.id);
    btn.setAttribute("label", (label2 ? label2 : "Test2"));
    btn.setAttribute("pass", (pass ? pass : "First Pass"));

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        window.parent.dashboard.stopTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

        clearInterval(tmrControl2Hnd);

        if (__$(this.getAttribute("target"))) {

            __$(this.getAttribute("target")).value = "+";

        }

        if (__$("touchscreenInput" + tstCurrentPage)) {

            __$("touchscreenInput" + tstCurrentPage).value = "+";

        }

        if (__$(this.getAttribute("timeTarget"))) {

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        //Disbabling the other button

        __$('btnTest2Nve').className = "blue";

        __$('btnTest2Pve').className = "green";


        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

                hideMinimizeButton();

            }

        }

        var time = __$("tmrControl2").innerHTML;

        if (test2Target.id.trim() == "fp_test2_result") {

            __$("fp_test2_time").setAttribute("condition", true);

            __$("fp_test2_time").value = time;

        }

        if (test2Target.id.trim() == "im_test2_result") {


            __$("im_test2_time").setAttribute("condition", true);

            __$("im_test2_time").value = time;

        }

    }

    td.appendChild(btn);

    var minuteLabelInterval = setInterval(function () {

        if (window.parent.dashboard.data.stock_label_data && window.parent.dashboard.data.stock_label_data[label1] &&
            window.parent.dashboard.data.stock_label_data[label1].rec_time && window.parent.dashboard.data.stock_label_data[label2] &&
            window.parent.dashboard.data.stock_label_data[label2].rec_time) {

            clearInterval(minuteLabelInterval);

            __$("l1_minutes").innerHTML = window.parent.dashboard.data.stock_label_data[label1].rec_time + " Minutes";

            __$("l2_minutes").innerHTML = window.parent.dashboard.data.stock_label_data[label2].rec_time + " Minutes";

        }

    }, 500);

    if (typeof window.parent.dashboard.subscription != typeof undefined && typeof window.parent.dashboard.subscription.timers != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label1 + " " + pass).trim()] != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label1 + " " + pass).trim()].count != typeof undefined) {

        var counter = parseInt(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label1 + " " + pass).trim()].count);

        tmrControl1SecsCount = counter % 60;

        tmrControl1MinsCount = (counter - tmrControl1SecsCount) / 60;

        var target = test1Target.id.split("_")[0] + "_" + test1Target.id.split("_")[1];

        if (window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label1 + " " + pass).trim()].running &&
            __$("startTimer2.1") && timers_running[target].clicked) {

            timers_running[target].clicked = false;

            loadingForm = true;

            __$("startTimer2.1").onmousedown();

        }

    }

    if (typeof window.parent.dashboard.subscription != typeof undefined && typeof window.parent.dashboard.subscription.timers != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label2 + " " + pass).trim()] != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label2 + " " + pass).trim()].count != typeof undefined) {

        var counter = parseInt(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label2 + " " + pass).trim()].count);

        tmrControl2SecsCount = counter % 60;

        tmrControl2MinsCount = (counter - tmrControl2SecsCount) / 60;

        var target = test2Target.id.split("_")[0] + "_" + test2Target.id.split("_")[1];

        if (__$("startTimer2.2") &&
            window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label2 + " " + pass).trim()].running && timers_running[target].clicked) {

            timers_running[target].clicked = false;

            loadingForm = true;

            __$("startTimer2.2").onmousedown();

        }

    }

    if (test1Target.id == "fp_test1_result" && test2Target.id == "fp_test2_result") {

        var time1 = padZeros(tmrControl1MinsCount, 2) + ":" + padZeros(tmrControl1SecsCount, 2);

        var time2 = padZeros(tmrControl2MinsCount, 2) + ":" + padZeros(tmrControl2SecsCount, 2);

        __$("tmrControl1").innerHTML = time1;

        __$("tmrControl2").innerHTML = time2;

    }

    if (test1Target.id == "im_test1_result" && test2Target.id == "im_test2_result") {

        var time1 = padZeros(tmrControl1MinsCount, 2) + ":" + padZeros(tmrControl1SecsCount, 2);

        var time2 = padZeros(tmrControl2MinsCount, 2) + ":" + padZeros(tmrControl2SecsCount, 2);

        __$("tmrControl1").innerHTML = time1;

        __$("tmrControl2").innerHTML = time2;

    }

    //If value is set read value from control 

    if (__$("fp_test1_time").value && test1Target.id == "fp_test1_result") {

        if (__$("fp_test1_time").value.match(",") == null)

            __$("tmrControl1").innerHTML = __$("fp_test1_time").value;

    }

    if (__$("fp_test2_time").value && test2Target.id == "fp_test2_result") {

        if (__$("fp_test2_time").value.match(",") == null)

            __$("tmrControl2").innerHTML = __$("fp_test2_time").value;

    }

    if (__$("im_test1_time").value && test1Target.id == "im_test1_result") {

        if (__$("im_test1_time").value.match(",") == null)

            __$("tmrControl1").innerHTML = __$("im_test1_time").value;

    }

    if (__$("im_test2_time").value && test2Target.id == "im_test2_result") {

        if (__$("im_test2_time").value.match(",") == null)

            __$("tmrControl2").innerHTML = __$("im_test2_time").value;

    }

    //Enabling Buttons
    if (__$(test1Target.id).value && __$(test1Target.id).value == "+") {

        __$('btnTest1Pve').className = "green";


    } else if (__$(test1Target.id).value && __$(test1Target.id).value == "-") {

        __$("btnTest1Nve").className = "green";

    }

    if (__$(test2Target.id).value && __$(test2Target.id).value == "+") {

        __$('btnTest2Pve').className = "green";


    } else if (__$(test2Target.id).value && __$(test2Target.id).value == "-") {

        __$("btnTest2Nve").className = "green";

    }

}

function loadSerialTest(testTarget, testTimeTarget, label, pass) {

    customizeCancel("HIV TESTING");

    var url = "/stock/get_pack_size/" + encodeURIComponent(label);

    getAjaxRequest(url, function (data) {


        if (!testTarget || !testTimeTarget) {

            return;

        }

        var loadingForm = false;

        var target = testTarget.id.split("_")[0] + "_" + testTarget.id.split("_")[1];

        tmrControl1SecsCount = timers_running[target].sec ? timers_running[target].sec : 0;

        tmrControl1MinsCount = timers_running[target].min ? timers_running[target].min : 0;

        if (__$("nextButton") && testTimeTarget.getAttribute("startTime") == null) {

            var currentClass = __$("nextButton").className;

            __$("nextButton").className = currentClass.replace(/blue|green/i, "gray");


        }

        var label_data = JSON.parse(data);

        var table = document.createElement("table");
        table.id = "timeTable1";
        table.style.margin = "auto";
        table.border = 0;

        if (__$("inputFrame" + tstCurrentPage)) {

            __$("inputFrame" + tstCurrentPage).appendChild(table);

        }

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.id = "timeTD1";
        td.align = "center";
        td.verticalAlign = "middle";
        td.style.border = "1px solid #3c60b1";
        //td.style.borderRadius = "10px";
        td.style.padding = "25px";
        td.colSpan = 3;
        td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

        tr.appendChild(td);

        var div = document.createElement("div");
        div.style.border = "3px solid #3c60b1";
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
        btn.setAttribute("timeTarget", testTimeTarget.id);
        btn.setAttribute("label", (label ? label : "Test"));
        btn.setAttribute("pass", (pass ? pass : "First Pass"));
        btn.id = "startTimer1";

        btn.onmousedown = function () {

            if (this.className.match(/gray/i)) {

                return;

            }

            /*
             Makes sense to block back button once timers are rolling because the next sensible move would be
             cancelling if not happy
             */
            if (__$("backButton")) {

                var currentClass = __$("backButton").className;

                __$("backButton").className = currentClass.replace(/blue|green/i, "gray");

            }

            if (__$(this.getAttribute("timeTarget"))) {

                __$(this.getAttribute("timeTarget")).setAttribute("startTime", (new Date()));

            }

            window.parent.dashboard.startTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

            showMinimizeButton();

            if (!loadingForm) {

                var data = form2js(document.getElementById('data'), undefined, false, undefined, undefined, true);

                window.parent.dashboard.saveTemporaryData("HIV TESTING", data);

            } else {

                loadingForm = false;

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

                    var window_time = parseInt(label_data.rec_time) + parseInt(label_data.window_time)


                    if (tmrControl1MinsCount >= parseInt(label_data.rec_time) && tmrControl1MinsCount < window_time) {

                        __$("tmrControl1").style.color = "green";

                    } else if (tmrControl1MinsCount >= window_time) {

                        __$("tmrControl1").style.color = "#d9d8d7";

                    }


                }

                var target = testTarget.id.split("_")[0] + "_" + testTarget.id.split("_")[1];

                timers_running[target].clicked = false;


                timers_running[target].min = tmrControl1MinsCount;

                timers_running[target].sec = tmrControl1SecsCount;

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


        td.innerHTML = (label ? label : "Test") + " Result " + (label_data.rec_time ? "<font style='color:green'> - " + label_data.rec_time + " Minutes</font>" : "");
        td.style.fontSize = "3vh";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "right";

        tr.appendChild(td);

        var btn = document.createElement("button");
        btn.className = (testTimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
        btn.innerHTML = "Non Reactive";
        btn.style.fontSize = "5vh !important";
        btn.style.minWidth = "8vh";
        btn.style.minHeight = "5vh";
        btn.id = "btnTest1Nve";
        btn.setAttribute("target", testTarget.id);
        btn.setAttribute("timeTarget", testTimeTarget.id);
        btn.setAttribute("label", (label ? label : "Test"));
        btn.setAttribute("pass", (pass ? pass : "First Pass"));

        btn.onclick = function () {

            if (this.className.match(/gray/i)) {

                return;

            }

            window.parent.dashboard.stopTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

            hideMinimizeButton();

            clearInterval(tmrControl1Hnd);

            if (__$(this.getAttribute("target"))) {

                __$(this.getAttribute("target")).value = "-";

            }

            if (__$("touchscreenInput" + tstCurrentPage)) {

                __$("touchscreenInput" + tstCurrentPage).value = "-";

            }

            if (__$(this.getAttribute("timeTarget"))) {

                var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

                var now = (new Date());

                var duration = (now - startTime) / (60 * 1000);

                __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

            }


            __$('btnTest1Nve').className = "green";

            __$('btnTest1Pve').className = "blue";

            if (__$("nextButton")) {

                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

            var time = __$("tmrControl1").innerHTML;

            if (testTarget.id.trim() == "fp_test1_result") {

                __$("fp_test1_time").setAttribute("condition", true);

                __$("fp_test1_time").value = time;

            }

            if (testTarget.id.trim() == "fp_test2_result") {

                __$("fp_test2_time").setAttribute("condition", true);

                __$("fp_test2_time").value = time;

            }

        }

        td.appendChild(btn);

        var td = document.createElement("td");
        td.align = "right";

        tr.appendChild(td);

        var btn = document.createElement("button");
        btn.className = (testTimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
        btn.innerHTML = "Reactive";
        btn.style.fontSize = "5vh !important";
        btn.style.minWidth = "8vh";
        btn.style.minHeight = "5vh";
        btn.id = "btnTest1Pve";
        btn.setAttribute("target", testTarget.id);
        btn.setAttribute("timeTarget", testTimeTarget.id);
        btn.setAttribute("label", (label ? label : "Test"));
        btn.setAttribute("pass", (pass ? pass : "First Pass"));

        btn.onclick = function () {

            if (this.className.match(/gray/i)) {

                return;

            }

            window.parent.dashboard.stopTimer((this.getAttribute("label") + " " + this.getAttribute("pass")).trim());

            hideMinimizeButton();

            clearInterval(tmrControl1Hnd);

            if (__$(this.getAttribute("target"))) {

                __$(this.getAttribute("target")).value = "+";

            }

            if (__$("touchscreenInput" + tstCurrentPage)) {

                __$("touchscreenInput" + tstCurrentPage).value = "+";

            }

            if (__$(this.getAttribute("timeTarget"))) {

                var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

                var now = (new Date());

                var duration = (now - startTime) / (60 * 1000);

                __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

            }

            __$('btnTest1Nve').className = "blue";

            __$('btnTest1Pve').className = "green";


            if (__$("nextButton")) {

                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

            var time = __$("tmrControl1").innerHTML;

            if (time.trim().length <= 0)
                time = "";

            if (testTarget.id.trim() == "fp_test1_result") {

                __$("fp_test1_time").setAttribute("condition", true);

                __$("fp_test1_time").value = time;

            }

            if (testTarget.id.trim() == "fp_test2_result") {

                __$("fp_test2_time").setAttribute("condition", true);

                __$("fp_test2_time").value = time;

            }

        }

        td.appendChild(btn);

        if (typeof window.parent.dashboard.subscription != typeof undefined && typeof window.parent.dashboard.subscription.timers != typeof undefined &&
            typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] != typeof undefined &&
            typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label + " " + pass).trim()] != typeof undefined &&
            typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label + " " + pass).trim()].count != typeof undefined) {

            var counter = parseInt(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label + " " + pass).trim()].count);

            tmrControl1SecsCount = counter % 60;

            tmrControl1MinsCount = (counter - tmrControl1SecsCount) / 60;

            var target = testTarget.id.split("_")[0] + "_" + testTarget.id.split("_")[1];

            if (__$("startTimer1") &&
                window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][(label + " " + pass).trim()].running && timers_running[target].clicked) {

                timers_running[target].clicked = false;

                loadingForm = true;

                __$("startTimer1").onmousedown();

            }

        }

        var time = padZeros(tmrControl1MinsCount, 2) + ":" + padZeros(tmrControl1SecsCount, 2);

        if (testTarget.id == "fp_test1_result") {

            __$("tmrControl1").innerHTML = time;


        } else if (testTarget.id == "fp_test2_result") {

            __$("tmrControl1").innerHTML = time;

        }


        if (__$("fp_test1_time").value && testTarget.id == "fp_test1_result") {

            if (__$("fp_test1_time").value.match(",") == null)
                __$("tmrControl1").innerHTML = __$("fp_test1_time").value;


        } else if (__$("fp_test2_time").value && testTarget.id == "fp_test2_result") {

            if (__$("fp_test2_time").value.match(",") == null)
                __$("tmrControl1").innerHTML = __$("fp_test2_time").value;

        }

        if (__$(testTarget.id).value && __$(testTarget.id).value == "+") {

            __$('btnTest1Pve').className = "green";


        } else if (__$(testTarget.id).value && __$(testTarget.id).value == "-") {

            __$("btnTest1Nve").className = "green";

        }


    }, null);

}

function activateNavBtn() {

    if (__$("nextButton")) {

        var currentClass = __$("nextButton").className;

        __$("nextButton").className = currentClass.replace(/gray/i, "green");

    }

    if (__$("backButton")) {

        var currentClass = __$("backButton").className;

        __$("backButton").className = currentClass.replace(/gray/i, "blue");

    }

    var lastHIVStatus = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "PRE TEST COUNSELLING", "Last HIV test");

    decodeResult(lastHIVStatus, decodeURIComponent(window.parent.dashboard.getCookie("AgeGroup")),
        __$("fp_test1_result").value.trim(), __$("fp_test2_result").value.trim(), __$("im_test1_result").value.trim(),
        __$("im_test2_result").value.trim(), __$("outcome_summary"), __$("result_given_to_client"));

}

function decodeResult(lastHIVTestResult, ageGroup, fpTest1Result, fpTest2Result, imTest1Result, imTest2Result, outcomeControl, resultGivenControl) {

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

                if (ageGroup == "0-11 months" || parseInt(monthDiff(window.parent.dashboard.data.data.birthdate, (new Date()).format("YYYY-mm-dd"))) <= 23) {

                    window.parent.dashboard.showMsg("Take DBS sample for confirmatory", "");

                }

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && imTest1Result.trim() == "-" &&
                imTest2Result.trim() == "-") {

                outcome = "Test 1 & Test 2 Negative";

                result = "New Negative";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && imTest1Result.trim() == "+" &&
                imTest2Result.trim() == "+") {

                outcome = "Test 1 & Test 2 Positive";

                result = (ageGroup == "0-11 months" ? "New Exposed Infant" : "New Positive");

                if (ageGroup == "0-11 months" || parseInt(monthDiff(window.parent.dashboard.data.data.birthdate, (new Date()).format("YYYY-mm-dd"))) <= 23) {

                    window.parent.dashboard.showMsg("Take DBS sample for confirmatory", "");

                }

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && ((imTest1Result.trim() == "-" &&
                imTest2Result.trim() == "+") || (imTest1Result.trim() == "+" && imTest2Result.trim() == "-"))) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "New Inconclusive";

            }

            break;
        case "last positive":

            if ((imTest1Result.trim() == "-" && imTest2Result.trim() == "-")) {

                outcome = "Test 1 & Test 2 Negative";

                result = "Confirmatory Inconclusive";

                window.parent.dashboard.showMsg("Take DBS sample", "");

            } else if ((imTest1Result.trim() == "+" && imTest2Result.trim() == "-") ||
                (imTest1Result.trim() == "-" && imTest2Result.trim() == "+")) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "Confirmatory Inconclusive";

                window.parent.dashboard.showMsg("Take DBS sample", "");

            } else if (fpTest1Result.trim() == "-" && fpTest2Result.trim() == "-") {

                outcome = "Test 1 & Test 2 Negative";

                result = "Confirmatory Inconclusive";

                __$("sample_id").setAttribute("condition", true);

                window.parent.dashboard.showMsg("Take DBS sample", "");

                setTimeout(function () {

                    __$("sample_id").setAttribute("condition", false);

                }, 500);

            } else if ((fpTest1Result.trim() == "+" && fpTest2Result.trim() == "+") || (imTest1Result.trim() == "+" &&
                imTest2Result.trim() == "+")) {

                outcome = "Test 1 & Test 2 Positive";

                result = "Confirmatory Positive";


            }
            break;

        case "last exposed infant":

            if ((fpTest1Result.trim() == "-" && fpTest2Result.trim() == "-" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) || (fpTest1Result.trim() != fpTest2Result.trim() &&
                imTest1Result.trim() != imTest2Result.trim())) {

                outcome = "Test 1 & Test 2 Negative";

                result = "New Negative";

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "+" && imTest1Result.trim().length <= 0 &&
                imTest2Result.trim().length <= 0) {

                var age = window.parent.dashboard.queryExistingObsArray("Age");

                var key = Object.keys(age);

                if (ageGroup == "0-11 months") {

                    window.parent.dashboard.showMsg("Take DBS sample for confirmation", "");

                    outcome = "Test 1 & Test 2 Positive";

                    result = "New Exposed Infant";

                } else {

                    outcome = "Test 1 & Test 2 Positive";

                    result = "New Positive";

                    if (parseInt(monthDiff(window.parent.dashboard.data.data.birthdate, (new Date()).format("YYYY-mm-dd"))) <= 23) {

                        window.parent.dashboard.showMsg("Take DBS sample for confirmation", "");

                    }

                }

            } else if (fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-" && ((imTest1Result.trim() == "-" &&
                imTest2Result.trim() == "+") || (imTest1Result.trim() == "-" && imTest2Result.trim() == "-") ||
                (imTest1Result.trim() == "+" && imTest2Result.trim() == "-"))) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "New  Inconclusive";

            } else if (((fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-") || (fpTest1Result.trim() == "-" &&
                fpTest2Result.trim() == "+")) && imTest1Result.trim() == "+" && imTest2Result.trim() == "+") {

                outcome = "Test 1 & Test 2 Positive";

                result = "Confirmatory Positive";

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

                result = "New Positive";

                result = (ageGroup == "0-11 months" ? "New Exposed Infant" : "New Positive");

                if (ageGroup == "0-11 months" || parseInt(monthDiff(window.parent.dashboard.data.data.birthdate, (new Date()).format("YYYY-mm-dd"))) <= 23) {

                    window.parent.dashboard.showMsg("Take DBS sample", "");

                }

            } else if (((fpTest1Result.trim() == "+" && fpTest2Result.trim() == "-") || (fpTest1Result.trim() == "-" &&
                fpTest2Result.trim() == "+")) && imTest1Result.trim().length <= 0 && imTest2Result.trim().length <= 0) {

                outcome = "Test 1 & Test 2 Discordant";

                result = "New Inconclusive";

                __$("sample_id").setAttribute("condition", true);

                window.parent.dashboard.showMsg("Take DBS sample", "");

            }

            break;

    }

    outcomeControl.value = outcome;

    resultGivenControl.value = result;

}

function showHIVTestingSummary() {

    window.parent.dashboard.queryExistingObsArray("Event in the last 72 hrs?", function (data) {

        var ob = Object.keys(data);

        if (data[ob[0]] && data[ob[0]] == "Yes" && __$("fp_test1_result").value == "-") {

            window.parent.dashboard.showMsg("High Risk event in last 72 hours advise to Start <b>PEP</b>");

        }


    });

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
        td.innerHTML = "Test 1";
        td.colSpan = 2;

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 2";
        td.colSpan = 2;

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 1";
        td.colSpan = 2;

        tr.appendChild(td);

        var td = document.createElement("td");
        td.align = "center";
        td.innerHTML = "Test 2";
        td.colSpan = 2;

        tr.appendChild(td);

        /*var td = document.createElement("td");
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

         tr.appendChild(td);*/

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
            "": ""
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
            "New Inconclusive": "N<span style='font-size: 10px'>In</span>",
            "Confirmatory Positive": "C+",
            "Confirmatory Inconclusive": "C<span style='font-size: 10px'>In</span>",
            "": ""
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

function showDetailsSummary() {

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
        td.rowSpan = 2;

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = "Client Name";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.padding = "10px";
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Phone/Physical Address";
        th.style.padding = "10px";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderTop = "3px solid #333";
        td.style.borderRight = "1px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";

        tr.appendChild(td);

        var td = document.createElement("td");
        //td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 2;

        tr.appendChild(td);


        var tr = document.createElement("tr");

        table.appendChild(tr);

        var th = document.createElement("th");
        th.innerHTML = "<i>Fill name and contact details<br/><u>only</u> if client gives consent to be contacted</i>";
        th.style.padding = "10px";
        th.style.borderBottom = "1px solid #333";
        th.style.fontWeight = "normal";
        th.style.fontSize = "11px";
        th.style.verticalAlign = "bottom";
        th.colSpan = 2;

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";

        tr.appendChild(td);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";

        tr.appendChild(td);

        var name = "";

        if (__$("first_name").value.trim().length <= 1 && __$("last_name").value.trim().length <= 1) {

            name = (window.parent.dashboard.data.data.names && window.parent.dashboard.data.data.names.length > 0 &&
                window.parent.dashboard.data.data.names[0]["First Name"] ?
                    window.parent.dashboard.data.data.names[0]["First Name"] : __$("first_name").value.trim()) + " " +
                (window.parent.dashboard.data.data.names && window.parent.dashboard.data.data.names.length > 0 &&
                window.parent.dashboard.data.data.names[0]["Family Name"] ?
                    window.parent.dashboard.data.data.names[0]["Family Name"] : __$("last_name").value.trim())

        } else {

            name = __$("first_name").value.trim() + " " + __$("last_name").value.trim();
        }

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        td.innerHTML = (__$("capture_details").value.trim() == "No" ? "(no consent)" : name);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";


        if (__$("capture_details").value.trim() == "No") {

            td.innerHTML = "";

        } else {

            td.innerHTML = (__$("phone_number") ? __$("phone_number").value.trim() : "");


        }

        tr.appendChild(td);


        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";


        if (__$("capture_details").value.trim() == "No") {

            td.innerHTML = "";

        } else {

            var physical_address = "";

            if (__$("village").value.trim() && __$("village").value.trim().length > 0) {

                physical_address = __$("village").value.trim();

            }
            if (__$("closest_landmark").value.trim() && __$("closest_landmark").value.trim().length > 0) {

                physical_address = __$("closest_landmark").value.trim();

            }

            if (__$("village").value.trim() && __$("village").value.trim().length > 0 && __$("closest_landmark").value.trim()
                && __$("closest_landmark").value.trim().length > 0) {

                physical_address = __$("village").value.trim() + ", " + __$("closest_landmark").value.trim();

            }

            td.innerHTML = physical_address;


        }

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";

        tr.appendChild(td);

    }

}

function evaluateReferral() {

    var riskCategory;

    var testResult;

    var pregnant = (String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "HTS CLIENT REGISTRATION", "Sex/Pregnancy")).trim() == "FP");

    if (__$("risk_category")) {

        riskCategory = __$("risk_category").value.trim();

    }

    testResult = String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "HIV TESTING", "Result Given to Client")).trim();

    if (pregnant && testResult.trim().toLowerCase() == "new negative") {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 45))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 45))))).format("YYYY-mm-dd");

        }

        var pregnancy_months = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
            "HTS CLIENT REGISTRATION", "How many months pregnant?");

        if (parseInt(pregnancy_months) > 6) {

            window.parent.dashboard.showMsg("Book appointment for Re-Test at Maternity as " +
                "pregnant women are very susceptible to HIV infection and need to start ART as soon as possible for their " +
                "health and to prevent transmission.", "Re-Test");

            var remaining_days = (9 - parseInt(pregnancy_months)) * 30;

            if (__$("appointment")) {

                __$("appointment").removeAttribute("condition");

                __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() + remaining_days + 14)))).format("YYYY-mm-dd"))

                __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() + remaining_days)))).format("YYYY-mm-dd");

            }


        }
        else {

            var remaining_days = (7 - parseInt(pregnancy_months)) * 30;

            if (__$("appointment")) {

                __$("appointment").removeAttribute("condition");

                __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() + remaining_days + 14)))).format("YYYY-mm-dd"))

                __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() + remaining_days)))).format("YYYY-mm-dd");

            }

            window.parent.dashboard.showMsg("Book appointment for Re-Test in 3<sup>rd</sup> Trimester of pregnancy as " +
                "pregnant women are very susceptible to HIV infection and need to start ART as soon as possible for their own " +
                "health and to prevent transmission.", "Re-Test");

        }

    } else if (riskCategory && riskCategory.trim().toLowerCase() == "low risk" && testResult.trim().toLowerCase() ==
        "new negative") {

        if (__$("referral")) {

            __$("referral").value = "No Re-Test Needed";

        }

        if (__$("appointment")) {

            __$("appointment").setAttribute("condition", false);

        }

        window.parent.dashboard.showMsg("No Re-Test Needed. Client should go for re-testing <u>if in future</u> a <i>" +
            "High Risk Event</i> occurs or if they enter into <i>On-Going Risk</i> behaviour", "No Re-Test Needed");

    } else if (testResult.trim().toLowerCase() == "confirmatory positive") {

        if (__$("referral")) {

            __$("referral").value = "No Re-Test Needed";

        }

        if (__$("appointment")) {

            __$("appointment").setAttribute("condition", false);

        }

        window.parent.dashboard.showMsg("No Re-Test Needed. Client confirmed positive.", "No Re-Test Needed!");

    } else if (riskCategory && riskCategory.trim().toLowerCase() == "high risk event in last 3 months" &&
        (testResult.trim().toLowerCase() == "new inconclusive") || (testResult.trim().toLowerCase() == "new negative")) {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("minDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 4))))).format("YYYY-mm-dd"))

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 4 * 2))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 4))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Re-Test after 4 weeks to rule out or confirm a new " +
            "infection (window period)", "Re-Test");

    } else if (riskCategory && riskCategory.trim().toLowerCase() == "on-going risk" &&
        (testResult.trim().toLowerCase() == "new negative")) {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("minDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd"))

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52 * 2))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Re-Test after 12 months to detect an infection that may " +
            "happen in future and to ensure timely enrollment in ART", "Re-Test");

    } else if (testResult.trim().toLowerCase() == "new exposed infant") {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("minDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd"))

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52 * 2))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Re-Test when child at 12-24 months!", "Re-Test");

    } else if (testResult.trim().toLowerCase() == "new positive") {

        if (__$("referral")) {

            __$("referral").value = "Confirmatory Test at HIV Clinic";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Confirmatory Testing at the HIV Clinic " +
            "<u>as soon as possible</u>!", "Re-Test");

    }

}


function evaluateReferral2() {

    var riskCategory;

    var testResult;

    var pregnant = (String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "HTS CLIENT REGISTRATION", "Sex/Pregnancy")).trim() == "FP");

    riskCategory = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "PRE TEST COUNSELLING", "Client Risk Category");


    testResult = String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "HIV TESTING", "Result Given to Client")).trim();


    if (pregnant && testResult.trim().toLowerCase() == "new negative") {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 45))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 45))))).format("YYYY-mm-dd");

        }

        var pregnancy_months = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
            "HTS CLIENT REGISTRATION", "How many months pregnant?");

        if (parseInt(pregnancy_months) > 6) {

            window.parent.dashboard.showMsg("Book appointment for Re-Test at Maternity as " +
                "pregnant women are very susceptible to HIV infection and need to start ART as soon as possible for their " +
                "health and to prevent transmission.", "Re-Test");

            var remaining_days = (9 - parseInt(pregnancy_months)) * 30;

            if (__$("appointment")) {

                __$("appointment").removeAttribute("condition");

                __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() + remaining_days + 14)))).format("YYYY-mm-dd"))

                __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() + remaining_days)))).format("YYYY-mm-dd");

            }


        }
        else {

            var remaining_days = (7 - parseInt(pregnancy_months)) * 30;

            if (__$("appointment")) {

                __$("appointment").removeAttribute("condition");

                __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() + remaining_days + 14)))).format("YYYY-mm-dd"))

                __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() + remaining_days)))).format("YYYY-mm-dd");

            }

            window.parent.dashboard.showMsg("Book appointment for Re-Test in 3<sup>rd</sup> Trimester of pregnancy as " +
                "pregnant women are very susceptible to HIV infection and need to start ART as soon as possible for their own " +
                "health and to prevent transmission.", "Re-Test");

        }


    } else if (riskCategory && riskCategory.trim().toLowerCase() == "low risk" && testResult.trim().toLowerCase() ==
        "new negative") {

        if (__$("referral")) {

            __$("referral").value = "No Re-Test Needed";

        }

        if (__$("appointment")) {

            __$("appointment").setAttribute("condition", false);

        }

        window.parent.dashboard.showMsg("No Re-Test Needed. Client should go for re-testing <u>if in future</u> a <i>" +
            "High Risk Event</i> occurs or if they enter into <i>On-Going Risk</i> behaviour", "No Re-Test Needed");

    } else if (testResult.trim().toLowerCase() == "confirmatory positive") {

        if (__$("referral")) {

            __$("referral").value = "No Re-Test Needed";

        }

        if (__$("appointment")) {

            __$("appointment").setAttribute("condition", false);

        }

        window.parent.dashboard.showMsg("No Re-Test Needed. Client confirmed positive.", "No Re-Test Needed!");

    } else if (riskCategory && (riskCategory.trim().toLowerCase() == "high risk event in last 3 months" && (testResult.trim().toLowerCase() == "new inconclusive")

        || (riskCategory.trim().toLowerCase() == "high risk event in last 3 months" && testResult.trim().toLowerCase() == "new negative"))) {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("minDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 4))))).format("YYYY-mm-dd"))

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 4 * 2))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 4))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Re-Test after 4 weeks", "Re-Test");

    } else if (riskCategory && riskCategory.trim().toLowerCase() == "on-going risk" &&
        (testResult.trim().toLowerCase() == "new negative")) {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("minDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd"))

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52 * 2))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Re-Test after 12 months to detect an infection that may " +
            "happen in future and to ensure timely enrollment in ART", "Re-Test");

    } else if (testResult.trim().toLowerCase() == "new exposed infant") {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("minDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd"))

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52 * 2))))).format("YYYY-mm-dd"))

            __$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Re-Test when child at 12-24 months!", "Re-Test");

    } else if (testResult.trim().toLowerCase() == "new positive") {

        if (__$("referral")) {

            __$("referral").value = "Confirmatory Test at HIV Clinic";

        }

        if (__$("appointment")) {

            __$("appointment").removeAttribute("condition");

            __$("appointment").setAttribute("maxDate", (new Date((new Date().setDate((new Date()).getDate() +
                (7 * 52))))).format("YYYY-mm-dd"))

            /*__$("appointment").value = (new Date((new Date().setDate((new Date()).getDate() +
             (7 * 52))))).format("YYYY-mm-dd");*/

            __$("appointment").value = (new Date()).format("YYYY-mm-dd");

        }

        window.parent.dashboard.showMsg("Book appointment for Confirmatory Testing at the HIV Clinic " +
            "<u>as soon as possible</u>!", "Re-Test");

    } else {

        if (__$("referral")) {

            __$("referral").value = "Re-Test";

        }

    }

}
function setAppiontment() {

    __$("today").click();

    __$("today").setAttribute("disabled", "disabled");

    __$("today").style.display = "none";

}
function loadPost() {

    evaluateReferral2();

    setMaxDate("appointment", 1)


    return false;

}

function validateAppointment() {


    var appointment = __$("appointment").value;

    var date_today = new Date();

    if (appointment < date_today.format("YYYY-mm-dd")) {

        gotoPage(tstCurrentPage - 1, false, true);

        window.parent.dashboard.showMsg("The date booked is behind today", "Invalide Date");

    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var currentRange;
var target = "duration_in_days";


function showTimeSinceLastDate() {

    parent.innerHTML = "";

    if (__$("nextButton")) {

        var initNavLogic = __$("nextButton").onmousedown;

        __$("nextButton").className = __$("nextButton").className.replace(/green/i, "gray");

        __$("nextButton").onmousedown = function () {

            if (__$("nextButton").className.match(/gray/i))
                return;

            if (String(typeof initNavLogic).toLowerCase() == "function")
                initNavLogic();

        }

    }

    if (__$("backButton")) {

        var oldCallback = __$("backButton").onmousedown;

        __$("backButton").onmousedown = function () {

            if (__$('nextButton'))
                __$('nextButton').className = __$('nextButton').className.replace(/gray/i, 'green');

            oldCallback();

        }

    }

    var lt = document.getElementById("inputFrame" + tstCurrentPage);
    var div = document.createElement("div");
    div.style.width = "100%";
    div.style.border = "1px solid #ccc";
    div.style.height = "calc(100vh - 175px)";
    div.style.overflow = "auto";

    lt.appendChild(div);

    var table = document.createElement("table");
    table.width = "100%";
    table.style.borderCollapse = "collapse";
    table.cellPadding = "10";

    div.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.style.fontSize = "2em";
    td.style.borderBottom = "1px solid #ccc";
    td.innerHTML = "Duration ago";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.width = "60%";
    td.style.fontSize = "2.2em";
    // td.id = "lblDuration";
    td.align = "left";
    td.innerHTML = "<div style='float: left' id='lblDuration'>How many years ago?</div>";

    tr.appendChild(td);

    var input = document.createElement("input");
    input.style.fontSize = "32px";
    input.style.border = "1px #ccc solid";
    input.style.padding = "10px";
    input.style.width = "150px";
    input.style.cssFloat = "right";
    input.style.backgroundColor = "#eee";
    input.style.textAlign = "center";
    input.id = "duration";
    input.type = "text";
    input.value = "";

    td.appendChild(input);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.style.width = "40%";
    td.style.verticalAlign = "top";
    td.style.borderRight = "1px dotted #ccc";
    td.rowSpan = 2;

    tr.appendChild(td);

    var ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0px";

    td.appendChild(ul);

    var durations = ["Years", "Months", "Weeks", "Days"];

    for (var i = 0; i < durations.length; i++) {

        var duration = durations[i];

        var li = document.createElement("li");
        li.style.padding = "10px";
        li.style.fontSize = "2em";
        li.style.borderBottom = "1px dotted #ccc";
        li.id = duration;

        li.onclick = function () {

            updateRange(this.id);

        }

        ul.appendChild(li);

        var liTable = document.createElement("table");
        liTable.width = "100%";
        liTable.style.fontSize = "1.1em";

        li.appendChild(liTable);

        var liTr = document.createElement("tr");

        liTable.appendChild(liTr);

        var liTd = document.createElement("td");
        liTd.innerHTML = duration;

        liTr.appendChild(liTd);

        var liTd = document.createElement("td");
        liTd.style.textAlign = "right";

        liTr.appendChild(liTd);

        var img = document.createElement("img");
        img.setAttribute("src", "touchscreentoolkit/lib/images/unchecked.png");
        img.height = "40";
        img.id = "img" + duration;

        liTd.appendChild(img);

    }

    var td = document.createElement("td");
    td.style.padding = "0px";

    //tr.appendChild(td);

    var input = document.createElement("input");
    input.style.fontSize = "2.5em";
    input.style.border = "1px #ccc solid";
    input.style.padding = "10px";
    input.style.width = "100%";
    input.style.backgroundColor = "#eee";
    input.style.textAlign = "center";
    input.id = "duration";
    input.type = "text";
    input.value = "";

    // td.appendChild(input);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    //var tr = document.createElement("tr");

    //table.appendChild(tr);

    var td = document.createElement("td");
    td.style.verticalAlign = "top";
    td.style.height = "calc(100vh - 320px)";
    td.id = "numberPad";

    tr.appendChild(td);

    var table = document.createElement("table");
    table.style.margin = "auto";

    td.appendChild(table);

    var buttons = [[7, 8, 9], [4, 5, 6], [1, 2, 3], ["clear", 0, "del"]];

    for (var i = 0; i < buttons.length; i++) {

        var tr = document.createElement("tr");

        table.appendChild(tr);

        for (var j = 0; j < buttons[i].length; j++) {

            var td = document.createElement("td");

            tr.appendChild(td);

            var button = document.createElement("button");
            button.innerHTML = buttons[i][j];
            button.className = "click";
            button.style.minWidth = "100px";

            td.appendChild(button);

        }

    }

    init();


}

function setTimeSinceLastDate() {

    var time_in_days = (__$("duration_in_days").value.trim().length > 0 &&
    __$("duration_in_days").value.trim().match(/^\d+$/) ? parseInt(__$("duration_in_days").value.trim()) : null);

    if (time_in_days != null) {

        var date = new Date();

        date.setDate(date.getDate() - time_in_days);

        __$("time_since_last_test_date").value = date.format("YYYY-mm-dd");

    } else {

        __$("time_since_last_test_date").value = "";

    }

}

function updateDuration(token) {

    if (!token)
        return;

    if (token.match(/\d/)) {

        if (__$("duration")) {

            var birthdate = window.parent.dashboard.data.data.birthdate;


            switch (currentRange) {

                case "Years":

                    if (parseInt((String(__$("duration").value).trim()) + token) > 30) {

                        window.parent.dashboard.showMsg("Years you are about enter is greater than (30 years)", "Time Since Last Test")


                    } else if (birthdate && birthdate.length > 0 && parseInt(getAge(birthdate)[0]) < parseInt((String(__$("duration").value).trim()) + token)) {

                        window.parent.dashboard.showMsg("Years you are about enter  is greater than  age of the client (" + parseInt(getAge(birthdate)[0]) + " years)", "Time Since Last Test");


                    } else {

                        __$("duration").value = (String(__$("duration").value).trim()) + token;


                    }

                    break;
                case "Months":

                    if (parseInt((String(__$("duration").value).trim()) + token) > 24) {

                        window.parent.dashboard.showMsg("Months you are about enter is greater than (24 months)", "Time Since Last Test")


                    }
                    else {

                        __$("duration").value = (String(__$("duration").value).trim()) + token;

                    }

                    break;

                case "Weeks":

                    if (parseInt((String(__$("duration").value).trim()) + token) > 24) {

                        window.parent.dashboard.showMsg("Weeks you are about enter is greater than (24 weeks)", "Time Since Last Test")


                    }
                    else {

                        __$("duration").value = (String(__$("duration").value).trim()) + token;

                    }

                    break;

                case "Days":

                    if (parseInt((String(__$("duration").value).trim()) + token) > 31) {

                        window.parent.dashboard.showMsg("Days you are about enter is greater than (31 days)", "Time Since Last Test")


                    }
                    else {

                        __$("duration").value = (String(__$("duration").value).trim()) + token;

                    }

                    break;
            }


        }

    } else if (token.trim().toLowerCase() == "del") {

        if (__$("duration")) {

            var word = (String(__$("duration").value).trim());

            __$("duration").value = word.substring(0, (word.length - 1));

        }

    } else if (token.trim().toLowerCase() == "clear") {

        if (__$("duration")) {

            __$("duration").value = "";

        }

    }

}

function updateRange(id) {

    if (currentRange) {

        if (__$("img" + currentRange)) {

            __$("img" + currentRange).setAttribute("src", "touchscreentoolkit/lib/images/unchecked.png");

        }

        if (__$(currentRange)) {

            __$(currentRange).style.backgroundColor = "";

        }

    }

    switch (id) {

        case "Years":

            currentRange = "Years";

            break;

        case "Months":

            currentRange = "Months";

            break;

        case "Weeks":

            currentRange = "Weeks";

            break;

        case "Days":

            currentRange = "Days";

            break;

    }

    if (currentRange) {

        if (__$("img" + currentRange)) {

            __$("img" + currentRange).setAttribute("src", "touchscreentoolkit/lib/images/checked.png");

        }

        if (__$(currentRange)) {

            __$(currentRange).style.backgroundColor = "lightblue";

        }

        if (__$("lblDuration")) {

            __$("lblDuration").innerHTML = "How many " + currentRange.trim().toLowerCase() + " ago?";

        }

        updateResult();

    }

}

function updateResult() {

    if (__$("duration") && __$(target) && currentRange) {

        var days = 0;

        var duration = (__$("duration").value.match(/^\d+$/) ? __$("duration").value.trim() : 0);

        switch (currentRange) {

            case "Years":

                days = 365 * parseInt(duration);

                break;

            case "Months":

                days = 30 * parseInt(duration);

                break;

            case "Weeks":

                days = 7 * parseInt(duration);

                break;

            case "Days":

                days = parseInt(duration);

                break;

        }

        __$(target).value = days;

        if (__$("duration").value.trim().length > 0) {

            if (__$('nextButton'))
                __$('nextButton').className = __$('nextButton').className.replace(/gray/i, 'green');

        } else {

            if (__$('nextButton'))
                __$('nextButton').className = __$('nextButton').className.replace(/green/i, 'gray');

        }

    }

}

function init() {

    var buttons = document.getElementsByClassName("click");

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].onclick = function () {

            updateDuration(this.innerHTML.trim());
            __$('nextButton').className = __$('nextButton').className.replace(/gray/i, 'green');
            __$('nextButton').onmousedown = function () {
                gotoNextPage()
            };


        }

    }

    setInterval(function () {

        updateResult();

    }, 100);

    if (__$("Years")) {

        __$("Years").click();

    }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function showAssessmentSummary() {

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
        td.rowSpan = 4;

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = "Client Risk Category";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.padding = "10px";
        th.style.verticalAlign = "top";
        th.colSpan = 4;

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Referral for Re-Testing";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";
        th.colSpan = 4;

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Number of Items<br />Given";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";
        th.colSpan = 3;

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Comments";
        th.style.padding = "10px";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        th.style.borderLeft = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 4;

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("Low<i style='color: #eee'>_</i>Risk", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("On-going<i style='color: #eee'>_</i>Risk", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("High<i style='color: #eee'>_</i>Risk<i style='color: #eee'>_</i>Event<i style='color: #eee'>_</i>" +
            "in<br/>last<i style='color: #eee'>_</i>3<i style='color: #eee'>_</i>months", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("Risk<i style='color: #eee'>_</i>assessment<br/>Not<i style='color: #eee'>_</i>Done", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("No<i style='color: #eee'>_</i>Re-Test<i style='color: #eee'>_</i>needed", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("Re-Test", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("Confirmatory<i style='color: #eee'>_</i>Test<br/>at<i style='color: #eee'>_</i>HIV" +
            "<i style='color: #eee'>_</i>Clinic", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.rowSpan = 3;
        td.style.verticalAlign = "bottom";
        td.innerHTML = "Appointment<br/>Date Given";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.verticalAlign = "top";
        td.align = "center";
        td.innerHTML = "<b>HTS<br/>Family<br/>Slips</b>";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.verticalAlign = "top";
        td.colSpan = 2;
        td.align = "center";
        td.innerHTML = "<b>Condoms</b>";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.verticalAlign = "bottom";
        td.innerHTML = "<i>Specimen ID for DBS<br />samples sent to lab.</i>";

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.verticalAlign = "bottom";
        td.align = "center";
        td.rowSpan = 2;
        td.innerHTML = "<i>1 Slip for each<br/>partner+ each<br/>U5 child with<br/>unk. status</i>";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 2;

        tr.appendChild(td);

        verticalText("Male", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.rowSpan = 2;

        tr.appendChild(td);

        verticalText("Female", td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.verticalAlign = "top";
        td.rowSpan = 2;
        td.innerHTML = "<i>Follow-up outcome for<br/>clients referred, etc.</i>";

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

        var risksMapping = {
            "Low Risk": "Low",
            "On-going Risk": "Ong",
            "High Risk Event in Last 3 months": "Hi",
            "Risk assessment Not Done": "ND",
            "": ""
        };

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("Low", risksMapping[__$("risk_category").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("Ong", risksMapping[__$("risk_category").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("Hi", risksMapping[__$("risk_category").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("ND", risksMapping[__$("risk_category").value.trim()], td);

        var referralMapping = {
            "No Re-Test Needed": "NoT",
            "Re-Test": "ReT",
            "Confirmatory Test at HIV Clinic": "CT",
            "": ""
        };

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("NoT", referralMapping[__$("referral").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("ReT", referralMapping[__$("referral").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("CT", referralMapping[__$("referral").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        td.innerHTML = (__$("appointment").value.trim().length > 0 ? __$("appointment").value.trim() : "");

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.align = "center";

        td.innerHTML = (__$("slips").value.trim().length > 0 ? __$("slips").value.trim() : 0);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.align = "center";

        td.innerHTML = (__$("male").value.trim().length > 0 ? __$("male").value.trim() : 0);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.align = "center";

        td.innerHTML = (__$("female").value.trim().length > 0 ? __$("female").value.trim() : 0);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        td.innerHTML = (__$("comments").value.trim().length > 0 ? __$("comments").value.trim() : "");

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

    }

}


function showPostSummary() {

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
        td.rowSpan = 4;

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = "Referral for Re-Testing";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";
        th.colSpan = 4;

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Number of Items<br />Given";
        th.style.padding = "10px";
        th.style.borderLeft = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";
        th.colSpan = 3;

        tr.appendChild(th);

        var th = document.createElement("th");
        th.innerHTML = "Comments";
        th.style.padding = "10px";
        th.style.borderRight = "1px solid #333";
        th.style.borderTop = "3px solid #333";
        th.style.verticalAlign = "top";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        th.style.borderLeft = "1px solid #333";
        td.style.borderTop = "3px solid #333";
        td.innerHTML = "&nbsp;";
        td.style.width = "30px";
        td.style.height = "50px";
        td.rowSpan = 4;

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("No<i style='color: #eee'>_</i>Re-Test<i style='color: #eee'>_</i>needed", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("Re-Test", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 3;

        tr.appendChild(td);

        verticalText("Confirmatory<i style='color: #eee'>_</i>Test<br/>at<i style='color: #eee'>_</i>HIV" +
            "<i style='color: #eee'>_</i>Clinic", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.rowSpan = 3;
        td.style.verticalAlign = "bottom";
        td.innerHTML = "Appointment<br/>Date Given";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.verticalAlign = "top";
        td.align = "center";
        td.innerHTML = "<b>HTS<br/>Family<br/>Slips</b>";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.verticalAlign = "top";
        td.colSpan = 2;
        td.align = "center";
        td.innerHTML = "<b>Condoms</b>";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.verticalAlign = "bottom";
        td.innerHTML = "<i>Specimen ID for DBS<br />samples sent to lab.</i>";

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.verticalAlign = "bottom";
        td.align = "center";
        td.rowSpan = 2;
        td.innerHTML = "<i>1 Slip for each<br/>partner+ each<br/>U5 child with<br/>unk. status</i>";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.rowSpan = 2;

        tr.appendChild(td);

        verticalText("Male", td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.rowSpan = 2;

        tr.appendChild(td);

        verticalText("Female", td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.verticalAlign = "top";
        td.rowSpan = 2;
        td.innerHTML = "<i>Follow-up outcome for<br/>clients referred, etc.</i>";

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.fontSize = "12px";

        table.appendChild(tr);

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid #333";
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

        var referralMapping = {
            "No Re-Test Needed": "NoT",
            "Re-Test": "ReT",
            "Confirmatory Test at HIV Clinic": "CT",
            "": ""
        };

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("NoT", referralMapping[__$("referral").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";

        tr.appendChild(td);

        addDiv("ReT", referralMapping[__$("referral").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        tr.appendChild(td);

        addDiv("CT", referralMapping[__$("referral").value.trim()], td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        td.innerHTML = (__$("appointment").value.trim().length > 0 ? __$("appointment").value.trim() : "");

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.align = "center";

        td.innerHTML = (__$("slips").value.trim().length > 0 ? __$("slips").value.trim() : 0);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.align = "center";

        td.innerHTML = (__$("male").value.trim().length > 0 ? __$("male").value.trim() : 0);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";
        td.align = "center";

        td.innerHTML = (__$("female").value.trim().length > 0 ? __$("female").value.trim() : 0);

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.style.borderRight = "1px solid #333";

        td.innerHTML = (__$("comments").value.trim().length > 0 ? __$("comments").value.trim() : "");

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid #333";
        td.style.borderTop = "1px solid #333";
        td.innerHTML = "&nbsp;";

        tr.appendChild(td);

    }

}

var hndValidation;

function validateCredentials(username, password) {

    var data = {
        "data": {
            "token": window.parent.dashboard.getCookie("token"),
            "checkUsername": username,
            "checkPassword": password
        }
    };

    ajaxPostRequest("/validate_credentials", data, function (result) {

        var json = JSON.parse(result);

        if (json.valid) {

            if (__$("nextButton")) {

                __$("nextButton").className = __$("nextButton").className.replace(/gray/, "green");

            }

        } else {

            if (__$("nextButton")) {

                __$("nextButton").className = __$("nextButton").className.replace(/green/, "gray");

            }

        }

    })

}

function checkValidation() {

    if (__$("nextButton")) {

        __$("nextButton").className = __$("nextButton").className.replace(/green/, "gray");

    }

    hndValidation = setInterval(function () {

        validateCredentials(__$("im_tester").value.trim(), __$("touchscreenInput" + tstCurrentPage).value.trim())

    }, 500);

}

function stopValidationChecks() {

    clearInterval(hndValidation);

    if (__$("nextButton")) {

        __$("nextButton").className = __$("nextButton").className.replace(/gray/, "green");

    }

}


function reverseConsumption(consumption_id, prefix, suffix) {

    var location = window.parent.dashboard.getCookie("location");
    var userId = window.parent.dashboard.getCookie("username");

    var data = {
        data: {
            consumption_id: consumption_id,
            location: location,
            userId: userId,
            datatype: "reverse_consumption",
            token: window.parent.dashboard.getCookie("token")
        }
    }

    ajaxPostRequest("/stock/save_item", data, function (result) {

        if (__$(prefix + "_lot_number" + suffix)) {

            __$(prefix + "_lot_number" + suffix).removeAttribute("consumption_id");

        }

        if (__$(prefix + "_lot_" + suffix + "_dispatch_id")) {

            __$(prefix + "_lot_" + suffix + "_dispatch_id").value = "";

        }

        if (__$(prefix + "_lot_" + suffix + "_expiry")) {

            __$(prefix + "_lot_" + suffix + "_expiry").value = "";

        }

    })

}

function setMaxDate(element, number_of_years) {

    var max_date = new Date(((new Date()).setYear((new Date()).getFullYear() + number_of_years))).format("YYYY-mm-dd");

    __$(element).setAttribute("maxDate", max_date);

}

function setPhoneNumberValidation(phone_number) {

    if (__$(phone_number)) {

        var field = __$(phone_number);

        field.setAttribute("validationRule", "^01\\d{6}$|Unknown|Not Available|^01\\d{8}$|^02\\d{8}$|^03\\d{8}$|^04\\d{8}$|^05\\d{8}$|^06\\d{8}$|^07\\d{8}$|^08\\d{8}$|^09\\d{8}$|^N\\/A$");

        field.setAttribute("validationMessage", "Not a valid phone number");

        field.setAttribute("field_type", "number");

        field.setAttribute("tt_pageStyleClass", "Numeric NumbersOnly NumbersWithUnknown nota");

    }

}


function isNotInfant() {

    var is_not_infant = true;

    window.parent.dashboard.queryExistingObsArray("Age Group", function (data) {

        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {

            if (data[keys[i]] == "1-14 years") {

                is_not_infant = false;

            }

        }


    });


    return is_not_infant;
}

function setTestKits(callback) {

    //Temporary Fix

    window.parent.dashboard.setCookie('LastHIVTest', window.parent.dashboard.queryActiveObs("HTS PROGRAM",
        (new Date()).format("YYYY-mm-dd"), "PRE TEST COUNSELLING", "Last HIV test"));

    var descriptions = ["First Test", "Second Test"];

    var done = [];

    for (var i = 0; i < descriptions.length; i++) {

        getAjaxRequest("/stock/available_kits_by_desctiption/" + encodeURIComponent(descriptions[i]), function (data) {

            var kit_data = JSON.parse(data);

            if (!window.parent.dashboard.data.kits)
                window.parent.dashboard.data.kits = {};

            window.parent.dashboard.data.kits[kit_data.description] = kit_data.name;

            if (kit_data.description == "First Test") {

                __$('fp_lot_number1').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                    window.parent.dashboard.getCookie("username") + "&item_name=" + kit_data.name + "&batch=");

                __$("fp_item_name1").value = kit_data.name;

                __$('im_lot_number1').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                    window.parent.dashboard.getCookie("username") + "&item_name=" + kit_data.name + "&batch=");

                __$("im_item_name1").value = kit_data.name;

            }

            else {

                __$('fp_lot_number2').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                    window.parent.dashboard.getCookie("username") + "&item_name=" + kit_data.name + "&batch=");

                __$("fp_item_name2").value = kit_data.name;

                __$('im_lot_number2').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                    window.parent.dashboard.getCookie("username") + "&item_name=" + kit_data.name + "&batch=");

                __$("im_item_name2").value = kit_data.name;

            }

            if (kit_data.name && kit_data.name.length > 0)
                recommendedTimerForLabels([kit_data.name]);

            done.push(true);

            if (callback && done.length == descriptions.length)
                callback();

        });

    }

}
function setTestKitsProfiency() {

    var descriptions = ["First Test", "Second Test"];


    for (var i = 0; i < descriptions.length; i++) {

        getAjaxRequest("/stock/available_kits_by_desctiption/" + encodeURIComponent(descriptions[i]), function (data) {

            var kit_data = JSON.parse(data);

            if (!window.parent.proficiency.kits)
                window.parent.proficiency.kits = {};

            window.parent.proficiency.kits[kit_data.description] = kit_data.name;


            for (var i = 0; i < 5; i = i + 1) {

                if (kit_data.description == "First Test") {

                    __$('data.fp_lot_number1_' + i).setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                        window.parent.dashboard.getCookie("username") +
                        "&item_name=" + kit_data.name + "&batch=");

                    __$('data.im_lot_number1_' + i).setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                        window.parent.dashboard.getCookie("username") + "&item_name=" + kit_data.name + "&batch=");

                }

                else {

                    __$('data.fp_lot_number2_' + i).setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                        window.parent.dashboard.getCookie("username") +
                        "&item_name=" + kit_data.name + "&batch=");

                    __$('data.im_lot_number2' + i).setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=' +
                        window.parent.dashboard.getCookie("username") + "&item_name=" + kit_data.name + "&batch=");

                }

                if (kit_data.name && kit_data.name.length > 0)
                    recommendedTimerForLabelsProficiency([kit_data.name]);

            }

        });


    }

}

function loadPassParallelTestsProfiiency(test1Target, test1TimeTarget, test2Target, test2TimeTarget, label1, label2, iterator) {

    customizeCancel("HIV TESTING");

    if (!test1Target || !test1TimeTarget || !test2Target || !test2TimeTarget) {

        return;

    }

    tmrControl1SecsCount = 0;
    tmrControl1MinsCount = 0;
    tmrControl2SecsCount = 0;
    tmrControl2MinsCount = 0;

    if (__$("nextButton") && test1TimeTarget.getAttribute("startTime") == null) {

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
    table.id = "timeTable1";
    table.style.margin = "auto";
    table.border = 0;

    mainTd1.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    td.style.borderRadius = "g10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px solid #3c60b1";
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
    btn.setAttribute("timeTarget", test1TimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).setAttribute("startTime", (new Date()));

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

                var label_data = window.parent.dashboard.data.stock_label_data[label1]

                var window_time = parseInt(label_data.rec_time) + parseInt(label_data.window_time)


                if (tmrControl1MinsCount >= parseInt(label_data.rec_time) && tmrControl1MinsCount < window_time) {

                    __$("tmrControl1").style.color = "green";

                } else if (tmrControl1MinsCount >= window_time) {

                    __$("tmrControl1").style.color = "#d9d8d7";

                }

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

    var test1 = "First";


    if (__$("data.fp_item_name1_" + iterator).value && __$("data.fp_item_name1_" + iterator).value != "") {

        test1 = __$("data.fp_item_name1_" + iterator).value

    }

    if (__$("data.im_item_name1_" + iterator).value && __$("data.im_item_name1_" + iterator).value != "") {

        test1 = __$("data.im_item_name1_" + iterator).value

    }

    td.innerHTML = (label1 ? label1 : test1 + " Test") + " Result " + "<font style='color:green' id='l1_minutes'> </font>";
    td.style.fontSize = "3vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test1TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Non Reactive";
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

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

        //Disbabling the other button

        __$('btnTest1Nve').className = "green";

        __$('btnTest1Pve').className = "gray";

        var time = __$("tmrControl1").innerHTML;

        if (test1Target.id.trim() == "data.fp_test1_result" + iterator) {

            __$("fp_test1_time" + iterator).setAttribute("condition", true);

            __$("fp_test1_time" + iterator).value = time;

        }

        if (test1Target.id.trim() == "data.im_test1_result" + iterator) {


            __$("im_test1_time" + iterator).setAttribute("condition", true);

            __$("im_test1_time" + iterator).value = time;

        }


    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test1TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Reactive";
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

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

        //Disbabling the other button

        __$('btnTest1Nve').className = "gray";

        __$('btnTest1Pve').className = "green";


        var time = __$("tmrControl1").innerHTML;

        if (test1Target.id.trim() == "data.fp_test1_result" + iterator) {

            __$("fp_test1_time" + iterator).setAttribute("condition", true);

            __$("fp_test1_time" + iterator).value = time;

        }

        if (test1Target.id.trim() == "data.im_test1_result" + iterator) {


            __$("im_test1_time" + iterator).setAttribute("condition", true);

            __$("im_test1_time" + iterator).value = time;

        }


    }

    td.appendChild(btn);

    var table = document.createElement("table");
    table.id = "timeTable2";
    table.style.margin = "auto";
    table.border = 0;

    mainTd2.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.align = "center";
    td.verticalAlign = "middle";
    td.style.border = "1px solid #3c60b1";
    //td.style.borderRadius = "10px";
    td.style.padding = "25px";
    td.colSpan = 3;
    td.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";

    tr.appendChild(td);

    var div = document.createElement("div");
    div.style.border = "3px solid #3c60b1";
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
    btn.setAttribute("timeTarget", test2TimeTarget.id);

    btn.onclick = function () {

        if (this.className.match(/gray/i)) {

            return;

        }

        if (__$(this.getAttribute("timeTarget"))) {

            __$(this.getAttribute("timeTarget")).setAttribute("startTime", (new Date()));

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

                var label2_data = window.parent.proficiency.stock_label_data[label2]

                var window_time = parseInt(label2_data.rec_time) + parseInt(label2_data.window_time)


                if (tmrControl2MinsCount >= parseInt(label2_data.rec_time) && tmrControl2MinsCount < window_time) {

                    __$("tmrControl2").style.color = "green";

                } else if (tmrControl2MinsCount >= window_time) {

                    __$("tmrControl2").style.color = "#d9d8d7";

                }

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

    var test2 = "Second";

    if (__$("data.fp_item_name2_" + iterator).value && __$("data.fp_item_name2_" + iterator).value != "") {

        test2 = __$("data.fp_item_name2_" + iterator).value

    }

    if (__$("data.im_item_name2_" + iterator).value && __$("data.im_item_name2_" + iterator).value != "") {

        test2 = __$("data.im_item_name2_" + iterator).value

    }

    td.innerHTML = (label2 ? label2 : test2 + " Test") + " Result " + "<font style='color:green' id='l2_minutes'></font>";
    td.style.fontSize = "3vh";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test2TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Non Reactive";
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

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

        //Disbabling the other button

        __$('btnTest2Nve').className = "green";

        __$('btnTest2Pve').className = "gray";

        var time = __$("tmrControl2").innerHTML;

        if (test2Target.id.trim() == "data.fp_test2_result" + iterator) {

            __$("fp_test2_time").setAttribute("condition", true);

            __$("fp_test2_time").value = time;

        }

        if (test2Target.id.trim() == "data.im_test2_result" + iterator) {


            __$("im_test2_time").setAttribute("condition", true);

            __$("im_test2_time").value = time;

        }


    }

    td.appendChild(btn);

    var td = document.createElement("td");
    td.align = "right";

    tr.appendChild(td);

    var btn = document.createElement("button");
    btn.className = (test2TimeTarget.getAttribute("startTime") != null ? "blue" : "gray");
    btn.innerHTML = "Reactive";
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

            var startTime = (new Date(__$(this.getAttribute("timeTarget")).getAttribute("startTime")));

            var now = (new Date());

            var duration = (now - startTime) / (60 * 1000);

            __$(this.getAttribute("timeTarget")).value = duration.toFixed(2);

        }

        //Disbabling the other button

        __$('btnTest2Nve').className = "gray";

        __$('btnTest2Pve').className = "green";


        if (__$("nextButton") && __$(this.getAttribute("target2"))) {

            if (__$(this.getAttribute("target2")).value.trim().length > 0) {
                var currentClass = __$("nextButton").className;

                __$("nextButton").className = currentClass.replace(/gray/i, "green");

            }

        }

        var time = __$("tmrControl2").innerHTML;

        if (test2Target.id.trim() == "data.fp_test2_result" + iterator) {

            __$("fp_test2_time").setAttribute("condition", true);

            __$("fp_test2_time").value = time;

        }

        if (test2Target.id.trim() == "data.im_test2_result" + iterator) {


            __$("im_test2_time").setAttribute("condition", true);

            __$("im_test2_time").value = time;

        }

    }

    td.appendChild(btn);


    var minuteLabelInterval = setInterval(function () {

        __$("l1_minutes").innerHTML = window.parent.proficiency.stock_label_data[label1].rec_time + " Minutes";

        __$("l2_minutes").innerHTML = window.parent.proficiency.stock_label_data[label2].rec_time + " Minutes";

        clearInterval(minuteLabelInterval);

    }, 500);

    if (test1Target.id == "data.fp_test1_result" + iterator && test2Target.id == "data.fp_test2_result" + iterator) {

        __$("tmrControl1").innerHTML = (__$("fp_test1_time").value ? __$("fp_test1_time").value : "00:00" );

        __$("tmrControl2").innerHTML = (__$("fp_test2_time").value ? __$("fp_test2_time").value : "00:00" );

    }

    if (test1Target.id == "data.im_test1_result" + iterator && test2Target.id == "data.im_test2_result" + iterator) {

        __$("tmrControl1").innerHTML = (__$("im_test1_time").value ? __$("im_test1_time").value : "00:00" );

        __$("tmrControl2").innerHTML = (__$("im_test2_time").value ? __$("im_test2_time").value : "00:00" );

    }


}

function recommendedTimerForLabelsProficiency(labels) {

    if (labels[0].length == 0)
        return;

    for (var i = 0; i < labels.length; i++) {

        getAjaxRequest("/stock/get_pack_size/" + encodeURIComponent(labels[i]), function (data) {

            var label_data = JSON.parse(data);

            if (!window.parent.proficiency.stock_label_data)
                window.parent.dashboard.data.stock_label_data = {};

            window.parent.proficiency.stock_label_data[label_data.id] = {
                rec_time: label_data.rec_time,
                window_time: label_data.window_time
            }

        });

    }

}
function getMonthList() {

    var ul = __$("options");

    //ul.innerHTML = "";

    var windowHeight = window.innerHeight;


    ul.style.height = (0.65 * windowHeight) + "px";

    ul.style.overflowY = "scroll";


    /*var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
     "October", "November", "December","Unknown"];

     for (var i = 0 ; i < monthList.length ; i++){

     var li  = document.createElement("li");

     ul.appendChild(li);

     li.id = i;

     if(i % 2 == 0){

     li.className = "even"

     li.setAttribute("tag","even");

     }else{

     li.className = "odd"

     li.setAttribute("tag","odd")

     }

     li.setAttribute("tstvalue",monthList[i]);

     li.setAttribute("onclick", "null; updateTouchscreenInputForSelect(this); ");

     li.innerHTML = monthList[i];



     }

     //ul.innerHTML = "";*/

}

function monthDaysKeyPad() {

    var keyboard = __$("keyboard");

    __$("inputFrame" + tstCurrentPage).style.height = "50px";

    keyboard.innerHTML = "";

    var keyPadDiv = document.createElement("div");

    keyPadDiv.style.width = "40%";

    keyPadDiv.style.float = "left";

    keyboard.appendChild(keyPadDiv);

    var months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "Juy": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    }

    var year = __$("birthyear").value;

    var month = __$("birthmonth").value;

    var nextMonthNumber = parseInt(months[month]) + 2;

    var date = new Date(year + "-" + padZeros(nextMonthNumber, 2) + "-" + "01");

    date.setDate(date.getDate() - 1);

    var lateDayOfSelectedMonth = date.getDate()

    var table = document.createElement("table");

    table.style.width = "100%";

    keyPadDiv.appendChild(table);


    var tr;

    for (var i = 1; i <= 31; i++) {

        if ((i - 1) % 7 == 0) {

            tr = document.createElement("tr");

            table.appendChild(tr);

        }

        var td = document.createElement("td");

        tr.appendChild(td);

        var button = document.createElement("button");

        td.appendChild(button);


        if (i <= 9) {

            button.innerHTML = "0" + i;

            button.setAttribute("onclick", '__$("touchscreenInput"+tstCurrentPage).value ="0"+' + i);

        } else {

            button.innerHTML = i;

            button.setAttribute("onclick", '__$("touchscreenInput"+tstCurrentPage).value =' + i);

        }

        if (i > parseInt(lateDayOfSelectedMonth)) {

            button.className = "gray";

            button.removeAttribute("onclick");
        }
        else {

            button.className = "blue";

        }

    }

    var unknownButton = document.createElement("button");

    unknownButton.innerHTML = "Unknown";

    unknownButton.style.float = "right";

    unknownButton.style.marginTop = "10%";

    unknownButton.setAttribute("onclick", '__$("touchscreenInput"+tstCurrentPage).value ="Unknown"');

    keyboard.appendChild(unknownButton);

}

function setAgeValues() {

    var birthyear = __$("birthyear").value;

    var birthmonth = __$('birthmonth').value;

    var birthday = __$("birthday").value;

    if (birthday.trim().toLowerCase() == "unknown") {

        birthday = "05";

        __$("estimate").value = 1;

    } else {

        __$("estimate").value = 0;

    }

    var months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "Juy": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    }

    var birthdate = birthyear + "-" + padZeros(parseInt(months[birthmonth]) + 1, 2) + "-" + padZeros(parseInt(birthday), 2);

    __$("birthdate").value = birthdate;


}

function validateMaxMinYear() {

    var today = new Date();

    if (parseInt(__$("birthyear").value) < (parseInt(today.getFullYear()) - 120)) {

        var message = "Year entered is less than " + (parseInt(today.getFullYear()) - 120);

        setTimeout(function () {

            gotoPage(tstCurrentPage - 1, false, true);

            window.parent.dashboard.showMsg(message, "Year of Birth Validation")

        }, 10);

    }

    if (parseInt(__$("birthyear").value) > parseInt(today.getFullYear())) {

        var message = "Year entered is greater than " + parseInt(today.getFullYear());

        setTimeout(function () {

            gotoPage(tstCurrentPage - 1, false, true);

            window.parent.dashboard.showMsg(message, "Year of Birth Validation")

        }, 10);

    }

}

function validateAndProcessMonth() {

    var year = __$("birthyear").value

    var month = __$('birthmonth').value;

    if (month.trim().toLowerCase() == "unknown") {


        var birthdate = __$("birthdate");

        var estimate_field = (birthdate.getAttribute("estimate_field") != null ?
            __$(birthdate.getAttribute("estimate_field")) : undefined);

        if (estimate_field) {

            estimate_field.value = 1

        }

        var estimateBirthDate = year + "-07-10";

        birthdate.value = estimateBirthDate

        __$("estimate").value = 1;

    } else {

        var months = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "Juy": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11
        }

        var today = new Date();

        if (parseInt(year) == parseInt(today.getFullYear()) && parseInt(months[month]) > parseInt(today.getMonth())) {

            var message = "Month selected is greater than Current Month";

            setTimeout(function () {

                gotoPage(tstCurrentPage - 1, false, true);

                window.parent.dashboard.showMsg(message, "Month of Birth Validation")

            }, 10);

        }

    }

}

function setEstimatedAgeValue() {

    __$("birthyear").setAttribute("disabled", true);

    __$("birthmonth").setAttribute("disabled", true);

    __$("birthday").setAttribute("disabled", true);

    if (__$("birthdate") && __$("age_estimate") && __$("estimate")) {

        if (__$("age_estimate").value.trim().length > 0) {

            __$("estimate").value = 1;

            var year = (new Date()).getFullYear() - parseInt(__$("age_estimate").value.trim());

            __$("birthdate").value = year + "-07-15";

        } else {

            __$("estimate").value = 0;

        }

    }

}

function validateExpiryDate(date_string, target) {

    if (date_string.length > 0) {


        var date_string = date_string.match(/\b\d{2}\/[A-Za-z]{3}\/\d{4}\b|\b\d\/[A-Za-z]{3}\/\d{4}\b/)[0];

        var today = new Date();

        var date = new Date(date_string);

        if (date.format("YYYY-mm-dd") <= today.format("YYYY-mm-dd")) {


            setTimeout(function () {

                window.parent.dashboard.showMsg("The product  expired on " + date_string, "Stock Expiry Date");

                gotoPage(tstCurrentPage - 1, null, true);


            }, 10);

            setTimeout(function () {

                if (__$("timeTable1")) {

                    __$("timeTable1").innerHTML = "";

                }

                if (__$("timeTable2")) {

                    __$("timeTable2").innerHTML = "";

                }

                __$("nextButton").className = __$("nextButton").className.replace("gray", "blue");

            }, 100);

        } else {

            switch (target) {

                case "fp_lot_1_dispatch_id":

                    if (__$("fp_lot_1_dispatch_id").value) {

                        saveConsumption(__$("fp_lot_1_dispatch_id").value, "fp_lot_number1");

                    }

                    break;

                case "fp_lot_2_dispatch_id":

                    if (__$("fp_lot_2_dispatch_id").value) {

                        saveConsumption(__$("fp_lot_2_dispatch_id").value, "fp_lot_number2");

                    }
                    break;

                case "im_lot_1_dispatch_id":

                    if (__$("im_lot_1_dispatch_id").value) {

                        saveConsumption(__$("im_lot_1_dispatch_id").value, "im_lot_number1")

                    }

                case "im_lot_2_dispatch_id":

                    if (__$("im_lot_2_dispatch_id").value) {

                        saveConsumption(__$("im_lot_2_dispatch_id").value, "im_lot_number2")

                    }
                    break;

            }

        }

    }

}

function showMinimizeButton() {

    if (window.parent.dashboard.$$("minimizeButton"))
        return;

    var button = document.createElement("button");
    button.className = "blue";
    button.innerHTML = "Minimize";
    button.style.float = "left";
    button.id = "minimizeButton";

    button.onmousedown = function () {

        // var data = form2js(document.getElementById('data'), undefined, false, undefined, undefined, true);

        // window.parent.dashboard.saveTemporaryData("HIV TESTING", data);

        window.parent.dashboard.clearMyTimers();

        window.parent.dashboard.exitNavPanel();

    }

    if (window.parent.dashboard.$$("buttons")) {

        window.parent.dashboard.$$("buttons").appendChild(button);

    }

}

function hideMinimizeButton(multiple) {

    var found = false;

    if (multiple && typeof window.parent.dashboard.subscription != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers != typeof undefined &&
        typeof window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] != typeof undefined) {

        var keys = Object.keys(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")]);

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            if (window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")] &&
                window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][key] &&
                window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")][key].running) {

                found = true;

                break;

            }

        }

    }

    if (!found && window.parent.dashboard.$$("minimizeButton") && window.parent.dashboard.$$("buttons")) {

        window.parent.dashboard.$$("buttons").removeChild(window.parent.dashboard.$$("minimizeButton"));

    }

}

function clearTimers(category) {

    if (window.parent.dashboard.subscription.timers &&
        window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")]) {

        var keys = Object.keys(window.parent.dashboard.subscription.timers[window.parent.dashboard.getCookie("patient_id")]);

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            window.parent.dashboard.clearTimer(key);

        }

    }

    if (typeof category == typeof String()) {

        if (typeof window.parent.dashboard.data.data.temporaryData != typeof undefined &&
            typeof window.parent.dashboard.data.data.temporaryData[category] != typeof undefined) {

            delete window.parent.dashboard.data.data.temporaryData[category];

            window.parent.dashboard.deleteTemporaryData(category);

        }

    }

}

function cancelTransaction(category) {

    clearTimers(category);

    window.parent.dashboard.exitNavPanel();

}

function customizeCancel(category) {

    if (window.parent.dashboard.$$("cancelButton")) {

        window.parent.dashboard.$$("cancelButton").onmousedown = function () {

            window.parent.dashboard.showConfirmMsg("Are you sure you want to cancel this transaction and stop all timers?",
                "Confirm Abort", "javascript:dashboard.__().cancelTransaction('" + (category ? category : "") + "')");

        }

    }

}

function hasPartner() {

    var hasNoPartner = (window.parent.dashboard.data.data.relationships.map(function (relation) {
        return relation.relative_type
    }).map(function (relation) {
        return (relation.match(/spouse/i) ? true : false)
    }).indexOf(true) < 0)

    return !hasNoPartner;

}

function noPartnerToday() {

    var present = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "PRE TEST COUNSELLING", "Partner Present at this Session?");

    if (!present)
        present = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
            "PRE TEST COUNSELLING", "Partner Present at this Session?");

    if (String(present).trim().toLowerCase() == "yes") {

        return false;

    } else {

        return true;

    }

}

function clientHasHIVLastTest() {

    var present = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
        "PRE TEST COUNSELLING", "Last HIV test");

    if (String(present).trim().length > 0) {

        return true;

    } else {

        return false;

    }

}

function ageLimit() {

    var birthdate = window.parent.dashboard.data.data.birthdate

    var age = parseInt(getAge(birthdate)[0]);

    if (age >= 5) {

        return true;

    } else {

        return false;

    }


}

function initialiseExistingData() {

    if (!window.parent.dashboard)
        return;

    if (clientHasHIVLastTest() && __$("last_hiv_test") && false) {

        var value = window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"),
            "PRE TEST COUNSELLING", "Last HIV test");

        __$("last_hiv_test").value = value;

    }

    if (!ageLimit()) {

        if (__$("last_hiv_test")) {

            var opt = document.createElement("option");

            opt.innerHTML = "Last Exposed Infant";

            __$("last_hiv_test").appendChild(opt);

        }

    }

}

var firstRun;

initialiseExistingData();