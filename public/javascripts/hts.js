/**
 * Created by chimwemwe on 6/7/16.
 */

"use strict"

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

    if(__$("birthdate")) {

        var age = getAge(__$("birthdate").value.trim());

        if(__$("age")) {

            __$("age").value = age[1];

        }

        var ageGroup = "";

        switch(age[2]) {

            case "Y":

                if(age[0] <= 14) {

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

                if(age[0] > 11) {

                    ageGroup = "1-14 years";

                } else {

                    ageGroup = "0-11 months";

                }

                break;

        }

        if(__$("age_group")) {

            __$("age_group").value = ageGroup;

        }

        if(age[2] == "Y" && age[0] >= 10 && age[0] <= 45) {

            if(__$("pregnant")) {

                __$("pregnant").setAttribute("condition",
                    "__$('gender').value.trim().toLowerCase() == 'female'");

            }

        } else if(__$("pregnant")) {

            __$("pregnant").setAttribute("condition", "false");

            __$("pregnant").value = "";

        }

    }

}

function updatePregnancy() {

    if(__$("sex_or_pregnancy") && __$("gender") && __$("pregnant")) {

        var gender = __$("gender").value.trim();

        var pregnant = __$("pregnant").value.trim();

        var status = "";

        if(gender.trim().toLowerCase() == "female" && pregnant.trim().toLowerCase() == "yes") {

            status = "FP";

        } else if(gender.trim().toLowerCase() == "female") {

            status = "FNP";

        } else {

            status = "M";

        }

        __$("sex_or_pregnancy").value = status;

    }

    if(__$("inputFrame" + tstCurrentPage)) {

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

    if(!parent)
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

    if(__$("time_since_last_test") && __$("time_since_last_test_date")) {

        var age = getAge(__$("time_since_last_test_date").value.trim());

        if(__$("time_since_last_test")) {

            __$("time_since_last_test").value = age[1];

        }

    }

}

function showHTSVisitSummary() {

    if(__$("inputFrame" + tstCurrentPage)) {

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
            "Comes with HTC Family Reference Slip":"FRS",
            "Other (VCT, etc.)":"Oth"
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
            "Never Tested":"LNev",
            "Last Negative":"L-",
            "Last Positive":"L+",
            "Last Exposed Infant":"LEx",
            "Last Inconclusive":"LIn"
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

        addDiv("N", __$("partner_present").value.trim().substring(0,1).toUpperCase(), th);

        var th = document.createElement("td");
        th.style.borderBottom = "1px solid #333";
        th.style.borderRight = "1px solid #333";
        th.align = "center";

        tr.appendChild(th);

        addDiv("Y", __$("partner_present").value.trim().substring(0,1).toUpperCase(), th);

    }

}

function showDetailsSummary() {



}

function setAjaxUrl(pos) {

    switch(pos) {

        case 0:

            if(__$("district")){

                __$("district").setAttribute("ajaxURL", "/district_query?region=" + __$("touchscreenInput" +
                    tstCurrentPage).value.trim() + "&district=");

            }

            break;

        case 1:

            if(__$('ta')){

                __$('ta').setAttribute('ajaxURL', '/ta_query?district=' + __$('touchscreenInput' +
                    tstCurrentPage).value + '&ta=');

            }

            break;

        case 2:

            if(__$('village')){

                __$('village').setAttribute('ajaxURL', '/village_query?district=' + __$('district').value.trim() +
                    '&ta=' + __$('touchscreenInput' + tstCurrentPage).value + '&village=');

            }

            break;

        case 3:

            if(__$("item_name")) {

                __$('item_name').setAttribute('ajaxURL', '/stock_items?category=' + __$('touchscreenInput' +
                    tstCurrentPage).value.trim() + '&item_name=');

            }

            break;

        case 4:

            if(__$("lot_number1")) {

                __$('lot_number1').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie("username") +
                    "&item_name=" + __$('touchscreenInput' + tstCurrentPage).value.trim() + "&batch=");

            }

            break;

    }


}

function showHIVTestingSummary() {



}