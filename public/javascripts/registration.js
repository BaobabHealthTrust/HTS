/**
 * Created by chimwemwe on 11/3/16.
 */

var page = 1;

var style = this.sheet(__$("content"));
this.addCSSRule(style, ".hidekeyboard", "display: none !important");
this.addCSSRule(style, ".element", "border: 1px solid #999");
this.addCSSRule(style, ".element", "background-color: #cadcd3");
this.addCSSRule(style, ".element", "color: #000");
this.addCSSRule(style, ".element", "padding: 3px");
this.addCSSRule(style, ".element", "margin: 3px");
this.addCSSRule(style, ".element", "font-size: 24px");
this.addCSSRule(style, ".element", "cursor: pointer");
this.addCSSRule(style, ".element", "border-radius: 10px");

this.addCSSRule(style, "div.odd", "background-color: #B2C4B4 !important");

this.addCSSRule(style, "div.highlighted", "background-color: lightblue !important");
this.addCSSRule(style, "div.highlighted", "color: #000");

this.addCSSRule(style, "div.female", "border-radius: 150px");
this.addCSSRule(style, "div.female", "border-right: 5px solid magenta");
this.addCSSRule(style, "div.female", "border-bottom: 1px solid magenta");
this.addCSSRule(style, "div.female", "padding: 15px");
this.addCSSRule(style, "div.female", "color: magenta");
this.addCSSRule(style, "div.female", "background-color: rgba(223, 47, 229, 0.1)");
this.addCSSRule(style, "div.female", "width: 260px");
this.addCSSRule(style, "div.female", "height: 260px");
this.addCSSRule(style, "div.female", "margin: auto");

this.addCSSRule(style, "div.male", "border-radius: 150px");
this.addCSSRule(style, "div.male", "border-right: 5px solid #2f66e5");
this.addCSSRule(style, "div.male", "border-bottom: 1px solid #2f66e5");
this.addCSSRule(style, "div.male", "padding: 15px");
this.addCSSRule(style, "div.male", "color: magenta");
this.addCSSRule(style, "div.male", "background-color: rgba(47, 102, 229, 0.1)");
this.addCSSRule(style, "div.male", "width: 260px");
this.addCSSRule(style, "div.male", "height: 260px");
this.addCSSRule(style, "div.male", "margin: auto");

this.addCSSRule(style, ".arrow-up", "width: 0");
this.addCSSRule(style, ".arrow-up", "height: 0");
this.addCSSRule(style, ".arrow-up", "border-left: 30px solid transparent");
this.addCSSRule(style, ".arrow-up", "border-right: 30px solid transparent");
this.addCSSRule(style, ".arrow-up", "cursor: pointer");
this.addCSSRule(style, ".arrow-up", "border-bottom: 30px solid #3465a4");

this.addCSSRule(style, ".arrow-up:hover", "border-bottom: 30px solid #5ca6c4");

this.addCSSRule(style, ".arrow-up:active", "border-bottom: 30px solid #ef8544");

this.addCSSRule(style, ".arrow-down", "width: 0");
this.addCSSRule(style, ".arrow-down", "height: 0");
this.addCSSRule(style, ".arrow-down", "border-left: 30px solid transparent");
this.addCSSRule(style, ".arrow-down", "border-right: 30px solid transparent");
this.addCSSRule(style, ".arrow-down", "cursor: pointer");
this.addCSSRule(style, ".arrow-down", "border-top: 30px solid #3465a4");

this.addCSSRule(style, ".arrow-down:hover", "border-top: 30px solid #5ca6c4");

this.addCSSRule(style, ".arrow-down:active", "border-top: 30px solid #ef8544");

function sheet(target) {
    // Create the <style> tag
    var style = document.createElement("style");

    style.appendChild(document.createTextNode(""));

    if (target) {

        target.appendChild(style);

    } else {
        // Add the <style> element to the page
        document.head.appendChild(style);

    }

    return style.sheet;
}

function addCSSRule(sheet, selector, rules, index) {

    if ("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    }
    else if ("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
    }

}

function __$(id) {

    return document.getElementById(id);

}

function loadNames() {

    __$("inputFrame" + tstCurrentPage).style.display = "none";

    var panel = document.createElement("div");
    panel.style.borderRadius = "10px";
    panel.style.width = "99%";
    panel.style.height = "100%";
    panel.style.padding = "10px";
    panel.style.backgroundColor = "white";
    // panel.style.margin = "-10px";

    __$("page" + tstCurrentPage).appendChild(panel);

    var tbl = document.createElement("div");
    tbl.style.display = "table";
    tbl.style.width = "100%";
    tbl.style.height = "100%";

    panel.appendChild(tbl);

    var row = document.createElement("div");
    row.style.display = "table-row";

    tbl.appendChild(row);

    var cell0 = document.createElement("div");
    cell0.style.display = "table-cell";
    cell0.style.height = "100%";
    cell0.style.verticalAlign = "top";

    row.appendChild(cell0);

    var cell1 = document.createElement("div");
    cell1.style.display = "table-cell";
    cell1.style.height = "100%";
    cell1.style.width = "70px";
    cell1.style.verticalAlign = "top";

    row.appendChild(cell1);

    var navpanel0 = document.createElement("div");
    navpanel0.style.width = "70px";
    navpanel0.style.height = "calc(100% - 100px)";
    navpanel0.id = "navpanel0";
    navpanel0.style.cssFloat = "right";
    navpanel0.style.backgroundColor = "#e7efeb";
    navpanel0.style.overflow = "hidden";
    navpanel0.style.verticalAlign = "top";
    navpanel0.style.textAlign = "center";

    cell1.appendChild(navpanel0);

    var navUp = document.createElement("div");
    navUp.id = "navUp";
    navUp.className = "arrow-up";
    navUp.style.margin = "auto";

    navUp.onmousedown = function () {
        if (page - 1 > 0) {
            page -= 1;
        }

        var url = window.parent.patient.settings.ddePath + window.parent.patient.settings.searchPath + "/?first_name=" + __$("first_name").value.trim() +
            "&last_name=" + __$("last_name").value.trim() + "&gender=" +
            __$("gender").value.trim() + "&page=" + page;

        ajaxSearch(page, url);
    }

    navpanel0.appendChild(navUp);

    var navpanel1 = document.createElement("div");
    navpanel1.style.width = "70px";
    navpanel1.style.height = "30px";
    navpanel1.id = "navpanel1";
    navpanel1.style.cssFloat = "right";
    navpanel1.style.backgroundColor = "#e7efeb";
    navpanel1.style.overflow = "hidden";
    navpanel1.style.verticalAlign = "bottom";

    cell1.appendChild(navpanel1);

    var navDown = document.createElement("div");
    navDown.id = "navDown";
    navDown.className = "arrow-down";
    navDown.style.margin = "auto";

    navDown.onmousedown = function () {
        page += 1;

        var url = window.parent.patient.settings.ddePath + window.parent.patient.settings.searchPath + "/?first_name=" + __$("first_name").value.trim() +
            "&last_name=" + __$("last_name").value.trim() + "&gender=" +
            __$("gender").value.trim() + "&page=" + page;

        ajaxSearch(page, url);
    }

    navpanel1.appendChild(navDown);

    var leftpanel = document.createElement("div");
    leftpanel.style.border = "2px solid #B2C4B4";
    leftpanel.style.width = "49.3%";
    leftpanel.style.height = "calc(100% - 75px)";
    leftpanel.id = "leftpanel";
    leftpanel.style.cssFloat = "left";
    leftpanel.style.borderRadius = "8px";
    leftpanel.style.backgroundColor = "#e7efeb";
    leftpanel.style.overflow = "auto";

    cell0.appendChild(leftpanel);

    var rightpanel = document.createElement("div");
    rightpanel.style.border = "2px solid #B2C4B4";
    rightpanel.style.width = "49.3%";
    rightpanel.style.height = "calc(100% - 75px)";
    rightpanel.id = "rightpanel";
    rightpanel.style.cssFloat = "right";
    rightpanel.style.borderRadius = "10px";
    rightpanel.style.backgroundColor = "#e7efeb";
    rightpanel.style.overflow = "auto";

    cell0.appendChild(rightpanel);

    var footer = document.createElement("div");
    footer.id = "extras";
    footer.style.cssFloat = "right";

    __$("buttons").appendChild(footer);

    var newPatient = document.createElement("button");
    newPatient.innerHTML = "<span>New Patient</span>";
    newPatient.id = "newPatient";
    newPatient.style.cssFloat = "right";

    newPatient.onmousedown = function () {

        buildAddPage(__$("first_name").value.trim(), __$("last_name").value.trim(),
            __$("gender").value.trim());

    }

    footer.appendChild(newPatient);

    var editPatient = document.createElement("button");
    editPatient.innerHTML = "<span>Edit Patient</span>";
    editPatient.id = "editPatient";
    editPatient.style.cssFloat = "right";
    editPatient.className = "gray";

    editPatient.onmousedown = function () {

        if (this.className.match(/gray/))
            return;

        buildEditPage(this.getAttribute("patient_id"));

    }

    footer.appendChild(editPatient);

    var url = window.parent.patient.settings.ddePath + window.parent.patient.settings.searchPath + "/?first_name=" + __$("first_name").value.trim() +
        "&last_name=" + __$("last_name").value.trim() + "&gender=" +
        __$("gender").value.trim() + "&page=" + page;

    ajaxSearch(page, url);

}

function hidekeyboard() {
    if (__$("keyboard")) {
        __$("keyboard").style.display = "none";
    } else {
        setTimeout("hidekeyboard()", 100);
    }
}

function ajaxSearch(page, url) {

    /*var url = window.parent.patient.settings.ddePath + window.parent.patient.settings.searchPath + "/?first_name=" + __$("first_name").value.trim() +
     "&last_name=" + __$("last_name").value.trim() + "&gender=" +
     __$("gender").value.trim() + "&page=" + page;*/

    if (__$("nextButton")) {
        __$("nextButton").className = "button gray navButton";
        __$("nextButton").onclick = function () {
        };
    }

    if (__$("editPatient")) {

        __$("editPatient").className = "gray";

    }

    var auth = window.parent.patient.makeBaseAuth(window.parent.patient.settings.ddeUser, window.parent.patient.settings.ddePassword);
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        handleAjaxRequest(httpRequest);
    };
    try {
        httpRequest.open('GET', url, true);
        httpRequest.setRequestHeader('Authorization', auth);
        httpRequest.send(null);
    } catch (e) {
    }

}

function handleAjaxRequest(aXMLHttpRequest) {

    if (!aXMLHttpRequest) return;

    __$("leftpanel").innerHTML = "";
    __$("rightpanel").innerHTML = "";

    if (__$("nextButton")) {
        __$("nextButton").className = "button gray navButton";
        __$("nextButton").onclick = function () {
        };
    }

    if (__$("editPatient")) {

        __$("editPatient").className = "gray";

    }

    if (aXMLHttpRequest.readyState == 4 && aXMLHttpRequest.status == 200) {

        var result = aXMLHttpRequest.responseText;

        window.parent.patient.patients = JSON.parse(result);

        if (Object.keys(window.parent.patient.patients).length == 0) {
            __$("rightpanel").innerHTML = "<div style='margin: auto; padding: 20px; font-size: 24px; font-style: italic;'>No results found!</div>";
        }

        for (var i = 0; i < window.parent.patient.patients.length; i++) {

            var div = document.createElement("div");
            div.id = i;
            div.className = "element " + (i % 2 > 0 ? "odd" : "");
            div.setAttribute("tag", (i % 2 > 0 ? "odd" : "even"));
            div.setAttribute("npid", window.parent.patient.patients[i]["national_id"]);
            div.setAttribute("patient_id", window.parent.patient.patients[i]["person_id"]);

            div.onclick = function () {
                deselectAllAndSelect(this.id);

                window.parent.patient.patientId = this.getAttribute("npid");

                showPatient(this.id);

                __$("patient").value = this.id;

                __$("selected_patient").value = this.getAttribute("npid");

                if (__$("editPatient")) {

                    __$("editPatient").className = "blue";

                    __$("editPatient").setAttribute("pos", this.id);

                    __$("editPatient").setAttribute("patient_id", this.getAttribute("patient_id"));

                }

                if (__$('nextButton')) {
                    __$("nextButton").innerHTML = "<span>Select</span>"
                    __$("nextButton").className = "green navButton";

                    __$('nextButton').onmousedown = function () {

                        // window.location = window.parent.patient.settings.basePath + "/patient/" + __$("selected_patient").value.trim();

                        gotoNextPage();

                    }
                }
            }

            div.innerHTML = "<table width='100%'><tr><td style='width: 50%'>" +
                window.parent.patient.patients[i]["names"]["given_name"] + " " + window.parent.patient.patients[i]["names"]["family_name"] +
                " (" + window.parent.patient.patients[i]["age"] + ")" + "</td><td>" + window.parent.patient.patients[i]["national_id"] +
                "</td><td style='width: 30px; background-color: white; border-radius: 60px; padding: 5px; border: 1px solid #666;'>" +
                (window.parent.patient.patients[i]["gender"] == "M" ? "<img src='" + window.parent.patient.icoMale + "' width='47px' alt='Male' />" :
                    (window.parent.patient.patients[i]["gender"] == "F" ? "<img src='" + window.parent.patient.icoFemale + "' width='47px' alt='Female' />" : "")) + "</td></tr></table>";

            __$("rightpanel").appendChild(div);

        }

    }

}

function deselectAllAndSelect(me) {

    for (var i = 0; i < __$("rightpanel").children.length; i++) {
        if (__$("rightpanel").children[i].id == me) {
            __$("rightpanel").children[i].className = "element highlighted";
        } else {
            __$("rightpanel").children[i].className = "element " +
                (__$("rightpanel").children[i].getAttribute("tag") == "odd" ? "odd" : "");
        }
    }

}

function showPatient(pos) {

    __$("leftpanel").innerHTML = "";

    if (__$("json")) {
        __$("json").innerHTML = JSON.stringify(window.parent.patient.patients[pos]);
    }

    var table = document.createElement("table");
    table.style.margin = "auto";
    table.style.paddingTop = "10px";
    table.setAttribute("cellpadding", 10);
    table.setAttribute("cellspacing", 0);
    table.style.fontSize = "28px";
    table.style.color = "#000";
    table.style.width = "100%";

    __$("leftpanel").appendChild(table);

    var tbody = document.createElement("tbody");

    table.appendChild(tbody);

    var tr1 = document.createElement("tr");

    tbody.appendChild(tr1);

    var cell1_1 = document.createElement("th");
    cell1_1.style.textAlign = "right";
    cell1_1.style.color = "#000";
    cell1_1.innerHTML = "Patient Name:";
    cell1_1.style.borderRight = "1px dotted #000";

    tr1.appendChild(cell1_1);

    var cell1_2 = document.createElement("td");
    cell1_2.style.fontStyle = "italic";
    cell1_2.innerHTML = window.parent.patient.patients[pos]["names"]["given_name"] + " " + window.parent.patient.patients[pos]["names"]["family_name"];

    tr1.appendChild(cell1_2);

    var tr2 = document.createElement("tr");

    tbody.appendChild(tr2);

    var cell2_1 = document.createElement("th");
    cell2_1.style.textAlign = "right";
    cell2_1.style.color = "#000";
    cell2_1.innerHTML = "Age:";
    cell2_1.style.borderRight = "1px dotted #000";

    tr2.appendChild(cell2_1);

    var cell2_2 = document.createElement("td");
    cell2_2.style.fontStyle = "italic";
    cell2_2.innerHTML = (window.parent.patient.patients[pos]["birthdate_estimated"] ? "~" : "") + window.parent.patient.patients[pos]["age"];

    tr2.appendChild(cell2_2);

    var tr3 = document.createElement("tr");

    tbody.appendChild(tr3);

    var cell3_1 = document.createElement("th");
    cell3_1.style.textAlign = "right";
    cell3_1.style.color = "#000";
    cell3_1.innerHTML = "National ID:";
    cell3_1.style.borderRight = "1px dotted #000";

    tr3.appendChild(cell3_1);

    var cell3_2 = document.createElement("td");
    cell3_2.style.fontStyle = "italic";
    cell3_2.innerHTML = window.parent.patient.patients[pos]["national_id"];

    tr3.appendChild(cell3_2);

    for (var k = 0; k < window.parent.patient.patients[pos]["patient"]["identifiers"].length; k++) {

        if (String(window.parent.patient.patients[pos]["patient"]["identifiers"][k][Object.keys(window.parent.patient.patients[pos]["patient"]
                ["identifiers"][k])[0]]).trim().length <= 0)
            continue;

        var tr3 = document.createElement("tr");

        tbody.appendChild(tr3);

        var cell3_1 = document.createElement("th");
        cell3_1.style.textAlign = "right";
        cell3_1.style.color = "#000";
        cell3_1.innerHTML = Object.keys(window.parent.patient.patients[pos]["patient"]["identifiers"][k])[0] + ":";
        cell3_1.style.borderRight = "1px dotted #000";

        tr3.appendChild(cell3_1);

        var cell3_2 = document.createElement("td");
        cell3_2.style.fontStyle = "italic";
        cell3_2.innerHTML = window.parent.patient.patients[pos]["patient"]["identifiers"][k][Object.keys(window.parent.patient.patients[pos]
            ["patient"]["identifiers"][k])[0]];

        tr3.appendChild(cell3_2);

    }

    var tr4 = document.createElement("tr");

    tbody.appendChild(tr4);

    var cell4_1 = document.createElement("th");
    cell4_1.style.textAlign = "right";
    cell4_1.style.color = "#000";
    cell4_1.innerHTML = "Gender:";
    cell4_1.style.borderRight = "1px dotted #000";

    tr4.appendChild(cell4_1);

    var cell4_2 = document.createElement("td");
    cell4_2.style.fontStyle = "italic";

    cell4_2.innerHTML = (window.parent.patient.patients[pos]["gender"] == "M" ? "Male" : (window.parent.patient.patients[pos]["gender"] == "F" ? "Female" : ""));

    tr4.appendChild(cell4_2);

    var tr5 = document.createElement("tr");

    tbody.appendChild(tr5);

    var cell5_1 = document.createElement("th");
    cell5_1.style.textAlign = "right";
    cell5_1.style.color = "#000";
    cell5_1.innerHTML = "Residence:";
    cell5_1.style.borderRight = "1px dotted #000";

    tr5.appendChild(cell5_1);

    var cell5_2 = document.createElement("td");
    cell5_2.style.fontStyle = "italic";
    cell5_2.innerHTML = window.parent.patient.patients[pos]["addresses"]["current_village"];

    tr5.appendChild(cell5_2);

}
