"use strict"

var user = ({

    $: function (id) {
        return document.getElementById(id);
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

            console.log(data);

            user.settings = JSON.parse(data);

        })

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

            } else if(fields[key].field_type == "password") {

                input.type = "password";

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

    login: function() {

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
                id: "data.username"
            },
            "Password": {
                field_type: "password",
                id: "data.password"
            },
            "Location": {
                field_type: "text",
                id: "data.location"
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
                "'javascript:window.parent.user.unloadChild()'; tt_cancel_show = 'javascript:window.parent.user.unloadChild()';" +
                "function submitData(){ var data = form2js(document.getElementById('data'), undefined, true); " +
                "if(window.parent) window.parent.user.submitData(data); }</script></head><body>";

            html += "<div id='content'>" + content + "</div></body>";

            var page = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

            iframe.setAttribute("src", page);

            divPanel.appendChild(iframe);

            iframe.onload = function () {

                // user.$("ifrMain").contentWindow.protocol.init(path, undefined, undefined, undefined, undefined);

            }

        }

    },

    submitData: function (data) {

        if (user.$("navPanel")) {

            document.body.removeChild(user.$("navPanel"));

        }

        data.data.userId = "admin";

        user.ajaxPostRequest(user.settings.loginPath, data, function (sid) {

            console.log(sid)

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
            if (console)
                console.log(e);
        }

    },

    init: function (settingsPath, target, updateURL) {

        this.action = updateURL;

        this.target = target;

        if (typeof settingsPath != undefined) {

            this.ajaxRequest(settingsPath, function (settings) {

                try {

                    user.settings = JSON.parse(settings);

                    // user.addUser();

                } catch (e) {

                    if (console)
                        console.log(e);

                }

            })

        }

    }

});