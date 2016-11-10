function checkFirstSeecondTestAvailable(){

        var descriptions = ['First Test','Second Test']

        var available = {};

        for(var i = 0 ; i < descriptions.length ; i++){

            window.parent.stock.ajaxRequest("/stock/available_kits_by_desctiption/"+ encodeURIComponent(descriptions[i]), function(data) {

                    if(!data)
                        var data = {};

                    var json = (typeof data == typeof String() ? JSON.parse(data) : data)

                    if(json.name){

                            available[json.description] = {name: json.name , present: true};

                    }
                    else{

                            available[json.description] = {name: json.name , present: false};

                    }


            });

        }

        window.parent.stock.availableByDescription = available;


}

function validateDescription(){

       var description = __$('touchscreenInput' + tstCurrentPage).value.trim();

       var available = window.parent.stock.availableByDescription;

       if(available[description]){

                 setTimeout(function(){

                            gotoPage(tstCurrentPage - 1, false, true); 

                            window.parent.stock.showMsg(available[description].name + ' is already set as '+ description, "Item with description already exists")},

                 10);

       }

}