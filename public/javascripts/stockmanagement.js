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

            result = date.getFullYear() + "-" + stock.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                stock.padZeros(date.getDate(), 2);

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

var stock = ({

    stocks: [],

    stockId: null,

    page: 1,

    $: function (id) {

        return document.getElementById(id);

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

    searchForStock: function () {

        if (typeof(tstCurrentDate) === "undefined") {

            var script = document.createElement("script");

            script.innerText = "var tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "'";

            document.head.appendChild(script);

        }

        var div = document.createElement("div");
        div.id = "content";

        document.body.appendChild(div);

        var style = this.sheet(stock.$("content"));
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

        stock.page = 1;

        var form = document.createElement("form");
        form.id = "stock.form.main";
        form.style.display = "none";
        form.setAttribute("action", "javascript:stock.submitSearch()");

        div.appendChild(form);

        var table = document.createElement("table");
        table.border = 0;
        table.cellPadding = 5;

        form.appendChild(table);

        var fields = ["Item Category", "Item Name", "Select or Create New Stock Item"];

        for (var i = 0; i < fields.length; i++) {

            if (["Item Category", "Item Name", "Select or Create New Stock Item"].indexOf(fields[i]) >= 0) {

                var tr = document.createElement("tr");

                table.appendChild(tr);

                var td1 = document.createElement("td");
                td1.innerHTML = fields[i];

                tr.appendChild(td1);

                var td2 = document.createElement("td");

                tr.appendChild(td2);

                var input = document.createElement((["Gender", "Current Region",
                    "Region of Origin"].indexOf(fields[i]) >= 0 ? "select" : "input"));
                input.id = fields[i].toLowerCase().replace(/\s/g, "_").replace(/\//g, "_");
                input.name = fields[i].toLowerCase().replace(/\s/g, "_").replace(/\//g, "_");
                input.setAttribute("helpText", fields[i]);

                switch (fields[i]) {

                    case "Item Category":

                        input.setAttribute("ajaxURL", stock.settings.categorySearchPath + "?category=");

                        input.setAttribute("tt_onLoad", "stock.$('nextButton').style.display = 'block';");

                        input.setAttribute("tt_onUnLoad", "stock.$('" +
                            "Item Name".toLowerCase().replace(/\s/g, "_").replace(/\//g, "_") +
                            "').setAttribute('ajaxURL', '" + stock.settings.stockItemsSearchPath +
                            "?category=' + $('touchscreenInput' + tstCurrentPage).value.trim() + '&item_name=')");

                        break;

                    case "Item Name":

                        input.setAttribute("tt_onLoad", "stock.$('nextButton').style.display = 'block';");

                        input.setAttribute("optional", true);

                        break;

                    case "Select or Create New Stock Item":

                        input.id = "selected_item";
                        input.name = "selected_item";
                        input.value = "";
                        input.setAttribute("helpText", "Select or Create New Stock Item");
                        input.setAttribute("tt_onLoad", "stock.loadItems(); stock.hideKeyboard(); stock.$('nextButton').onmousedown = " +
                            "function(){};");
                        input.setAttribute("tt_pageStyleClass", "NoControls");
                        input.setAttribute("tt_onUnLoad", "stock.$('nextButton').className = 'green navButton'; stock.$('nextButton').onmousedown " +
                            "= function(){gotoNextPage()}; if(stock.$('extras')) stock.$('buttons').removeChild(stock.$('extras'));");

                        break;

                }

                input.type = "text";

                td2.appendChild(input);

            }

        }

        var base = document.createElement("base");
        base.href = stock.settings.basePath;

        document.head.appendChild(base);

        var script = document.createElement("script");
        script.setAttribute("src", stock.settings.basePath + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        var form2js = document.createElement("script");
        form2js.setAttribute("src", "/javascripts/form2js.js");

        document.head.appendChild(form2js);

    },

    ajaxSearch: function (page) {

        var url = stock.settings.searchPath + "/?category=" + stock.$("item_category").value.trim() +
            "&item_name=" + stock.$("item_name").value.trim() + "&page=" + page;

        /*if (stock.$("nextButton")) {
         stock.$("nextButton").className = "button gray navButton";
         stock.$("nextButton").onclick = function () {
         };
         }*/

        if (stock.$("editItem")) {

            stock.$("editItem").className = "gray";

        }

        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            stock.handleAjaxRequest(httpRequest);
        };
        try {
            httpRequest.open('GET', url, true);
            httpRequest.send(null);
        } catch (e) {
        }

    },

    handleAjaxRequest: function (aXMLHttpRequest) {

        if (!aXMLHttpRequest) return;

        stock.$("leftpanel").innerHTML = "";
        stock.$("rightpanel").innerHTML = "";

        /*if (stock.$("nextButton")) {
         stock.$("nextButton").className = "button gray navButton";
         stock.$("nextButton").onclick = function () {
         };
         }*/

        if (stock.$("editItem")) {

            stock.$("editItem").className = "gray";

        }

        if (aXMLHttpRequest.readyState == 4 && aXMLHttpRequest.status == 200) {

            var result = aXMLHttpRequest.responseText;

            stock.stocks = JSON.parse(result);

            if (Object.keys(stock.stocks).length == 0) {
                stock.$("rightpanel").innerHTML = "<div style='margin: auto; padding: 20px; font-size: 24px; font-style: italic;'>No results found!</div>";
            }

            for (var i = 0; i < stock.stocks.length; i++) {

                var div = document.createElement("div");
                div.id = i;
                div.className = "element " + (i % 2 > 0 ? "odd" : "");
                div.setAttribute("tag", (i % 2 > 0 ? "odd" : "even"));
                div.setAttribute("sid", stock.stocks[i]["stockId"]);
                div.style.padding = "15px";

                div.onclick = function () {
                    stock.deselectAllAndSelect(this.id);

                    stock.showItem(this.id);

                    if (stock.$("stock")) {

                        stock.$("stock").value = this.id;

                    }

                    stock.$("selected_item").value = this.getAttribute("npid");

                    if (stock.$("editItem")) {

                        stock.$("editItem").className = "blue";

                    }

                    /*if (stock.$('nextButton')) {
                     stock.$("nextButton").innerHTML = "<span>Select</span>"
                     stock.$("nextButton").className = "green navButton";

                     stock.$('nextButton').onmousedown = function () {

                     window.location = stock.settings.basePath + "/" + stock.$("selected_item").value.trim();

                     }
                     }*/
                }

                div.innerHTML = "<table width='100%'><tr><td style='width: 50%'>" + stock.stocks[i].item_name + " (" +
                    stock.stocks[i].category + ")" + "</td></tr></table>";

                stock.$("rightpanel").appendChild(div);

            }

        }

    },

    deselectAllAndSelect: function (me) {

        for (var i = 0; i < stock.$("rightpanel").children.length; i++) {
            if (stock.$("rightpanel").children[i].id == me) {
                stock.$("rightpanel").children[i].className = "element highlighted";
            } else {
                stock.$("rightpanel").children[i].className = "element " + (stock.$("rightpanel").children[i].getAttribute("tag") == "odd" ? "odd" : "");
            }
        }

    },

    showItem: function (pos) {

        stock.$("leftpanel").innerHTML = "";

        if (stock.$("json")) {
            stock.$("json").innerHTML = JSON.stringify(stock.stocks[pos]);
        }

        var table = document.createElement("table");
        table.style.margin = "auto";
        table.style.paddingTop = "10px";
        table.setAttribute("cellpadding", 10);
        table.setAttribute("cellspacing", 0);
        table.style.fontSize = "28px";
        table.style.color = "#000";
        table.style.width = "100%";

        stock.$("leftpanel").appendChild(table);

        var tbody = document.createElement("tbody");

        table.appendChild(tbody);

        var tr1 = document.createElement("tr");

        tbody.appendChild(tr1);

        var cell1_1 = document.createElement("th");
        cell1_1.style.textAlign = "right";
        cell1_1.style.color = "#000";
        cell1_1.style.width = "250px";
        cell1_1.innerHTML = "Item Name:";
        cell1_1.style.borderRight = "1px dotted #000";

        tr1.appendChild(cell1_1);

        var cell1_2 = document.createElement("td");
        cell1_2.style.fontStyle = "italic";
        cell1_2.innerHTML = stock.stocks[pos]["item_name"];

        tr1.appendChild(cell1_2);

        var tr2 = document.createElement("tr");

        tbody.appendChild(tr2);

        var cell2_1 = document.createElement("th");
        cell2_1.style.textAlign = "right";
        cell2_1.style.color = "#000";
        cell2_1.innerHTML = "Description:";
        cell2_1.style.borderRight = "1px dotted #000";

        tr2.appendChild(cell2_1);

        var cell2_2 = document.createElement("td");
        cell2_2.style.fontStyle = "italic";
        cell2_2.innerHTML = (stock.stocks[pos]["description"] ? stock.stocks[pos]["description"] : "");

        tr2.appendChild(cell2_2);

        var tr3 = document.createElement("tr");

        tbody.appendChild(tr3);

        var cell3_1 = document.createElement("th");
        cell3_1.style.textAlign = "right";
        cell3_1.style.color = "#000";
        cell3_1.innerHTML = "Category:";
        cell3_1.style.borderRight = "1px dotted #000";

        tr3.appendChild(cell3_1);

        var cell3_2 = document.createElement("td");
        cell3_2.style.fontStyle = "italic";
        cell3_2.innerHTML = stock.stocks[pos]["category"];

        tr3.appendChild(cell3_2);

        var tr7 = document.createElement("tr");

        tbody.appendChild(tr7);

        var cell7_1 = document.createElement("th");
        cell7_1.style.textAlign = "right";
        cell7_1.style.color = "#000";
        cell7_1.innerHTML = "In Stock:";
        cell7_1.style.borderRight = "1px dotted #000";

        tr7.appendChild(cell7_1);

        var cell7_2 = document.createElement("td");
        cell7_2.style.fontStyle = "italic";
        cell7_2.innerHTML = stock.stocks[pos]["in_stock"];

        tr7.appendChild(cell7_2);

        var tr4 = document.createElement("tr");

        tbody.appendChild(tr4);

        var cell4_1 = document.createElement("th");
        cell4_1.style.textAlign = "right";
        cell4_1.style.color = "#000";
        cell4_1.innerHTML = "Last Order Size:";
        cell4_1.style.borderRight = "1px dotted #000";

        tr4.appendChild(cell4_1);

        var cell4_2 = document.createElement("td");
        cell4_2.style.fontStyle = "italic";

        cell4_2.innerHTML = stock.stocks[pos]["last_order_size"];

        tr4.appendChild(cell4_2);

        var tr5 = document.createElement("tr");

        tbody.appendChild(tr5);

        var cell5_1 = document.createElement("th");
        cell5_1.style.textAlign = "right";
        cell5_1.style.color = "#000";
        cell5_1.innerHTML = "Average Dispatch/Day:";
        cell5_1.style.borderRight = "1px dotted #000";

        tr5.appendChild(cell5_1);

        var cell5_2 = document.createElement("td");
        cell5_2.style.fontStyle = "italic";
        cell5_2.innerHTML = stock.stocks[pos]["avg_dispatch_per_day"];

        tr5.appendChild(cell5_2);

        var tr6 = document.createElement("tr");

        tbody.appendChild(tr6);

        var cell6_1 = document.createElement("th");
        cell6_1.style.textAlign = "right";
        cell6_1.style.color = "#000";
        cell6_1.innerHTML = "Re-Order Level:";
        cell6_1.style.borderRight = "1px dotted #000";

        tr6.appendChild(cell6_1);

        var cell6_2 = document.createElement("td");
        cell6_2.style.fontStyle = "italic";
        cell6_2.innerHTML = stock.stocks[pos]["re_order_level"];

        tr6.appendChild(cell6_2);

        var tr = document.createElement("tr");

        tbody.appendChild(tr);

        var td = document.createElement("td");
        td.colSpan = 2;
        td.align = "center";
        td.style.paddingTop = "20px";

        tr.appendChild(td);

        var btnReceive = document.createElement("button");
        btnReceive.className = "blue";
        btnReceive.style.minWidth = "130px";
        btnReceive.innerHTML = "Receive";
        btnReceive.setAttribute("tag", pos);

        btnReceive.onmousedown = function () {

            stock.receiveItem(this.getAttribute("tag"));

        }

        td.appendChild(btnReceive);

        var btnDispatch = document.createElement("button");
        btnDispatch.className = "blue";
        btnDispatch.style.minWidth = "130px";
        btnDispatch.innerHTML = "Dispatch";
        btnDispatch.setAttribute("tag", pos);

        btnDispatch.onmousedown = function () {

            stock.dispatchItem(this.getAttribute("tag"));

        }

        td.appendChild(btnDispatch);

        var btnTransfer = document.createElement("button");
        btnTransfer.className = "blue";
        btnTransfer.style.minWidth = "130px";
        btnTransfer.innerHTML = "Transfer";
        btnTransfer.setAttribute("tag", pos);

        btnTransfer.onmousedown = function () {

            stock.transferItem(this.getAttribute("tag"));

        }

        td.appendChild(btnTransfer);

        var btnEdit = document.createElement("button");
        btnEdit.className = "blue";
        btnEdit.style.minWidth = "130px";
        btnEdit.innerHTML = "Edit";
        btnEdit.setAttribute("tag", pos);

        btnEdit.onmousedown = function () {

            stock.editItem(this.getAttribute("tag"));

        }

        td.appendChild(btnEdit);

    },

    loadItems: function () {

        stock.$("inputFrame" + tstCurrentPage).style.display = "none";

        var panel = document.createElement("div");
        panel.style.borderRadius = "10px";
        panel.style.width = "99%";
        panel.style.height = "100%";
        panel.style.padding = "10px";
        panel.style.backgroundColor = "white";
        // panel.style.margin = "-10px";

        stock.$("page" + tstCurrentPage).appendChild(panel);

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
            if (stock.page - 1 > 0) {
                stock.page -= 1;
            }

            stock.ajaxSearch(stock.page);
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
            stock.page += 1;

            stock.ajaxSearch(stock.page);
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

        stock.$("buttons").appendChild(footer);

        var newPatient = document.createElement("button");
        newPatient.innerHTML = "<span>New Item</span>";
        newPatient.id = "newPatient";
        newPatient.style.cssFloat = "right";

        newPatient.onmousedown = function () {

            stock.addItem();

        }

        footer.appendChild(newPatient);

        stock.ajaxSearch(stock.page);
    },

    hideKeyboard: function () {
        if (stock.$("keyboard")) {
            stock.$("keyboard").style.display = "none";
        } else {
            setTimeout("hideKeyboard()", 100);
        }
    },

    unloadChild: function () {

        if (stock.$("navPanel")) {

            document.body.removeChild(stock.$("navPanel"));

        }

    },

    listItems: function () {

        console.log("in");

    },

    addItem: function () {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "stock"
            },
            "Category": {
                field_type: "text",
                ajaxURL: stock.settings.categorySearchPath + "?category=",
                allowFreeText: true,
                id: "data.category",
                tt_onUnLoad: "__$('data.item_name').setAttribute('ajaxURL', '" + stock.settings.stockItemsSearchPath +
                    "?category=' + __$('touchscreenInput' + tstCurrentPage).value.trim() + '&item_name=')"
            },
            "Item Name": {
                field_type: "text",
                allowFreeText: true,
                id: "data.item_name"
            },
            "Description": {
                field_type: "text",
                id: "data.description",
                optional: true
            },
            "Re-Order Level": {
                field_type: "number",
                tt_pageStyleClass: "NumbersOnly",
                id: "data.re_order_level"
            }
        }

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    editItem: function (pos) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "stock"
            },
            "Stock ID": {
                field_type: "hidden",
                id: "data.stock_id",
                value: stock.stocks[pos].stock_id
            },
            "Category": {
                field_type: "text",
                ajaxURL: stock.settings.categorySearchPath + "?category=",
                allowFreeText: true,
                id: "data.category",
                tt_onUnLoad: "__$('data.item_name').setAttribute('ajaxURL', '" + stock.settings.stockItemsSearchPath +
                    "?category=' + __$('touchscreenInput' + tstCurrentPage).value.trim() + '&item_name=')",
                value: stock.stocks[pos].category
            },
            "Item Name": {
                field_type: "text",
                allowFreeText: true,
                id: "data.item_name",
                value: stock.stocks[pos].item_name
            },
            "Description": {
                field_type: "text",
                id: "data.description",
                optional: true,
                value: stock.stocks[pos].description
            },
            "Re-Order Level": {
                field_type: "number",
                tt_pageStyleClass: "NumbersOnly",
                id: "data.re_order_level",
                value: stock.stocks[pos].re_order_level
            }
        }

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    receiveItem: function (pos) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "receive"
            },
            "Stock ID": {
                field_type: "hidden",
                id: "data.stock_id",
                value: stock.stocks[pos].stock_id
            },
            "Received Quantity": {
                field_type: "number",
                tt_pageStyleClass: "NumbersOnly",
                id: "data.receipt_quantity"
            },
            "Date Received": {
                field_type: "date",
                id: "data.receipt_datetime"
            }
        }

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    buildFields: function(fields, table) {

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

            var input = document.createElement("input");
            input.id = fields[key].id;
            input.name = fields[key].id;
            input.setAttribute("helpText", key);

            if(fields[key].field_type == "hidden") {

                input.type = "hidden";

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

    },

    dispatchItem: function (pos) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "dispatch"
            },
            "Stock ID": {
                field_type: "hidden",
                id: "data.stock_id",
                value: stock.stocks[pos].stock_id
            },
            "Quantity to Dispatch": {
                field_type: "number",
                tt_pageStyleClass: "NumbersOnly",
                id: "data.dispatch_quantity"
            },
            "Date of Dispatch": {
                field_type: "date",
                id: "data.dispatch_datetime"
            },
            "Who Released Item": {
                field_type: "text",
                id: "data.dispatch_who_dispatched",
                allowFreeText: true
            },
            "Who Received": {
                field_type: "text",
                id: "data.dispatch_who_received",
                allowFreeText: true
            },
            "Who Authorised Release": {
                field_type: "text",
                id: "data.dispatch_who_authorised",
                allowFreeText: true
            },
            "Dispatch Location": {
                field_type: "text",
                id: "data.dispatch_location",
                allowFreeText: true
            }
        }

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    transferItem: function (pos) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "transfer"
            },
            "Dispatch ID": {
                field_type: "hidden",
                id: "data.dispatch_id",
                value: stock.stocks[pos].dispatch_id
            },
            "Quantity to Transfer": {
                field_type: "number",
                tt_pageStyleClass: "NumbersOnly",
                id: "data.transfer_quantity"
            },
            "Date of Transfer": {
                field_type: "date",
                id: "data.transfer_datetime"
            },
            "Who Released Item": {
                field_type: "text",
                id: "data.transfer_who_transfered",
                allowFreeText: true
            },
            "Who Received": {
                field_type: "text",
                id: "data.transfer_who_received",
                allowFreeText: true
            },
            "Who Authorised Release": {
                field_type: "text",
                id: "data.transfer_who_authorised",
                allowFreeText: true
            },
            "Transfer Location": {
                field_type: "text",
                id: "data.transfer_location",
                allowFreeText: true
            }
        }

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    submitData: function (data) {

        if (stock.$("navPanel")) {

            document.body.removeChild(stock.$("navPanel"));

        }

        data.data.userId = "admin";

        stock.ajaxPostRequest(stock.settings.itemSavePath, data, function (sid) {

            console.log(sid)

        })

    },

    navPanel: function (content) {

        if (stock.$("navPanel")) {

            document.body.removeChild(stock.$("navPanel"));

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "0px";
            divPanel.style.width = "100%";
            divPanel.style.height = "100%";
            divPanel.style.backgroundColor = "#fff";
            divPanel.id = "navPanel";
            divPanel.style.zIndex = 800;

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
                "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><meta http-equiv='content-type' " +
                "content='text/html;charset=UTF-8'/><script src='/javascripts/form2js.js'></script><script language='javascript'>tstUsername = '';" +
                "tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "';tt_cancel_destination = " +
                "'javascript:window.parent.stock.unloadChild()'; tt_cancel_show = 'javascript:window.parent.stock.unloadChild()';" +
                "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
                "if(window.parent) window.parent.stock.submitData(data); }</script></head><body>";

            html += "<div id='content'>" + content + "</div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

                // stock.$("ifrMain").contentWindow.protocol.init(path, undefined, undefined, undefined, undefined);

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

    init: function (settingsPath, userId) {

        this['settings'] = {};

        this['userId'] = userId;

        if (typeof settingsPath != undefined) {

            this.ajaxRequest(settingsPath, function (settings) {

                stock.settings = JSON.parse(settings);

                stock.searchForStock();

            })

        }

    }

})