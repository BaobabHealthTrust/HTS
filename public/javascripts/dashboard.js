"use strict"

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

                result = date.getFullYear() + "-" + dashboard.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    dashboard.padZeros(date.getDate(), 2) + " " + dashboard.padZeros(date.getHours(), 2) + ":" +
                    dashboard.padZeros(date.getMinutes(), 2) + ":" + dashboard.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

                result = date.getFullYear() + "-" + dashboard.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    dashboard.padZeros(date.getDate(), 2);

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

Object.defineProperty(Array.prototype, "shuffle", {
    value: function () {
        var array = this;

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * i); // no +1 here!
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
});

var dashboard = ({

    gender: "F",

    __$: function (id) {
        return document.getElementById(id);
    },

    $: function (id) {

        return document.getElementById(id);

    },

    $$: function (id) {

        if (this.$("ifrMain")) {

            return this.$("ifrMain").contentWindow.document.getElementById(id);

        }

    },

    __: function (id) {

        if (this.$("ifrMain")) {

            return this.$("ifrMain").contentWindow;

        }

    },

    /*
    *   Method to get the value assigned to a specific concept for a given encounter on a given visit for a
    *   specific program
    *
    * */
    queryActiveObs: function(program, visit, encounter, concept) {

        if(this.data && this.data.data && this.data.data.programs && Object.keys(this.data.data.programs).length > 0) {

            var patientPrograms = this.data.data.programs[program].patient_programs;

            var result = null;

            var pKeys = Object.keys(patientPrograms);

            for(var i = 0; i < pKeys.length; i++) {

                var key = pKeys[i];

                if(!patientPrograms[key].date_completed) {

                    if(patientPrograms[key].visits && patientPrograms[key].visits[visit]) {

                        if(patientPrograms[key].visits[visit][encounter]) {

                            for(var j = 0; j < patientPrograms[key].visits[visit][encounter].length; j++) {

                                if (patientPrograms[key].visits[visit][encounter][j][concept]) {

                                    result = patientPrograms[key].visits[visit][encounter][j][concept].response.value;

                                    return result;

                                }

                            }

                        }

                    }

                }

            }

        } else {

            return null;

        }

    },

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

    echo: function (msg) {
        if (console)
            console.log(msg)
    },

    setData: function (key, data) {
        this[key] = data;
    },

    getData: function (key) {
        return this[key];
    },

    sheet: function () {
        // Create the <style> tag
        var style = document.createElement("style");

        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    },

    addCSSRule: function (sheet, selector, rules, index) {

        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if ("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }

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

    getAge: function (birthdate, estimated) {

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

            var num = "< 1H";

            age = [num, num, num];

        }

        age[0] = (estimated != undefined && parseInt(estimated) == 1 ? "~" + age[0] : age[0]);

        return age;

    },

    buildPage: function () {

        var style = this.sheet();
        this.addCSSRule(style, "body", "padding: 0px !important");
        this.addCSSRule(style, "body", "overflow: hidden");
        this.addCSSRule(style, "body", "margin: 0px");
        this.addCSSRule(style, ".headTab", "width: 100%");
        this.addCSSRule(style, ".headTab", "box-shadow: 5px 2px 5px 0px rgba(0,0,0,0.75)");
        this.addCSSRule(style, ".headTab", "overflow: hidden");
        this.addCSSRule(style, ".headTab", "height: 120px");
        this.addCSSRule(style, ".headTab", "border: 1px solid #004586");
        this.addCSSRule(style, ".blueText", "color: #3c60b1");

        this.addCSSRule(style, "button", "font-size: 22px !important");
        this.addCSSRule(style, "button", "padding: 15px;");
        this.addCSSRule(style, "button", "min-width: 120px");
        this.addCSSRule(style, "button", "cursor: pointer");
        this.addCSSRule(style, "button", "min-height: 55px");
        this.addCSSRule(style, "button", "border-radius: 5px !important");
        this.addCSSRule(style, "button", "margin: 3px");

        this.addCSSRule(style, "button:active", "background-color: #ffc579 !important");
        this.addCSSRule(style, "button:active", "background-image: -webkit-gradient(linear, left top, left bottom, from(#ffc579), to(#fb9d23)) !important");
        this.addCSSRule(style, "button:active", "background-image: -webkit-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -moz-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -ms-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: -o-linear-gradient(top, #ffc579, #fb9d23) !important");
        this.addCSSRule(style, "button:active", "background-image: linear-gradient(to bottom, #ffc579, #fb9d23)");
        this.addCSSRule(style, "button:active", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#ffc579, endColorstr=#fb9d23) !important");

        this.addCSSRule(style, ".blue", "border: 1px solid #7eb9d0");
        this.addCSSRule(style, ".blue", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".blue", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".blue", "border-radius: 3px");
        this.addCSSRule(style, ".blue", "font-size: 28px");
        this.addCSSRule(style, ".blue", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".blue", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".blue", "text-decoration: none");
        this.addCSSRule(style, ".blue", "display: inline-block");
        this.addCSSRule(style, ".blue", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".blue", "font-weight: bold");
        this.addCSSRule(style, ".blue", "color: #FFFFFF");
        this.addCSSRule(style, ".blue", "background-color: #a7cfdf");
        this.addCSSRule(style, ".blue", "background-image: -webkit-gradient(linear, left top, left bottom, from(#a7cfdf), to(#23538a))");
        this.addCSSRule(style, ".blue", "background-image: -webkit-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -moz-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -ms-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: -o-linear-gradient(top, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "background-image: linear-gradient(to bottom, #a7cfdf, #23538a)");
        this.addCSSRule(style, ".blue", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a7cfdf, endColorstr=#23538a)");

        this.addCSSRule(style, ".blue:hover", "border: 1px solid #5ca6c4");
        this.addCSSRule(style, ".blue:hover", "background-color: #82bbd1");
        this.addCSSRule(style, ".blue:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#82bbd1), to(#193b61))");
        this.addCSSRule(style, ".blue:hover", "background-image: -webkit-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -moz-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -ms-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: -o-linear-gradient(top, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "background-image: linear-gradient(to bottom, #82bbd1, #193b61)");
        this.addCSSRule(style, ".blue:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#82bbd1, endColorstr=#193b61)");

        this.addCSSRule(style, ".green", "border: 1px solid #34740e");
        this.addCSSRule(style, ".green", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".green", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".green", "border-radius: 3px");
        this.addCSSRule(style, ".green", "font-size: 28px");
        this.addCSSRule(style, ".green", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".green", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".green", "text-decoration: none");
        this.addCSSRule(style, ".green", "display: inline-block");
        this.addCSSRule(style, ".green", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".green", "font-weight: bold");
        this.addCSSRule(style, ".green", "color: #FFFFFF");
        this.addCSSRule(style, ".green", "background-color: #4ba614");
        this.addCSSRule(style, ".green", "background-image: -webkit-gradient(linear, left top, left bottom, from(#4ba614), to(#008c00))");
        this.addCSSRule(style, ".green", "background-image: -webkit-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -moz-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -ms-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: -o-linear-gradient(top, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "background-image: linear-gradient(to bottom, #4ba614, #008c00)");
        this.addCSSRule(style, ".green", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#4ba614, endColorstr=#008c00)");

        this.addCSSRule(style, ".green:hover", "border: 1px solid #224b09");
        this.addCSSRule(style, ".green:hover", "background-color: #36780f");
        this.addCSSRule(style, ".green:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#36780f), to(#005900))");
        this.addCSSRule(style, ".green:hover", "background-image: -webkit-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -moz-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -ms-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: -o-linear-gradient(top, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "background-image: linear-gradient(to bottom, #36780f, #005900)");
        this.addCSSRule(style, ".green:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#36780f, endColorstr=#005900)");

        this.addCSSRule(style, ".red", "border: 1px solid #72021c");
        this.addCSSRule(style, ".red", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".red", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".red", "border-radius: 3px");
        this.addCSSRule(style, ".red", "font-size: 28px");
        this.addCSSRule(style, ".red", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".red", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".red", "text-decoration: none");
        this.addCSSRule(style, ".red", "display: inline-block");
        this.addCSSRule(style, ".red", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".red", "font-weight: bold");
        this.addCSSRule(style, ".red", "color: #FFFFFF");
        this.addCSSRule(style, ".red", "background-color: #a90329");
        this.addCSSRule(style, ".red", "background-image: -webkit-gradient(linear, left top, left bottom, from(#a90329), to(#6d0019))");
        this.addCSSRule(style, ".red", "background-image: -webkit-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -moz-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -ms-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: -o-linear-gradient(top, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "background-image: linear-gradient(to bottom, #a90329, #6d0019)");
        this.addCSSRule(style, ".red", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a90329, endColorstr=#6d0019)");

        this.addCSSRule(style, ".red:hover", "border: 1px solid #450111");
        this.addCSSRule(style, ".red:hover", "background-color: #77021d");
        this.addCSSRule(style, ".red:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#77021d), to(#3a000d))");
        this.addCSSRule(style, ".red:hover", "background-image: -webkit-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -moz-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -ms-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: -o-linear-gradient(top, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "background-image: linear-gradient(to bottom, #77021d, #3a000d)");
        this.addCSSRule(style, ".red:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#77021d, endColorstr=#3a000d)");

        this.addCSSRule(style, ".gray", "border: 1px solid #ccc");
        this.addCSSRule(style, ".gray", "-webkit-border-radius: 3px");
        this.addCSSRule(style, ".gray", "-moz-border-radius: 3px");
        this.addCSSRule(style, ".gray", "border-radius: 3px");
        this.addCSSRule(style, ".gray", "font-size: 28px");
        this.addCSSRule(style, ".gray", "font-family: arial, helvetica, sans-serif");
        this.addCSSRule(style, ".gray", "padding: 10px 10px 10px 10px");
        this.addCSSRule(style, ".gray", "text-decoration: none");
        this.addCSSRule(style, ".gray", "display: inline-block");
        this.addCSSRule(style, ".gray", "text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3)");
        this.addCSSRule(style, ".gray", "font-weight: bold");
        this.addCSSRule(style, ".gray", "color: #FFFFFF");
        this.addCSSRule(style, ".gray", "background-color: #ccc");
        this.addCSSRule(style, ".gray", "background-image: -webkit-gradient(linear, left top, left bottom, from(#ccc), to(#999))");
        this.addCSSRule(style, ".gray", "background-image: -webkit-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -moz-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -ms-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: -o-linear-gradient(top, #ccc, #999)");
        this.addCSSRule(style, ".gray", "background-image: linear-gradient(to bottom, #ccc, #999)");
        this.addCSSRule(style, ".gray", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#ccc, endColorstr=#999)");

        this.addCSSRule(style, ".gray:hover", "border: 1px solid #ccc");
        this.addCSSRule(style, ".gray:hover", "background-color: #ddd");
        this.addCSSRule(style, ".gray:hover", "background-image: -webkit-gradient(linear, left top, left bottom, from(#333), to(#ccc))");
        this.addCSSRule(style, ".gray:hover", "background-image: -webkit-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -moz-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -ms-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: -o-linear-gradient(top, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "background-image: linear-gradient(to bottom, #333, #ccc)");
        this.addCSSRule(style, ".gray:hover", "filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#333, endColorstr=#ccc)");

        var table = document.createElement("table");
        table.width = "100%";
        table.border = 0;
        table.style.font = "14px \"Lucida Grande\", Helvetica, Arial, sans-serif";
        table.style.MozUserSelect = "none";
        table.style.borderCollapse = "collapse";

        document.body.appendChild(table);

        var tr1 = document.createElement("tr");

        table.appendChild(tr1);

        var td1_1 = document.createElement("td");
        td1_1.style.width = "25%";
        td1_1.style.padding = "5px";
        td1_1.style.paddingLeft = "15px";

        tr1.appendChild(td1_1);

        var div1 = document.createElement("div");
        div1.className = "headTab";

        td1_1.appendChild(div1);

        var tableDiv1 = document.createElement("table");
        tableDiv1.cellPadding = 1;
        tableDiv1.width = "100%";

        div1.appendChild(tableDiv1);

        var trDiv1_1 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_1);

        var thDiv1_1_1 = document.createElement("th");
        thDiv1_1_1.style.fontSize = "24px";
        thDiv1_1_1.style.textAlign = "left";
        thDiv1_1_1.style.width = "100%";
        thDiv1_1_1.style.overflow = "hidden";
        thDiv1_1_1.style.fontWeight = "normal";
        thDiv1_1_1.style.padding = "5px";
        thDiv1_1_1.id = "patient_name";
        thDiv1_1_1.className = "blueText";
        thDiv1_1_1.innerHTML = "Patient Name";

        trDiv1_1.appendChild(thDiv1_1_1);

        var trDiv1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_2);

        var thDiv1_2_1 = document.createElement("th");
        thDiv1_2_1.style.textAlign = "left";
        thDiv1_2_1.style.fontSize = "14px";
        thDiv1_2_1.style.paddingLeft = "5px";
        thDiv1_2_1.style.borderBottom = "1px solid #004586";
        thDiv1_2_1.className = "blueText";
        thDiv1_2_1.innerHTML = "Identifiers";

        trDiv1_2.appendChild(thDiv1_2_1);

        var trDiv1_3 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3);

        var tdDiv1_3_1 = document.createElement("td");

        tableDiv1.appendChild(tdDiv1_3_1);

        var tableDiv1_3_1 = document.createElement("table");
        tableDiv1_3_1.width = "100%";
        tableDiv1_3_1.style.fontSize = "12px";

        tdDiv1_3_1.appendChild(tableDiv1_3_1);

        var trDiv1_3_1_1 = document.createElement("tr");

        tableDiv1_3_1.appendChild(trDiv1_3_1_1);

        var tdDiv1_3_1_1_1 = document.createElement("td");
        tdDiv1_3_1_1_1.style.textAlign = "right";
        tdDiv1_3_1_1_1.style.fontWeight = "bold";
        tdDiv1_3_1_1_1.className = "blueText";
        tdDiv1_3_1_1_1.id = "primary_id_label";
        tdDiv1_3_1_1_1.innerHTML = "National ID";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_1);

        var tdDiv1_3_1_1_2 = document.createElement("td");
        tdDiv1_3_1_1_2.style.textAlign = "center";
        tdDiv1_3_1_1_2.style.width = "3px";
        tdDiv1_3_1_1_2.innerHTML = ":";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_2);

        var tdDiv1_3_1_1_3 = document.createElement("td");
        tdDiv1_3_1_1_3.id = "primary_id";
        tdDiv1_3_1_1_3.innerHTML = "XXX-XXX";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_3);

        var trDiv1_3_1_2 = document.createElement("tr");

        tableDiv1_3_1.appendChild(trDiv1_3_1_2);

        var tdDiv1_3_1_2_1 = document.createElement("td");
        tdDiv1_3_1_2_1.style.textAlign = "right";
        tdDiv1_3_1_2_1.style.fontWeight = "bold";
        tdDiv1_3_1_2_1.className = "blueText";
        tdDiv1_3_1_2_1.id = "other_id_label";
        tdDiv1_3_1_2_1.innerHTML = "Asthma Number";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_1);

        var tdDiv1_3_1_2_2 = document.createElement("td");
        tdDiv1_3_1_2_2.style.textAlign = "center";
        tdDiv1_3_1_2_2.style.width = "3px";
        tdDiv1_3_1_2_2.innerHTML = ":";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_2);

        var tdDiv1_3_1_2_3 = document.createElement("td");
        tdDiv1_3_1_2_3.id = "other_id";
        tdDiv1_3_1_2_3.innerHTML = "YYY-ZZZ-123";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_3);

        var td1_2 = document.createElement("td");
        td1_2.style.width = "25%";
        td1_2.style.padding = "5px";

        tr1.appendChild(td1_2);

        var div2 = document.createElement("div");
        div2.className = "headTab";

        td1_2.appendChild(div2);

        var tableDiv2 = document.createElement("table");
        tableDiv2.cellpadding = 1;
        tableDiv2.width = "100%";
        tableDiv2.style.fontSize = "14px";

        div2.appendChild(tableDiv2);

        var trDiv2_1 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_1);

        var tdDiv2_1_1 = document.createElement("td");
        tdDiv2_1_1.style.textAlign = "right";
        tdDiv2_1_1.style.fontWeight = "bold";
        tdDiv2_1_1.style.width = "100px";
        tdDiv2_1_1.className = "blueText";
        tdDiv2_1_1.innerHTML = "Gender";

        trDiv2_1.appendChild(tdDiv2_1_1);

        var tdDiv2_1_2 = document.createElement("td");
        tdDiv2_1_2.style.textAlign = "center";
        tdDiv2_1_2.style.width = "3px";
        tdDiv2_1_2.innerHTML = ":";

        trDiv2_1.appendChild(tdDiv2_1_2);

        var tdDiv2_1_3 = document.createElement("td");
        tdDiv2_1_3.id = "gender";
        tdDiv2_1_3.innerHTML = "Male";

        trDiv2_1.appendChild(tdDiv2_1_3);

        var trDiv2_2 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_2);

        var tdDiv2_2_1 = document.createElement("td");
        tdDiv2_2_1.style.textAlign = "right";
        tdDiv2_2_1.style.fontWeight = "bold";
        tdDiv2_2_1.className = "blueText";
        tdDiv2_2_1.innerHTML = "Age";

        trDiv2_2.appendChild(tdDiv2_2_1);

        var tdDiv2_2_2 = document.createElement("td");
        tdDiv2_2_2.style.textAlign = "center";
        tdDiv2_2_2.style.width = "3px";
        tdDiv2_2_2.innerHTML = ":";

        trDiv2_2.appendChild(tdDiv2_2_2);

        var tdDiv2_2_3 = document.createElement("td");
        tdDiv2_2_3.id = "age";
        tdDiv2_2_3.innerHTML = "35";

        trDiv2_2.appendChild(tdDiv2_2_3);

        var trDiv2_3 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_3);

        var tdDiv2_3_1 = document.createElement("td");
        tdDiv2_3_1.style.textAlign = "right";
        tdDiv2_3_1.style.fontWeight = "bold";
        tdDiv2_3_1.className = "blueText";
        tdDiv2_3_1.innerHTML = "Address";

        trDiv2_3.appendChild(tdDiv2_3_1);

        var tdDiv2_3_2 = document.createElement("td");
        tdDiv2_3_2.style.textAlign = "center";
        tdDiv2_3_2.style.width = "3px";
        tdDiv2_3_2.innerHTML = ":";

        trDiv2_3.appendChild(tdDiv2_3_2);

        var tdDiv2_3_3 = document.createElement("td");
        tdDiv2_3_3.id = "addressl1";
        tdDiv2_3_3.innerHTML = "Village,";

        trDiv2_3.appendChild(tdDiv2_3_3);

        var trDiv2_4 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_4);

        var tdDiv2_4_1 = document.createElement("td");
        tdDiv2_4_1.style.textAlign = "right";
        tdDiv2_4_1.style.fontWeight = "bold";
        tdDiv2_4_1.className = "blueText";
        tdDiv2_4_1.innerHTML = "&nbsp;";

        trDiv2_4.appendChild(tdDiv2_4_1);

        var tdDiv2_4_2 = document.createElement("td");
        tdDiv2_4_2.style.textAlign = "center";
        tdDiv2_4_2.style.width = "3px";
        tdDiv2_4_2.innerHTML = "&nbsp;";

        trDiv2_4.appendChild(tdDiv2_4_2);

        var tdDiv2_4_3 = document.createElement("td");
        tdDiv2_4_3.id = "addressl2";
        tdDiv2_4_3.innerHTML = "T/A,";

        trDiv2_4.appendChild(tdDiv2_4_3);

        var trDiv2_5 = document.createElement("tr");

        tableDiv2.appendChild(trDiv2_5);

        var tdDiv2_5_1 = document.createElement("td");
        tdDiv2_5_1.style.textAlign = "right";
        tdDiv2_5_1.style.fontWeight = "bold";
        tdDiv2_5_1.className = "blueText";
        tdDiv2_5_1.innerHTML = "&nbsp;";

        trDiv2_5.appendChild(tdDiv2_5_1);

        var tdDiv2_5_2 = document.createElement("td");
        tdDiv2_5_2.style.textAlign = "center";
        tdDiv2_5_2.style.width = "3px";
        tdDiv2_5_2.innerHTML = "&nbsp;";

        trDiv2_5.appendChild(tdDiv2_5_2);

        var tdDiv2_5_3 = document.createElement("td");
        tdDiv2_5_3.id = "addressl3";
        tdDiv2_5_3.innerHTML = "District";

        trDiv2_5.appendChild(tdDiv2_5_3);

        var td1_3 = document.createElement("td");
        td1_3.style.width = "25%";
        td1_3.style.padding = "5px";

        tr1.appendChild(td1_3);

        var div3 = document.createElement("div");
        div3.className = "headTab";

        td1_3.appendChild(div3);

        var tableDiv3 = document.createElement("table");
        tableDiv3.cellpadding = 1;
        tableDiv3.width = "100%";
        tableDiv3.style.fontSize = "14px";

        div3.appendChild(tableDiv3);

        var trDiv3_1 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_1);

        var tdDiv3_1_1 = document.createElement("td");
        tdDiv3_1_1.style.textAlign = "right";
        tdDiv3_1_1.style.fontWeight = "bold";
        tdDiv3_1_1.style.width = "100px";
        tdDiv3_1_1.className = "blueText";
        tdDiv3_1_1.innerHTML = "BP";

        trDiv3_1.appendChild(tdDiv3_1_1);

        var tdDiv3_1_2 = document.createElement("td");
        tdDiv3_1_2.style.textAlign = "center";
        tdDiv3_1_2.style.width = "3px";
        tdDiv3_1_2.innerHTML = ":";

        trDiv3_1.appendChild(tdDiv3_1_2);

        var tdDiv3_1_3 = document.createElement("td");
        tdDiv3_1_3.id = "bp";
        tdDiv3_1_3.innerHTML = "120/80";

        trDiv3_1.appendChild(tdDiv3_1_3);

        var trDiv3_2 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_2);

        var tdDiv3_2_1 = document.createElement("td");
        tdDiv3_2_1.style.textAlign = "right";
        tdDiv3_2_1.style.fontWeight = "bold";
        tdDiv3_2_1.className = "blueText";
        tdDiv3_2_1.innerHTML = "Temperature";

        trDiv3_2.appendChild(tdDiv3_2_1);

        var tdDiv3_2_2 = document.createElement("td");
        tdDiv3_2_2.style.textAlign = "center";
        tdDiv3_2_2.style.width = "3px";
        tdDiv3_2_2.innerHTML = ":";

        trDiv3_2.appendChild(tdDiv3_2_2);

        var tdDiv3_2_3 = document.createElement("td");
        tdDiv3_2_3.id = "temperature";
        tdDiv3_2_3.innerHTML = "36<sup>o</sup>C";

        trDiv3_2.appendChild(tdDiv3_2_3);

        var trDiv3_3 = document.createElement("tr");

        tableDiv3.appendChild(trDiv3_3);

        var tdDiv3_3_1 = document.createElement("td");
        tdDiv3_3_1.style.textAlign = "right";
        tdDiv3_3_1.style.fontWeight = "bold";
        tdDiv3_3_1.className = "blueText";
        tdDiv3_3_1.innerHTML = "BMI";

        trDiv3_3.appendChild(tdDiv3_3_1);

        var tdDiv3_3_2 = document.createElement("td");
        tdDiv3_3_2.style.textAlign = "center";
        tdDiv3_3_2.style.width = "3px";
        tdDiv3_3_2.innerHTML = ":";

        trDiv3_3.appendChild(tdDiv3_3_2);

        var tdDiv3_3_3 = document.createElement("td");
        tdDiv3_3_3.id = "bmi";
        tdDiv3_3_3.innerHTML = "25";

        trDiv3_3.appendChild(tdDiv3_3_3);

        var td1_4 = document.createElement("td");
        td1_4.style.width = "25%";
        td1_4.style.padding = "5px";
        td1_4.style.paddingRight = "15px";

        tr1.appendChild(td1_4);

        var div4 = document.createElement("div");
        div4.className = "headTab";
        div4.id = "modApp";
        div4.style.textAlign = "center";
        div4.style.cursor = "pointer";

        div4.onclick = function () {

            if (dashboard.$("navPanel")) {

                document.body.removeChild(dashboard.$("navPanel"));

            }

        }

        td1_4.appendChild(div4);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2_1 = document.createElement("td");
        td2_1.style.width = "100%";
        td2_1.style.padding = "5px";
        td2_1.style.paddingRight = "15px";
        td2_1.style.paddingLeft = "15px";
        td2_1.colSpan = 4;

        tr2.appendChild(td2_1);

        var div2_1 = document.createElement("div");
        div2_1.id = "main";
        div2_1.style.width = "100%";
        div2_1.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div2_1.style.overflow = "hidden";
        div2_1.style.height = "300px";
        div2_1.style.border = "1px solid #345db5";

        td2_1.appendChild(div2_1);

        var tableDiv2_1 = document.createElement("table");
        tableDiv2_1.width = "100%";
        tableDiv2_1.border = 1;
        tableDiv2_1.style.borderCollapse = "collapse";
        tableDiv2_1.style.border = "1px solid #345db5";
        tableDiv2_1.cellPadding = 5;
        tableDiv2_1.cellSpacing = 0;

        div2_1.appendChild(tableDiv2_1);

        var trDiv2_1 = document.createElement("tr");
        trDiv2_1.style.backgroundColor = "#345db5";

        tableDiv2_1.appendChild(trDiv2_1);

        var tdDiv2_1_1 = document.createElement("td");
        tdDiv2_1_1.style.width = "200px";
        tdDiv2_1_1.style.borderRight = "1px solid #fff";
        tdDiv2_1_1.style.color = "#fff";
        tdDiv2_1_1.style.textAlign = "left";
        tdDiv2_1_1.style.fontWeight = "bold";
        tdDiv2_1_1.style.paddingLeft = "10px";
        tdDiv2_1_1.innerHTML = "Programs";

        trDiv2_1.appendChild(tdDiv2_1_1);

        var tdDiv2_1_2 = document.createElement("td");
        tdDiv2_1_2.style.width = "200px";
        tdDiv2_1_2.style.borderRight = "1px solid #fff";
        tdDiv2_1_2.style.color = "#fff";
        tdDiv2_1_2.style.textAlign = "center";
        tdDiv2_1_2.style.fontWeight = "bold";
        tdDiv2_1_2.innerHTML = "Visits";

        trDiv2_1.appendChild(tdDiv2_1_2);

        var tdDiv2_1_3 = document.createElement("td");
        tdDiv2_1_3.style.borderRight = "1px solid #fff";
        tdDiv2_1_3.style.color = "#fff";
        tdDiv2_1_3.style.textAlign = "center";
        tdDiv2_1_3.style.fontWeight = "bold";
        tdDiv2_1_3.innerHTML = "&nbsp;";
        tdDiv2_1_3.id = "header";

        trDiv2_1.appendChild(tdDiv2_1_3);

        var tdDiv2_1_4 = document.createElement("td");
        tdDiv2_1_4.style.width = "200px";
        tdDiv2_1_4.style.borderRight = "1px solid #fff";
        tdDiv2_1_4.style.color = "#fff";
        tdDiv2_1_4.style.textAlign = "left";
        tdDiv2_1_4.style.fontWeight = "bold";
        tdDiv2_1_4.style.paddingLeft = "10px";
        tdDiv2_1_4.innerHTML = "Tasks";

        trDiv2_1.appendChild(tdDiv2_1_4);

        var trDiv2_2 = document.createElement("tr");

        tableDiv2_1.appendChild(trDiv2_2);

        var tdDiv2_2_1 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_1);

        var div2_2_1 = document.createElement("div");
        div2_2_1.id = "programs";
        div2_2_1.style.width = "100%";
        div2_2_1.style.overflow = "auto";
        div2_2_1.style.height = "100%";
        div2_2_1.style.border = "1px solid #fff";

        tdDiv2_2_1.appendChild(div2_2_1);

        var tdDiv2_2_2 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_2);

        var div2_2_2 = document.createElement("div");
        div2_2_2.id = "visits";
        div2_2_2.style.width = "100%";
        div2_2_2.style.overflow = "auto";
        div2_2_2.style.height = "100%";
        div2_2_2.style.border = "1px solid #fff";

        tdDiv2_2_2.appendChild(div2_2_2);

        var tdDiv2_2_3 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_3);

        var div2_2_3 = document.createElement("div");
        div2_2_3.id = "details";
        div2_2_3.style.width = "100%";
        div2_2_3.style.overflow = "auto";
        div2_2_3.style.height = "100%";
        div2_2_3.style.border = "1px solid #fff";
        div2_2_3.style.textAlign = "center";

        tdDiv2_2_3.appendChild(div2_2_3);

        var tdDiv2_2_4 = document.createElement("td");

        trDiv2_2.appendChild(tdDiv2_2_4);

        var div2_2_4 = document.createElement("div");
        div2_2_4.id = "tasks";
        div2_2_4.style.width = "100%";
        div2_2_4.style.overflow = "auto";
        div2_2_4.style.height = "100%";
        div2_2_4.style.border = "1px solid #fff";

        tdDiv2_2_4.appendChild(div2_2_4);

        var tr3 = document.createElement("tr");
        tr3.style.backgroundColor = "#333";

        table.appendChild(tr3);

        var td3_1 = document.createElement("td");
        td3_1.style.padding = "10px";

        tr3.appendChild(td3_1);

        var btnCancel = document.createElement("button");
        btnCancel.className = "red";
        btnCancel.innerHTML = "Cancel";
        btnCancel.onmousedown = function () {
            window.location = '/';
        }

        td3_1.appendChild(btnCancel);

        var td3_2 = document.createElement("td");
        td3_2.style.padding = "10px";
        td3_2.colSpan = 3;
        td3_2.style.textAlign = "right";

        tr3.appendChild(td3_2);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.innerHTML = "Finish";
        btnFinish.onmousedown = function () {
            window.location = '/';
        }

        td3_2.appendChild(btnFinish);

        dashboard.loadPrograms(dashboard['modules'], dashboard.__$("programs"));

    },

    loadPrograms: function (sourceData, targetControl) {

        if (!sourceData || !targetControl) {

            return;

        }

        targetControl.innerHTML = "";

        var ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.width = "100%";
        ul.style.padding = "0px";
        ul.style.margin = "0px";

        targetControl.appendChild(ul);

        var keys = Object.keys(sourceData);

        if (keys.length <= 0)
            return;

        for (var i = 0; i < keys.length; i++) {

            var li = document.createElement("li");
            li.style.cursor = "pointer";
            li.style.marginBottom = "5px";
            li.style.borderBottom = "1px solid #ccc";
            li.id = keys[i];
            li.setAttribute("icon", sourceData[keys[i]]['icon']);
            li.setAttribute("label", keys[i]);

            li.onmouseover = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "lightblue";

                }

            }

            li.onmouseout = function () {

                if (this.getAttribute('selected') == null) {

                    this.style.backgroundColor = "";

                }

            }

            li.onclick = function () {

                if (dashboard.selectedProgram) {

                    if (dashboard.__$(dashboard.selectedProgram)) {

                        dashboard.__$(dashboard.selectedProgram).removeAttribute("selected");

                        dashboard.__$(dashboard.selectedProgram).style.backgroundColor = "";

                        dashboard.__$(dashboard.selectedProgram).getElementsByTagName("table")[0].style.color = "#000";

                    }

                }

                this.setAttribute("selected", true);

                this.style.backgroundColor = "#345db5";

                this.getElementsByTagName("table")[0].style.color = "#fff";

                dashboard.selectedProgram = this.id;

                dashboard.loadModule(this.getAttribute("label"), this.getAttribute("icon"), sourceData[this.getAttribute("label")]);

            }

            ul.appendChild(li);

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.width = "100%";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            li.appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "20px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", sourceData[keys[i]]['icon']);
            img.height = "45";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = keys[i];

            tr.appendChild(td2);

            if (i == 0) {

                li.click();

            }

        }

        if (dashboard.__$("patient_name")) {

            var name = "";

            var first_name = dashboard.data["data"]["names"][0]["First Name"];

            var middle_name = dashboard.data["data"]["names"][0]["Middle Name"];

            var last_name = dashboard.data["data"]["names"][0]["Family Name"];

            name = first_name.trim() + " " + (middle_name && middle_name != "N/A" ? middle_name.trim().substr(0, 1) +
                ". " : "") + last_name.trim();

            dashboard.__$("patient_name").innerHTML = name;

        }

        if (dashboard.__$("gender")) {

            var gender = {
                M: "Male",
                F: "Female"
            }

            dashboard.__$("gender").innerHTML = (dashboard.data["data"]["gender"] ? gender[dashboard.data["data"]["gender"]] : "&nbsp;");

        }

        if (dashboard.__$("age")) {

            var age = (dashboard.data["data"]["birthdate"].trim().length > 0 ? Math.round((((new Date()) -
                (new Date(dashboard.data["data"]["birthdate"]))) / (365 * 24 * 60 * 60 * 1000)), 0) : "");

            dashboard.__$("age").innerHTML = (dashboard.data["data"]["birthdate_estimated"] == 1 ? "~ " : "") + age;

        }

        if (dashboard.__$("addressl1")) {

            dashboard.__$("addressl1").innerHTML = (dashboard.data["data"]["addresses"][0] ? dashboard.data["data"]["addresses"][0]["Current Village"] : "&nbsp;");

        }

        if (dashboard.__$("addressl2")) {

            dashboard.__$("addressl2").innerHTML = (dashboard.data["data"]["addresses"][0] ? dashboard.data["data"]["addresses"][0]["Current T/A"] : "&nbsp;");

        }

        if (dashboard.__$("addressl3")) {

            dashboard.__$("addressl3").innerHTML = (dashboard.data["data"]["addresses"][0] ? dashboard.data["data"]["addresses"][0]["Current District"] : "&nbsp;");

        }

        if (dashboard.__$("bp")) {

            dashboard.__$("bp").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BP"] : "&nbsp;");

        }

        if (dashboard.__$("temperature")) {

            dashboard.__$("temperature").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["Temperature"] : "&nbsp;");

        }

        if (dashboard.__$("bmi")) {

            dashboard.__$("bmi").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BMI"] : "&nbsp;");

        }

    },

    refreshDemographics: function () {

        if (dashboard.__$("patient_name")) {

            var name = "";

            var first_name = dashboard.data["data"]["names"][0]["First Name"];

            var middle_name = dashboard.data["data"]["names"][0]["Middle Name"];

            var last_name = dashboard.data["data"]["names"][0]["Family Name"];

            name = first_name.trim() + " " + (middle_name && middle_name != "N/A" ? middle_name.trim().substr(0, 1) +
                ". " : "") + last_name.trim();

            dashboard.__$("patient_name").innerHTML = name;

        }

        if (dashboard.__$("primary_id") && dashboard.__$("primary_id_label") && Object.keys(dashboard.data["data"]["identifiers"]).length > 0) {

            dashboard.__$("primary_id_label").innerHTML = 'National id';

            dashboard.__$("primary_id").innerHTML = (dashboard.data["data"]["identifiers"]['National id'] ?
                dashboard.data["data"]["identifiers"]['National id']["identifier"] : "&nbsp;");

            if(dashboard.data["data"]["identifiers"]['National id']) {

                dashboard.setCookie("client_identifier", dashboard.data["data"]["identifiers"]['National id'], 0.3333);

            }

        }

        if (dashboard.__$("gender")) {

            var gender = {
                M: "Male",
                F: "Female"
            }

            dashboard.gender = dashboard.data["data"]["gender"];

            dashboard.setCookie("gender", dashboard.gender, 1);

            dashboard.__$("gender").innerHTML = (dashboard.data["data"]["gender"] ? gender[dashboard.data["data"]["gender"]] : "&nbsp;");

        }

        if (dashboard.__$("age")) {

            var age = (dashboard.data["data"]["birthdate"].trim().length > 0 ? Math.round((((new Date()) -
                (new Date(dashboard.data["data"]["birthdate"]))) / (365 * 24 * 60 * 60 * 1000)), 0) : "");

            dashboard.__$("age").innerHTML = (dashboard.data["data"]["birthdate_estimated"] == 1 ? "~ " : "") + age;

        }

        if (dashboard.__$("addressl1")) {

            dashboard.__$("addressl1").innerHTML = (dashboard.data["data"]["addresses"][0] ? dashboard.data["data"]["addresses"][0]["Current Village"] : "&nbsp;");

        }

        if (dashboard.__$("addressl2")) {

            dashboard.__$("addressl2").innerHTML = (dashboard.data["data"]["addresses"][0] ? dashboard.data["data"]["addresses"][0]["Current T/A"] : "&nbsp;");

        }

        if (dashboard.__$("addressl3")) {

            dashboard.__$("addressl3").innerHTML = (dashboard.data["data"]["addresses"][0] ? dashboard.data["data"]["addresses"][0]["Current District"] : "&nbsp;");

        }

        if (dashboard.__$("bp")) {

            dashboard.__$("bp").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BP"] : "&nbsp;");

        }

        if (dashboard.__$("temperature")) {

            dashboard.__$("temperature").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["Temperature"] : "&nbsp;");

        }

        if (dashboard.__$("bmi")) {

            dashboard.__$("bmi").innerHTML = (dashboard.data["data"]["vitals"] ? dashboard.data["data"]["vitals"]["BMI"] : "&nbsp;");

        }

        if(dashboard.selectedVisit) {

            dashboard.$(dashboard.selectedVisit).click();

        }

        if(dashboard.activeTab) {

            dashboard.activeTab.click();

        }

    },

    loadModule: function (module, icon, sourceData) {

        if (dashboard.__$("modApp")) {

            dashboard.__$("modApp").innerHTML = "";

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.style.margin = "auto";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            dashboard.__$("modApp").appendChild(table);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td1 = document.createElement("td");
            td1.style.width = "40px";
            td1.style.textAlign = "right";

            tr.appendChild(td1);

            var img = document.createElement("img");
            img.setAttribute("src", icon);
            img.height = "110";

            td1.appendChild(img);

            var td2 = document.createElement("td");
            td2.innerHTML = module;
            td2.style.fontSize = "30px";
            td2.style.color = "#345db5";

            tr.appendChild(td2);

        }

        if (dashboard.__$("tasks")) {

            dashboard.__$("tasks").innerHTML = "";


            var ul = document.createElement("ul");
            ul.style.listStyle = "none";
            ul.style.width = "100%";
            ul.style.padding = "0px";
            ul.style.margin = "0px";

            dashboard.__$("tasks").appendChild(ul);

            var keys = Object.keys(sourceData["tasks"]);

            for (var i = 0; i < keys.length; i++) {

                var li = document.createElement("li");
                li.innerHTML = keys[i];
                li.style.padding = "10px";
                li.style.paddingTop = "15px";
                li.style.paddingBottom = "15px";
                li.style.cursor = "pointer";
                li.style.marginBottom = "5px";
                li.style.borderBottom = "1px solid #ccc";
                li.setAttribute("path", sourceData["tasks"][keys[i]]);

                li.onmouseover = function () {

                    if (this.getAttribute('selected') == null) {

                        this.style.backgroundColor = "lightblue";

                    }

                }

                li.onmouseout = function () {

                    if (this.getAttribute('selected') == null) {

                        this.style.backgroundColor = "";

                    }

                }

                li.onclick = function () {

                    window.location = this.getAttribute("path");

                }

                ul.appendChild(li);

            }

        }

        if (sourceData && sourceData["identifiers"] && dashboard.__$("primary_id") && dashboard.__$("primary_id_label") &&
            sourceData["identifiers"].length > 0) {

            dashboard.__$("primary_id_label").innerHTML = sourceData["identifiers"][0];

            dashboard.__$("primary_id").innerHTML = (dashboard.data["data"]["identifiers"][sourceData["identifiers"][0]] ?
                dashboard.data["data"]["identifiers"][sourceData["identifiers"][0]]["identifier"] : "&nbsp;");

            if(dashboard.data["data"]["identifiers"]['National id']) {

                dashboard.setCookie("client_identifier", dashboard.data["data"]["identifiers"]['National id'], 0.3333);

            }
        }

        if (sourceData && sourceData["identifiers"] && dashboard.__$("other_id") && dashboard.__$("other_id_label") &&
            sourceData["identifiers"].length > 1) {

            dashboard.__$("other_id_label").innerHTML = sourceData["identifiers"][1];

            dashboard.__$("other_id").innerHTML = (dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]] ?
                dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"] : "&nbsp;");

            if(!dashboard.data["data"]["identifiers"]['National id'] &&
                dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]) {

                dashboard.setCookie("client_identifier",
                    dashboard.data["data"]["identifiers"][sourceData["identifiers"][1]]["identifier"], 0.3333);

            }

        }

        if (dashboard.__$("header")) {

            dashboard.__$("header").innerHTML = "&nbsp;";

        }

        if (dashboard.__$("details")) {

            dashboard.__$("details").innerHTML = "";

        }

        if (dashboard.__$("visits") && dashboard.data) {

            dashboard.__$("visits").innerHTML = "";

            var program = sourceData["program"];

            if (dashboard.data["data"]["programs"][program]) {

                var patientPrograms = Object.keys(dashboard.data["data"]["programs"][program]["patient_programs"])

                for (var i = 0; i < patientPrograms.length; i++) {

                    var visits = Object.keys(dashboard.data["data"]["programs"][program]["patient_programs"][patientPrograms[i]]["visits"]).sort(function (a, b) {
                        return (new Date(b)) - (new Date(a))
                    });

                    var ul = document.createElement("ul");
                    ul.id = "ulVisits";
                    ul.style.listStyle = "none";
                    ul.style.width = "100%";
                    ul.style.padding = "0px";
                    ul.style.margin = "0px";

                    dashboard.__$("visits").appendChild(ul);

                    var j = 0;

                    for (j = 0; j < visits.length; j++) {

                        var li = document.createElement("li");
                        li.id = "visit" + j;
                        li.innerHTML = (new Date(visits[j])).format();
                        li.style.padding = "10px";
                        li.style.paddingTop = "15px";
                        li.style.paddingBottom = "15px";
                        li.style.cursor = "pointer";
                        li.style.marginBottom = "5px";
                        li.style.borderBottom = "1px solid #ccc";
                        li.style.textAlign = "center";
                        li.setAttribute("program", program);
                        li.setAttribute("patientProgram", patientPrograms[i]);
                        li.setAttribute("visit", visits[j]);

                        if (j >= dashboard.step) {

                            li.className = "hidden";

                            li.style.display = "none";

                        } else {

                            li.className = "visible";

                        }

                        li.onmouseover = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "lightblue";

                            }

                        }

                        li.onmouseout = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "";

                            }

                        }

                        li.onclick = function () {

                            if (dashboard.selectedVisit) {

                                if (dashboard.__$(dashboard.selectedVisit)) {

                                    dashboard.__$(dashboard.selectedVisit).removeAttribute("selected");

                                    dashboard.__$(dashboard.selectedVisit).style.backgroundColor = "";

                                    dashboard.__$(dashboard.selectedVisit).style.color = "#000";

                                }

                            }

                            this.setAttribute("selected", true);

                            this.style.backgroundColor = "#345db5";

                            this.style.color = "#fff";

                            dashboard.selectedVisit = this.id;

                            dashboard.loadVisit(this, dashboard.data);

                        }

                        ul.appendChild(li);

                    }

                    if (j >= dashboard.step) {

                        var btnMore = document.createElement("li");
                        btnMore.id = "btnMore";
                        btnMore.innerHTML = ".. more visits ...";
                        btnMore.style.padding = "10px";
                        btnMore.style.paddingTop = "15px";
                        btnMore.style.paddingBottom = "15px";
                        btnMore.style.cursor = "pointer";
                        btnMore.style.color = "#345db5";
                        btnMore.style.fontStyle = "italic";
                        btnMore.style.marginBottom = "5px";
                        btnMore.style.borderBottom = "1px solid #ccc";
                        btnMore.style.textAlign = "center";
                        btnMore.setAttribute("currentLimit", dashboard.step);

                        btnMore.onmouseover = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "lightblue";

                            }

                        }

                        btnMore.onmouseout = function () {

                            if (this.getAttribute('selected') == null) {

                                this.style.backgroundColor = "";

                            }

                        }

                        btnMore.onclick = function () {

                            dashboard.showMore(this);

                        }

                        ul.appendChild(btnMore);

                    }

                }

            }

        }

    },

    showMore: function (btn) {

        var limit = parseInt(btn.getAttribute("currentLimit"));

        var active = dashboard.__$("ulVisits").getElementsByClassName("visible").length;

        var total = (dashboard.__$("ulVisits").children.length) - 1;

        if (active < total) {

            for (var i = limit; i < limit + dashboard.step; i++) {

                if (dashboard.__$("visit" + i)) {

                    dashboard.__$("visit" + i).style.display = "block";

                    dashboard.__$("visit" + i).className = "visible";

                }

            }

            limit += dashboard.step;

            if (limit >= total) {

                btn.style.display = "none";

            }

            btn.setAttribute("currentLimit", limit);

        }

    },

    loadVisit: function (control, sourceData) {

        if (!control || !sourceData) {

            return;

        }

        var program = control.getAttribute("program");
        var patientProgram = control.getAttribute("patientProgram");
        var visit = control.getAttribute("visit");

        if (dashboard.__$("header")) {

            var date = (new Date(control.getAttribute("visit"))).format("d mmmm, YYYY");

            var label = "Details for " + date + " Visit";

            dashboard.__$("header").innerHTML = label;

        }

        var colors = [
            ["#9966cc", "rgba(153,102,204,0.05)", "#ffffff"],
            ["#669900", "rgba(102,153,0,0.05)", "#ffffff"],
            ["#ff420e", "rgba(255,66,14,0.05)", "#ffffff"],
            ["#6a8ac9", "rgba(106,138,201,0.05)", "#ffffff"],
            ["#c99414", "rgba(201,148,20,0.05)", "#ffffff"],
            ["#3870f1", "rgba(56,112,241,0.05)", "#ffffff"],
            ["#004586", "rgba(0,69,134,0.05)", "#ffffff"],
            ["#ff950e", "rgba(255,149,14,0.05)", "#ffffff"],
            ["#579d1c", "rgba(87,157,28,0.05)", "#ffffff"],
            ["#993366", "rgba(153,51,102,0.05)", "#ffffff"],
            ["#9fc397", "rgba(159,195,151,0.05)", "#ffffff"],
            ["#000000", "rgba(0,0,0,0.05)", "#ffffff"],
            ["#c2c34f", "rgba(194,195,79,0.05)", "#ffffff"],
            ["#9a612a", "rgba(154,97,42,0.05)", "#ffffff"],
            ["#7f8fb0", "rgba(127,143,176,0.05)", "#ffffff"],
            ["#bf8d5c", "rgba(191,141,92,0.05)", "#ffffff"],
            ["#5ca2bf", "rgba(92,162,191,0.05)", "#ffffff"],
            ["#f1389c", "rgba(241,56,156,0.05)", "#ffffff"],
            ["#ab065f", "rgba(171,6,95,0.05)", "#ffffff"],
            ["#068aab", "rgba(6,138,171,0.05)", "#ffffff"]
        ];

        colors = colors.shuffle();

        var keys = Object.keys(sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"][visit]);

        if (dashboard.__$("details")) {

            dashboard.__$("details").innerHTML = "";

            for (var i = 0; i < keys.length; i++) {

                dashboard.loadVisitSummary(keys[i], dashboard.__$("details"), colors[i], sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"][visit][keys[i]]);

            }

        }

    },

    loadVisitSummary: function (encounter, parent, color, sourceData) {

        var div = document.createElement("div");
        div.style.width = "46%";
        div.style.display = "inline-block";
        div.style.height = "200px";
        div.style.overflow = "hidden";
        div.style.margin = "5px";
        div.style.border = "1px solid " + color[1];
        div.style.backgroundColor = color[1];
        div.id = "enc." + encounter;

        parent.appendChild(div);

        var table = document.createElement("table");
        table.style.width = "100%";
        table.cellPadding = 5;
        table.style.borderCollapse = "collapse";

        div.appendChild(table);

        var tr1 = document.createElement("tr");

        table.appendChild(tr1);

        var th = document.createElement("th");
        th.style.backgroundColor = color[0];
        th.innerHTML = encounter;
        th.style.textAlign = "center";
        th.style.color = color[2];
        th.style.cursor = "pointer";
        th.setAttribute("target", "enc." + encounter);
        th.setAttribute("iTarget", "container." + encounter);

        th.onclick = function () {

            dashboard.activeTab = this;

            dashboard.showMeOnly(dashboard.$(this.getAttribute("target")), dashboard.$(this.getAttribute("iTarget")));

        }

        tr1.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td = document.createElement("td");

        tr2.appendChild(td);

        var container = document.createElement("div");
        container.id = "container." + encounter;
        container.style.height = "170px";
        container.style.overflow = "hidden";

        td.appendChild(container);

        dashboard.loadDetails(container, sourceData);

    },

    loadDetails: function (parent, sourceData) {

        var table = document.createElement("table");
        table.style.width = "100%";
        table.cellPadding = 2;
        table.style.borderCollapse = "collapse";

        parent.appendChild(table);

        for (var i = 0; i < sourceData.length; i++) {

            var keys = Object.keys(sourceData[i]);

            var tr = document.createElement("tr");

            table.appendChild(tr);

            for (var j = 0; j < 4; j++) {

                var td = document.createElement("td");

                td.style.verticalAlign = "top";

                if (j == 0) {

                    td.style.fontWeight = "bold";

                    td.style.fontSize = "14px";

                    td.style.textAlign = "right";

                    td.innerHTML = keys[0];

                } else if (j == 1) {

                    td.innerHTML = ":";

                    td.style.width = "10px";

                    td.style.textAlign = "center";

                } else if(j == 3) {

                    var img = document.createElement("img");
                    img.setAttribute("src", dashboard.icoClose);
                    img.height = "40";
                    img.style.float = "right";

                    td.appendChild(img);

                    tr.setAttribute("uuid", sourceData[i][keys[0]]["UUID"]);

                    td.style.cursor = "pointer";

                    td.onclick = function() {

                        dashboard.showConfirmMsg("Do you really want to delete this entry?", "Confirm",
                                "javascript:dashboard.voidConcept('" + this.getAttribute("uuid") + "')");

                    }

                } else {

                    td.style.minWidth = "50%";

                    if (keys[0] == "Drug Orders") {

                        var drugs = "<ol>";

                        for (var k = 0; k < sourceData[i][keys[0]].length; k++) {

                            drugs += "<li style='margin-bottom: 5px; margin-top: 5px;'>" + sourceData[i][keys[0]][k]["instructions"] + "</li>";

                        }

                        drugs += "</ol>";

                        td.innerHTML = drugs;

                    } else {

                        td.innerHTML = (sourceData[i][keys[0]]["response"]["category"] == "DATE AND TIME" ?
                            (new Date(sourceData[i][keys[0]]["response"]["value"])).format() : sourceData[i][keys[0]]["response"]["value"]);

                    }

                }

                tr.appendChild(td);

            }

        }

    },

    showConfirmMsg: function (msg, topic, nextURL) {

        if (!topic) {

            topic = "Confirm";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "#eee";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "red";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset red";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btnCancel = document.createElement("button");
        btnCancel.className = "blue";
        btnCancel.innerHTML = "Cancel";
        btnCancel.style.minWidth = "100px";

        btnCancel.onclick = function () {

            if (user.$("msg.shield")) {

                document.body.removeChild(user.$("msg.shield"));

            }

        }

        tdf.appendChild(btnCancel);

        var btnOK = document.createElement("button");
        btnOK.className = "red";
        btnOK.innerHTML = "OK";
        btnOK.style.minWidth = "100px";

        if (nextURL)
            btnOK.setAttribute("nextURL", nextURL);

        btnOK.onclick = function () {

            if (user.$("msg.shield")) {

                document.body.removeChild(user.$("msg.shield"));

                if (this.getAttribute("nextURL"))
                    window.location = this.getAttribute("nextURL");

            }

        }

        tdf.appendChild(btnOK);

    },

    showMeOnly: function (target, iTarget) {

        if(target.style.height == "200px") {

            target.style.width = "95%";

            target.style.height = "95%";

            dashboard.$("details").scrollTop = target.offsetTop;

            iTarget.style.height = (target.offsetHeight - 40) + "px";

            iTarget.style.overflow = "auto";

        } else {

            target.style.width = "46%";

            target.style.height = "200px";

            target.style.overflow = "hidden";

            iTarget.style.height = "170px";

            iTarget.style.overflow = "hidden";

        }

    },

    ajaxRequest: function (url, callback) {

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

    },

    navPanel: function (path) {

        if (dashboard.__$("navPanel")) {

            document.body.removeChild(dashboard.__$("navPanel"));

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "130px";
            divPanel.style.width = "100%";
            divPanel.style.height = (window.innerHeight - 130) + "px";
            divPanel.style.backgroundColor = "#fff";
            divPanel.style.borderTop = "1px solid #000";
            divPanel.id = "navPanel";

            document.body.appendChild(divPanel);

            var iframe = document.createElement("iframe");
            iframe.id = "ifrMain";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "1px solid #000";

            var url = window.location.href.match(/(.+)\/[^\/]+$/);

            var base = (url ? url[1] : "");

            dashboard.setCookie("gender", dashboard.gender, 1);

            var html = "<html><head><title></title><base href='" + base + "' /> <script type='text/javascript' language='javascript' " +
                "src='" + "/javascripts/protocol_analyzer.js' defer></script><meta http\-equiv='content-type' " +
                "content='text/html;charset=UTF-8'/><script language='javascript'>tstUsername = '';" +
                "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                "\"javascript:window.parent.document.body.removeChild('navPanel')\";tt_cancel_show = " +
                "\"javascript:window.parent.document.body.removeChild('navPanel')\";</script></head><body>";

            html += "<div id='content'></div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

                if (dashboard.__$("ifrMain") && dashboard.__$("ifrMain").contentWindow.protocol) {

                    dashboard.__$("ifrMain").contentWindow.protocol.init(path, undefined, undefined, undefined, undefined);

                }

            }

        }

    },

    submitData: function (data) {

        if (dashboard.__$("navPanel")) {

            document.body.removeChild(dashboard.__$("navPanel"));

        }

        if (socket && data) {

            var patient_id = window.location.href.match(/\/([^\/]+)$/)[1];

            data.data.patient_id = patient_id.trim();

            data.data.userId = dashboard.getCookie("username");

            data.data.location = dashboard.getCookie("location");

            data.data.today = (new Date()).format("YYYY-mm-dd");

            socket.emit('update', data);

        }

    },

    voidConcept: function(uuid) {

        if(socket && uuid) {
            var patient_id = window.location.href.match(/\/([^\/]+)$/)[1];

            var data = {
                uuid: uuid,
                username: dashboard.getCookie("username"),
                patient_id: patient_id.trim()
            }

            socket.emit('void', data);

        }

    },

    showMsg: function (msg, topic) {

        if (!topic) {

            topic = "Message";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "#eee";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "#345db5";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset #345db5";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btn = document.createElement("button");
        btn.className = "blue";
        btn.innerHTML = "OK";

        btn.onclick = function () {

            if (dashboard.$("msg.shield")) {

                document.body.removeChild(dashboard.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

    },

    showAlertMsg: function (msg, topic) {

        if (!topic) {

            topic = "Alert";

        }

        var shield = document.createElement("div");
        shield.style.position = "absolute";
        shield.style.top = "0px";
        shield.style.left = "0px";
        shield.style.width = "100%";
        shield.style.height = "100%";
        shield.id = "msg.shield";
        shield.style.backgroundColor = "rgba(128,128,128,0.75)";
        shield.style.zIndex = 1050;

        document.body.appendChild(shield);

        var width = 420;
        var height = 280;

        var div = document.createElement("div");
        div.id = "msg.popup";
        div.style.position = "absolute";
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.backgroundColor = "#eee";
        div.style.borderRadius = "5px";
        div.style.left = "calc(50% - " + (width / 2) + "px)";
        div.style.top = "calc(50% - " + (height * 0.7) + "px)";
        div.style.border = "1px outset #fff";
        div.style.boxShadow = "5px 2px 5px 0px rgba(0,0,0,0.75)";
        div.style.fontFamily = "arial, helvetica, sans-serif";
        div.style.MozUserSelect = "none";

        shield.appendChild(div);

        var table = document.createElement("table");
        table.width = "100%";
        table.cellSpacing = 0;

        div.appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.style.padding = "5px";
        th.style.borderTopRightRadius = "5px";
        th.style.borderTopLeftRadius = "5px";
        th.style.fontSize = "20px";
        th.style.backgroundColor = "red";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset red";

        trh.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td2 = document.createElement("td");

        tr2.appendChild(td2);

        var content = document.createElement("div");
        content.id = "msg.content";
        content.style.width = "calc(100% - 30px)";
        content.style.height = (height - 105 - 30) + "px";
        content.style.border = "1px inset #eee";
        content.style.overflow = "auto";
        content.style.textAlign = "center";
        content.style.verticalAlign = "middle";
        content.style.padding = "15px";
        content.style.fontSize = "22px";

        content.innerHTML = msg;

        td2.appendChild(content);

        var trf = document.createElement("tr");

        table.appendChild(trf);

        var tdf = document.createElement("td");
        tdf.align = "center";

        trf.appendChild(tdf);

        var btn = document.createElement("button");
        btn.className = "blue";
        btn.innerHTML = "OK";

        btn.onclick = function () {

            if (dashboard.$("msg.shield")) {

                document.body.removeChild(dashboard.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

    },

    init: function (dataPath, modulesPath, settingsPath) {

        this['selectedProgram'] = null;

        this['selectedVisit'] = null;

        this['step'] = 5;

        this.icoClose = "data:image/png;base64,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";

        document.body.oncontextmenu = function () {
            return false;
        }

        this.ajaxRequest(dataPath, function (data) {

            dashboard['data'] = data;

            dashboard.ajaxRequest(settingsPath, function (settings) {

                dashboard.settings = settings;

                dashboard.ajaxRequest(modulesPath, function (modules) {

                    dashboard['modules'] = modules;

                    dashboard.buildPage();

                    setInterval(function () {

                        if (dashboard.__$("main")) {

                            dashboard.__$("main").style.height = (window.innerHeight - 225) + "px";

                        }

                        if (dashboard.__$("details")) {
                            dashboard.__$("details").style.height = (window.innerHeight - 270) + "px";
                        }

                        if (dashboard.__$("programs")) {
                            dashboard.__$("programs").style.height = (window.innerHeight - 270) + "px";
                        }

                        if (dashboard.__$("visits")) {
                            dashboard.__$("visits").style.height = (window.innerHeight - 270) + "px";
                        }

                        if (dashboard.__$("tasks")) {
                            dashboard.__$("tasks").style.height = (window.innerHeight - 270) + "px";
                        }

                        if (dashboard.__$("navPanel")) {

                            dashboard.__$("navPanel").style.height = (window.innerHeight - 130) + "px";

                        }

                    }, 10);

                });

            });

        });

    }

});