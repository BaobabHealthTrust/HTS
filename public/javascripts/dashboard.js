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
        div.style.cursor = "pointer";

        div.onclick = function () {

            dashboard.showMeOnly(this);

        }

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

        tr1.appendChild(th);

        var tr2 = document.createElement("tr");

        table.appendChild(tr2);

        var td = document.createElement("td");

        tr2.appendChild(td);

        dashboard.loadDetails(td, sourceData);

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

            for (var j = 0; j < 3; j++) {

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

    showMeOnly: function (target) {

        var copy = target.outerHTML;

        if (dashboard.__$("details")) {

            dashboard.__$("details").innerHTML = copy;

            var div = dashboard.__$("details").children[0];

            div.style.width = "95%";

            div.style.height = "95%";

            div.style.overflow = "auto";

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
                "src='" + "/javascripts/protocol_analyzer.js' defer></script><meta http-equiv='content-type' " +
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

    init: function (dataPath, modulesPath, rootPath) {

        this['selectedProgram'] = null;

        this['selectedVisit'] = null;

        this['step'] = 5;

        this['rootPath'] = rootPath;

        document.body.oncontextmenu = function () {
            return false;
        }

        this.ajaxRequest(dataPath, function (data) {

            dashboard['data'] = data;

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

    }

});