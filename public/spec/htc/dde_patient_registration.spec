P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;registration]

Q.1.1. Sex/Pregnancy [pos :: 0 $$ id :: sex_or_pregnancy $$ type :: hidden]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP

Q.1.2. Consent given to be contacted? [pos :: 1 $$ id :: capture_details]
O.1.2.1. Yes
O.1.2.2. No

Q.1.3. First Name [pos :: 2 $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.firstNamesPath + "?name=">> $$ id :: first_name]

Q.1.4. Last Name [pos :: 3 $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.lastNamesPath + "?name=">> $$ id :: last_name]

Q.1.5. Gender [pos :: 4 $$ id :: gender]
O.1.5.1. Female
O.1.5.2. Male

Q.1.6. Select or Create New Patient [pos :: 5 $$ tt_pageStyleClass :: NoControls $$ optional :: true $$ id :: selected_patient $$ tt_onLoad :: loadNames(); hidekeyboard(); __$('nextButton').onmousedown = "function(){}"; $$ tt_onUnLoad :: __$('nextButton').className = 'green navButton'; __$('nextButton').onmousedown = function(){gotoNextPage()}; if(__$('extras')) __$('buttons').removeChild(__$('extras'));]

Q.1.7. Patient [pos :: 6 $$ field_type :: hidden $$ id :: patient]

Q.1.8. Summary[pos :: 7 $$ id :: summary $$ tt_onLoad :: showSummary()]