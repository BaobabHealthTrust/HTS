var risk_category;

function __$(id){
    return document.getElementById(id);
}

function setRiskCategory() {

    var low_risk = "[No Sex/Abstenance, Consistent and correct Condom useConsistent and correct Condom use, Stable, known HIV-negative partner who does not engage in risky behaviour]";
    var on_going_risk = "[Stable partner who is taking ART, Stable partner with unknown HIV status, MSM, Sex Worker, Injecting drug user, Born/Breastfeeding from HIV-Infected mother]";
    var high_risk = "[Occupational Exposure , STI, Rape, Unprotected sex, Shared needles with known HIV infected person]";

    var yesAnswers = [];
    //################# Populate yesAnswers array ####################
    var checkBoxes = __$('page' + tstCurrentPage).getElementsByTagName("img");
    for(var i in checkBoxes){
        var box = checkBoxes[i];
        if(box.src && !box.src.match(/unticked/)){
            var yesAnswer = box.parentNode.parentNode.childNodes[1].innerHTML;
            yesAnswers.push(yesAnswer);
        }
    }
    //################# Loop through yesAnswers array to get Risk Category. #####
    var risk_type = []
    var risk_type = 'Risk assessment not done';
    for(var yes in yesAnswers){
        if (high_risk.indexOf(yesAnswers[yes]) > -1){
            risk_type = 'High risk event';
            break;
        }
        else if (on_going_risk.indexOf(yesAnswers[yes]) > -1){
            risk_type = 'On-going Risk';
        }
        else if (low_risk.indexOf(yesAnswers[yes]) > -1){
            if (risk_type != "on_going") {
                risk_type = 'Low Risk';
            }
        }
    }
    //######### Get Risk Type ###################
    risk_category = risk_type;
    /*
     ['Low Risk','Low Risk'],
     ['On-going Risk','AVD+ or High Risk'],
     ['High risk event','High risk event in last 3 months'],
     ['Risk assessment not done','Risk assessment not done']
     */
}

function getRiskCategory() {
    var risk_type = risk_category;
    var keyboard = document.getElementById('keyboard');

    __$('touchscreenInput' + tstCurrentPage).value = risk_type;
    keyboard.style.display = 'none';
    return risk_type;
}
