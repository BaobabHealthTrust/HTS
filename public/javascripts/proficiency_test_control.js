var timers = {}

function loadPTControl(test){

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

        button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','+','timer_1_"+ i +"','reactive_1_"+i+"','non_reactive_1_"+i+"')");

        td.appendChild(button);


        var td = document.createElement("td");

        tr.appendChild(td);

        td.style.padding = "1.2em";

        td.style.textAlign = "center";

        td.style.borderBottom = "1px solid black";

        td.style.borderRight = "1px solid black";

        var button = document.createElement("button");

        button.id = "non_reactive_1_"+i;

         button.setAttribute("onclick","updateResult('"+test+ "_2_"+i+"','+','timer_1_"+ i +"','non_reactive_1_"+i+"','reactive_1_"+i+"')");

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

                __$(id).innerHTML = "<font style= 'color:#7ea8c4; font-weight: bold; font-size : 1.0em'>" +
                                padZeros(timers[id].minutes,2) +":"+padZeros(timers[id].seconds,2) + "</font>"

        }else{

            clearInterval(timerInterval);

        }

        

    },1000)

}

function updateResult(test,result,timer, buttonActivate,buttonDeactivate) {

    var resultField = __$("data."+test);

    resultField.value = result;

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

    }
    else{

        rptButton.className = "green";

    }


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
