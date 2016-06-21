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

                result = date.getFullYear() + "-" + stock;
                padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                stock.padZeros(date.getDate(), 2) + " " + stock.padZeros(date.getHours(), 2) + ":" +
                stock.padZeros(date.getMinutes(), 2) + ":" + stock.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

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

}

var stock = ({

    version: "0.0.1",

    stocks: [],

    stockId: null,

    page: 1,

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

    searchForStock: function () {

        if (typeof(tstCurrentDate) === "undefined") {

            var script = document.createElement("script");

            script.innerText = "var tstCurrentDate = '" + (new Date()).format("YYYY-mm-dd") + "'; tt_cancel_show = '/';tt_cancel_destination = '/';";

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
                            "function(){window.parent.stock.listItems(window.parent.document.body)};");
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

                    if (stock.$("editItem")) {

                        stock.$("editItem").className = "blue";

                    }

                }

                div.innerHTML = "<table width='100%'><tr><td style='width: 50%'>" + stock.stocks[i].name + " (" +
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
        cell1_2.innerHTML = stock.stocks[pos]["name"];

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
        cell7_2.innerHTML = stock.stocks[pos]["inStock"];

        tr7.appendChild(cell7_2);

        var tr4 = document.createElement("tr");

        tbody.appendChild(tr4);

        var cell4_1 = document.createElement("th");
        cell4_1.style.textAlign = "right";
        cell4_1.style.color = "#000";
        cell4_1.innerHTML = "Last Batch Size:";
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
        cell5_1.innerHTML = "Average Issue/Day:";
        cell5_1.style.borderRight = "1px dotted #000";

        tr5.appendChild(cell5_1);

        var cell5_2 = document.createElement("td");
        cell5_2.style.fontStyle = "italic";
        cell5_2.innerHTML = stock.stocks[pos]["avg"];

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
        btnReceive.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnReceive.style.minWidth = "130px";
        btnReceive.innerHTML = "Receive";
        btnReceive.setAttribute("tag", pos);

        btnReceive.onmousedown = function () {

            if (this.className.match(/gray/))
                return;

            stock.receiveItem(stock.stocks[parseInt(this.getAttribute("tag"))].stock_id);

        }

        td.appendChild(btnReceive);

        var btnIssue = document.createElement("button");
        btnIssue.className = (stock.stocks[pos]["inStock"] > 0 && stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnIssue.style.minWidth = "130px";
        btnIssue.innerHTML = "Issue";
        btnIssue.setAttribute("tag", pos);

        btnIssue.onmousedown = function () {

            if (this.className.match(/gray/))
                return;

            stock.dispatchItem(stock.stocks[parseInt(this.getAttribute("tag"))].stock_id);

        }

        td.appendChild(btnIssue);

        var btnTransfer = document.createElement("button");
        btnTransfer.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnTransfer.style.minWidth = "130px";
        btnTransfer.innerHTML = "Transfer";
        btnTransfer.setAttribute("tag", pos);
        btnTransfer.setAttribute("label", stock.stocks[pos].name);

        btnTransfer.onclick = function () {

            if (this.className.match(/gray/))
                return;

            stock.transferItem(this.getAttribute("label"));

        }

        td.appendChild(btnTransfer);

        stock.ajaxRequest(stock.settings.availableBatchesToUserSummaryPath + stock.stocks[pos].name +
            "&userId=" + stock.getCookie("username"), function (data, optionalControl) {

            var json = JSON.parse(data);

            if (optionalControl) {

                optionalControl.className = (json.inStock && parseInt(json.inStock) > 0 ? "blue" : "gray");

            }

        }, btnTransfer);

        var btnEdit = document.createElement("button");
        btnEdit.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnEdit.style.minWidth = "130px";
        btnEdit.innerHTML = "Edit";
        btnEdit.setAttribute("tag", pos);

        btnEdit.onmousedown = function () {

            if (this.className.match(/gray/))
                return;

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
        newPatient.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");

        newPatient.onmousedown = function () {

            if (this.className.match(/gray/i))
                return;

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

        if (stock.$("stock.navPanel")) {

            document.body.removeChild(stock.$("stock.navPanel"));

        }

    },

    listItems: function (target) {

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
        td0_0_0.innerHTML = "Inventory Control";

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

        var btnSearch = document.createElement("button");
        btnSearch.className = "blue";
        btnSearch.style.cssFloat = "right";
        btnSearch.style.marginTop = "15px";
        btnSearch.innerHTML = "Search for Inventory";

        btnSearch.onclick = function () {

            window.parent.stock.searchForStock();

        }

        nav.appendChild(btnSearch);

        var btnAdd = document.createElement("button");
        btnAdd.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnAdd.style.cssFloat = "right";
        btnAdd.style.margin = "15px";
        btnAdd.innerHTML = "Add Item";

        btnAdd.onclick = function () {

            if (this.className.match(/gray/))
                return;

            window.parent.stock.addItem();

        }

        nav.appendChild(btnAdd);

        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        stock.loadListItems(stock.settings.listPath, div0_1_0_0);

    },

    loadListItems: function (path, target) {

        if (!path || !target)
            return;

        stock.ajaxRequest(path, function (data) {

            stock.stocks = JSON.parse(data);

            stock.buildUsersView(target);

        })

    },

    buildUsersView: function (target) {

        if (!target)
            return;

        if (!stock.stocks)
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

        var fields = ["", "Item Name", "Description", "Category", "In Stock", "Re-Order Level", "Average Issue/Day",
            "Receive", "Issue", "Edit", "Delete", "Transfer"];
        var colSizes = ["30px", "200px", undefined, "200px", "100px", "100px", "100px", "80px", "80px", "80px", "80px",
            "80px"];

        for (var i = 0; i < fields.length; i++) {

            var th = document.createElement("th");

            if (colSizes[i])
                th.style.width = colSizes[i];

            th.innerHTML = fields[i];

            tr.appendChild(th);

        }

        for (var i = 0; i < stock.stocks.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var keys = Object.keys(stock.stocks[i]);

            for (var j = 0; j < fields.length; j++) {

                var td = document.createElement("td");
                td.style.verticalAlign = "top";

                if ([0, 4, 5, 6].indexOf(j) >= 0) {

                    td.align = "center";

                } else {

                    td.align = "left";

                }

                if (j > 6) {

                    td.innerHTML = "";

                    if (j == 7) {

                        td.style.padding = "2px";

                        var btnReceive = document.createElement("button");
                        btnReceive.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
                        btnReceive.style.minWidth = "100px";
                        btnReceive.style.minHeight = "30px";
                        btnReceive.style.fontWeight = "normal";
                        btnReceive.innerHTML = "Receive";
                        btnReceive.setAttribute("stock_id", stock.stocks[i].stock_id);
                        btnReceive.setAttribute("pos", i);

                        btnReceive.onclick = function () {

                            if (this.className.match(/gray/))
                                return;

                            window.parent.stock.receiveItem(this.getAttribute("stock_id"),
                                stock.stocks[this.getAttribute("pos")].name);

                        }

                        td.appendChild(btnReceive);

                    } else if (j == 8) {

                        td.style.padding = "2px";

                        var btnIssue = document.createElement("button");
                        btnIssue.className = (stock.stocks[i]["inStock"] > 0 && stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
                        btnIssue.style.minWidth = "100px";
                        btnIssue.style.minHeight = "30px";
                        btnIssue.style.fontWeight = "normal";
                        btnIssue.innerHTML = "Issue";
                        btnIssue.setAttribute("stock_id", stock.stocks[i].stock_id);
                        btnIssue.setAttribute("pos", i);

                        btnIssue.onclick = function () {

                            if (this.className.match(/gray/))
                                return;

                            window.parent.stock.dispatchItem(this.getAttribute("stock_id"),
                                stock.stocks[this.getAttribute("pos")].name);

                        }

                        td.appendChild(btnIssue);

                    } else if (j == 11) {

                        td.style.padding = "2px";

                        var btnTransfer = document.createElement("button");
                        btnTransfer.style.minWidth = "100px";
                        btnTransfer.style.minHeight = "30px";
                        btnTransfer.style.fontWeight = "normal";
                        btnTransfer.innerHTML = "Transfer";
                        btnTransfer.setAttribute("stock_id", stock.stocks[i].stock_id);
                        btnTransfer.setAttribute("pos", i);
                        btnTransfer.setAttribute("label", stock.stocks[i][keys[1]]);

                        btnTransfer.onclick = function () {

                            if (this.className.match(/gray/))
                                return;

                            stock.transferItem(this.getAttribute("label"));

                        }


                        td.appendChild(btnTransfer);

                        stock.ajaxRequest(stock.settings.availableBatchesToUserSummaryPath + stock.stocks[i].name +
                            "&userId=" + stock.getCookie("username"), function (data, optionalControl) {

                            var json = JSON.parse(data);

                            if (optionalControl) {

                                optionalControl.className = (json.inStock && parseInt(json.inStock) > 0 ? "blue" : "gray");

                            }

                        }, btnTransfer);

                    } else if (j == 9) {

                        td.style.padding = "2px";

                        var btnEdit = document.createElement("button");
                        btnEdit.className = (stock.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
                        btnEdit.style.minWidth = "100px";
                        btnEdit.style.minHeight = "30px";
                        btnEdit.style.fontWeight = "normal";
                        btnEdit.innerHTML = "Edit";
                        btnEdit.setAttribute("stock_id", stock.stocks[i].stock_id);
                        btnEdit.setAttribute("pos", i);

                        btnEdit.onclick = function () {

                            if (this.className.match(/gray/))
                                return;

                            window.parent.stock.editItem(this.getAttribute("pos"));

                        }

                        td.appendChild(btnEdit);

                    } else if (j == 10) {

                        td.style.padding = "2px";

                        var btnDelete = document.createElement("button");
                        btnDelete.style.minWidth = "100px";
                        btnDelete.style.minHeight = "30px";
                        btnDelete.style.fontWeight = "normal";
                        btnDelete.innerHTML = "Delete";
                        btnDelete.className = (stock.roles.indexOf("Admin") >= 0 ? "red" : "gray");
                        btnDelete.setAttribute("stock_id", stock.stocks[i].stock_id);
                        btnDelete.setAttribute("pos", i);

                        btnDelete.onclick = function () {

                            if (this.className.match(/gray/))
                                return;

                            window.parent.stock.showConfirmMsg("Do you really want to delete this item permanently?",
                                "Confirm Delete", "javascript:window.parent.stock.deleteItem('" +
                                    this.getAttribute("stock_id") + "')");

                        }

                        td.appendChild(btnDelete);

                    }

                } else if (j == 0) {

                    td.innerHTML = (i + 1);

                } else if (j == 4) {

                    td.style.fontWeight = "bold";

                    if (parseInt(stock.stocks[i][keys[j]]) > parseInt(stock.stocks[i][keys[j + 1]])) {

                        td.style.color = "green";

                    } else {

                        td.style.color = "red";

                    }

                    td.innerHTML = stock.stocks[i][keys[j]];

                } else {

                    td.innerHTML = stock.stocks[i][keys[j]];

                }

                td.style.borderColor = "#eee";

                tr.appendChild(td);

            }

        }

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

    editItem: function (pos, stock_id) {

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
                value: (pos ? stock.stocks[pos].stock_id : stock_id)
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
                value: stock.stocks[pos].name
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

    receiveItem: function (stock_id, label) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var batchLabel = (label ? label + ": " : "") + "Lot Number";

        var expiryLabel = (label ? label + ": " : "") + "Expiry Date";

        var receivedLabel = (label ? label + ": " : "") + "Received Quantity  (individual items)";

        var dateLabel = (label ? label + ": " : "") + "Date Received";

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "receive"
            },
            "Stock ID": {
                field_type: "hidden",
                id: "data.stock_id",
                value: stock_id
            }
        };

        fields[batchLabel] = {
            field_type: "text",
            id: "data.batch_number",
            optional: true
        };

        fields[expiryLabel] = {
            field_type: "date",
            id: "data.expiry_date",
            maxDate: new Date(((new Date()).setYear((new Date()).getFullYear() + 2))).format("YYYY-mm-dd"),
            optional: true
        };

        fields[receivedLabel] = {
            field_type: "number",
            tt_pageStyleClass: "NumbersOnly",
            id: "data.receipt_quantity"
        };

        fields[dateLabel] = {
            field_type: "date",
            id: "data.receipt_datetime"
        };

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

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

            var input = document.createElement("input");
            input.id = fields[key].id;
            input.name = fields[key].id;
            input.setAttribute("helpText", key);

            if (fields[key].field_type == "hidden") {

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

    consumeItem: function (label) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var batchLabel = (label ? label + ": " : "") + "Lot Number";

        var quantityLabel = (label ? label + ": " : "") + "Quantity to Consume  (individual items)";

        var dateLabel = (label ? label + ": " : "") + "Date of Consumption";

        var typeLabel = (label ? label + ": " : "") + "Consumption Type";

        var receiverLabel = (label ? label + ": " : "") + "Who Consumed";

        var reasonLabel = (label ? label + ": " : "") + "Reason for Consumption";

        var locationLabel = (label ? label + ": " : "") + "Consumption Location";

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "consumption"
            },
            "Dispatch ID": {
                field_type: "hidden",
                id: "data.dispatch_id",
                value: ""
            }
        };

        fields[batchLabel] = {
            field_type: "text",
            id: "data.batch_number",
            ajaxURL: stock.settings.availableUserBatchesPath + (label ? label : "") + "&userId=" +
                stock.getCookie("username") + "&batch=",
            tt_onUnload: "if(__$('data.consumption_quantity')){var limit = __$('touchscreenInput' + " +
                "tstCurrentPage).value.trim().match(/(\\d+)\\)$/)[1]; " +
                "__$('data.consumption_quantity').setAttribute('absoluteMax', limit)}"
        };

        fields[quantityLabel] = {
            field_type: "number",
            tt_pageStyleClass: "NumbersOnly",
            id: "data.consumption_quantity"
        };

        fields[dateLabel] = {
            field_type: "date",
            id: "data.date_consumed"
        };

        fields[typeLabel] = {
            field_type: "text",
            id: "data.consumption_type",
            ajaxURL: stock.settings.consumptionTypesPath
        };

        fields[receiverLabel] = {
            field_type: "text",
            id: "data.who_consumed",
            allowFreeText: true,
            ajaxURL: stock.settings.userListingPath
        };

        fields[reasonLabel] = {
            field_type: "text",
            id: "data.reason_for_consumption",
            allowFreeText: true
        };

        fields[locationLabel] = {
            field_type: "text",
            id: "data.location",
            allowFreeText: true,
            ajaxURL: stock.settings.locationsListPath
        };

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    disposeItem: function (label) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var batchLabel = (label ? label + ": " : "") + "Lot Number";

        var quantityLabel = (label ? label + ": " : "") + "Quantity to Dispose  (individual items)";

        var dateLabel = (label ? label + ": " : "") + "Date of Disposal";

        var typeLabel = (label ? label + ": " : "") + "Consumption Type";

        var receiverLabel = (label ? label + ": " : "") + "Who Consumed";

        var reasonLabel = (label ? label + ": " : "") + "Reason for Disposal";

        var locationLabel = (label ? label + ": " : "") + "Consumption Location";

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "consumption"
            },
            "Dispatch ID": {
                field_type: "hidden",
                id: "data.dispatch_id",
                value: ""
            }
        };

        fields[batchLabel] = {
            field_type: "text",
            id: "data.batch_number",
            ajaxURL: stock.settings.availableUserBatchesPath + (label ? label : "") + "&userId=" +
                stock.getCookie("username") + "&batch=",
            tt_onUnload: "if(__$('data.consumption_quantity')){var limit = __$('touchscreenInput' + " +
                "tstCurrentPage).value.trim().match(/(\\d+)\\)$/)[1]; " +
                "__$('data.consumption_quantity').setAttribute('absoluteMax', limit)}"
        };

        fields[quantityLabel] = {
            field_type: "number",
            tt_pageStyleClass: "NumbersOnly",
            id: "data.consumption_quantity"
        };

        fields[dateLabel] = {
            field_type: "date",
            id: "data.date_consumed"
        };

        fields[typeLabel] = {
            field_type: "hidden",
            id: "data.consumption_type",
            ajaxURL: stock.settings.consumptionTypesPath,
            value: "Disposal"
        };

        fields[receiverLabel] = {
            field_type: "hidden",
            id: "data.who_consumed",
            allowFreeText: true,
            ajaxURL: stock.settings.userListingPath,
            value: stock.getCookie("username")
        };

        fields[reasonLabel] = {
            field_type: "text",
            id: "data.reason_for_consumption",
            allowFreeText: true,
            helpText: "Reason for disposal"
        };

        fields[locationLabel] = {
            field_type: "hidden",
            id: "data.location",
            allowFreeText: true,
            ajaxURL: stock.settings.locationsListPath,
            value: stock.getCookie("location")
        };

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    dispatchItem: function (stock_id, label) {

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var batchLabel = (label ? label + ": " : "") + "Lot Number";

        var quantityLabel = (label ? label + ": " : "") + "Quantity to Issue (individual item)";

        var dateLabel = (label ? label + ": " : "") + "Date of Issue";

        var dispatcherLabel = (label ? label + ": " : "") + "Who Released Item";

        var receiverLabel = (label ? label + ": " : "") + "Who Received";

        var authorityLabel = (label ? label + ": " : "") + "Who Authorised Release";

        var locationLabel = (label ? label + ": " : "") + "Issue Location";

        var fields = {
            "Datatype": {
                field_type: "hidden",
                id: "data.datatype",
                value: "dispatch"
            },
            "Stock ID": {
                field_type: "hidden",
                id: "data.stock_id",
                value: stock_id
            }
        };

        fields[batchLabel] = {
            field_type: "text",
            id: "data.batch_number",
            ajaxURL: stock.settings.availableBatchesPath + (label ? label : "") + "&batch=",
            tt_onUnload: "if(__$('data.dispatch_quantity')){var limit = __$('touchscreenInput' + " +
                "tstCurrentPage).value.trim().match(/(\\d+)\\)$/)[1]; " +
                "__$('data.dispatch_quantity').setAttribute('absoluteMax', limit)}"
        };

        fields[quantityLabel] = {
            field_type: "number",
            tt_pageStyleClass: "NumbersOnly",
            id: "data.dispatch_quantity"
        };

        fields[dateLabel] = {
            field_type: "date",
            id: "data.dispatch_datetime"
        };

        fields[dispatcherLabel] = {
            field_type: "hidden",
            id: "data.dispatch_who_dispatched",
            value: stock.getCookie("username")
        };

        fields[receiverLabel] = {
            field_type: "text",
            id: "data.dispatch_who_received",
            ajaxURL: stock.settings.userListingPath
        };

        fields[authorityLabel] = {
            field_type: "hidden",
            id: "data.dispatch_who_authorised",
            value: stock.getCookie("username")
        };

        fields[locationLabel] = {
            field_type: "text",
            id: "data.dispatch_destination",
            allowFreeText: true,
            ajaxURL: stock.settings.locationsListPath
        };

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    transferItem: function (label) {

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
                value: ""
            },
            "Lot Number": {
                field_type: "text",
                id: "data.batch_number",
                ajaxURL: stock.settings.availableUserBatchesPath + (label ? label : "") + "&userId=" +
                    stock.getCookie("username") + "&batch=",
                tt_onUnload: "if(__$('data.transfer_quantity')){var limit = __$('touchscreenInput' + " +
                    "tstCurrentPage).value.trim().match(/(\\d+)\\)$/)[1]; " +
                    "__$('data.transfer_quantity').setAttribute('absoluteMax', limit)}"
            },
            "Quantity to Transfer (individual items)": {
                field_type: "number",
                tt_pageStyleClass: "NumbersOnly",
                id: "data.transfer_quantity"
            },
            "Date of Transfer": {
                field_type: "date",
                id: "data.transfer_datetime"
            },
            "Who Released Item": {
                field_type: "hidden",
                id: "data.transfer_who_transfered",
                value: stock.getCookie("username")
            },
            "Who Received": {
                field_type: "text",
                id: "data.transfer_who_received",
                allowFreeText: true,
                ajaxURL: stock.settings.userListingPath
            },
            "Who Authorised Release": {
                field_type: "hidden",
                id: "data.transfer_who_authorised",
                ajaxURL: stock.getCookie("username")
            },
            "Transfer Location": {
                field_type: "text",
                id: "data.transfer_location",
                allowFreeText: true,
                ajaxURL: stock.settings.locationsListPath
            }
        }

        stock.buildFields(fields, table);

        stock.navPanel(form.outerHTML);

    },

    deleteItem: function (stock_id) {

        var data = {
            data: {}
        };

        data.data.userId = stock.getCookie("username");

        data.data.token = stock.getCookie("token");

        data.data.stock_id = stock_id;

        stock.ajaxPostRequest(stock.settings.itemDeletePath, data, function (sid) {

            var json = JSON.parse(sid);

            if (stock.$("stock.content"))
                stock.loadListItems(stock.settings.listPath, stock.$("stock.content"));

            stock.showMsg(json.message);

        })

    },

    submitData: function (data) {

        if (stock.$("stock.navPanel")) {

            document.body.removeChild(stock.$("stock.navPanel"));

        }

        data.data.userId = stock.getCookie("username");

        data.data.token = stock.getCookie("token");

        stock.ajaxPostRequest(stock.settings.itemSavePath, data, function (sid) {

            var json = JSON.parse(sid);

            if (stock.$("stock.content"))
                stock.loadListItems(stock.settings.listPath, stock.$("stock.content"));

            stock.showMsg(json.message);

        })

    },

    navPanel: function (content) {

        if (stock.$("stock.navPanel")) {

            document.body.removeChild(stock.$("stock.navPanel"));

        } else {

            var divPanel = document.createElement("div");
            divPanel.style.position = "absolute";
            divPanel.style.left = "0px";
            divPanel.style.top = "0px";
            divPanel.style.width = "100%";
            divPanel.style.height = "100%";
            divPanel.style.backgroundColor = "#fff";
            divPanel.id = "stock.navPanel";
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

    ajaxRequest: function (url, callback, optionalControl) {

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {

            if (httpRequest.readyState == 4 && (httpRequest.status == 200 ||
                httpRequest.status == 304)) {

                if (httpRequest.responseText.trim().length > 0) {
                    var result = httpRequest.responseText;

                    callback(result, optionalControl);

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

            if (stock.$("msg.shield")) {

                document.body.removeChild(stock.$("msg.shield"));

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

            if (stock.$("msg.shield")) {

                document.body.removeChild(stock.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

    },

    roles: [],

    init: function (settingsPath, userId) {

        this['settings'] = {};

        this['userId'] = userId;

        if (typeof settingsPath != undefined) {

            this.ajaxRequest(settingsPath, function (settings) {

                stock.settings = JSON.parse(settings);

                stock.roles = [];

                if (stock.getCookie("roles").trim().length > 0) {

                    stock.roles = JSON.parse(stock.getCookie("roles"));

                }

            })

        }

    }

})