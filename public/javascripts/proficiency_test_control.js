var timers = {}

var repeat_test_panel = {}

var consumption =[0,0];

function getAjaxRequest(url, callback, optionalControl) {

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

}

function loadPTControl(test){

    var control = __$("inputFrame"+tstCurrentPage);

    control.innerHTML = "";

    //control.style.overflowY = "scroll";

    //control.style.overflowX = "scroll";

    var table = document.createElement("table");

    table.id="pt_table"

    control.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    table.style.borderCollapse = "collapse";

    table.style.width = "95%";

    table.style.margin = "auto";

    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Sample #";

    th.style.padding = "0.3em";

    th.style.width = "12px"

    th.rowSpan = "2";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "2px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 1 " + (__$("data.test1_kit_name").value ? ": "+__$('data.test1_kit_name').value : "");

    th.style.padding = "0.3em";

    th.colSpan = "3";

    th.style.borderRight = "2px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 2 " + (__$("data.test2_kit_name").value ? ": "+__$('data.test2_kit_name').value : "");

    th.style.padding = "0.3em";

    th.colSpan = "3";

    th.style.borderRight = "2px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Immediate Repeat?";

    th.style.padding = "0.3em";

    th.rowSpan = "2";

    th.style.borderBottom = "1px solid black";


    var tr = document.createElement("tr");

    table.appendChild(tr);


    var th = document.createElement("th");

    th.innerHTML = "Timer 1";

    th.style.borderBottom = "1px solid black";


    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Result";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "2px solid black";

    th.colSpan = "2";

    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Timer 2";

    th.style.borderBottom = "1px solid black";

    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Results";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "2px solid black";

    th.colSpan = "2";

    tr.appendChild(th)


    for(var i = 0 ; i < 5 ; i++){

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = i + 1;

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.fontWeight = "bold";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "2px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var div = document.createElement("div");

        div.style.border = "1px solid #366496";

        div.style.borderRadius = "0%";

        div.style.width = "90%";

        div.id = "timer_1_"+i;

        div.style.height = "100%";

        div.style.margin = "auto";

        div.style.textAlign = "center";

        div.style.verticalAlign = "middle";

        div.innerHTML = "Start";

        div.setAttribute("onclick","startTimer('timer_1_"+i+"')");

        div.style.fontSize = "1.8em";

        div.style.color = "#3c60b1";

        div.style.backgroundColor = "#fff";

        div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

        td.appendChild(div);

        /*var button = document.createElement("button");

        button.id = "button_start_1_"+i;

        button.innerHTML = "Start"

         button.setAttribute("onclick","startTimer('button_start_1_"+i+"')");

        td.appendChild(button);*/


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "reactive_1_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','+','timer_1_"+ i +"','reactive_1_"+i+"','non_reactive_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "2px solid black";

        var button = document.createElement("button");

        button.id = "non_reactive_1_"+i;

         button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','-','timer_1_"+ i +"','non_reactive_1_"+i+"','reactive_1_"+i+"')");

        button.innerHTML = "NR";

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var div = document.createElement("div");

        div.style.border = "1px solid #366496";

        div.style.borderRadius = "0%";

        div.style.width = "90%";

        div.id = "timer_2_"+i;

        div.style.height = "100%";

        div.style.margin = "auto";

        div.style.textAlign = "center";

        div.style.verticalAlign = "middle";

        div.innerHTML = "Start";

         div.setAttribute("onclick","startTimer('timer_2_"+i+"')");

        div.style.fontSize = "1.8em";

        div.style.color = "#3c60b1";

        div.style.backgroundColor = "#fff";

        div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

        td.appendChild(div);

        /*var button = document.createElement("button");

        button.id = "button_start_2_"+i;

        button.innerHTML = "Start";

        button.setAttribute("onclick","startTimer('button_start_2_"+i+"')");

        td.appendChild(button);*/


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "reactive_2_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','+','timer_2_"+ i +"','reactive_2_"+i+"','non_reactive_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "2px solid black";

        var button = document.createElement("button");

        button.id = "non_reactive_2_"+i;

        button.innerHTML = "NR";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','-','timer_2_"+ i +"','non_reactive_2_"+i+"','reactive_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "repeat_"+i;

        button.innerHTML = "Repeat";

        button.setAttribute("onclick","setForRepeate("+i+",'repeat_"+i+"')");

        td.appendChild(button);



    }


}


function loadRepeatPTControl(test){

    var control = __$("inputFrame"+tstCurrentPage);

    control.innerHTML = "";

    //control.style.overflowY = "scroll";

    //control.style.overflowX = "scroll";

    var table = document.createElement("table");



    control.appendChild(table);

    
    var tr = document.createElement("tr");

    table.appendChild(tr);

    table.style.borderCollapse = "collapse";

    table.style.width = "95%";

    table.style.margin = "auto";

    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Sample #";

    th.style.padding = "0.3em";

    th.style.width = "12px"

    th.rowSpan = "2";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "2px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 1 " + (__$("data.test1_kit_name").value ? ": "+__$('data.test1_kit_name').value : "");

    th.style.padding = "0.3em";

    th.colSpan = "3";

    th.style.borderRight = "2px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 2 " + (__$("data.test2_kit_name").value ? ": "+__$('data.test2_kit_name').value : "");

    th.style.padding = "0.3em";

    th.colSpan = "3";



    var tr = document.createElement("tr");

    table.appendChild(tr);


    var th = document.createElement("th");

    th.innerHTML = "Timer 1";

    th.style.borderBottom = "1px solid black";


    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Result";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "2px solid black";

    th.colSpan = "2";

    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Timer 2";

    th.style.borderBottom = "1px solid black";

    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Results";

    th.style.borderBottom = "1px solid black";

    th.colSpan = "2";

    tr.appendChild(th)


    var panel = Object.keys(repeat_test_panel);

    panel.sort();


    for(var i = 0 ; i < panel.length ; i++){

        if(repeat_test_panel[panel[i]] == false){

            continue;

        }

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = parseInt(panel[i]) + 1;
        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "2px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";


        var div = document.createElement("div");

        div.style.border = "1px solid #366496";

        div.style.borderRadius = "0%";

        div.style.width = "90%";

        div.id = "im_timer_1_"+i;

        div.style.height = "100%";

        div.style.margin = "auto";

        div.style.textAlign = "center";

        div.style.verticalAlign = "middle";

        div.innerHTML = "Start";

         div.setAttribute("onclick","startTimer('im_timer_1_"+i+"')");

        div.style.fontSize = "1.8em";

        div.style.color = "#3c60b1";

        div.style.backgroundColor = "#fff";

        div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

        td.appendChild(div);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_reactive_1_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','+','im_timer_1_"+ i +"','im_reactive_1_"+i+"','im_non_reactive_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "2px solid black";

        var button = document.createElement("button");

        button.id = "im_non_reactive_1_"+i;

         button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','-','im_timer_1_"+ i +"','im_non_reactive_1_"+i+"','im_reactive_1_"+i+"')");

        button.innerHTML = "NR";

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        var div = document.createElement("div");

        div.style.border = "1px solid #366496";

        div.style.borderRadius = "0%";

        div.style.width = "90%";

        div.id = "im_timer_2_"+i;

        div.style.height = "100%";

        div.style.margin = "auto";

        div.style.textAlign = "center";

        div.style.verticalAlign = "middle";

        div.innerHTML = "Start";

         div.setAttribute("onclick","startTimer('im_timer_2_"+i+"')");

        div.style.fontSize = "1.8em";

        div.style.color = "#3c60b1";

        div.style.backgroundColor = "#fff";

        div.style.boxShadow = "3px 1px 3px 0px rgba(0,0,0,0.75)";

        td.appendChild(div);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_reactive_2_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','+','im_timer_2_"+ i +"','im_reactive_2_"+i+"','im_non_reactive_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "0.3em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_non_reactive_2_"+i;

        button.innerHTML = "NR";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','-','im_timer_2_"+ i +"','im_non_reactive_2_"+i+"','im_reactive_2_"+i+"')");

        td.appendChild(button);



    }


}


function startTimer(button){

    __$(button).innerHTML = "<font style= 'font-weight: bold; font-size : 1.0em'>00:00</font>"

    __$(button).removeAttribute("onclick");

   if(!timers[button]){

        timers[button] = {minutes : 0 , seconds : 0 , progress: true}

        if(button.match(/timer_1_/i)){

             consumption[0]++

        }else{

            consumption[1]++
        }

       
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

function updateResult(test,result,timer, buttonActivate,buttonDeactivate) {

    var resultField = __$("data."+test);

    resultField.value = result;

    if(timers[timer])
         __$("data."+test +"_time").value = timers[timer].minutes +":"+timers[timer].seconds;

    if(timer && timers[timer])
        timers[timer].progress = false;

    if(buttonDeactivate)
        __$(buttonDeactivate).className = "blue";

    if(buttonActivate)
        __$(buttonActivate).className = "green";


}

function setForRepeate(panel,button){

    var rptButton = __$(button);

    if(rptButton.className.match(/green/i)){

        rptButton.className = "blue";

         repeat_test_panel[panel] = false;

    }
    else{

        rptButton.className = "green";

        repeat_test_panel[panel] = true;

    }

    console.log(repeat_test_panel);


}

function checkRepeatFields(){

        var condition = false;

        var repeat_keys = Object.keys(repeat_test_panel);

        for(var i = 0 ; i < repeat_keys.length ; i++){


            if(repeat_test_panel[repeat_keys[i]]){

                 condition = true;

                 return condition;

            }

        }

         return condition;

}

function setLotNumber(target, value){

    __$(target).setAttribute('ajaxURL','/stock/available_batches_to_user?userId=' + 
                            getCookie("username") + "&item_name=" + value + "&batch=")

}

function setLotExpiry(expiry){

         var lot = __$('touchscreenInput' + tstCurrentPage).value.trim();

        var date_string = lot.match(/\b\d+\/[A-Za-z]{3}\/\d{4}\b/)[0];

        if(date_string)
                __$(expiry).value = (new Date(date_string)).format("YYYY-mm-dd");

}

function loadFinalResultControl(){

    for(var i = 0 ; i < consumption.length ; i++){

        __$("data.test_"+(i + 1)+"_consumption_quantity").value = consumption[i];

    }

    var control = __$("inputFrame"+tstCurrentPage);

    control.innerHTML = "";

    control.style.overflowY = "scroll";

    //control.style.overflowX = "scroll";

    var table = document.createElement("table");

    table.style.borderCollapse = "collapse";

    table.style.width = "95%";

    table.style.margin = "auto";

    table.style.marginTop = "15px";

    control.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var th = document.createElement("th");

    th.innerHTML = "HTS Provider";

    th.colSpan = "10";

    tr.appendChild(th);


    var tr = document.createElement("tr");

    table.appendChild(tr);

    var th = document.createElement("th");

    th.innerHTML = "Test 1";

    th.colSpan = "4";

    tr.appendChild(th);


    var th = document.createElement("th");

    th.innerHTML = "Test 2";


    th.colSpan = "4";

    tr.appendChild(th);


    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("th");

    td.style.padding = "0.5em";

    td.rowSpan = "5";

    td.style.border = "1px solid black";

    // verticalText("Sample No", td);

    td.style.width = "20px";

    td.innerHTML = "Sample No."

    tr.appendChild(td);

    var td = document.createElement("td");

    td.innerHTML = "<b>Kit Name : </b>"  + __$('data.test1_kit_name').value ? __$('data.test1_kit_name').value : "" ;

    td.style.padding = "0.5em";

    td.style.border = "1px solid black"

    td.colSpan = "4";

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML =  "<b>Kit Name : </b>"  + __$('data.test2_kit_name').value ? __$('data.test2_kit_name').value : "" ;

    td.style.padding = "0.5em";

    td.colSpan = "4";

    td.style.border = "1px solid black"

    tr.appendChild(td);
    

    var td = document.createElement("td");

    td.innerHTML = "Final Result";

    td.style.padding = "0.5em";

    td.colSpan = "2";

    td.rowSpan = "5";

    td.style.border = "1px solid black"

    tr.appendChild(td);


    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");

    td.innerHTML =  "<b>Lot Number : </b>"  + __$('data.lot_number1').value ? __$('data.lot_number1').value : "" ;

    td.style.padding = "0.5em";

    td.style.border = "1px solid black"

    td.colSpan = "4";

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML = "<b>Lot Number : </b>"  + __$('data.lot_number2').value ? __$('data.lot_number2').value : "" ;

    td.style.padding = "0.5em";

    td.colSpan = "4";

    td.style.border = "1px solid black"

    tr.appendChild(td);


    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");

    td.innerHTML = "<b>Expiry Date : </b>"  + __$('data.test1_expiry_date').value ? (new Date( __$('data.test1_expiry_date').value)).format() : "" ;

    td.style.padding = "0.5em";

    td.style.border = "1px solid black"

    td.colSpan = "4";

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML = "<b>Expiry Date : </b>"  + __$('data.test2_expiry_date').value ? (new Date(__$('data.test2_expiry_date').value)).format() : "" ;

    td.style.padding = "0.5em";

    td.colSpan = "4";

    td.style.border = "1px solid black"

    tr.appendChild(td);


    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");

    td.innerHTML = "First Pass";

    td.style.padding = "0.5em";

    td.style.border = "1px solid black"

    td.colSpan = "4";

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML = "Immediate Repeat";

    td.style.padding = "0.5em";

    td.colSpan = "4";

    td.style.border = "1px solid black"

    tr.appendChild(td);


    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("td");

    td.innerHTML = "Test 1";

    td.style.padding = "0.5em";

    td.style.border = "1px solid black"

    td.colSpan = "2";

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML = "Test 2";

    td.style.padding = "0.5em";

    td.colSpan = "2";

    td.style.border = "1px solid black"

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML = "Test 1";

    td.style.padding = "0.5em";

    td.style.border = "1px solid black"

    td.colSpan = "2";

    tr.appendChild(td);


    var td = document.createElement("td");

    td.innerHTML = "Test 2";

    td.style.padding = "0.5em";

    td.colSpan = "2";

    td.style.border = "1px solid black"

    tr.appendChild(td);


    for(var i = 0 ; i < 5 ; i++){

        var tr = document.createElement("tr");

        table.appendChild(tr)

        var td = document.createElement("th");

        td.innerHTML = i + 1;

        td.style.padding = "0.5em";

        td.style.border = "1px solid black"

        tr.appendChild(td);


        var td = document.createElement("th");

        td.innerHTML = __$('data.test_1_'+ i).value == "+"?  "<span style='border: 2px solid  #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> + </span>" : "+";

        td.style.padding = "0.5em";

        td.style.borderLeft = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);

        var td = document.createElement("th");

        td.innerHTML = "-";

        td.innerHTML = __$('data.test_1_'+ i).value == "-"?  "<span style='border: 2px solid  #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> - </span>" : "-";

        td.style.padding = "0.5em";

         td.style.borderRight = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);



        var td = document.createElement("th");

        td.innerHTML = __$('data.test_2_'+ i).value == "+"?  "<span style='border: 2px solid  #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> + </span>" : "+";

        td.style.padding = "0.5em";

         td.style.borderLeft = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);

        var td = document.createElement("th");

        td.innerHTML = __$('data.test_2_'+ i).value == "-"?  "<span style='border: 2px solid  #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> - </span>" : "-";

        td.style.padding = "0.5em";

         td.style.borderRight = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);



        var td = document.createElement("th");

        td.innerHTML = __$('data.im_1_'+ i).value == "+"?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> + </span>" : "+";

        td.style.padding = "0.5em";

        td.style.borderLeft = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);

        var td = document.createElement("th");

        td.innerHTML = __$('data.im_1_'+ i).value == "-"?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> - </span>" : "-";

        td.style.padding = "0.5em";

        td.style.borderRight = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);


        var td = document.createElement("th");

        td.innerHTML = __$('data.im_2_'+ i).value == "+"?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> + </span>" : "+";

        td.style.padding = "0.5em";

        td.style.borderLeft = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);

        var td = document.createElement("th");

        td.innerHTML = __$('data.im_2_'+ i).value == "-"?  "<span style='border: 2px solid #ff5050 ; padding : 0.5em ; width : 18px ; height : 15px; border-radius: 50%'> - </span>" : "-";

        td.style.padding = "0.5em";

         td.style.borderRight = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        tr.appendChild(td);


        var td = document.createElement("th");

        td.style.borderLeft = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black"

        var button = document.createElement("button");

        button.innerHTML = "+";

        button.className = "blue";

        button.id = "result_r_"+i;

        button.setAttribute("onclick","updateFinalResult("+i+",'+', 'result_r_', 'result_nr_')");

        td.appendChild(button);

        tr.appendChild(td);

        var td = document.createElement("th");

        td.style.borderRight = "1px solid black"

        td.style.borderBottom = "1px solid black"

        td.style.borderTop = "1px solid black";

        var button = document.createElement("button");

        button.className = "blue";

        button.innerHTML = "-";

        button.id = "result_nr_"+i;

        button.setAttribute("onclick","updateFinalResult("+i+",'-', 'result_nr_', 'result_r_')");

        td.appendChild(button);

        tr.appendChild(td);

    }




}

function updateFinalResult(panel,result, activate, deactivate){

    __$('data.final_result_'+panel).value = result;

    if(activate){
        __$(activate + panel).className = "green";
    }

    if(deactivate){
        __$(deactivate + panel).className = "blue";
    }

}


function updateUserAttributes(){

    var username = __$("data.tester").value;

    window.parent.proficiency.ajaxRequest("/app_custom/user_attributes/"+username , function(data){

            var data = JSON.parse(data);

            console.log(data);

            __$('data.first_name').value = data.first_name

            __$('data.last_name').value = data.last_name

            __$('data.provider_id').value = data.provider_id

    });

}

function loadPTOfficialResultControl(){

    var control = __$("inputFrame"+tstCurrentPage);

    control.innerHTML = "";

    control.style.overflowY = "scroll";

    //control.style.overflowX = "scroll";



    var table = document.createElement("table");

    table.style.borderCollapse = "collapse";

    table.style.width = "95%";

    table.style.margin = "auto";

    table.style.marginTop = "15px";

    control.appendChild(table);

    var tr = document.createElement("tr");

    table.appendChild(tr);

    var td = document.createElement("th");

    td.innerHTML = "Sample #";

    td.style.borderBottom = "1px solid black";

    td.style.borderRight = "1px solid black";

    td.style.borderLeft = "1px solid black";

    td.rowSpan = "2"


    tr.appendChild(td);

     var td = document.createElement("th");

    td.innerHTML = "Official Result";

    td.style.borderBottom = "1px solid black";

     td.style.borderRight = "1px solid black";

    td.colSpan = "3";


    tr.appendChild(td);


    var tr = document.createElement("tr");

    table.appendChild(tr);


    var td = document.createElement("th");

    td.innerHTML = "Strong Positive";

    td.style.borderBottom = "1px solid black";

    tr.appendChild(td);


    var td = document.createElement("th");

    td.innerHTML = "Weak Positive";

    td.style.borderBottom = "1px solid black";

    tr.appendChild(td);


    var td = document.createElement("th");

    td.style.borderBottom = "1px solid black";

    td.style.borderRight = "1px solid black";

    td.innerHTML = "Negative";

    tr.appendChild(td);


    for(var i  = 0; i < 5 ; i++){

            var tr = document.createElement("tr");

            table.appendChild(tr);


            var td = document.createElement("th");

            td.innerHTML = i + 1;

            td.style.borderBottom = "1px solid black";

            td.style.borderRight = "1px solid black";

            td.style.borderLeft = "1px solid black";

            tr.appendChild(td);


            var td = document.createElement("td");

            td.style.borderBottom = "1px solid black";

            td.style.textAlign ="center";

            var button = document.createElement("button")

            button.className = "blue";

            button.innerHTML = "<font style= 'font-size:1.5em'>+</font>"

            button.id = "strong_positive_"+i;

            button.setAttribute("onclick","updateOfficialResult('data.pt_panel_result_"+i+"', 'Strong Positive','strong_positive_"+i+"',['weak_positive_"+i+"','negative_"+i+"'])")

            td.appendChild(button);

            tr.appendChild(td);


            var td = document.createElement("td");

            td.style.borderBottom = "1px solid black";

            td.style.textAlign ="center";

            var button = document.createElement("button")

            button.className = "blue";

            button.innerHTML = "<font style= 'font-size:1em'>+</font>"

            button.id = "weak_positive_"+i;

            button.setAttribute("onclick","updateOfficialResult('data.pt_panel_result_"+i+"', 'Weak Positive','weak_positive_"+i+"',['strong_positive_"+i+"','negative_"+i+"'])")

            td.appendChild(button);

            tr.appendChild(td);


            var td = document.createElement("td");

            td.style.borderBottom = "1px solid black";

            td.style.borderRight = "1px solid black";

            td.style.textAlign ="center";

            var button = document.createElement("button")

            button.className = "blue";

            button.innerHTML = "<font style= 'font-size:1em'>-</font>"

            button.id = "negative_"+i;

            button.setAttribute("onclick","updateOfficialResult('data.pt_panel_result_"+i+"', 'Negative','negative_"+i+"',['strong_positive_"+i+"','weak_positive_"+i+"'])")

            td.appendChild(button);

            tr.appendChild(td);


    }


    __$("nextButton").className = __$("nextButton").className.replace(/blue|green/i, "gray");


    var nexButtonIterval = setInterval(function(){

        if(__$('nextButton').className.match("gray")){

            var fals = 0

            for(var i = 0 ; i < 5; i++){

                if(!__$("data.pt_panel_result_"+i).value){

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

function updateOfficialResult(field, value,enable,disables){



    __$(field).value = value;

    __$(enable).className = "green";

    for(var i = 0; i < disables.length; i++){

        __$(disables[i]).className = "blue";

    }


}

function sePTLotNumber(){

    getAjaxRequest("/stock/available_kits_by_desctiption/"+encodeURIComponent("Proficiency Test"),function(data){

            var kit_data = JSON.parse(data);

            var url = "/stock/available_batches_to_user?userId="+__$('data.tester').value +"&item_name=" + kit_data.name + "&batch="

            console.log(url);

            __$("data.pt_panel_lot_number").setAttribute("ajaxURL",url);

    })


}
function dtsPachListValidation(){

     var list = __$('touchscreenInput' + tstCurrentPage).value.trim();

     if(list.split(";").length < 5){

            setTimeout(function(){

                    gotoPage(tstCurrentPage - 1, false, true);

                    window.parent.proficiency.showMsg("There are only "+list.split(";").length +" items in the DTS pack","DTS pack check");
            },5)
     }


}