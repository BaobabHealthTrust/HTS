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

            if (format.match(/YYYY\-mm\-dd/)) {

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

    gender: null,

    username: null,

    name: null,

    roles: [],

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

    addUser: function () {

        var div = document.createElement("div");
        div.id = "user.div.main";

        if (this.target) {

            this.target.appendChild(div);

        } else {

            document.body.appendChild(div);

        }

        var form = document.createElement("form");
        form.action = (this.action ? this.action : "");
        form.method = "POST";

        div.appendChild(form);

        var table = document.createElement("table");

        form.appendChild(table);

        var fields = {
            "Username": {
                field_type: "text"
            },
            "Password": {
                field_type: "password",
                type: "password",
                id: "password",
                tt_onUnLoad: "__$('confirm_password').setAttribute('validationRule', __$('touchscreenInput' + tstCurrentPage).value)"
            },
            "Confirm Password": {
                field_type: "password",
                type: "password",
                id: "confirm_password",
                validationRule: "",
                validationMessage: "Password Mismatch!"
            },
            "Role(s)": {
                field_type: "select",
                multiple: "multiple",
                ajaxURL: "/roles"
            },
            "First Name": {
                field_type: "text"
            },
            "Last Name": {
                field_type: "text"
            },
            "Date of Birth": {
                field_type: "birthdate",
                estimate_field: "estimated"
            },
            "Estimated": {
                type: "hidden",
                id: "estimated"
            },
            "Gender": {
                field_type: "select",
                options: ["", "Male", "Female"]
            }
        }

        if (user.settings['hts.provider.id']) {

            fields['HTS Provider ID'] = {
                field_type: "text",
                optional: true
            }

        }

        var keys = Object.keys(fields);

        for (var i = 0; i < keys.length; i++) {

            var tr = document.createElement("tr");

            table.appendChild(tr);

            var key = keys[i];

            for (var j = 0; j < 2; j++) {

                var td = document.createElement("td");

                tr.appendChild(td);

                if (j == 0) {

                    td.innerHTML = key;

                } else {

                    var fieldType = fields[key].field_type;

                    var id = key.trim().toLowerCase().replace(/\s/, "_").replace(/\(/, "_").replace(/\)/, "_");

                    switch (fieldType) {

                        case "select":

                            var select = document.createElement("select");
                            select.id = id;
                            select.name = key;
                            select.setAttribute("helpText", key);

                            td.appendChild(select);

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

                                    attrs.splice(attrs.indexOf(exceptions[a]));

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
                            input.id = id;
                            input.name = key;
                            input.setAttribute("helpText", key);

                            td.appendChild(input);

                            var exceptions = ["helpText"]

                            var attrs = Object.keys(fields[key]);

                            for (var a = 0; a < exceptions.length; a++) {

                                if (attrs.indexOf(exceptions[a]) >= 0) {

                                    attrs.splice(attrs.indexOf(exceptions[a]));

                                }

                            }

                            if (attrs.length > 0) {

                                for (var a = 0; a < attrs.length; a++) {

                                    var attr = attrs[a];

                                    input.setAttribute(attr, fields[key][attr]);

                                }

                            }

                            break;

                    }

                }

            }

        }

        var base = document.createElement("base");
        base.href = user.settings.basePath;

        document.head.appendChild(base);

        var script = document.createElement("script");
        script.setAttribute("src", user.settings.basePath + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

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

    },

    login: function () {

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
                id: "data.location"
            }
        }

        user.buildFields(fields, table);

        user.navPanel(form.outerHTML);

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

        if (user.$("navPanel")) {

            document.body.removeChild(user.$("navPanel"));

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
                "src='" + "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js' defer></script><meta http-equiv='content-type' " +
                "content='text/html;charset=UTF-8'/><script src='/javascripts/form2js.js'></script><script language='javascript'>tstUsername = '';" +
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

    },

    submitData: function (data) {

        data.data.userId = user.getCookie("username");

        if (data.data.datatype == "changePassword") {

            user.ajaxPostRequest(user.settings.passwordUpdatePath, data.data, function (sid) {

                var json = JSON.parse(sid);

                if (user.$("navPanel")) {

                    document.body.removeChild(user.$("navPanel"));

                }

                user.showMsg(json.message, "Password Change");

            })

        } else {

            user.ajaxPostRequest(user.settings.loginPath, data.data, function (sid) {

                var json = JSON.parse(sid);

                if (user.$("navPanel")) {

                    document.body.removeChild(user.$("navPanel"));

                }

                if (Object.keys(json).indexOf("token") >= 0) {

                    user.setCookie("token", json["token"], 1);

                    user.setCookie("username", json["username"], 1);

                    user.setCookie("gender", json["gender"], 1);

                    user.setCookie("given_name", json["given_name"], 1);

                    user.setCookie("family_name", json["family_name"], 1);

                    user.setCookie("location", data.data.location, 1);

                    user.setCookie("attrs", JSON.stringify(json['attributes']), 1);

                    user.setCookie("roles", JSON.stringify(json['roles']), 1);

                    window.location = "/";

                } else {

                    if (user.getCookie("token").trim().length <= 0) {

                        user.login();

                        user.showMsg("Wrong username/password!", "Access Denied!");

                    }

                }

            })

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

            if (user.$("msg.shield")) {

                document.body.removeChild(user.$("msg.shield"));

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
        th.style.backgroundColor = "tomato";
        th.style.color = "#fff";
        th.innerHTML = topic;
        th.style.border = "2px outset tomato";

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

            if (user.$("msg.shield")) {

                document.body.removeChild(user.$("msg.shield"));

            }

        }

        tdf.appendChild(btn);

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

        for(var i = 0; i < roles.length; i++) {

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

            user.showMsg("Edit");

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

        var btnChangePassword = document.createElement("button");
        btnChangePassword.className = "blue";
        btnChangePassword.style.margin = "8px";
        btnChangePassword.style.width = "250px";
        btnChangePassword.style.cssFloat = "right";
        btnChangePassword.innerHTML = "Manage Users";

        btnChangePassword.onclick = function () {

            user.showMsg("Manage Users");

        }

        td0_1_0_0_0_0_1_0_2_0.appendChild(btnChangePassword);

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
        btnFinish.style.width = "120px";
        btnFinish.innerHTML = "Finish";

        btnFinish.onclick = function () {

            window.parent.location = "/";

        }

        nav.appendChild(btnFinish);

        var script = document.createElement("script");
        script.setAttribute("src", "/touchscreentoolkit/lib/javascripts/touchScreenToolkit.js");

        document.head.appendChild(script);

    },

    init: function (settingsPath, target, updateURL) {

        this.action = updateURL;

        this.target = target;

        if (typeof settingsPath != undefined) {

            this.ajaxRequest(settingsPath, function (settings) {

                // try {

                user.settings = JSON.parse(settings);

                if (user.getCookie("token").trim().length <= 0) {

                    user.login();

                }

            })

        }

    }

});