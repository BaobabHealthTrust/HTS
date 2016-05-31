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

            result = date.getFullYear() + "-" + landing.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                landing.padZeros(date.getDate(), 2);

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

var landing = ({

    __$: function (id) {
        return document.getElementById(id);
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
        td1_1.style.width = "75%";
        td1_1.style.padding = "5px";
        td1_1.style.paddingLeft = "15px";
        td1_1.colSpan = 3;

        tr1.appendChild(td1_1);

        var div1 = document.createElement("div");
        div1.className = "headTab";

        td1_1.appendChild(div1);

        var tableDiv1 = document.createElement("table");
        tableDiv1.cellPadding = 1;
        tableDiv1.width = "100%";
        tableDiv1.border = 0;

        div1.appendChild(tableDiv1);

        var trDiv1_1 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_1);

        var thDiv1_1_1 = document.createElement("th");
        thDiv1_1_1.style.fontSize = "28px";
        thDiv1_1_1.style.textAlign = "right";
        thDiv1_1_1.style.width = "200px";
        thDiv1_1_1.style.overflow = "hidden";
        thDiv1_1_1.style.fontWeight = "normal";
        thDiv1_1_1.style.padding = "5px";
        thDiv1_1_1.className = "blueText";
        thDiv1_1_1.innerHTML = "Scan Barcode";

        trDiv1_1.appendChild(thDiv1_1_1);

        var tdDiv1_1_1_2 = document.createElement("td");
        tdDiv1_1_1_2.style.width = "60px";

        trDiv1_1.appendChild(tdDiv1_1_1_2);

        var img = document.createElement("img");
        img.setAttribute("src", landing['icoBarcode']);
        img.setAttribute('height', 40);
        img.style.marginTop = "10px";

        tdDiv1_1_1_2.appendChild(img);

        var tdDiv1_1_1_3 = document.createElement("td");
        tdDiv1_1_1_3.style.borderBottom = "1px solid #3c60b1";
        tdDiv1_1_1_3.colSpan = 6;
        tdDiv1_1_1_3.style.padding = "0px";

        trDiv1_1.appendChild(tdDiv1_1_1_3);

        var barcode = document.createElement("input");
        barcode.type = "input";
        barcode.style.fontSize = "24px";
        barcode.id = "barcode";
        barcode.style.width = "100%";
        barcode.style.border = "none";

        tdDiv1_1_1_3.appendChild(barcode);

        var trDiv1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_2);

        var trDiv1_3_1_1 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3_1_1);

        var tdDiv1_3_1_1_0_a = document.createElement("td");
        tdDiv1_3_1_1_0_a.innerHTML = "&nbsp;";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_0_a);

        var tdDiv1_3_1_1_0 = document.createElement("td");
        tdDiv1_3_1_1_0.innerHTML = "&nbsp;";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_0);

        var tdDiv1_3_1_1_1 = document.createElement("td");
        tdDiv1_3_1_1_1.style.textAlign = "right";
        tdDiv1_3_1_1_1.style.fontWeight = "bold";
        tdDiv1_3_1_1_1.className = "blueText";
        tdDiv1_3_1_1_1.innerHTML = "Facility";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_1);

        var tdDiv1_3_1_1_2 = document.createElement("td");
        tdDiv1_3_1_1_2.style.textAlign = "center";
        tdDiv1_3_1_1_2.style.width = "3px";
        tdDiv1_3_1_1_2.innerHTML = ":";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_2);

        var tdDiv1_3_1_1_3 = document.createElement("td");
        tdDiv1_3_1_1_3.id = "facility";
        tdDiv1_3_1_1_3.innerHTML = "Kamuzu Central Hospital";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_3);

        var trDiv1_3_1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3_1_2);

        var tdDiv1_3_1_1_4 = document.createElement("td");
        tdDiv1_3_1_1_4.style.textAlign = "right";
        tdDiv1_3_1_1_4.style.fontWeight = "bold";
        tdDiv1_3_1_1_4.className = "blueText";
        tdDiv1_3_1_1_4.innerHTML = "Date";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_4);

        var tdDiv1_3_1_1_5 = document.createElement("td");
        tdDiv1_3_1_1_5.style.textAlign = "center";
        tdDiv1_3_1_1_5.style.width = "3px";
        tdDiv1_3_1_1_5.innerHTML = ":";

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_5);

        var today = (new Date()).format("d mmmm, YYYY");

        var tdDiv1_3_1_1_6 = document.createElement("td");
        tdDiv1_3_1_1_6.id = "today";
        tdDiv1_3_1_1_6.innerHTML = today;

        trDiv1_3_1_1.appendChild(tdDiv1_3_1_1_6);

        var trDiv1_3_1_2 = document.createElement("tr");

        tableDiv1.appendChild(trDiv1_3_1_2);

        var tdDiv1_3_1_2_0_a = document.createElement("td");
        tdDiv1_3_1_2_0_a.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_0_a);

        var tdDiv1_3_1_2_0 = document.createElement("td");
        tdDiv1_3_1_2_0.innerHTML = "&nbsp;";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_0);

        var tdDiv1_3_1_2_1 = document.createElement("td");
        tdDiv1_3_1_2_1.style.textAlign = "right";
        tdDiv1_3_1_2_1.style.fontWeight = "bold";
        tdDiv1_3_1_2_1.className = "blueText";
        tdDiv1_3_1_2_1.id = "other_id_label";
        tdDiv1_3_1_2_1.innerHTML = "Location";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_1);

        var tdDiv1_3_1_2_2 = document.createElement("td");
        tdDiv1_3_1_2_2.style.textAlign = "center";
        tdDiv1_3_1_2_2.style.width = "3px";
        tdDiv1_3_1_2_2.innerHTML = ":";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_2);

        var tdDiv1_3_1_2_3 = document.createElement("td");
        tdDiv1_3_1_2_3.id = "location";
        tdDiv1_3_1_2_3.innerHTML = "HIV Reception";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_3);

        var tdDiv1_3_1_2_4 = document.createElement("td");
        tdDiv1_3_1_2_4.style.textAlign = "right";
        tdDiv1_3_1_2_4.style.fontWeight = "bold";
        tdDiv1_3_1_2_4.className = "blueText";
        tdDiv1_3_1_2_4.id = "other_id_label";
        tdDiv1_3_1_2_4.innerHTML = "User";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_4);

        var tdDiv1_3_1_2_5 = document.createElement("td");
        tdDiv1_3_1_2_5.style.textAlign = "center";
        tdDiv1_3_1_2_5.style.width = "3px";
        tdDiv1_3_1_2_5.innerHTML = ":";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_5);

        var tdDiv1_3_1_2_6 = document.createElement("td");
        tdDiv1_3_1_2_6.id = "user";
        tdDiv1_3_1_2_6.innerHTML = "Test";

        trDiv1_3_1_2.appendChild(tdDiv1_3_1_2_6);

        var td1_4 = document.createElement("td");
        td1_4.style.width = "25%";
        td1_4.style.padding = "5px";
        td1_4.style.paddingRight = "15px";

        tr1.appendChild(td1_4);

        var div4 = document.createElement("div");
        div4.className = "headTab";
        div4.id = "modApp";
        div4.style.textAlign = "center";

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
        div2_2_2.style.width = "100%";
        div2_2_2.style.overflow = "hidden";
        div2_2_2.style.height = "100%";
        div2_2_2.style.border = "1px solid #fff";
        div2_2_2.style.padding = "0px";

        tdDiv2_2_2.appendChild(div2_2_2);

        var iframe = document.createElement("iframe");
        iframe.id = "visits";
        iframe.style.width = "99.8%";
        iframe.style.height = "100%";
        iframe.style.border = "3px inset #eee";

        div2_2_2.appendChild(iframe);

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
        btnCancel.innerHTML = "Logout";
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
        btnFinish.innerHTML = "Find or Register Patient";
        btnFinish.onmousedown = function () {
            window.location = '/';
        }

        td3_2.appendChild(btnFinish);

        landing.loadPrograms(landing['modules'], landing.__$("programs"));

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

                if (landing.selectedProgram) {

                    if (landing.__$(landing.selectedProgram)) {

                        landing.__$(landing.selectedProgram).removeAttribute("selected");

                        landing.__$(landing.selectedProgram).style.backgroundColor = "";

                        landing.__$(landing.selectedProgram).getElementsByTagName("table")[0].style.color = "#000";

                    }

                }

                this.setAttribute("selected", true);

                this.style.backgroundColor = "#345db5";

                this.getElementsByTagName("table")[0].style.color = "#fff";

                landing.selectedProgram = this.id;

                landing.loadModule(this.getAttribute("label"), this.getAttribute("icon"), sourceData[this.getAttribute("label")]);

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

    },

    loadModule: function (module, icon, sourceData) {

        if (landing.__$("modApp")) {

            landing.__$("modApp").innerHTML = "";

            var table = document.createElement("table");
            table.cellPadding = 5;
            table.style.margin = "auto";
            table.border = 0;
            table.style.borderCollapse = "collapse";

            landing.__$("modApp").appendChild(table);

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

        if (landing.__$("tasks")) {

            landing.__$("tasks").innerHTML = "";


            var ul = document.createElement("ul");
            ul.style.listStyle = "none";
            ul.style.width = "100%";
            ul.style.padding = "0px";
            ul.style.margin = "0px";

            landing.__$("tasks").appendChild(ul);

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

                    if(landing.__$("visits")) {

                        landing.__$("visits").setAttribute("src", this.getAttribute("path"));

                    }

                }

                ul.appendChild(li);

            }

        }

        if (landing.__$("header")) {

            landing.__$("header").innerHTML = module + " Statistics";

        }

        if (landing.__$("visits") && landing.data) {

            // landing.__$("visits").innerHTML = module;

            var html = "<body><style>body{text-align:center;color:#3c60b1;margin:10px;font:18px'LucidaGrande',Helvetica," +
                "Arial,sans-serif;-moz-user-select:none;overflow:auto;}.news{background-color:red;}.sports{" +
                "background-color:blue;}.none{background-color:black;}</style>";

            html += "<img src='" + icon + "' height='200' style='margin-top: 10%;' /><br/><h1>" + module + " Stastistics</h1></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            if (landing.__$("visits")) {

                landing.__$("visits").setAttribute("src", page);

            }

        }

    },

    loadVisit: function (control, sourceData) {

        if (!control || !sourceData) {

            return;

        }

        var program = control.getAttribute("program");
        var patientProgram = control.getAttribute("patientProgram");
        var visit = control.getAttribute("visit");

        if (landing.__$("header")) {

            var date = (new Date(control.getAttribute("visit"))).format("d mmmm, YYYY");

            var label = "Details for " + date + " Visit";

            landing.__$("header").innerHTML = label;

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

        if (landing.__$("details")) {

            landing.__$("details").innerHTML = "";

            for (var i = 0; i < keys.length; i++) {

                landing.loadVisitSummary(keys[i], landing.__$("details"), colors[i], sourceData["data"]["programs"][program]["patient_programs"][patientProgram]["visits"][visit][keys[i]]);

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

            landing.showMeOnly(this);

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

        landing.loadDetails(td, sourceData);

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

        if (landing.__$("details")) {

            landing.__$("details").innerHTML = copy;

            var div = landing.__$("details").children[0];

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

                if(httpRequest.responseText.trim().length > 0) {
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

    init: function (dataPath, modulesPath, barcodePath, searchPath) {

        this['icoBarcode'] = "data:image/png;base64,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";

        this['selectedProgram'] = null;

        this['selectedVisit'] = null;

        this['step'] = 5;

        this['barcodePath'] = barcodePath;

        this['searchPath'] = searchPath;

        document.body.oncontextmenu = function() {
            return false;
        }

        this.ajaxRequest(dataPath, function(data) {

            landing['data'] = data;

            landing.ajaxRequest(modulesPath, function(modules) {

                landing['modules'] = modules;

                landing.buildPage();

                setInterval(function () {

                    if (landing.__$("main")) {

                        landing.__$("main").style.height = (window.innerHeight - 225) + "px";

                    }

                    if (landing.__$("details")) {
                        landing.__$("details").style.height = (window.innerHeight - 270) + "px";
                    }

                    if (landing.__$("programs")) {
                        landing.__$("programs").style.height = (window.innerHeight - 270) + "px";
                    }

                    if (landing.__$("visits")) {
                        landing.__$("visits").style.height = (window.innerHeight - 270) + "px";
                    }

                    if (landing.__$("tasks")) {
                        landing.__$("tasks").style.height = (window.innerHeight - 270) + "px";
                    }

                }, 10);

            });

        });

        setInterval(function(){

            if(landing.__$("barcode")) {

                if(landing.__$("barcode").value.trim().match(/\$$/)) {

                    if(landing['barcodePath']) {

                        var barcode = landing.__$("barcode").value.trim().replace(/\$/g, "");

                        window.location = landing['barcodePath'] + barcode;

                    } else {

                        landing.__$("barcode").value = "";

                    }

                }

                landing.__$("barcode").focus();

            }

        }, 200);

    }

});