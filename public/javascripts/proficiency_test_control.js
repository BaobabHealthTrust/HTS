var timers = {}

var repeat_test_panel = {}

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

    th.innerHTML = "Panel #";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Start Timer 1";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 1 Timer";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 1 Result";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";

    th.colSpan = "2"


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Start Timer 2";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 2 Timer";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 2 Result ";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";

    th.colSpan ="2"


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Immediate Repeat?";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    for(var i = 0 ; i < 5 ; i++){

        var tr = document.createElement("tr");

        table.appendChild(tr);

        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = i + 1;

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "button_start_1_"+i;

        button.innerHTML = "Start Time 1"

         button.setAttribute("onclick","startTimer('timer_1_"+ i +"','button_start_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = "00:00";

        td.id ="timer_1_"+i;

        td.style.padding = "1.2em";

        td.style.fontWeight  ="bold";

        td.style.fontSize = "1.5em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "reactive_1_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','+','timer_1_"+ i +"','reactive_1_"+i+"','non_reactive_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "non_reactive_1_"+i;

         button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','-','timer_1_"+ i +"','non_reactive_1_"+i+"','reactive_1_"+i+"')");

        button.innerHTML = "NR";

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "button_start_2_"+i;

        button.innerHTML = "Start Time 2";

        button.setAttribute("onclick","startTimer('timer_2_"+ i +"','button_start_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = "00:00";

        td.style.fontWeight  ="bold";

        td.style.fontSize = "1.5em";

        td.id ="timer_2_"+i;

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "reactive_2_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','+','timer_2_"+ i +"','reactive_2_"+i+"','non_reactive_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "non_reactive_2_"+i;

        button.innerHTML = "NR";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','-','timer_2_"+ i +"','non_reactive_2_"+i+"','reactive_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

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

    th.innerHTML = "Panel #";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Start Timer 1";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 1 Timer";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 1 Result";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";

    th.colSpan = "2"


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Start Timer 2";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 2 Timer";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.style.borderRight = "1px solid black";


    var th = document.createElement("th");

    tr.appendChild(th);

    th.innerHTML = "Test 2 Result ";

    th.style.padding = "1.2em";

    th.style.borderBottom = "1px solid black";

    th.colSpan ="2"


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

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_button_start_1_"+i;

        button.innerHTML = "Start Time 1"

         button.setAttribute("onclick","startTimer('im_timer_1_"+ i +"','im_button_start_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = "00:00";

        td.id ="im_timer_1_"+i;

        td.style.padding = "1.2em";

        td.style.fontWeight  ="bold";

        td.style.fontSize = "1.5em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_reactive_1_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','+','timer_1_"+ i +"','im_reactive_1_"+i+"','im_non_reactive_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_non_reactive_1_"+i;

         button.setAttribute("onclick","updateResult('"+test+ "_1_"+i+"','-','im_timer_1_"+ i +"','im_non_reactive_1_"+i+"','im_reactive_1_"+i+"')");

        button.innerHTML = "NR";

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_button_start_2_"+i;

        button.innerHTML = "Start Time 2";

        button.setAttribute("onclick","startTimer('im_timer_2_"+ i +"','im_button_start_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.innerHTML = "00:00";

        td.style.fontWeight  ="bold";

        td.style.fontSize = "1.5em";

        td.id ="im_timer_2_"+i;

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_reactive_2_"+i;

        button.innerHTML = "R";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','+','im_timer_2_"+ i +"','im_reactive_2_"+i+"','im_non_reactive_2_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        var button = document.createElement("button");

        button.id = "im_non_reactive_2_"+i;

        button.innerHTML = "NR";

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','-','im_timer_2_"+ i +"','im_non_reactive_2_"+i+"','im_reactive_2_"+i+"')");

        td.appendChild(button);



    }


}


function startTimer(id, button){

    __$(button).className = "gray";

   if(!timers[id]){

        timers[id] = {minutes : 0 , seconds : 0 , progress: true}
   }

    var timerInterval = setInterval(function (){

        if(timers[id].progress){

            timers[id].seconds++;

                if(timers[id].seconds == 60){

                    timers[id].minutes++;

                    timers[id].seconds= 0

                }

                if(__$(id) != null){

                    __$(id).innerHTML = "<font style= 'color:#2e5d91; font-weight: bold; font-size : 1.0em'>" +
                                padZeros(timers[id].minutes,2) +":"+padZeros(timers[id].seconds,2) + "</font>"

                }

                

        }else{

            clearInterval(timerInterval);

        }

        

    },1000)

}

function updateResult(test,result,timer, buttonActivate,buttonDeactivate) {

    console.log(test);

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

        var date_string = lot.match(/\b\d{2}\/[A-Za-z]{3}\/\d{4}\b/)[0];

        if(date_string)
                __$(expiry).value = (new Date(date_string)).format("YYYY-mm-dd");

}

function loadFinalResultControl(){

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