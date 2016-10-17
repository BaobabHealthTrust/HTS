var dts_expiry_date = "";
var test_kit_expiry_date = "";
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
    table.style.top = "15%";
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

	td.style.borderLeft= "2px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.borderTop= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>HTS Provider ID</b>";

	td.style.textAlign= "center";

	td.setAttribute("rowspan","3");

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.borderTop= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>Control Serum</b>";

	td.style.textAlign= "center";

	td.setAttribute("colspan", "4");

	td.style.borderRight= "2px solid black";

	td.style.borderRight= "2px solid black";

	td.style.borderTop= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>Test Kit Evaluated</b>";

	td.style.textAlign= "center";

	td.setAttribute("colspan", "8");

	td.style.borderRight= "2px solid black";

	td.style.borderTop= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.setAttribute("colspan", "3");

	td.style.textAlign = "center";

	td.innerHTML ="<b>Interpretation</b>";

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";

	td.style.borderTop= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.borderTop= "2px solid black";

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

	td.style.borderLeft= "2px solid black";

	td.style.padding = "1em";

	td.style.textAlign = "center";

	var test_date = new Date( __$("data.qc_testing_date").value)

	td.innerHTML = test_date.format();


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.padding = "1em";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.innerHTML = __$("data.provider_id").value;


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.padding = "1em";

	td.style.textAlign = "center";


	td.style.borderBottom= "2px solid black";

	td.innerHTML = __$("data.dts_lot_number").value;

	


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.padding = "1em";

	td.style.textAlign = "center";

	/*var expiry_date = __$("data.dts_lot_number").value.match(/\b\d{2}\/[A-Za-z]{3}\/\d{4}\b/)[0];

	__$("data.dts_expiry_date").value = expiry_date;*/

	td.innerHTML = __$("data.dts_expiry_date").value;



	var dts_type = __$("data.dts_name").value

	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.padding = "1em";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "20px";

	td.style.textAlign = "center";

	if(dts_type.match(/Negative/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.padding  = "0.8em"

		span.style.borderRadius = "50%";

		span.innerHTML = "-";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>-</b>"

	}
	



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.padding = "1em";

	td.style.fontSize= "15px";

	td.style.textAlign = "center";

	if(dts_type.match(/Positive/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.padding  = "0.8em"

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.borderRadius = "50%";

		span.innerHTML = "+";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>+</b>"

	}


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.padding = "1em";

	td.style.textAlign = "center";

	td.innerHTML = __$("data.test_kit_name").value;


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.padding = "1em";

	td.style.textAlign = "center";

	td.style.borderBottom= "2px solid black";

	td.innerHTML = __$("data.test_kit_lot_number").value;


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.padding = "1em";

	td.innerHTML = __$("data.test_kit_expiry_date").value;



	var control_line_seen =__$("data.control_line_seen").value;

	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.fontSize= "15px";

	td.style.padding = "1em";

	if(control_line_seen.match(/No/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.padding  = "0.8em"

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.borderRadius = "50%";

		span.innerHTML = "N";

		td.appendChild(span);
	} else{

		td.innerHTML ="<b>N</b>";


	}


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.style.padding = "1em";

	if(control_line_seen.match(/Yes/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.padding  = "0.8em"

		span.style.height = "30px";

		span.style.border = "2px solid black";

		span.style.borderRadius = "50%";

		span.innerHTML = "Y";

		td.appendChild(span);

	} else{

		td.innerHTML ="<b>Y</b>";
		

	}


	var result = __$("data.result").value;

	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.fontSize= "15px";

	td.style.padding = "1em";

	if(result.match(/Negative/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.padding  = "0.8em"

		span.style.borderRadius = "50%";

		span.innerHTML = "-";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>-</b>"

	}


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.fontSize= "15px";

	td.style.padding = "1em";

	if(result.match(/Weak/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.padding  = "0.8em"

		span.style.borderRadius = "50%";

		span.innerHTML = "+";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>+</b>"

	}


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.fontSize= "18px";

	td.style.padding = "1em";

	if(result.match(/Strong/i)){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.padding  = "0.5em"

		span.style.borderRadius = "50%";

		span.style.fontSize= "18px";

		span.innerHTML = "<b>+</b>";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>+</b>"

	}


	var test_out_come = __$("data.outcome").value

	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.fontSize= "15px";

	td.style.padding = "1em";

	if(test_out_come=="Acceptable"){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.padding  = "0.8em"

		span.style.borderRadius = "50%";

		span.innerHTML = "A";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>A</b>"

	}


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.fontSize= "15px";

	td.style.padding = "1em";

	if(test_out_come=="Not Acceptable"){

		var span = document.createElement("span");

		span.style.width = "30px";

		span.style.height = "30px";

		span.style.border = "2px solid red";

		span.style.padding  = "0.8em"

		span.style.borderRadius = "50%";

		span.innerHTML = "NA";

		td.appendChild(span);

	}else{

		td.innerHTML ="<b>NA</b>"

	}



	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	td.style.padding = "1em";

	td.innerHTML = __$("data.interpretation").value;


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.textAlign = "center";

	td.style.borderBottom= "2px solid black";

	td.style.padding = "1em";

	td.innerHTML = __$("data.supervisor_code").value;


}

function setExpiryDate(date_string,field){

        if(date_string.length > 0){

            var date_string = date_string.match(/\b\d{2}\/[A-Za-z]{3}\/\d{4}\b/)[0];

            __$(field).value = date_string;

           	console.log(__$(field).value);

         }

}