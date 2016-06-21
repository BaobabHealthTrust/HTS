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

                result = date.getFullYear() + "-" + user.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    user.padZeros(date.getDate(), 2) + " " + user.padZeros(date.getHours(), 2) + ":" +
                    user.padZeros(date.getMinutes(), 2) + ":" + user.padZeros(date.getSeconds(), 2);

            } else if (format.match(/YYYY\-mm\-dd/)) {

                result = date.getFullYear() + "-" + user.padZeros((parseInt(date.getMonth()) + 1), 2) + "-" +
                    user.padZeros(date.getDate(), 2);

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

var user = ({

    version: "0.0.1",

    gender: null,

    username: null,

    name: null,

    roles: [],

    users: {},

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

    addUser: function (target) {

        if (!target)
            return;

        target.innerHTML = "";

        var div = document.createElement("div");
        div.id = "content";

        target.appendChild(div);

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        div.appendChild(form);

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                type: "hidden",
                id: "data.datatype",
                value: "addUser"
            },
            "Username": {
                field_type: "text",
                textCase: "lower",
                id: "data.username",
                allowFreeText: true,
                ajaxURL: user.settings.usernamesListingPath
            },
            "Password": {
                field_type: "text",
                type: "password",
                id: "data.password",
                textCase: "lower",
                tt_onUnLoad: "__$('data.confirm_password').setAttribute('validationRule', __$('touchscreenInput' + " +
                    "tstCurrentPage).value)"
            },
            "Confirm Password": {
                field_type: "text",
                type: "password",
                id: "data.confirm_password",
                validationRule: "",
                textCase: "lower",
                validationMessage: "Password Mismatch!"
            },
            "Role(s)": {
                field_type: "select",
                id: "data.roles",
                multiple: "multiple",
                ajaxURL: user.settings.rolesPath
            },
            "First Name": {
                field_type: "text",
                id: "data.first_name",
                allowFreeText: true,
                ajaxURL: user.settings.firstNamesPath
            },
            "Last Name": {
                field_type: "text",
                id: "data.last_name",
                allowFreeText: true,
                ajaxURL: user.settings.lastNamesPath
            },
            "Gender": {
                field_type: "select",
                options: ["", "Male", "Female"],
                id: "data.gender"
            }
        }

        if (user.settings['hts.provider.id']) {

            fields['HTS Provider ID'] = {
                field_type: "text",
                optional: true,
                id: "data.hts_provider_id"
            }

        }

        user.buildFields(fields, table);

        user.navPanel(form.outerHTML);

    },

    editUser: function (target, data) {

        if (!target)
            return;

        target.innerHTML = "";

        var div = document.createElement("div");
        div.id = "content";

        target.appendChild(div);

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        div.appendChild(form);

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Datatype": {
                field_type: "hidden",
                type: "hidden",
                id: "data.datatype",
                value: "editUser"
            },
            "First Name": {
                field_type: "text",
                id: "data.first_name",
                allowFreeText: true,
                ajaxURL: user.settings.firstNamesPath,
                value: (data && data.given_name ? data.given_name : user.getCookie("given_name"))
            },
            "Last Name": {
                field_type: "text",
                id: "data.last_name",
                allowFreeText: true,
                ajaxURL: user.settings.lastNamesPath,
                value: (data && data.family_name ? data.family_name : user.getCookie("family_name"))
            },
            "Gender": {
                field_type: "select",
                options: ["", "Male", "Female"],
                id: "data.gender",
                value: (data && data.gender ? data.gender : user.getCookie("gender"))
            }
        }

        if(user.roles.indexOf("Admin") >= 0) {

            fields["Role(s)"] = {
                field_type: "select",
                    id: "data.roles",
                    multiple: "multiple",
                    ajaxURL: user.settings.rolesPath
            };

        }

        if (user.settings['hts.provider.id']) {

            fields['HTS Provider ID'] = {
                field_type: "text",
                optional: true,
                id: "data.hts_provider_id",
                value: (data && data.attrs ? data.attrs['HTS Provider ID'] : "")
            }

        }

        user.buildFields(fields, table);

        user.navPanel(form.outerHTML);

    },

    settings: function (path) {

        this.ajaxRequest(path, function (data) {

            user.settings = JSON.parse(data);

        })

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

    login: function () {

        if (typeof(landing) != "undefined" && landing.intBarcode) {

            clearInterval(landing.intBarcode);

        }

        var form = document.createElement("form");
        form.id = "data";
        form.action = "javascript:submitData()";
        form.style.display = "none";

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Username": {
                field_type: "text",
                allowFreeText: true,
                id: "data.username",
                textCase: "lower"
            },
            "Password": {
                field_type: "password",
                id: "data.password",
                textCase: "lower"
            },
            "Location": {
                field_type: "text",
                id: "data.location",
                tt_onLoad: "window.parent.user.intBarcode = setInterval(function(){window.parent.user.checkLocationBarcode();}, 200);",
                tt_onUnLoad: "clearTimeout(window.parent.user.intBarcode);",
                tt_pageStyleClass: "NoKeyboard"
            }
        }

        user.buildFields(fields, table);

        user.navPanel(form.outerHTML);

    },

    intBarcode: null,

    checkLocationBarcode: function () {

        if (user.$$("touchscreenInput" + user.__().tstCurrentPage).value.trim().match(/\$$/)) {

            user.$$("touchscreenInput" + user.__().tstCurrentPage).value =
                user.$$("touchscreenInput" + user.__().tstCurrentPage).value.trim().replace(/\$/g, "");

            user.__().gotoNextPage();

        }

        user.$$("touchscreenInput" + user.__().tstCurrentPage).focus();

    },

    changePassword: function () {

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
                value: "changePassword"
            },
            "Current Password": {
                field_type: "password",
                id: "data.currentPassword",
                textCase: "lower"
            },
            "Password": {
                field_type: "password",
                id: "data.newPassword",
                textCase: "lower",
                tt_onUnLoad: "__$('data.confirmPassword').setAttribute('validationRule', __$('touchscreenInput' + tstCurrentPage).value)"
            },
            "Confirm Password": {
                field_type: "password",
                id: "data.confirmPassword",
                textCase: "lower",
                validationMessage: "Password Mismatch!"
            }
        }

        user.buildFields(fields, table);

        user.navPanel(form.outerHTML);

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

    },

    submitData: function (data) {

        data.data.userId = user.getCookie("username");

        data.data.token = user.getCookie("token");

        if (data.data.datatype == "changePassword") {

            user.ajaxPostRequest(user.settings.passwordUpdatePath, data.data, function (sid) {

                var json = JSON.parse(sid);

                if (user.$("user.navPanel")) {

                    document.body.removeChild(user.$("user.navPanel"));

                }

                user.showMsg(json.message, "Password Change", "/");

            })

        } else if (data.data.datatype == "addUser") {

            user.ajaxPostRequest(user.settings.userAddPath, data.data, function (sid) {

                var json = JSON.parse(sid);

                if (user.$("user.navPanel")) {

                    document.body.removeChild(user.$("user.navPanel"));

                }

                // window.location = "/";

                user.showMsg(json.message, "Status", "/");

            })

        } else if (data.data.datatype == "editUser") {

            user.ajaxPostRequest(user.settings.userEditPath, data.data, function (sid) {

                var json = JSON.parse(sid);

                if (user.$("user.navPanel")) {

                    document.body.removeChild(user.$("user.navPanel"));

                }

                // window.location = "/";

                user.showMsg(json.message, "Status", "/");

            })

        } else {

            user.ajaxPostRequest(user.settings.loginPath, data.data, function (sid) {

                var json = JSON.parse(sid);

                if (user.$("user.navPanel")) {

                    // document.body.removeChild(user.$("user.navPanel"));

                }

                // Sessions expire after 8 hrs if user does not logout
                if (Object.keys(json).indexOf("token") >= 0) {

                    user.setCookie("token", json["token"], 0.333333333);

                    user.setCookie("username", json["username"], 0.333333333);

                    user.setCookie("gender", json["gender"], 0.333333333);

                    user.setCookie("given_name", json["given_name"], 0.333333333);

                    user.setCookie("family_name", json["family_name"], 0.333333333);

                    user.setCookie("location", json["location"], 0.333333333);

                    user.setCookie("attrs", JSON.stringify(json['attributes']), 0.333333333);

                    user.setCookie("roles", JSON.stringify(json['roles']), 0.333333333);

                    window.location = "/";

                } else {

                    user.login();

                    user.showAlertMsg(json.message, "Access Denied!");

                }

            })

        }

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

            if (user.$("msg.shield")) {

                document.body.removeChild(user.$("msg.shield"));

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

    logout: function () {

        var token = user.getCookie("token");

        user.ajaxRequest(user.settings.logoutPath + token, function (result) {

            user.setCookie("token", "", -100);

            user.setCookie("username", "", -100);

            user.setCookie("given_name", "", -100);

            user.setCookie("gender", "", -100);

            user.setCookie("family_name", "", -100);

            user.setCookie("location", "", -100);

            user.setCookie("attrs", "", -100);

            user.setCookie("roles", "", -100);

            user.setCookie("gender", "", -100);

            window.location = "/";

        })

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

    showUser: function (target) {

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
        td0_0_0.innerHTML = "User Demographics";

        tr0_0.appendChild(td0_0_0);

        var tr0_1 = document.createElement("tr");

        table0.appendChild(tr0_1);

        var td0_1_0 = document.createElement("td");
        td0_1_0.style.borderTop = "5px solid #ccc";
        td0_1_0.style.padding = "0px";

        tr0_1.appendChild(td0_1_0);

        var div0_1_0_0 = document.createElement("div");
        div0_1_0_0.style.height = "calc(100% - 200px)";
        div0_1_0_0.style.backgroundColor = "#fff";
        div0_1_0_0.style.overflow = "auto";
        div0_1_0_0.style.padding = "5px";
        div0_1_0_0.style.textAlign = "center";

        td0_1_0.appendChild(div0_1_0_0);

        var table0_1_0_0_0 = document.createElement("table");
        table0_1_0_0_0.width = "100%";

        div0_1_0_0.appendChild(table0_1_0_0_0);

        var tr0_1_0_0_0_0 = document.createElement("tr");

        table0_1_0_0_0.appendChild(tr0_1_0_0_0_0);

        var td0_1_0_0_0_0_0 = document.createElement("td");
        td0_1_0_0_0_0_0.rowSpan = 4;
        td0_1_0_0_0_0_0.style.verticalAlign = "top";
        td0_1_0_0_0_0_0.style.paddingTop = "20px";

        tr0_1_0_0_0_0.appendChild(td0_1_0_0_0_0_0);

        var td0_1_0_0_0_0_1 = document.createElement("td");
        td0_1_0_0_0_0_1.innerHTML = "&nbsp;";

        tr0_1_0_0_0_0.appendChild(td0_1_0_0_0_0_1);

        var table0_1_0_0_0_0_0_0 = document.createElement("table");
        table0_1_0_0_0_0_0_0.width = "100%";
        table0_1_0_0_0_0_0_0.cellPadding = 5;
        table0_1_0_0_0_0_0_0.cellSpacing = 0;

        td0_1_0_0_0_0_0.appendChild(table0_1_0_0_0_0_0_0);

        var tr0_1_0_0_0_0_0_0_0 = document.createElement("tr");

        table0_1_0_0_0_0_0_0.appendChild(tr0_1_0_0_0_0_0_0_0);

        var td0_1_0_0_0_0_0_0_0_0 = document.createElement("td");
        td0_1_0_0_0_0_0_0_0_0.align = "center";
        td0_1_0_0_0_0_0_0_0_0.style.borderBottom = "1px dotted #ccc";

        tr0_1_0_0_0_0_0_0_0.appendChild(td0_1_0_0_0_0_0_0_0_0);

        var div0_1_0_0_0_0_0_0_0_0_0 = document.createElement("div");
        div0_1_0_0_0_0_0_0_0_0_0.style.borderRadius = "20px";
        div0_1_0_0_0_0_0_0_0_0_0.style.padding = "5px";
        div0_1_0_0_0_0_0_0_0_0_0.style.border = "solid 1px #6281A7";
        div0_1_0_0_0_0_0_0_0_0_0.style.width = "30px";
        div0_1_0_0_0_0_0_0_0_0_0.style.height = "30px";
        div0_1_0_0_0_0_0_0_0_0_0.style.textAlign = "center";
        div0_1_0_0_0_0_0_0_0_0_0.style.verticalAlign = "middle";

        td0_1_0_0_0_0_0_0_0_0.appendChild(div0_1_0_0_0_0_0_0_0_0_0);

        if (user.getCookie("gender").trim().length > 0) {

            var img = document.createElement("img");
            img.style.margin = "2px";

            img.setAttribute("alt", (user.getCookie("gender").match(/m/i) ? "M" : "F"));

            img.setAttribute("src", "/touchscreentoolkit/lib/images/" + (user.getCookie("gender").match(/m/i) ? "male" : "female") +
                ".gif");

            div0_1_0_0_0_0_0_0_0_0_0.appendChild(img);

        }

        var td0_1_0_0_0_0_0_0_0_1 = document.createElement("td");
        td0_1_0_0_0_0_0_0_0_1.align = "left";
        td0_1_0_0_0_0_0_0_0_1.style.fontSize = "32px";
        td0_1_0_0_0_0_0_0_0_1.style.borderBottom = "1px dotted #ccc";
        td0_1_0_0_0_0_0_0_0_1.style.verticalAlign = "middle";
        td0_1_0_0_0_0_0_0_0_1.style.borderLeft = "1px dotted #ccc";
        td0_1_0_0_0_0_0_0_0_1.style.paddingLeft = "15px";
        td0_1_0_0_0_0_0_0_0_1.innerHTML =
            (user.getCookie("given_name").trim().length > 0 ? user.getCookie("given_name") : "") + " " +
            (user.getCookie("family_name").trim().length > 0 ? user.getCookie("family_name") : "") + " (" +
            user.getCookie("username") + ")";

        tr0_1_0_0_0_0_0_0_0.appendChild(td0_1_0_0_0_0_0_0_0_1);

        var tr0_1_0_0_0_0_0_0_1 = document.createElement("tr");

        table0_1_0_0_0_0_0_0.appendChild(tr0_1_0_0_0_0_0_0_1);

        var td0_1_0_0_0_0_0_0_1_0 = document.createElement("td");
        td0_1_0_0_0_0_0_0_1_0.style.fontSize = "28px";
        td0_1_0_0_0_0_0_0_1_0.style.paddingTop = "30px";
        td0_1_0_0_0_0_0_0_1_0.style.verticalAlign = "top";
        td0_1_0_0_0_0_0_0_1_0.innerHTML = "Roles:";

        tr0_1_0_0_0_0_0_0_1.appendChild(td0_1_0_0_0_0_0_0_1_0);

        var td0_1_0_0_0_0_0_0_1_1 = document.createElement("td");
        td0_1_0_0_0_0_0_0_1_1.style.fontSize = "20px";
        td0_1_0_0_0_0_0_0_1_1.style.borderLeft = "1px dotted #ccc";
        td0_1_0_0_0_0_0_0_1_1.style.verticalAlign = "top";
        td0_1_0_0_0_0_0_0_1_1.style.textAlign = "left";
        td0_1_0_0_0_0_0_0_1_1.style.left = "1px dotted #ccc";

        tr0_1_0_0_0_0_0_0_1.appendChild(td0_1_0_0_0_0_0_0_1_1);

        var div0_1_0_0_0_0_0_0_1_1_0 = document.createElement("div");
        div0_1_0_0_0_0_0_0_1_1_0.style.width = "470px";
        div0_1_0_0_0_0_0_0_1_1_0.style.overflow = "auto";

        td0_1_0_0_0_0_0_0_1_1.appendChild(div0_1_0_0_0_0_0_0_1_1_0);

        var ul = document.createElement("ul");
        ul.id = "user.ul";

        div0_1_0_0_0_0_0_0_1_1_0.appendChild(ul);

        var roles = (user.getCookie("roles").trim().length > 0 ? JSON.parse(user.getCookie("roles")) : []);

        for (var i = 0; i < roles.length; i++) {

            var li = document.createElement("li");
            li.innerHTML = roles[i];
            li.style.fontSize = "26px";

            ul.appendChild(li);

        }

        var td0_1_0_0_0_0_1 = document.createElement("td");
        td0_1_0_0_0_0_1.align = "right";
        td0_1_0_0_0_0_1.style.verticalAlign = "top";

        tr0_1_0_0_0_0.appendChild(td0_1_0_0_0_0_1);

        var table0_1_0_0_0_0_1_0 = document.createElement("table");

        td0_1_0_0_0_0_1.appendChild(table0_1_0_0_0_0_1_0);

        var tr0_1_0_0_0_0_1_0_0 = document.createElement("tr");

        table0_1_0_0_0_0_1_0.appendChild(tr0_1_0_0_0_0_1_0_0);

        var td0_1_0_0_0_0_1_0_0_0 = document.createElement("td");

        tr0_1_0_0_0_0_1_0_0.appendChild(td0_1_0_0_0_0_1_0_0_0);

        var btnEdit = document.createElement("button");
        btnEdit.className = "blue";
        btnEdit.style.margin = "8px";
        btnEdit.style.width = "250px";
        btnEdit.style.cssFloat = "right";
        btnEdit.innerHTML = "Edit Demographics";

        btnEdit.onclick = function () {

            if (this.className.match(/gray/i))
                return;

            user.editUser(window.parent.document.body);

        }

        td0_1_0_0_0_0_1_0_0_0.appendChild(btnEdit);

        var tr0_1_0_0_0_0_1_0_1 = document.createElement("tr");

        table0_1_0_0_0_0_1_0.appendChild(tr0_1_0_0_0_0_1_0_1);

        var td0_1_0_0_0_0_1_0_1_0 = document.createElement("td");

        tr0_1_0_0_0_0_1_0_1.appendChild(td0_1_0_0_0_0_1_0_1_0);

        var btnChangePassword = document.createElement("button");
        btnChangePassword.className = "blue";
        btnChangePassword.style.margin = "8px";
        btnChangePassword.style.width = "250px";
        btnChangePassword.style.cssFloat = "right";
        btnChangePassword.innerHTML = "Change Password";

        btnChangePassword.onclick = function () {

            window.parent.user.changePassword();

        }

        td0_1_0_0_0_0_1_0_1_0.appendChild(btnChangePassword);

        var tr0_1_0_0_0_0_1_0_2 = document.createElement("tr");

        table0_1_0_0_0_0_1_0.appendChild(tr0_1_0_0_0_0_1_0_2);

        var td0_1_0_0_0_0_1_0_2_0 = document.createElement("td");

        tr0_1_0_0_0_0_1_0_2.appendChild(td0_1_0_0_0_0_1_0_2_0);

        var btnManageUsers = document.createElement("button");
        btnManageUsers.className = (user.roles.indexOf("Admin") >= 0 ? "blue" : "gray");
        btnManageUsers.style.margin = "8px";
        btnManageUsers.style.width = "250px";
        btnManageUsers.style.cssFloat = "right";
        btnManageUsers.innerHTML = "Manage Users";

        btnManageUsers.onclick = function () {

            if (this.className.match(/gray/))
                return;

            window.parent.user.showUsers(window.parent.document.body);

        }

        td0_1_0_0_0_0_1_0_2_0.appendChild(btnManageUsers);

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

    },

    showUsers: function (target) {

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
        td0_0_0.innerHTML = "User Management";

        tr0_0.appendChild(td0_0_0);

        var tr0_1 = document.createElement("tr");

        table0.appendChild(tr0_1);

        var td0_1_0 = document.createElement("td");
        td0_1_0.style.borderTop = "5px solid #ccc";
        td0_1_0.style.padding = "0px";

        tr0_1.appendChild(td0_1_0);

        var div0_1_0_0 = document.createElement("div");
        div0_1_0_0.id = "user.content";
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

        var btnNewUSer = document.createElement("button");
        btnNewUSer.className = "blue";
        btnNewUSer.style.cssFloat = "right";
        btnNewUSer.style.margin = "15px";
        btnNewUSer.style.width = "150px";
        btnNewUSer.innerHTML = "Add User";

        btnNewUSer.onclick = function () {

            window.parent.user.addUser(window.parent.document.body);

        }

        nav.appendChild(btnNewUSer);

        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

        user.loadUsers(user.settings.usersListingPath, div0_1_0_0);

    },

    loadUsers: function (path, target) {

        if (!path || !target)
            return;

        user.ajaxRequest(path, function (data) {

            user.users = JSON.parse(data);

            user.buildUsersView(target);

        })

    },

    buildUsersView: function (target) {

        if (!target)
            return;

        if (!user.users)
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

        var fields = ["", "Name", "Username", "Gender", "Role(s)", "Other Attributes", "Edit", "Block", "Activate"];
        var colSizes = ["30px", "200px", "100px", "80px", undefined, "220px", "60px", "60px", "60px"];

        var usernames = Object.keys(user.users);

        for (var i = 0; i < fields.length; i++) {

            var th = document.createElement("th");

            if (colSizes[i])
                th.style.width = colSizes[i];

            th.innerHTML = fields[i];

            tr.appendChild(th);

        }

        for (var i = 0; i < usernames.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var pos = i + 1;

            var attrs = "";

            var keys = Object.keys(user.users[usernames[i]].attributes);

            for (var j = 0; j < keys.length; j++) {

                attrs += "<b>" + keys[j] + "</b>" + ": " + (user.users[usernames[i]].attributes[keys[j]] ?
                    user.users[usernames[i]].attributes[keys[j]] : "") + "<br/>";

            }

            var values = [pos, user.users[usernames[i]].given_name + " " + user.users[usernames[i]].family_name,
                usernames[i], user.users[usernames[i]].gender, user.users[usernames[i]].roles.join("<br/>"), attrs,
                "", "", ""];

            for (var j = 0; j < values.length; j++) {

                var td = document.createElement("td");
                td.style.verticalAlign = "top";

                if (j == 0 || j == 3) {

                    td.align = "center";

                } else {

                    td.align = "left";

                }

                td.innerHTML = values[j];
                td.style.borderColor = "#eee";

                tr.appendChild(td);

                switch (j) {

                    case 6:

                        td.style.padding = "2px";

                        var btn = document.createElement("button");
                        btn.innerHTML = "Edit";
                        btn.className = "blue";
                        btn.style.minHeight = "40px";
                        btn.style.minWidth = "120px";
                        btn.style.fontWeight = "normal";
                        btn.setAttribute("username", usernames[i]);

                        btn.onclick = function () {

                            if (this.className.match(/gray/i))
                                return;

                            user.editUser(window.parent.document.body, user.users[this.getAttribute("username")]);

                        }

                        td.appendChild(btn);

                        break;

                    case 7:

                        if (user.getCookie("username") != usernames[i]) {

                            td.style.padding = "2px";

                            var btn = document.createElement("button");
                            btn.innerHTML = "Block";
                            btn.className = (user.users[usernames[i]].active ? "red" : "gray");
                            btn.style.minHeight = "40px";
                            btn.style.minWidth = "120px";
                            btn.style.fontWeight = "normal";
                            btn.setAttribute("username", usernames[i]);

                            btn.onclick = function () {

                                if (this.className.match(/gray/i))
                                    return;

                                user.processingData = {
                                    username: this.getAttribute("username"),
                                    userId: user.getCookie("username"),
                                    token: user.getCookie("token")
                                };

                                user.showConfirmMsg("Do you really want to block this user?", "Confirm User Block",
                                        "javascript:user.processMessage('" + user.settings.userBlockPath + "')");

                            }

                            td.appendChild(btn);

                        }

                        break;

                    case 8:

                        if (user.getCookie("username") != usernames[i]) {

                            td.style.padding = "2px";

                            var btn = document.createElement("button");
                            btn.innerHTML = "Activate";
                            btn.className = (user.users[usernames[i]].active ? "gray" : "green");
                            btn.style.minHeight = "40px";
                            btn.style.minWidth = "120px";
                            btn.style.fontWeight = "normal";
                            btn.setAttribute("username", usernames[i]);

                            btn.onclick = function () {

                                if (this.className.match(/gray/i))
                                    return;

                                user.processingData = {
                                    username: this.getAttribute("username"),
                                    userId: user.getCookie("username"),
                                    token: user.getCookie("token")
                                };

                                user.showConfirmMsg("Do you really want to activate this user?", "Confirm User Activation",
                                        "javascript:user.processMessage('" + user.settings.userActivatePath + "')");

                            }

                            td.appendChild(btn);

                        }

                        break;

                }

            }

        }

    },

    processingData: {},

    processMessage: function (path, data) {

        if (!data)
            data = user.processingData;

        user.ajaxPostRequest(path, data, function (response) {

            var json = JSON.parse(response);

            user.showMsg(json.message);

            if (user.$("user.content")) {

                user.loadUsers(user.settings.usersListingPath, user.$("user.content"));

            }

        })

    },

    init: function (settingsPath, target, updateURL) {

        this.action = updateURL;

        this.target = target;

        if (typeof settingsPath != undefined) {

            this.ajaxRequest(settingsPath, function (settings) {

                user.settings = JSON.parse(settings);

                if (user.getCookie("token").trim().length <= 0) {

                    user.login();

                } else {

                    user.ajaxRequest(user.settings.loginStatusCheckPath + user.getCookie("token"), function (data) {

                        var json = JSON.parse(data);

                        if (!json.loggedIn) {

                            user.login();

                        }

                        user.roles = [];

                        if (user.getCookie("roles").trim().length > 0) {

                            user.roles = JSON.parse(user.getCookie("roles"));

                        }

                    })

                }

            })

        }

    }

});