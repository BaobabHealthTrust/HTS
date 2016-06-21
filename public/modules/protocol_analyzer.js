/**
 * Created by chimwemwe on 5/24/16.
 */

"use strict"

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

        if (format.match(/YYYY\-mm\-dd/)) {

            result = date.getFullYear() + "-" + protocol.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                protocol.padZeros(date.getDate(), 2);

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

var protocol = ({

    version: "0.0.1",

    setCookie: function (cname, cvalue, exdays) {

        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;

    },

    getCookie: function (cname) {

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

    },

    expand: function (obj, original) {

        var keys = Object.keys(obj).sort();

        for (var i = 0; i < keys.length; i++) {

            var k = keys[i];

            var v = obj[k];

            if (String(typeof(obj[k])).toLowerCase() != "object" && k == "text" && obj['type'].toUpperCase() == "P") {

                if (!this.questions[obj["root"]]) {

                    this.questions[obj["root"]] = {};

                }

                this.questions[obj["root"]]["text"] = String(obj["text"]);
                this.questions[obj["root"]]["root"] = String(obj["root"]);

                if (obj["attributes"]) {

                    if (obj["attributes"]["program"])
                        this.questions[obj["root"]]["program"] = obj["attributes"]["program"];

                    if (obj["attributes"]["includejs"])
                        this.questions[obj["root"]]["includejs"] = obj["attributes"]["includejs"];

                    if (obj["attributes"]["includecss"])
                        this.questions[obj["root"]]["includecss"] = obj["attributes"]["includecss"];

                    if (obj["attributes"]["pos"])
                        this.questions[obj["root"]]["pos"] = obj["attributes"]["pos"];

                    if (obj["attributes"]["parent"])
                        this.questions[obj["root"]]["parent"] = obj["attributes"]["parent"];

                    if (obj["attributes"]["ignore"])
                        this.questions[obj["root"]]["ignore"] = obj["attributes"]["ignore"];

                    if (obj["attributes"]["parent"])
                        this.questions[obj["root"]]["parent"] = obj["attributes"]["parent"];

                    if (obj["attributes"]["scope"])
                        this.questions[obj["root"]]["scope"] = obj["attributes"]["scope"];

                    if (obj["attributes"]["concept"])
                        this.questions[obj["root"]]["concept"] = obj["attributes"]["concept"];

                    if (obj["attributes"]["except_concept"])
                        this.questions[obj["root"]]["except_concept"] = obj["attributes"]["except_concept"];

                    if (obj["attributes"]["drug_concept"])
                        this.questions[obj["root"]]["drug_concept"] = obj["attributes"]["drug_concept"];

                    if (obj["attributes"]["special_field"])
                        this.questions[obj["root"]]["special_field"] = obj["attributes"]["special_field"];

                    if (obj["attributes"]["label"])
                        this.questions[obj["root"]]["label"] = obj["attributes"]["label"];

                }

            }

            if (String(typeof(obj[k])).toLowerCase() != "object" && k == "text" && obj['type'].toUpperCase() == "Q") {

                if (obj["root"]) {

                    var parent = obj["root"].match(/^(\d+)/);

                    if (parent) {

                        parent = parent[1];

                        if (!this.questions[parent])
                            this.questions[parent] = {};

                        if (!this.questions[parent][obj["root"]])
                            this.questions[parent][obj["root"]] = {};

                        this.questions[parent][obj["root"]]["question"] = obj["text"];

                        if (obj["attributes"])
                            this.questions[parent][obj["root"]]["attributes"] = obj["attributes"];

                        if (!this.questions[parent][obj["root"][obj["root"].substring(0, (obj["root"].trim().length - 2))]]) {

                            var pos = obj["root"].substring(0, (obj["root"].trim().length - 2)).split(".");

                            var position = {};

                            switch (pos.length) {

                                case 1:

                                    position = original[pos[0]];

                                    break;

                                case 2:

                                    position = original[pos[0]][pos[1]];

                                    break;

                                case 3:

                                    position = original[pos[0]][pos[1]][pos[2]];

                                    break;

                                case 4:

                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]];

                                    break;

                                case 5:

                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]][pos[4]];

                                    break;

                                case 6:

                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]][pos[4]][pos[5]];

                                    break;

                                case 7:

                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]][pos[4]][pos[5]][pos[6]];

                                    break;

                                case 8:

                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]][pos[4]][pos[5]][pos[6]][pos[7]];

                                    break;

                                case 9:
                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]][pos[4]][pos[5]][pos[6]][pos[7]][pos[8]];

                                    break;

                                case 10:

                                    position = original[pos[0]][pos[1]][pos[2]][pos[3]][pos[4]][pos[5]][pos[6]][pos[7]][pos[8]][pos[9]];

                                    break;

                            }

                            if (position && position["type"]) {

                                if (position["type"].toLowerCase() == "o")
                                    this.questions[parent][obj["root"]]["condition"] =
                                        "[" + obj["root"].substring(0, (obj["root"].trim().length - 4)) + "] == [" + position["text"] + "]";

                            }

                        }

                    }

                }

            }

            if (String(typeof(obj[k])).toLowerCase() != "object" && k == "text" && obj['type'].toUpperCase() == "O") {

                if (obj["root"]) {

                    var parent = obj["root"].match(/^(\d+)/);

                    if (parent) {

                        parent = parent[1];

                        if (!this.questions[parent])
                            this.questions[parent] = {};

                        if (!this.questions[parent][obj["root"].substring(0, (obj["root"].trim().length - 2))])
                            this.questions[parent][obj["root"].substring(0, (obj["root"].trim().length - 2))] = {};

                        if (!this.questions[parent][obj["root"].substring(0, (obj["root"].trim().length - 2))]["options"])
                            this.questions[parent][obj["root"].substring(0, (obj["root"].trim().length - 2))]["options"] = {};

                        this.questions[parent][obj["root"].substring(0, (obj["root"].trim().length - 2))]["options"][obj["root"]] = obj["text"];

                    }

                }

            }

            if (String(typeof(obj[k])).toLowerCase() == "object") {

                this.expand(v, original);

            }

            // console.log(v);

        }

        // console.log(this.questions);

    },

    padZeros: function (number, positions) {
        var zeros = parseInt(positions) - String(number).length;
        var padded = "";

        for (var i = 0; i < zeros; i++) {
            padded += "0";
        }

        padded += String(number);

        return padded;
    },

    buildPage: function (obj, div, gender, age) {

        var order = {};

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/form2js.js");

        document.head.appendChild(script);

        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("language", "javascript");
        script.innerText = "var gender = '" + String(gender) + "'; tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "'; tt_cancel_show = " +
            "\"javascript:window.parent.dashboard.exitNavPanel()\"; tt_cancel_destination = " +
            "\"javascript:window.parent.dashboard.exitNavPanel()\";" +
            "function submitData(){" +
            "var data = form2js(document.getElementById('data'), undefined, true); console.log(data);" +
            "if(window.parent) window.parent.dashboard.submitData(data);" +
            "}";

        document.head.appendChild(script);

        var form = document.createElement("form");
        form.action = "javascript:submitData()";
        form.id = "data";
        form.style.display = "none";

        div.appendChild(form);

        var hiddenFields = {
            'data.program': obj["program"],
            'data.encounter_type': obj["text"],
            'data.patient_id': "",
            'data.user_id': ""
        }

        var fields = Object.keys(hiddenFields);

        for (var i = 0; i < fields.length; i++) {

            var key = fields[i];

            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = hiddenFields[key];

            form.appendChild(input);

        }

        var keys = Object.keys(obj);

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            var value = obj[key];

            if (value["attributes"]) {

                order[parseInt(value["attributes"]["pos"])] = key;

            }

        }

        var table = document.createElement("table");
        table.border = 0;

        form.appendChild(table);

        var orderKeys = Object.keys(order);

        for (var i = 0; i < orderKeys.length; i++) {

            var key = order[orderKeys[i]];

            var value = obj[key];

            if (["text", "root", "program", "concept", "except_concept", "drug_concept", "special_field", "label",
                "scope"].indexOf(key) < 0) {

                var tr = document.createElement("tr");

                table.appendChild(tr);

                var td1 = document.createElement("td");

                tr.appendChild(td1);

                var td2 = document.createElement("td");

                tr.appendChild(td2);

                td1.innerHTML = value["question"];

                var fieldType = "text";

                if(value["attributes"] && value["attributes"]['field_type']) {

                    fieldType = (["date", "number"].indexOf(value["attributes"]['field_type']) >= 0 ?
                        value["attributes"]['field_type'] : "text");

                }

                if (value["options"]) {

                    var select = document.createElement("select");
                    select.id = key;

                    td2.appendChild(select);

                    // TODO: Need to create a way to assign data type to name to associate to the right data storage type
                    select.name = "data.obs." + fieldType + "." + (value["attributes"] ? (value["attributes"]["concept"] ?
                        value["attributes"]["concept"] : value["question"].trim()) : value["question"].trim()) + "" +
                        (value["attributes"] ? (value["attributes"]["multiple"] ? "[]" : "") : "");

                    select.setAttribute("helpText", (value["attributes"] ? (value["attributes"]["helpText"] ?
                        value["attributes"]["helpText"] : value["question"] ) : value["question"]));

                    if (value["condition"] && (value["attributes"] ? (!value["attributes"]["condition"]) : true)) {

                        var parts = String(value["condition"]).match(/\[([^\]]+)\](\s)?([^\s|^\[]+)(\s)?\[([^\]]+)\]/);

                        if (parts) {

                            select.setAttribute("condition", "document.getElementById(\"" + parts[1] + "\").value " +
                                parts[3] + " \"" + parts[5] + "\"");

                        }

                    }

                    if (value["attributes"]) {

                        var attrs = Object.keys(value["attributes"]);

                        for (var a = 0; a < attrs.length; a++) {

                            var f = attrs[a];

                            var fv = value["attributes"][f];

                            if (f.toLowerCase() != "concept" && f.toLowerCase() != "ruby") {

                                select.setAttribute(f, (f.toLowerCase() == "helptext" ?
                                    fv.trim().replace(/\|/g, ":") : fv.trim() ))

                            }

                        }

                    }

                    var opt = document.createElement("option");

                    select.appendChild(opt);

                    if (value["options"]) {

                        var keys = Object.keys(value["options"]);

                        for (var a = 0; a < keys.length; a++) {

                            var f = keys[a];

                            var fv = value["options"][f];

                            var opt = document.createElement("option");
                            opt.setAttribute("value", fv);
                            opt.innerHTML = fv;

                            select.appendChild(opt);

                        }

                    }

                } else {

                    var input = document.createElement("input");
                    input.id = key;

                    td2.appendChild(input);

                    // TODO: Need to create a way to assign data type to name to associate to the right data storage type
                    input.name = "data.obs." + fieldType + "." + (value["attributes"] ? (value["attributes"]["concept"] ?
                        value["attributes"]["concept"] : value["question"].trim()) : value["question"].trim()) + "" +
                        (value["attributes"] ? (value["attributes"]["multiple"] ? "[]" : "") : "");

                    input.setAttribute("helpText", (value["attributes"] ? (value["attributes"]["helpText"] ?
                        value["attributes"]["helpText"] : value["question"] ) : value["question"]));

                    if (value["condition"] && (value["attributes"] ? (!value["attributes"]["condition"]) : true)) {

                        var parts = String(value["condition"]).match(/\[([^\]]+)\](\s)?([^\s|^\[]+)(\s)?\[([^\]]+)\]/);

                        if (parts) {

                            input.setAttribute("condition", "document.getElementById(\"" + parts[1] + "\").value " +
                                parts[3] + " \"" + parts[5] + "\"");

                        }

                    }

                    if (value["attributes"]) {

                        var attrs = Object.keys(value["attributes"]);

                        for (var a = 0; a < attrs.length; a++) {

                            var f = attrs[a];

                            var fv = value["attributes"][f];

                            if (f.toLowerCase() != "concept" && f.toLowerCase() != "ruby") {

                                input.setAttribute(f, (f.toLowerCase() == "helptext" ?
                                    fv.trim().replace(/\|/g, ":") : fv.trim() ))

                            }

                        }

                    }


                }

            }

        }

    },

    reGroup: function (data) {

        const DELIMITER = "$$";

        this.questions = {};

        var result = {};

        var lines = (data ? data.split("\n") : []);

        for (var i = 0; i < lines.length; i++) {


            if (lines[i].trim().length <= 0)
                continue;

            var line = lines[i];

            var mline = line.trim().match(/^[C|P|Q|O]\.(\d+)\.((\d+)\.)?((\d+)\.)?((\d+)\.)?((\d+)\.)?((\d+)\.)?((\d+)\.)?((\d+)\.)?((\d+)\.)?((\d+)\.)?\s([^\[]+)(\[(.+)\])?/);

            if (mline) {

                for (var j = 0; j < 10; j++) {

                    switch (j) {

                        case 0:

                            if (mline[1] && !result[mline[1]]) {

                                result[mline[1]] = {};

                                if (!mline[3]) {

                                    result[mline[1]]["text"] = mline[20];
                                    result[mline[1]]["type"] = line.substring(0, 1);
                                    result[mline[1]]["root"] = String(mline[1]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]]["attributes"] = {}

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 1:

                            if (mline[3] && !result[mline[1]][mline[3]]) {

                                result[mline[1]][mline[3]] = {};

                                if (!mline[5]) {

                                    result[mline[1]][mline[3]]["text"] = mline[20];
                                    result[mline[1]][mline[3]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]]["root"] = String(mline[1]) + "." + String(mline[3]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 2:

                            if (mline[5] && !result[mline[1]][mline[3]][mline[5]]) {

                                result[mline[1]][mline[3]][mline[5]] = {};

                                if (!mline[7]) {

                                    result[mline[1]][mline[3]][mline[5]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 3:

                            if (mline[7] && !result[mline[1]][mline[3]][mline[5]][mline[7]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]] = {};

                                if (!mline[9]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 4:

                            if (mline[9] && !result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]] = {};

                                if (!mline[11]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]) + "." + String(mline[9]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 5:

                            if (mline[11] && !result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]] = {};

                                if (!mline[13]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]) + "." +
                                        String(mline[9]) + "." + String(mline[11]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 6:

                            if (mline[13] && !result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]] = {};

                                if (!mline[15]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]) + "." +
                                        String(mline[9]) + "." + String(mline[11]) + "." + String(mline[13]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 7:

                            if (mline[15] && !result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]] = {};

                                if (!mline[17]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]) + "." +
                                        String(mline[9]) + "." + String(mline[11]) + "." + String(mline[13]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 8:

                            if (mline[17] && !result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]] = {};

                                if (!mline[19]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]) + "." +
                                        String(mline[9]) + "." + String(mline[11]) + "." + String(mline[13]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                        case 9:

                            if (mline[17] && !result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]]) {

                                result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]] = {};

                                if (!mline[19]) {

                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]]["text"] = mline[20];
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]]["type"] = line.substring(0, 1);
                                    result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]]["root"] = String(mline[1]) + "." +
                                        String(mline[3]) + "." + String(mline[5]) + "." + String(mline[7]) + "." +
                                        String(mline[9]) + "." + String(mline[11]) + "." + String(mline[13]);

                                    if (mline[22]) {

                                        var terms = mline[22].split(DELIMITER);

                                        result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]]["attributes"] = {};

                                        for (var t = 0; t < terms.length; t++) {

                                            var parts = terms[t].split("::");

                                            result[mline[1]][mline[3]][mline[5]][mline[7]][mline[9]][mline[11]][mline[13]][mline[15]][mline[17]][mline[19]]["attributes"][parts[0].trim()] = parts[1].trim();

                                        }

                                    }

                                }

                            }

                            break;

                    }

                }

            }

        }

        this.expand(result, result);

        this.manageWorkflow();

    },

    manageWorkflow: function () {

        var keys = Object.keys(this.questions);

        var written = {};

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            var value = this.questions[key];

            if ((value["ignore"] ? (value["ignore"].toLowerCase() == "true" ? false : true ) : true))
                this.flow.push(key);

            var name_label = value["text"].trim().toLowerCase().replace(/\s/g, "_").replace(/\//g, "");

            var name = name_label.replace(/\-/g, "_");

            var label = (value["label"] ? value["label"] : null);

            if (value["label"])
                this.label[label] = label;

            var labeltxt = (label ? label.trim().toLowerCase().replace(/\s/g, "_").replace(/\//g, "").replace(/\-/g, "_") : null);

            this.label_encounter_map[label ? labeltxt.toUpperCase() : name.replace(/_/g, " ").toUpperCase()] =
                name_label.replace(/_/g, " ").toUpperCase();

            written[(label ? labeltxt : name)] = true;

            if ((value['ignore'] ? (value['ignore'].toLowerCase() != "true") : true) && !value["parent"]) {

                var entry = [(value["pos"] ? parseInt(value["pos"]) : 0), (label ? labeltxt : name)];

                this.pages.push(entry);

            }

            this.scope[(label ? labeltxt : name)] = (value["scope"] ? value["scope"] : "TODAY");

            this.concept[(label ? labeltxt : name)] = (value["concept"] ? value["concept"] : null);

            this.except_concept[(label ? labeltxt : name)] = (value["except_concept"] ? value["except_concept"] : null);

            this.drug_concept[(label ? labeltxt : name)] = (value["drug_concept"] ? value["drug_concept"] : null);

            this.special_field[(label ? labeltxt : name)] = (value["special_field"] ? value["special_field"] : null);

            var div = document.createElement("div");
            div.id = "content";

            if (this.target) {

                this.target.appendChild(div);

            } else {

                document.body.appendChild(div);

            }

            if (value["includecss"]) {

                var jsfiles = value["includecss"].split(";");

                for (var s = 0; s < jsfiles.length; s++) {

                    var link = document.createElement("link");
                    link.setAttribute("href", "/stylesheets/" + jsfiles[s] + ".css");
                    link.setAttribute("type", "text/css");
                    link.setAttribute("rel", "stylesheet");

                    document.head.appendChild(link);

                }

            }

            this.buildPage(value, div, this['gender'], this['age']);

            if (value["includejs"]) {

                var jsfiles = value["includejs"].split(";");

                for (var s = 0; s < jsfiles.length; s++) {

                    var script = document.createElement("script");
                    script.setAttribute("src", (jsfiles[s].match(/touchscreentoolkit/i) ?
                        "/touchscreentoolkit/lib/javascripts/" : "/javascripts/") + jsfiles[s] + ".js");

                    document.head.appendChild(script);

                }

            }

        }

    },

    ajaxRequest: function (url, callback) {

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
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    init: function (path, target, rootPath, gender, age) {

        this.rootPath = rootPath;

        this.pages = [];

        this.label_encounter_map = {};

        this.flow = [];

        this.questions = {};

        this.scope = {};

        this.concept = {};

        this.except_concept = {};

        this.drug_concept = {};

        this.special_field = {};

        this.label = {};

        this.target = target;

        this['gender'] = gender;

        this['age'] = age;

        this.ajaxRequest(path, function (data) {

            protocol.reGroup(data);

        });

    }

});