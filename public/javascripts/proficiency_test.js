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

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/proficiency_test_control.js");

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
                id: "data.proficiency_testing_date"
            },
            "Counselor Name":{

                field_type : "text",
                id:"data.tester",
                ajaxURL: "/app_custom/hts_users",
                tt_onUnload:"updateUserAttributes();sePTLotNumber()"

            },

            "HTS provider ID": {
                field_type: "hidden",
                id: "data.provider_id"
            },
            "Phone number": {
                field_type: "hidden",
                id: "data.phone_number"
            },
            "Tester First Name": {
                field_type: "hidden",
                id: "data.first_name",
            },
            "Tester Last Name": {
                field_type: "hidden",
                id: "data.last_name"
            },
            "DTS PT pack checklist": {
                field_type: "select",
                id: "data.dts_pack_checklist",
                multiple: "multiple",
                tt_pageStyleClass: "MultiSelectList",
                tt_pageStyleClass: "NoKeyboard",
                options: ["5 Sample tubes", "1 Buffer tube", "2 Droppers", "1 Results recording form", "1 Testing instructions"],
                tt_onUnload:"dtsPachListValidation()"
            },
            "PT panel lot number": {
                field_type: "text",
                id: "data.pt_panel_lot_number"
                
            },
            "Test 1 kit name" :{
                field_type : "select",
                id: "data.test1_kit_name",
                ajaxURL : "/stock/stock_items?category=Test Kits&item_name=",
                tt_pageStyleClass: "NoKeyboard",
                tt_onUnload: "setLotNumber('data.lot_number1',__$('touchscreenInput' + tstCurrentPage).value)"

            },
            "Test 1 lot number" :{
                field_type : "select",
                id: "data.lot_number1",
                tt_pageStyleClass: "NoKeyboard",
                tt_onUnload: "setLotExpiry('data.test1_expiry_date');if(true){var limit = __$('touchscreenInput' + " +
                    "tstCurrentPage).value.trim().match(/(\\d+)\\)$/)[1]; " +
                    "if(limit < 10){ window.parent.proficiency.showMsg('Not enough stock to complete proficiency Test','Proficiency Test')}}"

            },
            "Test 1 epiry date" :{
                field_type : "hidden",
                id: "data.test1_expiry_date"

            }
            ,
            "Test 2 kit name" :{
                field_type : "select",
                id: "data.test2_kit_name",
                ajaxURL : "/stock/stock_items?category=Test Kits&item_name=",
                tt_pageStyleClass: "NoKeyboard",
                 tt_onUnload: "setLotNumber('data.lot_number2',__$('touchscreenInput' + tstCurrentPage).value)"

            },
            "Test 2 lot number" :{
                field_type : "select",
                id: "data.lot_number2",
                tt_pageStyleClass: "NoKeyboard",
                tt_onUnload: "setLotExpiry('data.test2_expiry_date');if(true){var limit = __$('touchscreenInput' + " +
                    "tstCurrentPage).value.trim().match(/(\\d+)\\)$/)[1]; " +
                    "if(limit < 10){ window.parent.proficiency.showMsg('Not enough stock to complete proficiency Test','Proficiency Test')}}"

            },
            "Test 2 epiry date" :{
                field_type : "hidden",
                id: "data.test2_expiry_date"

            }
            ,
            "Proficiency testing First Pass" :{
                field_type : "text",
                tt_onLoad: "loadPTControl('test')",
                id: "data.first_pass",
                tt_pageStyleClass: "NoKeyboard"

            },
            "Proficiency testing Immediate Repeat" :{
                field_type: "text",
                tt_onLoad: "loadRepeatPTControl('im')",
                id: "data.immediate_repeat",
                condition : "checkRepeatFields()",
                tt_pageStyleClass: "NoKeyboard"

            },
            "Proficiency Final Result":{
                field_type:"text",
                tt_onLoad : "loadFinalResultControl()",
                id: "data.final_result",
                tt_pageStyleClass: "NoKeyboard"
            },
            "Consumption Quantity 1" :{

                field_type : "hidden",
                id: "data.test_1_consumption_quantity",
                value: 0

            },
            "Consumption Quantity 2" :{

                field_type : "hidden",
                id: "data.test_2_consumption_quantity",
                value: 0

            }


        }

        for(var i = 0 ; i < 5 ; i++){

            var test1 = {
                field_type: "hidden",
                id: "data.test_1_"+i,
                 value: ""
            }

            fields["Test 1 " + i ] = test1;

            var test1Time = {
                field_type: "hidden",
                id: "data.test_1_" +i + "_time",
                 value: ""
            }

            fields["Test 1 Time " + i ] = test1Time;

            var test2 = {
                field_type: "hidden",
                id: "data.test_2_"+i,
                 value: ""
            }

            fields["Test 2 " + i ] = test2;


            var test2Time = {
                field_type: "hidden",
                id: "data.test_2_" + i +"_time",
                 value: ""
            }

            fields["Test 2 Time " + i ] = test2Time;

            var repeat_test1 = {
                field_type: "hidden",
                id: "data.im_1_"+i,
                 value: ""
            }

            fields["Immediate Repeat Test 1 " + i ] = repeat_test1;

            var im1Time = {
                field_type: "hidden",
                id: "data.im_1_"+ i +"_time",
                 value: ""
            }

            fields["IM 1 Time " + i ] = im1Time;


            var repeat_test2 = {
                field_type: "hidden",
                id: "data.im_2_"+i,
                 value: ""
            }

            fields["Immediate Repeat Test 2 " + i ] = repeat_test2;


            var im2Time = {
                field_type: "hidden",
                id: "data.im_2_"+i +"_time",
                 value: ""
            }

            fields["IM 2 Time " + i ] = im2Time;

            var final_result = {
                        field_type:"hidden",
                        id: "data.final_result_"+i,
                        value: ""
            }

            fields["Final Result "+i ] = final_result;

        }
        proficiency.buildFields(fields, table);

        proficiency.navPanel(form.outerHTML);

    },
    enterPTOfficialResult : function(){

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/proficiency_test_control.js");

        form.appendChild(script);


        var fields = {
           "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "proficiency_test_official_result"
            },
            "Show ID": {
                field_type: "hidden",
                id: "data.show_id",
                value: ""
            },

            "Creator": {
                field_type: "hidden",
                id: "data.creator",
                value: proficiency.getCookie('username')
            },
            "PT Lot Number": {
                field_type: "text",
                id: "data.pt_panel_lot_number",
                ajaxURL: eval("window.parent.proficiency.pt_url")
            },
            "Enter Official result": {
                field_type: "text",
                id: "data.first_name",
                tt_onLoad:"loadPTOfficialResultControl()",
                tt_pageStyleClass:"NoKeyboard"
            }

        }

        for(var i = 0 ; i < 5 ; i++){

            var entry = {

                    field_type: "hidden",
                    id: "data.pt_panel_result_"+ i
            }

            fields["PT Panel Results "+i] = entry;

        }



        proficiency.buildFields(fields, table);

        proficiency.navPanel(form.outerHTML);


    },

proficiencyTestApproval: function(target){

        if(!target)
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
        td0_0_0.innerHTML = "Proficiency Test Approval";

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


        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        proficiency.loadPTTests("/quality_control/proficiency_test_approval/", div0_1_0_0);


},
loadPTTests: function(path,target){

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

            var fields = [" ", "Date of PT test", "HTS Provider ID", "Name", "PT Lot Number", "Kit 1", "Kit 2","Score", "Action Plan"];
            var colSizes = ["20px", "10%", "10%", "10%", "10%", "10%", "10%", "80px", "80px", "80px", "80px",
                "180px"];


            for (var i = 0; i < fields.length; i++) {

                var th = document.createElement("th");

                if (colSizes[i])
                    th.style.width = colSizes[i];

                th.innerHTML = fields[i];

                tr.appendChild(th);


            }

            for(var i = 0 ; i < data.length ; i++){

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

                td.innerHTML = new Date(data[i].proficiency_test_date).format();

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].hts_provider_id;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].first_name + " "+data[i].last_name;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);



                 var td = document.createElement("td");

                td.innerHTML = data[i].pt_panel_lot_number;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.innerHTML = data[i].test_kit_1_name;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                 var td = document.createElement("td");

                td.innerHTML = data[i].test_kit_2_name;

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                 var td = document.createElement("td");

                td.innerHTML = (data[i].score ? data[i].score + "%" : "");

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.style.padding = "0.1em";

                td.style.border = "1px solid #e3e3e2";

                var button = document.createElement("button");

                button.innerHTML = "Action";

                button.setAttribute("onclick","window.parent.proficiency.approvePTResult("+JSON.stringify(data[i])+",window.parent.document.body)");


                td.appendChild(button);

                tr.appendChild(td);


            }

        })


    },

    approvePTResult :function(data,target){

         if(!target)
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
        td0_0_0.innerHTML = "Assess PT Results";

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

        var btnAction = document.createElement("button");

        btnAction.style.position = "absolute";
        btnAction.style.right = "180px";
        btnAction.className = "blue";
        btnAction.style.margin = "15px";
        btnAction.style.width = "150px";
        btnAction.innerHTML = "Action Plan";

        btnAction.onclick = function () {

           proficiency.proficiencyTestActionPlan(data.pid)

        }

        nav.appendChild(btnAction);

        var btnFinish = document.createElement("button");
        btnFinish.className = "green";
        btnFinish.style.cssFloat = "right";
        btnFinish.style.margin = "15px";
        btnFinish.style.width = "150px";
        btnFinish.innerHTML = "Finish";

        btnFinish.onclick = function () {

            window.parent.proficiency.proficiencyTestApproval(window.parent.document.body);

        }

        nav.appendChild(btnFinish);


        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        proficiency.loadPTResults("quality_control/proficiency_test_result/"+data.pid,data, div0_1_0_0);

    }
    ,
    loadPTResults: function(path,ptdata,target){



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

            var td = document.createElement("td");

            td.innerHTML = "";

            td.style.border = "1px solid #ffffff";

            tr.appendChild(td);


            var td = document.createElement("th");

            td.innerHTML = "Test 1";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4"

            tr.appendChild(td);


            var td = document.createElement("th");

            td.innerHTML = "Test 2";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4"

            tr.appendChild(td);


            var td = document.createElement("th");

            td.innerHTML = "";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "2"

            tr.appendChild(td);


            var td = document.createElement("th");

            td.innerHTML = "Official Result";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "3"

            tr.appendChild(td);



            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var td = document.createElement("td");

            verticalText("<b style= 'font-size : 1.3em'>Sample #</b>",td);

            td.style.border = "1px solid #ffffff";

            td.rowSpan = "5";

            tr.appendChild(td);


            var td = document.createElement("td");

            td.innerHTML = "<b>Kit Name : </b>" + (ptdata.test_kit_1_name ? ptdata.test_kit_1_name : "" );

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);


            var td = document.createElement("td");

            td.innerHTML = "<b>Kit Name : </b>" + (ptdata.test_kit_2_name ? ptdata.test_kit_2_name : "" );

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);


            var td = document.createElement("td");

            td.innerHTML = "Final Resut";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "2";

            td.rowSpan = "5";

            tr.appendChild(td);

            var td = document.createElement("td");

            verticalText("<font style= 'font-size : 1.3em'>Strong Positive</font>",td);

            td.style.border = "1px solid #ffffff";

            td.rowSpan = "5";

            tr.appendChild(td);


            var td = document.createElement("td");

            verticalText("<font style= 'font-size : 1.3em'>Weak Positive</font>",td);

            td.style.border = "1px solid #ffffff";

            td.rowSpan = "5";

            tr.appendChild(td);


            var td = document.createElement("td");

            verticalText("<font style= 'font-size : 1.3em'>Negative</font>",td);

            td.style.border = "1px solid #ffffff";

            td.rowSpan = "5";

            tr.appendChild(td);


            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var td = document.createElement("td");

            td.innerHTML = "<b>Lot Number : </b>" + (ptdata.test_kit_1_lot_number ? ptdata.test_kit_1_lot_number : "" );

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);
            

            var td = document.createElement("td");

            td.innerHTML =  "<b>Lot Number : </b>" + (ptdata.test_kit_2_lot_number ? ptdata.test_kit_2_lot_number : "" );

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);


            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var td = document.createElement("td");

            td.innerHTML = "<b>Expiry Date : </b>" + (ptdata.test_kit_1_expiry ? new Date(ptdata.test_kit_1_expiry).format() : "" );

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);
            

            var td = document.createElement("td");

            td.innerHTML = "<b>Expiry Date : </b>" + (ptdata.test_kit_2_expiry ? new Date(ptdata.test_kit_2_expiry).format() : "" );

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);


            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var td = document.createElement("th");

            td.innerHTML = "First Pass";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);
            

            var td = document.createElement("th");

            td.innerHTML = "Immediate Pass";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "4";

            tr.appendChild(td);


            var tr = document.createElement("tr");
            tr.style.backgroundColor = "#999";
            tr.style.color = "#eee";

            table.appendChild(tr);

            var td = document.createElement("td");

            td.innerHTML = "Test 1";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "2";

            tr.appendChild(td);

            var td = document.createElement("td");

            td.innerHTML = "Test 2";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "2";

            tr.appendChild(td);

            var td = document.createElement("td");

            td.innerHTML = "Test 1";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "2";

            tr.appendChild(td);

             var td = document.createElement("td");

            td.innerHTML = "Test 2";

            td.style.border = "1px solid #ffffff";

            td.colSpan = "2";

            tr.appendChild(td);


            for(var i = 0 ; i < data.length ; i++){

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

                td.textAlign = "center";

                td.innerHTML = data[i].first_pass_test_1 == '+' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 20px;'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                 var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].first_pass_test_1 == '-' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> - </span>" : "<span style = 'font-size: 20px;'> - </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].first_pass_test_2 == '+' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 20px;'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                 var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].first_pass_test_2 == '-' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> - </span>" : "<span style = 'font-size: 20px;'> - </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].im_pass_test_1 == '+' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 20px;'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                 var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].im_pass_test_1 == '-' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> - </span>" : "<span style = 'font-size: 20px;'> - </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].im_pass_test_2 == '+' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 20px;'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                 var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].im_pass_test_2 == '-' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> - </span>" : "<span style = 'font-size: 20px;'> - </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].final_result == '+' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 20px;'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);

                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].final_result == '-' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> - </span>" : "<span style = 'font-size: 20px;'> - </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].official_result.toLowerCase().trim() == 'strong positive' ? "<span style = 'padding: 0.5em ; font-size: 25px; font-weight:bold; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 25px;font-weight:bold'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].official_result.toLowerCase().trim() == 'weak positive' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> + </span>" : "<span style = 'font-size: 20px;'> + </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);


                var td = document.createElement("td");

                td.textAlign = "center";

                td.innerHTML = data[i].official_result.toLowerCase().trim() == 'negative' ? "<span style = 'padding: 0.5em ; font-size: 20px; width :25px ; height : 25px ; border-radius : 50%; border : 2px solid red'> - </span>" : "<span style = 'font-size: 20px;'> - </span";

                td.style.padding = "1em";

                td.style.border = "1px solid #e3e3e2"

                tr.appendChild(td);



            }

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td = document.createElement("td");

            td.colSpan = "3";

            td.style.border = "none";

            td.style.textAlign = "left"

            td.innerHTML ="<b>HTS Provider's Name :</>";

            tr.appendChild(td);

            var td = document.createElement("td");

            td.colSpan = "3";

            td.style.border = "none";

            td.style.textAlign = "left"

            td.innerHTML = ptdata.first_name + " " +ptdata.last_name;

            tr.appendChild(td);



            var tr = document.createElement("tr");

            table.appendChild(tr);

            var td = document.createElement("td");

            td.colSpan = "3";

            td.style.border = "none";

            td.style.textAlign = "left"

            td.innerHTML ="<b>HTS Provider's ID :</>";

            tr.appendChild(td);


            var td = document.createElement("td");

            td.colSpan = "3";

            td.style.border = "none";

            td.style.textAlign = "left"

            td.innerHTML = (ptdata.hts_provider_id ? ptdata.hts_provider_id : "");

            tr.appendChild(td);


        })


    },
    proficiencyTestActionPlan: function(id){

         var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var script = document.createElement("script");
        script.setAttribute("src", "/javascripts/proficiency_test_control.js");

        form.appendChild(script);


        var fields = {
           "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "proficiency_test_action_plan"
            },
            "Show ID": {
                field_type: "hidden",
                id: "data.proficiency_test_id",
                value: id
            },
            "Action plan": {
                field_type: "text",
                id: "data.action_plan"
            }

        }


        proficiency.buildFields(fields, table);

        proficiency.navPanel(form.outerHTML);

    },
    seAvailablePTLotNumber:  function (){

           proficiency.ajaxRequest("/stock/available_kits_by_desctiption/"+encodeURIComponent("Proficiency Test"),function(data){

                    var kit_data = JSON.parse(data);

                    var url = "/stock/available_batches?item_name=" + kit_data.name + "&batch="

                    proficiency.pt_url = url

            })

        }


    ,showMsg: function (msg, topic, nextURL) {

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

        if (proficiency.$("proficiency.navPanel")) {

            document.body.removeChild(proficiency.$("proficiency.navPanel"));

        }

        var divPanel = document.createElement("div");
        divPanel.style.position = "absolute";
        divPanel.style.left = "0px";
        divPanel.style.top = "0px";
        divPanel.style.width = "100%";
        divPanel.style.height = "100%";
        divPanel.style.backgroundColor = "#fff";
        divPanel.id = "proficiency.navPanel";
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
            "if(window.parent) window.parent.proficiency.submitData(data); alert(data) }</script></head><body>";

        html += "<div id='content'>" + content + "</div></body>";

        var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

        iframe.setAttribute("src", page);

        divPanel.appendChild(iframe);

        iframe.onload = function () {

        }

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


    submitData: function (data) {


        if (proficiency.$("proficiency.navPanel")) {

            document.body.removeChild(proficiency.$("proficiency.navPanel"));

        }

        data.data.userId = stock.getCookie("username");

        data.data.token = stock.getCookie("token");

        data.data.location = stock.getCookie("location");

        if(data.data.datatype == "proficiency_test"){


                proficiency.ajaxPostRequest("/quality_control/proficiency_test/", data.data, function (res) {

                    var json = JSON.parse(res);

                    if (proficiency.$("proficiency.navPanel")) {

                        document.body.removeChild(proficiency.$("proficiency.navPanel"));

                    }

                    // window.location = "/";

                    proficiency.showMsg(json.message, "Status", null);

                })

        }else if(data.data.datatype =="proficiency_test_official_result"){


              proficiency.ajaxPostRequest("/quality_control/proficiency_test_official_result/", data.data, function (res) {

                    var json = JSON.parse(res);

                    if (proficiency.$("proficiency.navPanel")) {

                        document.body.removeChild(proficiency.$("proficiency.navPanel"));

                    }

                    // window.location = "/";

                    proficiency.showMsg(json.message, "Status", null);

                })


        }else if(data.data.datatype =="proficiency_test_action_plan"){


            proficiency.ajaxPostRequest("/quality_control/proficiency_test_action_plan/", data.data, function (res) {

                    var json = JSON.parse(res);

                    if (proficiency.$("proficiency.navPanel")) {

                        document.body.removeChild(proficiency.$("proficiency.navPanel"));

                    }

                    proficiency.proficiencyTestApproval(document.body)

                    // window.location = "/";

                    proficiency.showMsg(json.message, "Status", null);

                })


        }

    }


 });

proficiency.seAvailablePTLotNumber();