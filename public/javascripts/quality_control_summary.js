var dts_expiry_date = "";
var test_kit_expiry_date = "";

var timers = {}

function verticalText(text, parent) {

    if (!parent)
        return;

    var div = document.createElement("div");
    div.style.height = "120px";
    div.style.fontSize = "14px";
    div.style.width = "30px";
    div.style.marginLeft = "auto"

    parent.appendChild(div);

    var child = document.createElement("div");
    child.style.transform = "rotate(-90deg)";
    child.style.transformOrigin = "right bottom 0";
    child.style.marginLeft = "-65px";

    child.innerHTML = text;

    div.appendChild(child);

}

function showQualityControlTestSummary() {

    var tstControl = __$('inputFrame' + tstCurrentPage)
    tstControl.style.overflow = "auto";
    tstControl.innerHTML = "";

    var table = document.createElement("table");

    table.style.borderCollapse = "collapse";
    table.style.margin = "auto";
    table.style.top = "15%";
    table.style.color = "#333";
    table.cellPadding = "10px";
    table.border = 0;
    table.style.width = "98%";
    table.style.margin = "auto";

    tstControl.appendChild(table);

    //First Row

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("th");
    td.setAttribute("rowspan", "3");
    td.style.textAlign = "center";
    td.style.borderRight = "2px solid black";
    td.style.borderBottom = "2px solid black";
    td.style.borderTop = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("th");
    td.setAttribute("rowspan", "3");
    td.style.textAlign = "center";
    td.style.borderRight = "2px solid black";
    td.style.borderBottom = "2px solid black";
    td.style.borderTop = "2px solid black";
    td.innerHTML = "<b>Test Kit Type</b>";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = "<b>DTS Sample</b>";
    td.style.textAlign = "center";
    td.setAttribute("colspan", "3");
    td.style.borderRight = "2px solid black";
    td.style.borderRight = "2px solid black";
    td.style.borderTop = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("th");
    td.innerHTML = "&nbsp;";
    td.style.textAlign = "center";
    td.setAttribute("colspan", "7");
    td.style.borderRight = "2px solid black";
    td.style.borderTop = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.setAttribute("colspan", "3");
    td.style.textAlign = "center";
    td.innerHTML = "<b>Interpretation</b>";
    td.style.textAlign = "center";
    td.style.borderRight = "2px solid black";
    td.style.borderTop = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.rowSpan = "3"
    td.style.textAlign = "center";
    td.style.textAlign = "center";
    td.style.borderLeft = "2px solid black";
    td.style.borderTop = "2px solid black";
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    ///Row 2
    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.innerHTML = "Name";
    td.setAttribute("rowspan", "2");
    td.style.textAlign = "center";
    td.style.borderRight = "1px solid black";
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.innerHTML = "Lot";
    td.setAttribute("rowspan", "2");
    td.style.textAlign = "center";
    td.style.borderRight = "1px solid black";
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "2px solid black"
    td.innerHTML = "Exipiry Date";
    td.style.textAlign = "center";
    td.setAttribute("rowspan", "2");
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "1px solid black"
    td.innerHTML = "Lot";
    td.style.textAlign = "center";
    td.setAttribute("rowspan", "2");
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "1px solid black"
    td.innerHTML = "Exipiry Date";
    td.style.textAlign = "center";
    td.setAttribute("rowspan", "2");
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "1px solid black"
    td.innerHTML = "Control Line Seen";
    td.style.textAlign = "center";
    td.setAttribute("rowspan", "2");
    td.setAttribute("colspan", "2");
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "1px solid black"
    td.innerHTML = "Result";
    td.style.textAlign = "center";
    td.setAttribute("colspan", "3");
    td.style.borderRight = "2px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "1px solid black"
    td.setAttribute("colspan", "2");
    td.innerHTML = "Outcome";
    td.style.textAlign = "center";
    td.style.borderRight = "1px solid black";

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "1px solid black";
    td.setAttribute("rowspan", "2");
    td.innerHTML = "Specify <u>Suspect Cause </u> and <u>Corrective Action</u>  for Not Acceptable Result";
    td.style.textAlign = "center";
    td.style.borderRight = "1px solid black";
    td.style.borderBottom = "2px solid black";

    tr.appendChild(td);

    //row 3

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");
    td.style.textAlign = "center";
    td.style.borderBottom = "2px solid black";

    verticalText("Negative", td);

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.textAlign = "center";
    td.style.borderBottom = "2px solid black";

    verticalText("Weak Positive", td);

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.borderRight = "2px solid black";
    td.style.borderBottom = "2px solid black";
    td.style.textAlign = "center";

    verticalText("Strong Positive", td);

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.textAlign = "center";
    td.style.borderBottom = "2px solid black";

    verticalText("Acceptable", td);

    tr.appendChild(td);

    var td = document.createElement("td");
    td.style.textAlign = "center";
    td.style.borderRight = "1px solid black";
    td.style.borderBottom = "2px solid black";

    verticalText("Not Acceptable", td);

    tr.appendChild(td);

    //Row 4 and 5

    var selections = (__$("data.test_kit_name").getAttribute("tstValue") != null ?
        __$("data.test_kit_name").getAttribute("tstValue") : "").split(";");

    for (var i = 0; i < selections.length * 2; i++) {

        var tr = document.createElement("tr");

        table.appendChild(tr);

        if(i % 2 == 0) {

            var td = document.createElement("td");
            td.style.borderRight = "2px solid black";
            td.style.borderBottom = "2px solid black";
            td.setAttribute("rowspan", "2");

            tr.appendChild(td);

            var td = document.createElement("td");
            td.innerHTML = selections[(i < 2 ? 0 : 1)];
            td.setAttribute("rowspan", "2");
            td.style.textAlign = "center";
            td.style.borderRight = "2px solid black";
            td.style.borderBottom = "2px solid black";

            tr.appendChild(td);

        }

        var td = document.createElement("td");
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$("data.dts_name" + (1 + (i % 2 == 0 ? 1 : 0))).value;
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$("data.dts_" + (1 + (i % 2 == 0 ? 1 : 0)) + "_lot_number").value;
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$("data.dts_" + (1 + (i % 2 == 0 ? 1 : 0)) + "_expiry_date").value;
        td.style.borderBottom = "2px solid black";
        td.style.borderRight = "2px solid black";
        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$("data.test_kit" + (i < 2 ? 1 : 2) + "_lot_number").value;
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$("data.test_kit" + (i < 2 ? 1 : 2) + "_expiry_date").value;
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var control_line_seen = __$("data.control_" + (i + 1) + "_line_seen").value

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (control_line_seen.trim().toLowerCase().match(/no/i) ? "red" : "#f0f0f0") + ";'> N </div>";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (control_line_seen.trim().toLowerCase().match(/yes/i) ? "red" : "#f0f0f0") + "'> Y </div>";
        td.style.borderRight = "1px solid black";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var result = __$("data.result_" + (i + 1)).value

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (result.trim().toLowerCase().match(/negative/i) ? "red" : "#f0f0f0") + "'> - </div>";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (result.trim().toLowerCase().match(/weak positive/i) ? "red" : "#f0f0f0") + "'> + </div>";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        td.style.fontSize = "1.2em";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (result.trim().toLowerCase().match(/strong positive/i) ? "red" : "#f0f0f0") + "'> + </div>";
        td.style.borderRight = "2px solid black";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var outcome = __$("data.outcome_" + (i + 1)).value;

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (outcome.trim().toLowerCase() == "acceptable" ? "red" : "#f0f0f0") + "'> A </div>";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.textAlign = "center";
        td.innerHTML = "<div style='padding : 0.5em ; width : 24px ; height : 24px; border-radius: 50%; margin: auto; border: 2px solid " +
            (outcome.trim().toLowerCase() == "not acceptable" ? "red" : "#f0f0f0") + "'> NA </div>";
        td.style.borderRight = "1px solid black";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.innerHTML = __$("data.interpretation_" + (i + 1)).value ? __$("data.interpretation_" + (i + 1)).value : "";
        td.style.borderRight = "2px solid black";
        td.style.borderBottom = "2px solid black";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "2px solid black";
        tr.appendChild(td);

    }

}

function setExpiryDate(date_string, field) {

    if (date_string.length > 0) {

        var date_string = date_string.match(/\b\d+\/[A-Za-z]{3}\/\d{4}\b/)[0];

        __$(field).value = date_string;

    }

}

function activateYesNo(yes, no) {

    __$(yes).className = "blue";

    __$(no).className = "blue";

}

function loadQualityTestControl() {

    var tstControl = __$('inputFrame' + tstCurrentPage)
    tstControl.innerHTML = "";

    var table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.margin = "auto";
    table.style.top = "15%";
    table.style.color = "#333";
    table.cellPadding = "10px";
    table.border = 0;
    table.style.width = "98%";
    table.style.margin = "auto";

    tstControl.appendChild(table);

    var selections = (__$("data.test_kit_name").getAttribute("tstValue") != null ?
        __$("data.test_kit_name").getAttribute("tstValue") : "").split(";");

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var th = document.createElement("th");
    th.style.borderRight = "1px solid black";
    th.style.borderBottom = "1px solid black";
    th.rowSpan = "2";
    th.innerHTML = ""

    tr.appendChild(th);

    var th = document.createElement("th");
    th.style.borderRight = "1px solid black";
    th.style.borderBottom = "1px solid black";
    th.innerHTML = "Test Kit Type"
    th.rowSpan = "2"

    tr.appendChild(th);

    var th = document.createElement("th");
    th.style.borderRight = "1px solid black";
    th.style.borderBottom = "1px solid black";
    th.innerHTML = "Sample Type"
    th.rowSpan = "2"

    tr.appendChild(th);

    var td = document.createElement("th");
    td.innerHTML = "Timer";
    td.rowSpan = "2";
    td.style.borderBottom = "1px solid black";
    td.style.borderRight = "1px solid black";

    tr.appendChild(td);

    var td = document.createElement("th");
    td.innerHTML = "Control Line seen";
    td.style.borderBottom = "1px solid black";
    td.style.borderRight = "1px solid black";
    td.rowSpan = "2";
    td.colSpan = "2";

    tr.appendChild(td);

    var td = document.createElement("th");
    td.style.borderRight = "1px solid black";
    td.innerHTML = "Result";
    td.colSpan = "3"

    tr.appendChild(td);

    var th = document.createElement("th");
    th.style.borderBottom = "1px solid black";
    th.rowSpan = "2";
    th.innerHTML = ""

    tr.appendChild(th);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("th");
    td.innerHTML = "Negative";
    td.style.borderBottom = "1px solid black";

    tr.appendChild(td);

    var td = document.createElement("th");
    td.style.borderBottom = "1px solid black";
    td.innerHTML = "Weak Positive";

    tr.appendChild(td);

    var td = document.createElement("th");
    td.style.borderBottom = "1px solid black";
    td.style.borderRight = "1px solid black";
    td.innerHTML = "Strong Positive";

    tr.appendChild(td);

    for(var i = 0; i < selections.length; i++) {

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");
        td.innerHTML = "";
        td.style.borderRight = "1px solid black";
        td.style.borderBottom = "1px solid black";
        td.rowSpan = "2";

        tr.appendChild(td);

        var th = document.createElement("th");
        th.innerHTML = selections[i];
        th.rowSpan = "2";
        th.style.borderRight = "1px solid black";

        tr.appendChild(th);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$('data.dts_name1').value ? __$('data.dts_name1').value : "";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.padding = "0.3em";
        td.style.textAlign = "center";
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black";

        tr.appendChild(td);

        var div = document.createElement("div");
        div.style.border = "1px solid #366496";
        div.style.borderRadius = "0%";
        div.style.width = "90%";
        div.id = "timer_" + (1 + (2 * i)) + "";
        div.style.height = "100%";
        div.style.margin = "auto";
        div.style.textAlign = "center";
        div.style.verticalAlign = "middle";
        div.innerHTML = "Start";
        div.setAttribute("onclick", "startTimer('timer_" + (1 + (2 * i)) + "'); activateYesNo('yes_" + (1 + (2 * i)) + "','no_" + (1 + (2 * i)) + "')");
        div.style.fontSize = "1.8em";
        div.style.color = "#3c60b1";
        div.style.backgroundColor = "#fff";
        div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

        td.appendChild(div);

        var td = document.createElement("th");
        td.style.borderBottom = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "no_" + (1 + (2 * i)) + ""
        button.setAttribute("onclick", " updateResult('data.control_" + (1 + (2 * i)) + "_line_seen','No','no_" +
            (1 + (2 * i)) + "',['yes_" + (1 + (2 * i)) + "','strong_positive_" + (1 + (2 * i)) + "','weak_positive_" +
            (1 + (2 * i)) + "','negative_" + (1 + (2 * i)) + "'],'timer_" + (1 + (2 * i)) + "')");
        button.innerHTML = "N";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "yes_" + (1 + (2 * i)) + ""
        button.innerHTML = "Y";
        button.setAttribute("onclick", " updateResult('data.control_" + (1 + (2 * i)) + "_line_seen','Yes','yes_" +
            (1 + (2 * i)) + "',['no_" + (1 + (2 * i)) + "','strong_positive_" + (1 + (2 * i)) + "','weak_positive_" +
            (1 + (2 * i)) + "','negative_" + (1 + (2 * i)) + "'],'timer_" + (1 + (2 * i)) + "')");

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "negative_" + (1 + (2 * i)) + ""
        button.setAttribute("onclick", " updateResult('data.result_" + (1 + (2 * i)) + "','Negative','negative_" +
            (1 + (2 * i)) + "',['weak_positive_" + (1 + (2 * i)) + "','strong_positive_" + (1 + (2 * i)) + "'],null);" +
            " setOutcomes(" + (1 + (2 * i)) + ")");
        button.innerHTML = "-";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "weak_positive_" + (1 + (2 * i)) + ""
        button.setAttribute("onclick", " updateResult('data.result_" + (1 + (2 * i)) + "','Negative Positive'," +
            "'weak_positive_" + (1 + (2 * i)) + "',['strong_positive_" + (1 + (2 * i)) + "','negative_" + (1 + (2 * i)) +
            "'],null);setOutcomes(" + (1 + (2 * i)) + ")");
        button.innerHTML = "+";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black"
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "strong_positive_" + (1 + (2 * i)) + "";
        button.setAttribute("onclick", " updateResult('data.result_" + (1 + (2 * i)) + "','Strong Positive'," +
            "'strong_positive_" + (1 + (2 * i)) + "',['weak_positive_" + (1 + (2 * i)) + "','negative_" + (1 + (2 * i)) +
            "'],null);setOutcomes(" + (1 + (2 * i)) + ")");
        button.innerHTML = "<font style= 'font-size:1.5em'>+</font>"

        td.appendChild(button);

        var td = document.createElement("td");
        td.innerHTML = "";
        td.style.borderBottom = "1px solid black";

        tr.appendChild(td);

        var tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid black";

        table.appendChild(tr);

        var td = document.createElement("td");
        td.innerHTML = "";
        td.style.borderRight = "1px solid black";
        td.style.borderBottom = "1px solid black";

        // tr.appendChild(td);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black";
        td.innerHTML = __$('data.dts_name2').value ? __$('data.dts_name2').value : "";

        tr.appendChild(td);

        var td = document.createElement("td");
        td.style.padding = "0.3em";
        td.style.textAlign = "center";
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black";

        tr.appendChild(td);

        var div = document.createElement("div");
        div.style.border = "1px solid #366496";
        div.style.borderRadius = "0%";
        div.style.width = "90%";
        div.id = "timer_" + (2 + (2 * i)) + "";
        div.style.height = "100%";
        div.style.margin = "auto";
        div.style.textAlign = "center";
        div.style.verticalAlign = "middle";
        div.innerHTML = "Start";
        div.setAttribute("onclick", "startTimer('timer_" + (2 + (2 * i)) + "');activateYesNo('yes_" + (2 + (2 * i)) +
            "','no_" + (2 + (2 * i)) + "')");
        div.style.fontSize = "1.8em";
        div.style.color = "#3c60b1";
        div.style.backgroundColor = "#fff";
        div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

        td.appendChild(div);

        var td = document.createElement("th");
        td.style.borderBottom = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "no_" + (2 + (2 * i)) + "";
        button.setAttribute("onclick", " updateResult('data.control_" + (2 + (2 * i)) + "_line_seen','No','no_" +
            (2 + (2 * i)) + "',['yes_" + (2 + (2 * i)) + "','strong_positive_" + (2 + (2 * i)) + "','weak_positive_" +
            (2 + (2 * i)) + "','negative_" + (2 + (2 * i)) + "'],'timer_" + (2 + (2 * i)) + "')");
        button.innerHTML = "N";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "yes_" + (2 + (2 * i)) + "";
        button.setAttribute("onclick", " updateResult('data.control_" + (2 + (2 * i)) + "_line_seen','Yes','yes_" +
            (2 + (2 * i)) + "',['no_" + (2 + (2 * i)) + "','strong_positive_" + (2 + (2 * i)) + "','weak_positive_" +
            (2 + (2 * i)) + "','negative_" + (2 + (2 * i)) + "'],'timer_" + (2 + (2 * i)) + "')");
        button.innerHTML = "Y";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "negative_" + (2 + (2 * i)) + "";
        button.setAttribute("onclick", " updateResult('data.result_" + (2 + (2 * i)) + "','Negative','negative_" +
            (2 + (2 * i)) + "',['weak_positive_" + (2 + (2 * i)) + "','strong_positive_" + (2 + (2 * i)) + "'],null);" +
            "setOutcomes(" + (2 + (2 * i)) + ")");
        button.innerHTML = "-";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "weak_positive_" + (2 + (2 * i)) + "";
        button.setAttribute("onclick", " updateResult('data.result_" + (2 + (2 * i)) + "','Weak Positive','weak_positive_" +
            (2 + (2 * i)) + "',['strong_positive_" + (2 + (2 * i)) + "','negative_" + (2 + (2 * i)) + "'],null);" +
            "setOutcomes(" + (2 + (2 * i)) + ")");
        button.innerHTML = "+";

        td.appendChild(button);

        var td = document.createElement("td");
        td.style.borderBottom = "1px solid black";
        td.style.borderRight = "1px solid black"
        td.style.textAlign = "center";

        tr.appendChild(td);

        var button = document.createElement("button");
        button.className = "gray";
        button.id = "strong_positive_" + (2 + (2 * i)) + "";
        button.setAttribute("onclick", " updateResult('data.result_" + (2 + (2 * i)) + "','Strong Positive'," +
            "'strong_positive_" + (2 + (2 * i)) + "',['weak_positive_" + (2 + (2 * i)) + "','negative_" + (2 + (2 * i)) +
            "'],null);setOutcomes(" + (2 + (2 * i)) + ")");

        button.innerHTML = "<font style= 'font-size:1.5em'>+</font>"

        td.appendChild(button);

        var td = document.createElement("td");
        td.innerHTML = "";
        td.style.borderBottom = "1px solid black";

        tr.appendChild(td);

        __$("nextButton").className = __$("nextButton").className.replace(/blue|green/i, "gray");

        var nexButtonIterval = setInterval(function () {

            if (__$('nextButton').className.match("gray")) {

                var fals = 0

                for (var i = 1; i < 3; i++) {

                    if (!__$("data.result_" + i).value) {

                        fals++;
                    }

                }

                if (fals == 0) {

                    __$("nextButton").className = __$("nextButton").className.replace(/gray/i, "green");

                }

            } else {

                clearInterval(nexButtonIterval);

            }

        }, 100)

    }

}

function startTimer(button) {

    __$(button).innerHTML = "<font style= 'font-weight: bold; font-size : 1.0em'>00:00</font>"

    __$(button).removeAttribute("onclick");

    if (!timers[button]) {

        timers[button] = {minutes: 0, seconds: 0, progress: true}
    }

    var timerInterval = setInterval(function () {

        if (timers[button].progress) {

            timers[button].seconds++;

            if (timers[button].seconds == 60) {

                timers[button].minutes++;

                timers[button].seconds = 0

            }

            if (__$(button) != null) {

                __$(button).innerHTML = "<font style= 'font-weight: bold; font-size : 1.0em'>" +
                    padZeros(timers[button].minutes, 2) + ":" + padZeros(timers[button].seconds, 2) + "</font>"

            }


        } else {

            clearInterval(timerInterval);

        }


    }, 1000)

}


function updateResult(field, value, buttonActivate, buttonActivates, timer) {

    var resultField = __$(field);

    resultField.value = value;

    if (timers[timer] && timers[timer].progress)
        __$("data." + timer).value = timers[timer].minutes + ":" + timers[timer].seconds;

    if (timer && timers[timer])
        timers[timer].progress = false;

    __$(buttonActivate).className = "green";

    for (var i = 0; i < buttonActivates.length; i++) {

        var button = __$(buttonActivates[i]);

        button.className = "blue";


    }

}

function setOutcomes(i) {

    var dts = __$("data.dts_name" + (i > 2 ? (i - 2) : i)).value;

    var result = __$("data.result_" + i).value;

    var selections = (__$("data.test_kit_name").getAttribute("tstValue") != null ?
        __$("data.test_kit_name").getAttribute("tstValue") : "").split(";");

    if ((dts.trim().toLowerCase().match(/positive/i) && result.trim().toLowerCase().match(/positive/i)) ||
        (dts.trim().toLowerCase().match(/negative/i) && result.trim().toLowerCase().match(/negative/i) )) {

        __$("data.outcome_" + i).value = "Acceptable";

        __$("data.interpretation_" + i).setAttribute("condition", false);

    } else {

        __$("data.outcome_" + i).value = "Not Acceptable";

        __$("data.interpretation_" + i).setAttribute("condition", true);

        __$("data.interpretation_" + i).setAttribute("helpText", "Comment on " + dts + " outcome for " + selections[(i % 2 == 0 ? 1 : 0)]);

        window.parent.quality.showMsg(dts + " with result of " + result + " is Not Acceptable", "Quality Control Outcome");
    }

}

function setSecondDTS(field) {

    var exceptions = encodeURIComponent('["' + __$('touchscreenInput' + tstCurrentPage).value + '"]');

    __$(field).setAttribute('ajaxURL', '/stock/stock_items?category=Dts' + "&exceptions=" + exceptions + "&description="
        + encodeURIComponent("Quality Control") + '&item_name=');


}
