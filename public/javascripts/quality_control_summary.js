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

	var td = document.createElement("th");

	tr.appendChild(td);

	td.setAttribute("rowspan","3");

	td.style.textAlign= "center";

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.borderTop= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML ="<b>DTS Sample</b>";

	td.style.textAlign= "center";

	td.setAttribute("colspan", "3");

	td.style.borderRight= "2px solid black";

	td.style.borderRight= "2px solid black";

	td.style.borderTop= "2px solid black";



	var td = document.createElement("th");

	tr.appendChild(td);

	td.innerHTML = "Test Kit Evaluated : "+ __$("data.test_kit_name").value ? __$("data.test_kit_name").value  : "";

	td.style.textAlign= "center";

	td.setAttribute("colspan", "7");

	td.style.borderRight= "2px solid black";

	td.style.borderTop= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.setAttribute("colspan", "3");

	td.style.textAlign = "center";

	td.innerHTML ="<b>Interpretation</b>";

	td.style.textAlign= "center";

	td.style.borderRight= "2px solid black";

	td.style.borderTop= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.rowSpan = "3"

	td.style.textAlign = "center";

	td.style.textAlign = "center";

	td.style.borderLeft = "2px solid black";

	td.style.borderTop = "2px solid black";

	td.style.borderBottom = "2px solid black";



	///Row 2
	var tr = document.createElement("tr");

	table.appendChild(tr);

	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML = "Name";

	td.setAttribute("rowspan","2");

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";



	var td = document.createElement("td");

	tr.appendChild(td);

	td.innerHTML = "Lot";

	td.setAttribute("rowspan","2");

	td.style.textAlign= "center";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black"

	td.innerHTML = "Exipiry Date";

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

	td.style.textAlign = "center";

	td.style.borderBottom= "2px solid black";

	verticalText("Negative",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.textAlign = "center";

	td.style.borderBottom= "2px solid black";

	verticalText("Weak Positive",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.borderRight= "2px solid black";

	td.style.borderBottom= "2px solid black";

	td.style.textAlign = "center";

	verticalText("Strong Positive",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.textAlign = "center";

	td.style.borderBottom= "2px solid black";

	verticalText("Acceptable",td);


	var td = document.createElement("td");

	tr.appendChild(td);

	td.style.textAlign = "center";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom= "2px solid black";

	verticalText("Not Acceptable",td);


	//Row 4 and 5

	for(var i = 1 ; i < 3 ; i++){

		var tr = document.createElement("tr");

		table.appendChild(tr);


		var td  = document.createElement("td");

		td.style.borderRight = "2px solid black";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.borderRight = "1px solid black";

		td.innerHTML = __$("data.dts_name"+i).value;

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.borderRight = "1px solid black";

		td.innerHTML = __$("data.dts_"+i+"_lot_number").value;

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.borderRight = "1px solid black";

		td.innerHTML = __$("data.dts_"+i+"_expiry_date").value;

		td.style.borderBottom = "2px solid black";

		td.style.borderRight= "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.borderRight = "1px solid black";

		td.innerHTML = __$("data.test_kit_lot_number").value;

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.borderRight = "1px solid black";

		td.innerHTML = __$("data.test_kit_expiry_date").value;

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var control_line_seen = __$("data.control_"+i+"_line_seen").value


		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.innerHTML =control_line_seen.trim().toLowerCase().match(/no/i) ?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> N </span>" : " N ";


		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.innerHTML =control_line_seen.trim().toLowerCase().match(/yes/i) ?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> Y </span>" : " Y ";

		td.style.borderRight = "1px solid black";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var result = __$("data.result_"+i).value


		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.innerHTML = result.trim().toLowerCase().match(/negative/i) ?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> - </span>" : " - ";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.innerHTML = result.trim().toLowerCase().match(/weak positive/i) ?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> + </span>" : " + ";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);
		

		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.style.fontWeight = "bold";

		td.style.fontSize = "1.2em";

		td.innerHTML = result.trim().toLowerCase().match(/strong positive/i) ?  "<span style='border: 2px solid #ff5050 ; padding : 0.3em ; width : 18px ; height : 15px; border-radius: 50%; font-size:1.2em; font-weight:bold'> + </span>" : " + ";

		td.style.borderRight = "2px solid black";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var outcome = __$("data.outcome_"+i).value;


		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.innerHTML = outcome.trim().toLowerCase()=="acceptable" ?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%;'> A </span>" : " A ";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.textAlign = "center";

		td.innerHTML = outcome.trim().toLowerCase()=="not acceptable" ?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%;'> NA </span>" : " NA ";

		td.style.borderRight = "1px solid black";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.innerHTML = __$("data.interpretation_"+i).value ?  __$("data.interpretation_"+i).value : "";

		td.style.borderRight = "2px solid black";

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);


		var td  = document.createElement("td");

		td.style.borderBottom = "2px solid black";

		tr.appendChild(td);

	}



}

function setExpiryDate(date_string,field){

        if(date_string.length > 0){

            var date_string = date_string.match(/\b\d+\/[A-Za-z]{3}\/\d{4}\b/)[0];

            __$(field).value = date_string;

         }

}

function activateYesNo(yes,no){

	__$(yes).className = "blue";

	__$(no).className = "blue";

}

function loadQualityTestControl(){

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


	var tr = document.createElement("tr");

	table.appendChild(tr);

	var th = document.createElement("th");

	tr.appendChild(th);

	th.style.borderRight = "1px solid black";

	th.style.borderBottom = "1px solid black";

	th.rowSpan = "3";

	th.innerHTML = ""



	var th = document.createElement("th");

	tr.appendChild(th);

	th.style.borderRight = "1px solid black";

	th.style.borderBottom = "1px solid black";

	th.innerHTML = "Sample Type"

	th.rowSpan = "3"


	var th = document.createElement("th");

	tr.appendChild(th);

	th.innerHTML = "Test Kit Evaluated : "+ __$("data.test_kit_name").value ? __$("data.test_kit_name").value  : "";

	th.colSpan = "6"

	th.style.borderRight = "1px solid black";


	var th = document.createElement("th");

	tr.appendChild(th);

	th.style.borderBottom = "1px solid black";

	th.rowSpan = "3";

	th.innerHTML = ""


	var tr = document.createElement("tr");

	table.appendChild(tr);


	var td = document.createElement("th");	

	td.innerHTML= "Timer";

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black";

	td.rowSpan = "2";

	tr.appendChild(td);


	var td = document.createElement("th");	

	td.innerHTML= "Control Line seen";

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black";

	td.rowSpan = "2";

	td.colSpan = "2";

	tr.appendChild(td);

	var td = document.createElement("th");	

	td.style.borderRight = "1px solid black";

	td.innerHTML= "Result";

	td.colSpan = "3"

	tr.appendChild(td);



	var tr = document.createElement("tr");

	table.appendChild(tr);

	var td = document.createElement("th");	

	verticalText("Negative",td);

	td.style.borderBottom = "1px solid black";

	tr.appendChild(td);

	var td = document.createElement("th");	

	td.style.borderBottom = "1px solid black";

	verticalText("Weak Positive",td);

	tr.appendChild(td);


	var td = document.createElement("th");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight= "1px solid black";

	verticalText("Strong Positive",td);

	tr.appendChild(td);



	var tr = document.createElement("tr");

	table.appendChild(tr);

	var td = document.createElement("td");	

	td.innerHTML= "";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom = "1px solid black";

	tr.appendChild(td);

	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black";

	td.innerHTML=  __$('data.dts_name1').value ? __$('data.dts_name1').value : "";

	tr.appendChild(td);


	var td = document.createElement("td");

    tr.appendChild(td);

    td.style.padding = "0.3em";

    td.style.textAlign = "center";

    td.style.borderBottom = "1px solid black";

    td.style.borderRight = "1px solid black";

    var div = document.createElement("div");

    div.style.border = "1px solid #366496";

    div.style.borderRadius = "0%";

    div.style.width = "90%";

    div.id = "timer_1";

    div.style.height = "100%";

    div.style.margin = "auto";

    div.style.textAlign = "center";

    div.style.verticalAlign = "middle";

    div.innerHTML = "Start";

    div.setAttribute("onclick","startTimer('timer_1'); activateYesNo('yes_1','no_1')");

    div.style.fontSize = "1.8em";

    div.style.color = "#3c60b1";

    div.style.backgroundColor = "#fff";

    div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

    td.appendChild(div);


	var td = document.createElement("th");	

	td.style.borderBottom = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "no_1"

	button.setAttribute("onclick"," updateResult('data.control_1_line_seen','No','no_1',['yes_1','strong_positive_1','weak_positive_1','negative_1'],'timer_1')");

	button.innerHTML = "N";

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "yes_1"

	button.innerHTML = "Y";

	button.setAttribute("onclick"," updateResult('data.control_1_line_seen','Yes','yes_1',['no_1','strong_positive_1','weak_positive_1','negative_1'],'timer_1')");

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "negative_1"

	button.setAttribute("onclick"," updateResult('data.result_1','Negative','negative_1',['weak_positive_1','strong_positive_1'],null);setOutcomes(1)");

	button.innerHTML = "-";

	td.appendChild(button);
	

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "weak_positive_1"

	button.setAttribute("onclick"," updateResult('data.result_1','Negative Positive','weak_positive_1',['strong_positive_1','negative_1'],null);setOutcomes(1)");

	button.innerHTML = "+";

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black"

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "strong_positive_1";

	button.setAttribute("onclick"," updateResult('data.result_1','Strong Positive','strong_positive_1',['weak_positive_1','negative_1'],null);setOutcomes(1)");

	button.innerHTML = "<font style= 'font-size:1.5em'>+</font>"

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.innerHTML= "";

	td.style.borderBottom = "1px solid black";

	tr.appendChild(td);


	var tr = document.createElement("tr");

	table.appendChild(tr);

	var td = document.createElement("td");	

	td.innerHTML= "";

	td.style.borderRight= "1px solid black";

	td.style.borderBottom = "1px solid black";

	tr.appendChild(td);

	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black";

	td.innerHTML= __$('data.dts_name2').value ? __$('data.dts_name2').value : "";

	tr.appendChild(td);


	 var td = document.createElement("td");

     tr.appendChild(td);

     td.style.padding = "0.3em";

     td.style.textAlign = "center";

     td.style.borderBottom = "1px solid black";

     td.style.borderRight = "1px solid black";

     var div = document.createElement("div");

     div.style.border = "1px solid #366496";

     div.style.borderRadius = "0%";

     div.style.width = "90%";

     div.id = "timer_2";

     div.style.height = "100%";

     div.style.margin = "auto";

     div.style.textAlign = "center";

     div.style.verticalAlign = "middle";

     div.innerHTML = "Start";

      div.setAttribute("onclick","startTimer('timer_2');activateYesNo('yes_2','no_2')");

     div.style.fontSize = "1.8em";

     div.style.color = "#3c60b1";

     div.style.backgroundColor = "#fff";

     div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

     td.appendChild(div);


	var td = document.createElement("th");	

	td.style.borderBottom = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "no_2";

	button.setAttribute("onclick"," updateResult('data.control_2_line_seen','No','no_2',['yes_2','strong_positive_2','weak_positive_2','negative_2'],'timer_2')");

	button.innerHTML = "N";

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "yes_2";

	button.setAttribute("onclick"," updateResult('data.control_2_line_seen','Yes','yes_2',['no_2','strong_positive_2','weak_positive_2','negative_2'],'timer_2')");

	button.innerHTML = "Y";

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "negative_2";

	button.setAttribute("onclick"," updateResult('data.result_2','Negative','negative_2',['weak_positive_2','strong_positive_2'],null);setOutcomes(2)");

	button.innerHTML = "-";

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "weak_positive_2";

	button.setAttribute("onclick"," updateResult('data.result_2','Weak Positive','weak_positive_2',['strong_positive_2','negative_2'],null);setOutcomes(2)");

	button.innerHTML = "+";

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.style.borderBottom = "1px solid black";

	td.style.borderRight = "1px solid black"

	td.style.textAlign = "center";

	var button = document.createElement("button");

	button.className = "gray";

	button.id = "strong_positive_2";

	button.setAttribute("onclick"," updateResult('data.result_2','Strong Positive','strong_positive_2',['weak_positive_2','negative_2'],null);setOutcomes(2)");


	button.innerHTML = "<font style= 'font-size:1.5em'>+</font>"

	td.appendChild(button);

	tr.appendChild(td);


	var td = document.createElement("td");	

	td.innerHTML= "";

	td.style.borderBottom = "1px solid black";

	tr.appendChild(td);


	__$("nextButton").className = __$("nextButton").className.replace(/blue|green/i, "gray");


    var nexButtonIterval = setInterval(function(){

        if(__$('nextButton').className.match("gray")){

            var fals = 0

            for(var i = 1; i < 3; i++){

                if(!__$("data.result_"+i).value){

                    fals++;
                }

            }

            if(fals == 0){

               __$("nextButton").className = __$("nextButton").className.replace(/gray/i, "green");

            }



        }else{

            clearInterval(nexButtonIterval);

        }

    },100)



}

function startTimer(button){

    __$(button).innerHTML = "<font style= 'font-weight: bold; font-size : 1.0em'>00:00</font>"

    __$(button).removeAttribute("onclick");

   if(!timers[button]){

        timers[button] = {minutes : 0 , seconds : 0 , progress: true}
   }

    var timerInterval = setInterval(function (){

        if(timers[button].progress){

            timers[button].seconds++;

                if(timers[button].seconds == 60){

                    timers[button].minutes++;

                    timers[button].seconds= 0

                }

                if(__$(button) != null){

                    __$(button).innerHTML = "<font style= 'font-weight: bold; font-size : 1.0em'>" +
                                padZeros(timers[button].minutes,2) +":"+padZeros(timers[button].seconds,2) + "</font>"

                }

                

        }else{

            clearInterval(timerInterval);

        }

        

    },1000)

}


function updateResult(field,value,buttonActivate,buttonActivates,timer) {

	var resultField = __$(field);

    resultField.value = value;

    if(timers[timer] && timers[timer].progress)
         __$("data."+timer).value = timers[timer].minutes +":"+timers[timer].seconds;

    if(timer && timers[timer])
        timers[timer].progress = false;

    __$(buttonActivate).className = "green";

    for(var i = 0 ; i < buttonActivates.length ; i++){

    	var button = __$(buttonActivates[i]);

    	button.className = "blue";

 
    }

}

function setOutcomes(i){

		var dts = __$("data.dts_name"+i).value;

		var result = __$("data.result_"+i).value;

		if((dts.trim().toLowerCase().match(/positive/i) && result.trim().toLowerCase().match(/positive/i))||
			(dts.trim().toLowerCase().match(/negative/i) && result.trim().toLowerCase().match(/negative/i) )){

				__$("data.outcome_"+i).value = "Acceptable";

				__$("data.interpretation_"+i).setAttribute("condition",false);

		}else{

				__$("data.outcome_"+i).value = "Not Acceptable";

				__$("data.interpretation_"+i).setAttribute("condition",true);

				__$("data.interpretation_"+i).setAttribute("helpText", "Comment on "+ dts + " outcome" );


				window.parent.quality.showMsg(dts + " with result of "+ result +" is Not Acceptable","Quality Control Outcome");
		}

}

function setSecondDTS(field){

		var exceptions = encodeURIComponent('["' + __$('touchscreenInput' + tstCurrentPage).value + '"]');

		__$(field).setAttribute('ajaxURL', '/stock/stock_items?category=Dts' + "&exceptions=" + exceptions + "&description=" 
			+ encodeURIComponent("Quality Control") + '&item_name=');



}
