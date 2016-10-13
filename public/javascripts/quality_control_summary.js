function verticalText(text, parent) {

    if (!parent)
        return;

    var div = document.createElement("div");
    div.style.height = "120px";
    div.style.fontSize = "14px";
    div.style.width = "30px";

    parent.appendChild(div);

    var child = document.createElement("div");
    child.style.transform = "rotate(-90deg)";
    child.style.transformOrigin = "right bottom 0";
    child.style.marginLeft = "-65px";

    child.innerHTML = text;

    div.appendChild(child);

}

function showQualityControlTestSummary(){

	var tstControl = __$('inputFrame'+tstCurrentPage)

	tstControl.innerHTML = "";

	var table = document.createElement("table");

	table.style.borderCollapse = "collapse";
    table.style.margin = "auto";
    table.style.marginTop = "20px";
    table.style.color = "#333";
    table.cellPadding = "10px";
    table.border = 0;

	tstControl.appendChild(table);

	table.style.width = "98%";

	table.style.margin = "auto";

	//First Row

	var tr = document.createElement("tr");

	table.appendChild(tr);

	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>Date</b>";

	td.setAttribute("rowspan","3");

	td.style.textAlign= "center";

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>HTS Provider ID</b>";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","3");

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>Control Serum</b>";

	td.style.textAlign= "center";

	td.setAttribute("colspan", "4");

	td.style.borderRight= "2px solid black";

	td.style.borderRight= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>Test Kit Evaluated</b>";

	td.style.textAlign= "center";

	td.setAttribute("colspan", "8");

	td.style.borderRight= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.setAttribute("colspan", "3");

	td.style.textAlign = "center";

	td.innerHTML ="<b>Interpretation</b>";

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";

	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	td.innerHTML ="<b>Reviewed by Supervisor</b>";

	td.setAttribute("rowspan", "3");



	///Row 2
	var tr = document.createElement("tr");

	table.appendChild(tr);

	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML = "Lot Number";

	td.setAttribute("rowspan","2");

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.innerHTML = "Exipiry Date";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","2");

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML = "Type";

	td.style.textAlign= "center";

	td.setAttribute("colspan","2");

	td.style.borderRight= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.innerHTML = "Kit Name";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","2");

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.innerHTML = "Lot";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","2");

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.innerHTML = "Exipiry Date";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","2");

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.innerHTML = "Control Line Seen";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","2");

	td.setAttribute("colspan","2");

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.innerHTML = "Result";

	td.style.textAlign= "center";

	td.setAttribute("colspan","3");

	td.style.borderRight= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black"

	td.setAttribute("colspan","2");

	td.innerHTML = "Outcome";

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.setAttribute("rowspan","2");

	td.innerHTML = "Specify <u>Suspect Cause </u> and <u>Corrective Action</u>  for Not Acceptable Result";

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	//row 3

	var tr = document.createElement("tr");

	table.appendChild(tr);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Negative",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Positive",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Negative",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Weak Positive",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Strong Positive",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Acceptable",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Not Acceptable",td);


	//Row 4

	var tr = document.createElement("tr");

	table.appendChild(tr);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="<b>-</b>"



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="<b>+</b>"


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="<b>N</b>";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="<b>Y</b>"



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="-"


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="+"


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "16px";

	td.innerHTML ="<b>+</b>"


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="<b>A</b>";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.innerHTML ="<b>NA</b>"



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";


}