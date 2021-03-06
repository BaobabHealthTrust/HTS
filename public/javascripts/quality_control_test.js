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

                result = date.getFullYear() + "-" + quality.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    quality.padZeros(date.getDate(), 2) + " " + quality.padZeros(date.getHours(), 2) + ":" +
                    quality.padZeros(date.getMinutes(), 2) + ":" + quality.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

                result = date.getFullYear() + "-" + quality.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    quality.padZeros(date.getDate(), 2);

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

var quality = ({

    version: "0.0.1",

    quality: [],

    qualityId: null,

    kits: {}
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

    navPanel: function (content) {

        if (quality.$("quality.navPanel")) {

            document.body.removeChild(quality.$("quality.navPanel"));

        }

        var divPanel = document.createElement("div");
        divPanel.style.position = "absolute";
        divPanel.style.left = "0px";
        divPanel.style.top = "0px";
        divPanel.style.width = "100%";
        divPanel.style.height = "100%";
        divPanel.style.backgroundColor = "#fff";
        divPanel.id = "quality.navPanel";
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

        var base = stock.settings.basePath;

        var html = "<html><head><title></title><base href='" + base + "' /> <script type='text/javascript' language='javascript' " +
            "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><script " +
            "src='/javascripts/form2js.js'></script><script language='javascript'>tstUsername = '';" +
            "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
            "'/'; tt_cancel_show = '/';" +
            "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
            "if(window.parent) window.parent.quality.submitData(data); alert(data) }</script></head><body>";

        html += "<div id='content'>" + content + "</div></body>";

        var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

        iframe.setAttribute("src", page);

        divPanel.appendChild(iframe);

        iframe.onload = function () {

        }

    },
    buildFields: function (fields, table) {

        var keys = Object.keys(fields);

        for (var i = 0; i < keys.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var key = keys[i];

            var td1 = document.createElement("td");
            td1.innerHTML = key;

            tr.appendChild(td1);

            var td2 = document.createElement("td");

            tr.appendChild(td2);

            var fieldType = fields[key].field_type;

            switch (fieldType) {

                case "select":

                    var select = document.createElement("select");
                    select.id = fields[key].id;
                    select.name = fields[key].id;
                    select.setAttribute("helpText", key);

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
                    input.setAttribute("helpText", key);

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

    qualityControlTest: function (label) {

        stock.setStockLimit();

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/quality_control_summary.js");

        form.appendChild(script);

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/quality_control_test.js");

        form.appendChild(script);

        var table = document.createElement("table");

        form.appendChild(table);

        var update_outcome = " var outcome ='Not Acceptable';if((__$('data.dts_name').value.match(/Positive/i) && __$('data.result').value.match(/Positive/i)) || (__$('data.dts_name').value.match(/Negative/i) && __$('data.result').value.match(/Negative/i)) ){" +
            " outcome  = 'Acceptable'; __$('data.interpretation').setAttribute('condition', false); gotoNextPage() }else{} __$('data.outcome').value  = outcome;";

        var include_summary_js = "var script = document.createElement('script'); script.type = 'text/javascript'; script.src ='/javascripts/quality_control_summary.js';" +
            "__$('data').appendChild(script);"

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "quality_assurance"
            },
            "Date of QC testing": {
                field_type: "date",
                id: "data.qc_testing_date"
            },
            "HTS Provider": {
                field_type: "text",
                id: "data.hts_provider",
                ajaxURL: "/app_custom/hts_users?name="
            },
            "DTS Sample 1": {
                field_type: "text",
                id: "data.dts_name1",
                tt_pageStyleClass: "NoKeyboard",
                ajaxURL: "/stock/stock_items?category=Dts&description=Quality Control&item_name=",
                tt_onUnload: "var dts_name = __$('touchscreenInput' + tstCurrentPage).value; if(dts_name){" +
                "__$('data.dts_1_lot_number').setAttribute('ajaxURL','/stock/available_batches_to_user?userId=" + user.getCookie("username") + "&item_name='+dts_name+'&batch=');" +
                " __$('data.dts_1_lot_number').setAttribute('condition',true)};setSecondDTS('data.dts_name2')"
            },
            "DTS Sample 1 Lot Number": {
                field_type: "text",
                id: "data.dts_1_lot_number",
                condition: false,
                tt_onUnload: "setExpiryDate(__$('touchscreenInput' + tstCurrentPage).value,'data.dts_1_expiry_date')"
            },
            "DTS Sample 1 Date": {
                field_type: "hidden",
                id: "data.dts_1_expiry_date"
            },
            "DTS Sample 2": {
                field_type: "text",
                id: "data.dts_name2",
                tt_pageStyleClass: "NoKeyboard",
                ajaxURL: "/stock/stock_items?category=Dts&description=Quality Control&item_name=",
                tt_onUnload: "var dts_name = __$('touchscreenInput' + tstCurrentPage).value; if(dts_name){" +
                "__$('data.dts_2_lot_number').setAttribute('ajaxURL','/stock/available_batches_to_user?userId=" + user.getCookie("username") + "&item_name='+dts_name+'&batch=');" +
                " __$('data.dts_2_lot_number').setAttribute('condition',true)}"
            },
            "DTS Sample 2 Lot Number": {
                field_type: "text",
                id: "data.dts_2_lot_number",
                condition: false,
                tt_onUnload: "setExpiryDate(__$('touchscreenInput' + tstCurrentPage).value,'data.dts_2_expiry_date')"
            },
            "DTS Sample 2 Date": {
                field_type: "hidden",
                id: "data.dts_2_expiry_date"
            },
            "Select Test kit to evaluate": {
                field_type: "select",
                multiple: "multiple",
                id: "data.test_kit_name",
                tt_pageStyleClass: "NoKeyboard",
                ajaxURL: '/stock/stock_items?category=Test Kits&item_name=',
                tt_beforeUnload: "var selections = __$('touchscreenInput' + tstCurrentPage).value.split(';'); " +
                "if(selections.length < 2) {quality.showMsg('Expecting at least 2 test kits to be selected!', 'Error!', " +
                "'javascript:gotoPage(tstCurrentPage-1, null, true)')}",
                tt_onUnload: "var selections = __$('touchscreenInput' + tstCurrentPage).value.split(';'); " +
                "var kit1_name = (selections.length > 0 ? selections[0] : ''); var kit2_name = (selections.length > 1 ? " +
                "selections[1] : ''); if(kit1_name.trim().length > 0){__$('data.test_kit1_lot_number').setAttribute('helpText', " +
                "selections[0] + ' Lot Number'); __$('data.test_kit1_lot_number').setAttribute('ajaxURL'," +
                "'/stock/available_batches_to_user?userId=" + user.getCookie("username") + "&item_name='+kit1_name+'&batch=');" +
                "__$('data.test_kit1_lot_number').setAttribute('condition',true)}; if(kit2_name.trim().length > 0){" +
                "__$('data.test_kit2_lot_number').setAttribute('helpText', selections[1] + ' Lot Number'); " +
                "__$('data.test_kit2_lot_number').setAttribute('ajaxURL', '/stock/available_batches_to_user?userId=" +
                user.getCookie("username") + "&item_name='+kit2_name+'&batch='); __$('data.test_kit2_lot_number').setAttribute('condition',true)}; " +
                "__$('data.test_kit_name').setAttribute('tstValue', __$('touchscreenInput' + tstCurrentPage).value)"
            },
            "Test kit 1 Lot Number": {
                field_type: "text",
                id: "data.test_kit1_lot_number",
                tt_onUnload: "setExpiryDate(__$('touchscreenInput' + tstCurrentPage).value,'data.test_kit1_expiry_date')"
            },
            "Test Kit Expiry Date": {
                field_type: "hidden",
                id: "data.test_kit1_expiry_date"
            },
            "Test kit 2 Lot Number": {
                field_type: "text",
                id: "data.test_kit2_lot_number",
                tt_onUnload: "setExpiryDate(__$('touchscreenInput' + tstCurrentPage).value,'data.test_kit2_expiry_date')"
            },
            "Test Kit 2 Expiry Date": {
                field_type: "hidden",
                id: "data.test_kit2_expiry_date"
            },
            "Quality Control Test": {
                field_type: "text",
                id: "data.quality_test",
                tt_onLoad: "loadQualityTestControl()",
                tt_pageStyleClass: "NoKeyboard"
            },
            "Control 1 Line seen": {
                field_type: "hidden",
                id: "data.control_1_line_seen"
            },
            "Control 2 Line seen": {
                field_type: "hidden",
                id: "data.control_2_line_seen"
            },
            "Control 3 Line seen": {
                field_type: "hidden",
                id: "data.control_3_line_seen"
            },
            "Control 4 Line seen": {
                field_type: "hidden",
                id: "data.control_4_line_seen"
            },
            "Result 1": {
                field_type: "hidden",
                id: "data.result_1"
            },
            "Result 2": {
                field_type: "hidden",
                id: "data.result_2"
            },
            "Result 3": {
                field_type: "hidden",
                id: "data.result_3"
            },
            "Result 4": {
                field_type: "hidden",
                id: "data.result_4"
            },
            "Timer 1": {
                id: "data.timer_1",
                field_type: "hidden"
            },
            "Timer 2": {
                id: "data.timer_2",
                field_type: "hidden"
            },
            "Timer 3": {
                id: "data.timer_3",
                field_type: "hidden"
            },
            "Timer 4": {
                id: "data.timer_4",
                field_type: "hidden"
            },
            "Outcome 1": {
                field_type: "hidden",
                id: "data.outcome_1"
            },
            "Outcome 2": {
                field_type: "hidden",
                id: "data.outcome_2"
            },
            "Outcome 3": {
                field_type: "hidden",
                id: "data.outcome_3"
            },
            "Outcome 4": {
                field_type: "hidden",
                id: "data.outcome_4"
            },
            "Comment for Test kit 1 Result 1": {
                field_type: "text",
                id: "data.interpretation_1",
                condition: false
            },
            "Comment for Test kit 1 Result 2": {
                field_type: "text",
                id: "data.interpretation_2",
                condition: false
            },
            "Comment for Test kit 2 Result 1": {
                field_type: "text",
                id: "data.interpretation_3",
                condition: false
            },
            "Comment for Test kit 2 Result 2": {
                field_type: "text",
                id: "data.interpretation_4",
                condition: false
            },
            "Quality Control Summary": {
                field_type: "text",
                id: "data.Summary",
                tt_pageStyleClass: "NoKeyboard",
                tt_onLoad: "showQualityControlTestSummary()"
            }
        }

        quality.buildFields(fields, table);

        quality.navPanel(form.outerHTML);

    },

    submitData: function (data) {

        if (quality.$("quality.navPanel")) {

            document.body.removeChild(stock.$("quality.navPanel"));

        }

        data.data.userId = stock.getCookie("username");

        data.data.token = stock.getCookie("token");

        data.data.location = stock.getCookie("location");

        if (data.data.datatype == "quality_assurance") {

            quality.ajaxPostRequest("/quality_control/save_quality_control_test/", data.data, function (res) {

                var json = JSON.parse(res);

                if (quality.$("quality.navPanel")) {

                    document.body.removeChild(quality.$("quality.navPanel"));

                }

                // window.location = "/";

                quality.showMsg(json.message, "Status", null);

            })

        }

    },

    outcome: function (dts_type, result) {

        var outcome = "Not acceptable";

        if ((dts_type.match(/Positive/i) && result.match(/Positive/i)) || (dts_type.match(/Negative/i) && result.match(/Negative/i))) {

            outcome = "Acceptable"

        }

        user.showMsg(outcome);

    },

    qualityControlApproval: function (target) {

        if (!target)
            return;

        target.innerHTML = "";

        var div0 = document.createElement("div");
        div0.id = "content";

        target.appendChild(div0);

        var table0 = document.createElement("table");
        table0.width = "100%";
        table0.style.margin = "0px";
        table0.cellSpacing = 0;

        div0.appendChild(table0);

        var tr0_0 = document.createElement("tr");

        table0.appendChild(tr0_0);

        var td0_0_0 = document.createElement("td");
        td0_0_0.style.fontSize = "2.3em";
        td0_0_0.style.backgroundColor = "#6281A7";
        td0_0_0.style.color = "#eee";
        td0_0_0.style.padding = "15px";
        td0_0_0.style.textAlign = "center";
        td0_0_0.innerHTML = "Quality Control Test Approval";

        tr0_0.appendChild(td0_0_0);

        var tr0_1 = document.createElement("tr");

        table0.appendChild(tr0_1);

        var td0_1_0 = document.createElement("td");
        td0_1_0.style.borderTop = "5px solid #ccc";
        td0_1_0.style.padding = "0px";

        tr0_1.appendChild(td0_1_0);

        var div0_1_0_0 = document.createElement("div");
        div0_1_0_0.id = "stock.content";
        div0_1_0_0.style.height = "calc(100% - 175px)";
        div0_1_0_0.style.backgroundColor = "#fff";
        div0_1_0_0.style.overflow = "auto";
        div0_1_0_0.style.padding = "1px";
        div0_1_0_0.style.textAlign = "center";
        div0_1_0_0.innerHTML = "&nbsp;";

        div0.appendChild(div0_1_0_0);

        var nav = document.createElement("div");
        nav.style.backgroundColor = "#333";
        nav.style.position = "absolute";
        nav.style.width = "100%";
        nav.style.bottom = "0px";
        nav.style.left = "0px";
        nav.style.height = "80px";

        document.body.appendChild(nav);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.style.cssFloat = "right";
        btnFinish.style.margin = "15px";
        btnFinish.style.width = "150px";
        btnFinish.innerHTML = "Finish";

        btnFinish.onclick = function () {

            window.parent.location = "/";

        }

        nav.appendChild(btnFinish);

        // var btnAdd = document.createElement("button");
        // btnAdd.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        // btnAdd.style.cssFloat = "right";
        // btnAdd.style.margin = "15px";
        // btnAdd.innerHTML = "Add Item";

        // btnAdd.onclick = function () {

        //     if (this.className.match(/gray/))
        //         return;

        //     window.parent.stock.addFacility();

        // }

        // nav.appendChild(btnAdd);

        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        quality.loadQualityTests("/quality_control/quality_control_test_approval/", div0_1_0_0);

    },
    loadQualityTests: function (path, target) {

        if (!path || !target)
            return;

        stock.ajaxRequest(path, function (data) {

            var data = JSON.parse(data);

            if (!target)
                return;

            if (!data)
                return;

            target.innerHTML = "";

            var table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.border = 1;
            table.style.borderColor = "#eee";
            table.width = "100%";
            table.cellPadding = "8";

            target.appendChild(table);

            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var fields = [" ", "Date of QC test", "DTS Sample", "DTS lot number", "Test kit name", "Test kit lot #", "Control line seen", "Result", "Outcome", "Interpretation", "Approve", "Disapprove"];
            var colSizes = ["20px", "10%", "10%", "12%", "15%", "15%", "10%", "10%", "10%", "10%", "10%",
                "180px"];


            for (var i = 0; i < fields.length; i++) {

                var th = document.createElement("th");

                if (colSizes[i])
                    th.style.width = colSizes[i];

                th.innerHTML = fields[i];

                tr.appendChild(th);


            }

            for (var i = 0; i < data.length; i++) {

                var tr = document.createElement("tr");

                tr.style.padding = "0.1em";

                tr.style.border = "1px solid #e3e3e2"

                table.appendChild(tr);


                var td = document.createElement("td");

                td.innerHTML = i + 1;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = new Date(data[i].qc_test_date).format();

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].sample_name;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].sample_lot_number;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].test_kit_name;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].test_kit_lot_number;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].control_line_seen;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].quality_test_result;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].outcome;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].interpretation;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                var button = document.createElement("button");

                button.innerHTML = "Approve";

                button.id = "approve_" + i

                button.className = (data[i].approval_status == 'approve' ? "green" : "blue");

                button.setAttribute("onclick", "window.parent.quality.updateQCResult(" + data[i].quality_assurance_test_id + ",'approve','approve_" + i + "','disapprove_" + i + "')");

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                td.appendChild(button)

                tr.appendChild(td);


                var td = document.createElement("td");

                var button = document.createElement("button");

                button.innerHTML = "Disapprove";

                button.className = (data[i].approval_status == 'disapprove' ? "green" : "blue");

                button.id = "disapprove_" + i

                button.setAttribute("onclick", "window.parent.quality.updateQCResult(" + data[i].quality_assurance_test_id + ",'disapprove','disapprove_" + i + "','approve_" + i + "')");

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                td.appendChild(button)

                tr.appendChild(td);


            }

        })


    },

    updateQCResult: function (test_id, approval_status, buttonActivate, buttonDeactivate) {

        if (buttonDeactivate)
            quality.$(buttonDeactivate).className = "blue";

        if (buttonActivate)
            quality.$(buttonActivate).className = "green";

        var data = {qc_id: test_id, approval_status: approval_status}

        window.parent.quality.ajaxPostRequest('/quality_control/quality_control_test_approval_update', data, function (res) {

            window.parent.proficiency.showMsg(res);

        })


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

            if (quality.$("msg.shield")) {

                document.body.removeChild(quality.$("msg.shield"));

                if (this.getAttribute("nextURL"))
                    window.location = this.getAttribute("nextURL");

            }

        }

        tdf.appendChild(btn);

    },

    __$: function(id) {

        return document.getElementById(id);

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

            if (user.$("msg.shield")) {

                document.body.removeChild(user.$("msg.shield"));

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

    ajaxPostRequest: function (url, data, callback) {

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

    init: function (settingsPath, userId) {

        this['settings'] = {};

        this['userId'] = userId;

        if (typeof settingsPath != undefined) {

            this.ajaxRequest(settingsPath, function (settings) {

                quality.settings = JSON.parse(settings);

                quality.roles = [];

                if (quality.getCookie("roles").trim().length > 0) {

                    quality.roles = JSON.parse(quality.getCookie("roles"));

                }

            })

        }

    }

});


