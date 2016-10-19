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

                result = date.getFullYear() + "-" + proficiency.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    proficiency.padZeros(date.getDate(), 2) + " " + proficiency.padZeros(date.getHours(), 2) + ":" +
                    proficiency.padZeros(date.getMinutes(), 2) + ":" + proficiency.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

                result = date.getFullYear() + "-" + proficiency.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    proficiency.padZeros(date.getDate(), 2);

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

};

var proficiency = ({

    version: "0.0.1",

    proficiency: [],

    proficiencyId: null,

    kits : {}
    ,
    stock_label: {}
    ,

    $: function (id) {

        return document.getElementById(id);

    },

    $$: function (id) {

        if (this.$("ifrMain")) {

            return this.$("ifrMain").contentWindow.document.getElementById(id);

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

    sheet: function (target) {
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
    },

    addCSSRule: function (sheet, selector, rules, index) {

        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if ("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }

    },

    setCookie: function (cname, cvalue, exdays) {

        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";

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

    buildFields: function (fields, table) {

        var keys = Object.keys(fields);

        for (var i = 0; i < keys.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var key = keys[i];

            var td1 = document.createElement("td");
            td1.innerHTML = (fields[key].helpText ? fields[key].helpText : key);

            tr.appendChild(td1);

            var td2 = document.createElement("td");

            tr.appendChild(td2);

            var fieldType = fields[key].field_type;

            switch (fieldType) {

                case "select":

                    var select = document.createElement("select");
                    select.id = fields[key].id;
                    select.name = fields[key].id;
                    select.setAttribute("helpText", (fields[key].helpText ? fields[key].helpText : key));

                    td2.appendChild(select);

                    if (fields[key].options) {

                        for (var o = 0; o < fields[key].options.length; o++) {

                            var opt = document.createElement("option");
                            opt.innerHTML = fields[key].options[o];

                            select.appendChild(opt);

                        }

                    }

                    var exceptions = ["options", "helpText"]

                    var attrs = Object.keys(fields[key]);

                    for (var a = 0; a < exceptions.length; a++) {

                        if (attrs.indexOf(exceptions[a]) >= 0) {

                            attrs.splice(attrs.indexOf(exceptions[a]), 1);

                        }

                    }

                    if (attrs.length > 0) {

                        for (var a = 0; a < attrs.length; a++) {

                            var attr = attrs[a];

                            select.setAttribute(attr, fields[key][attr]);

                        }

                    }

                    break;

                default:

                    var input = document.createElement("input");
                    input.id = fields[key].id;
                    input.name = fields[key].id;
                    input.setAttribute("helpText", (fields[key].helpText ? fields[key].helpText : key));

                    if (fields[key].field_type == "hidden") {

                        input.type = "hidden";

                    } else if (fields[key].field_type == "password") {

                        input.type = "password";

                        fields[key].field_type = "text";

                    } else {

                        input.type = "text";

                    }

                    td2.appendChild(input);

                    var elements = Object.keys(fields[key]);

                    elements.splice(elements.indexOf("id"), 1);

                    for (var j = 0; j < elements.length; j++) {

                        input.setAttribute(elements[j], fields[key][elements[j]]);

                    }

            }

        }

    },

    proficiencyTest: function (label) {

        stock.setStockLimit();        

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/hts.js");

        form.appendChild(script);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "proficiency_test"
            },
            "Show ID": {
                field_type: "hidden",
                id: "data.show_id",
                value: ""
            },
            "Date of Proficiency testing": {
                field_type: "date",
                id: "data.proficiency_testing_date",
                tt_onUnload: "setTestKitsProfiency()"
            },
            "HTS provider ID": {
                field_type: "number",
                id: "data.provider_id",
                tt_pageStyleClass : "Numeric NumbersOnly",
                validationRule: "^\\d{4}$",
                validationMessage: "The code is not valid"
            },
            "Phone number": {
                field_type: "number",
                id: "data.phone_number",
                tt_pageStyleClass : "Numeric NumbersWithUnknown",
                validationRule: "^0\\d{7}$|Unknown|Not Available|^0\\d{9}$|^N\\/A$",
                validationMessage: "Not a valid phone number"
            },
            "Tester First Name": {
                field_type: "text",
                id: "data.first_name",
                allowFreeText: true,
                ajaxURL: user.settings.firstNamesPath
            },
            "Tester Last Name": {
                field_type: "text",
                id: "data.last_name",
                allowFreeText: true,
                ajaxURL: user.settings.lastNamesPath
            },
            "DTS Lot Number": {
                field_type: "select",
                id: "data.dts_lot_number",
                condition : false
                
            },
            "DTS pack checklist": {
                field_type: "select",
                id: "data.dts_pack_checklist",
                multiple: "multiple",
                selectAll: true,
                tt_pageStyleClass: "MultiSelectList",
                tt_pageStyleClass: "NoKeyboard",
                options: ["5 Sample tubes", "1 Buffer tube", "2 Droppers", "1 Results recording form", "1 Testing instructions"]
            }
        }

        for(var i = 0; i < 5; i++) {

        	var setAjaxUrlName1 = "__$('data.fp_item_name1_"+i+"').setAttribute('ajaxURL','/stock_items?category='+__$('touchscreenInput'+tstCurrentPage).value +'&description=' + encodeURIComponent('First Test')+ '&item_name=')";

        	var lotNumber1 = "__$('data.fp_lot_number1_"+i+"').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie('username') + '&item_name=' + __$('touchscreenInput' + tstCurrentPage).value.trim() + '&batch=')";


            var setAjaxUrlName2 = "__$('data.fp_item_name2_"+i+"').setAttribute('ajaxURL','/stock_items?category='+__$('touchscreenInput'+tstCurrentPage).value +'&description=' + encodeURIComponent('Second Test')+ '&item_name=')";

            var lotNumber2 = "__$('data.fp_lot_number2_"+i+"').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie('username') + '&item_name=' + __$('touchscreenInput' + tstCurrentPage).value.trim() + '&batch=')";


            var imsetAjaxUrlName1 = "__$('data.im_item_name1_"+i+"').setAttribute('ajaxURL','/stock_items?category='+__$('touchscreenInput'+tstCurrentPage).value +'&description=' + encodeURIComponent('First Test')+ '&item_name=')";

            var imlotNumber1 = "__$('data.im_lot_number1_"+i+"').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie('username') + '&item_name=' + __$('touchscreenInput' + tstCurrentPage).value.trim() + '&batch=')";


            var imsetAjaxUrlName2 = "__$('data.im_item_name2_"+i+"').setAttribute('ajaxURL','/stock_items?category='+__$('touchscreenInput'+tstCurrentPage).value +'&description=' + encodeURIComponent('Second Test')+ '&item_name=')";

            var imlotNumber2 = "__$('data.im_lot_number2_"+i+"').setAttribute('ajaxURL', '/available_batches_to_user?userId=' + getCookie('username') + '&item_name=' + __$('touchscreenInput' + tstCurrentPage).value.trim() + '&batch=')";


        	// var setAjaxUrlName2 = "__$('data.fp_item_name2_"+i+"').setAttribute('ajaxURL','/stock_items?category='+__$('touchscreenInput'+tstCurrentPage).value +'&description=' + encodeURIComponent('Second Test')+ '&item_name=')"


        	var entry = {
        		field_type: "text",
        		id : "data.category"+i,
        		ajaxURL: "/stock_categories?category=",
        		tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
        		helpText: "First Pass Test 1 Kit Category",
        		tt_onUnload : setAjaxUrlName1
        	}

        	fields["First Pass Test 1 Kit Category " + i] = entry;

        	var entry = {
        		field_type: "text",
        		id: "data.fp_item_name1_"+i,
        		tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
        		helpText: "First Pass Test Kit 1 Name",
        		tt_onUnload : lotNumber1
        	}

        	fields["First Pass Test Kit 1 Name " + i] = entry;

        	var entry = {
        		field_type: "text",
        		id: "data.fp_lot_number1_"+i,
        		tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
        		helpText: "First Pass Test Kit 1 Lot Number"
        	}

        	fields["First Pass Test Kit 1 Lot Number"+i] = entry;

        	var entry = {
        		field_type: "select",
        		id: "data.fp_test1_result"+i,
                options: ["-","+"],
                tt_pageStyleClass:"NoControls NoKeyboard",
                helpText: "First Pass Test 1 Result",
                tt_onLoad: "loadSerialTest(__$('data.fp_test1_result"+i+"'), __$('data.fp_test1_duration"+i+"'), window.parent.proficiency.kits['First Test'])"

        	}
            fields ["First Pass Test 1 Result"+i] = entry;

            var entry ={
                field_type : "hidden",
                id: "data.fp_test1_duration"+i,
                condition: false

            }

            fields["First Pass Test Kit 1 Testing Duration (Minutes)"+i] = entry;

            var entry = {
                field_type: "text",
                id : "data.category2"+i,
                ajaxURL: "/stock_categories?category=",
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "First Pass Test 2 Kit Category",
                tt_onUnload : setAjaxUrlName2
            }

            fields["First Pass Test 2 Kit Category " + i] = entry;

            var entry = {
                field_type: "text",
                id: "data.fp_item_name2_"+i,
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "First Pass Test Kit 2 Name",
                tt_onUnload : lotNumber2
            }

            fields["First Pass Test Kit 2 Name " + i] = entry;

            var entry = {
                field_type: "text",
                id: "data.fp_lot_number2_"+i,
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "First Pass Test Kit 2 Lot Number"
            }

            fields["First Pass Test Kit 2 Lot Number"+i] = entry;

            var entry = {
                field_type: "select",
                id: "data.fp_test2_result"+i,
                options: ["-","+"],
                tt_pageStyleClass:"NoControls NoKeyboard",
                helpText: "First Pass Test 2 Result",
                tt_onLoad: "loadSerialTest(__$('data.fp_test2_result"+i+"'), __$('data.fp_test2_duration"+i+"'), window.parent.proficiency.kits['Second Test'])"

            }
            fields ["First Pass Test 2 Result"+i] = entry;

            var entry ={
                field_type : "hidden",
                id: "data.fp_test2_duration"+i,
                condition: false

            }

            fields["First Pass Test Kit 2 Testing Duration (Minutes)"+i] = entry;



            ///Repeat test

            var entry = {
                field_type: "text",
                id : "data.im_category"+i,
                ajaxURL: "/stock_categories?category=",
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "Repeat Test 1 Kit Category",
                tt_onUnload : imsetAjaxUrlName1
            }

            fields["Repeat Test 1 Kit Category" + i] = entry;

            var entry = {
                field_type: "text",
                id: "data.im_item_name1_"+i,
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "Repeat Test Kit 1 Name",
                tt_onUnload : imlotNumber1
            }

            fields["Repeat Test Kit 1 Name " + i] = entry;

            var entry = {
                field_type: "text",
                id: "data.im_lot_number1_"+i,
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "Repeat Test Kit 1 Lot Number"
            }

            fields["Repeat Test Kit 1 Lot Number"+i] = entry;

            var entry = {
                field_type: "select",
                id: "data.im_test1_result"+i,
                options: ["-","+"],
                helpText: "Repeat Test 1 Result",
                condition: false

            }
            fields ["Repeat Test 1 Result"+i] = entry;

            var entry ={
                field_type : "hidden",
                id: "data.im_test1_duration"+i,
                condition: false

            }

            fields["Repeat Test Kit 1 Testing Duration (Minutes)"+i] = entry;

            var entry = {
                field_type: "text",
                id : "data.im_category2"+i,
                ajaxURL: "/stock_categories?category=",
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "Repeat Test 2 Kit Category",
                tt_onUnload : imsetAjaxUrlName2
            }

            fields["Repeat Test 2 Kit Category " + i] = entry;

            var entry = {
                field_type: "text",
                id: "data.im_item_name2_"+i,
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "Repeat Test Kit 2 Name",
                tt_onUnload : imlotNumber2
            }

            fields["Repeat Test Kit 2 Name " + i] = entry;

            var entry = {
                field_type: "text",
                id: "data.im_lot_number2_"+i,
                tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                helpText: "Repeat Test Kit 2 Lot Number"
            }

            fields["Repeat Test Kit 2 Lot Number"+i] = entry;

            var entry = {
                field_type: "select",
                id: "data.im_test2_result"+i,
                options: ["-","+"],
                helpText: "Repeat Test 2 Result",
                condition: false

            }
            fields ["Repeat Test 2 Result"+i] = entry;

            var entry ={
                field_type : "hidden",
                id: "data.im_test2_duration"+i,
                condition: false

            }

            fields["Repeat Test Kit 2 Testing Duration (Minutes)"+i] = entry;

            var entry = {

                    field_type: "text",
                    id:"data.im_parallel",
                    tt_onLoad: "showCategory(\"Panel Test " + (i + 1) + "\")",
                    tt_onLoad: "recommendedTimmerForLabelsProficiency([__$('data.im_item_name1_"+i+"').value,__$('data.im_item_name2_"+i+"').value]);loadPassParallelTestsProfiiency(__$('data.im_test1_result"+i+"'), __$('data.im_test1_duration"+i+"'), __$('data.im_test2_result"+i
                                +"'), __$('data.im_test2_duration"+i+"'),window.parent.proficiency.kits['First Test'], window.parent.proficiency.kits['Second Test'],"+i+")",
                     tt_pageStyleClass: "NoControls NoKeyboard",
                     helpText: "Repeat Test 1 & 2 Parallel Tests"

            }

             fields["Repeat Test 1 & 2 Parallel Tests)"+i] = entry;



        }

        proficiency.buildFields(fields, table);

        proficiency.navPanel(form.outerHTML);

    },


showMsg: function (msg, topic, nextURL) {

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

        if (nextURL)
            btn.setAttribute("nextURL", nextURL);

        btn.onclick = function () {

            if (proficiency.$("msg.shield")) {

                document.body.removeChild(proficiency.$("msg.shield"));

                if (this.getAttribute("nextURL"))
                    window.location = this.getAttribute("nextURL");

            }

        }

        tdf.appendChild(btn);

    },

    showAlertMsg: function (msg, topic, nextURL) {

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

        if (nextURL)
            btn.setAttribute("nextURL", nextURL);

        btn.onclick = function () {

            if (proficiency.$("msg.shield")) {

                document.body.removeChild(proficiency.$("msg.shield"));

                if (this.getAttribute("nextURL"))
                    window.location = this.getAttribute("nextURL");

            }

        }

        tdf.appendChild(btn);

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

            if (proficiency.$("msg.shield")) {

                document.body.removeChild(proficiency.$("msg.shield"));

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

            if (proficiency.$("msg.shield")) {

                document.body.removeChild(proficiency.$("msg.shield"));

                if (this.getAttribute("nextURL"))
                    window.location = this.getAttribute("nextURL");

            }

        }

        tdf.appendChild(btnOK);

    },


    navPanel: function (content) {

        if (user.$("user.navPanel")) {

            document.body.removeChild(user.$("user.navPanel"));

        }

        var divPanel = document.createElement("div");
        divPanel.style.position = "absolute";
        divPanel.style.left = "0px";
        divPanel.style.top = "0px";
        divPanel.style.width = "100%";
        divPanel.style.height = "100%";
        divPanel.style.backgroundColor = "#fff";
        divPanel.id = "user.navPanel";
        divPanel.style.zIndex = 800;
        divPanel.style.overflow = "hidden";

        document.body.appendChild(divPanel);

        var iframe = document.createElement("iframe");
        iframe.id = "ifrMain";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "1px solid #000";

        var url = window.location.href.match(/(.+)\/[^\/]+$/);

        // var base = (url ? url[1] : "");

        var base = user.settings.basePath;

        var html = "<html><head><title></title><base href='" + base + "' /> <script type='text/javascript' language='javascript' " +
            "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><script " +
            "src='/javascripts/form2js.js'></script><script language='javascript'>tstUsername = '';" +
            "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
            "'/'; tt_cancel_show = '/';" +
            "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
            "if(window.parent) window.parent.user.submitData(data); }</script></head><body>";

        html += "<div id='content'>" + content + "</div></body>";

        var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

        iframe.setAttribute("src", page);

        divPanel.appendChild(iframe);

        iframe.onload = function () {

        }

    }

 });