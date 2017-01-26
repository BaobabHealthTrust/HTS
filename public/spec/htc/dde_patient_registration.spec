P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;registration;hts]

Q.1.1. Sex/Pregnancy [pos :: 0 $$ id :: sex_or_pregnancy $$ type :: hidden]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP

Q.1.2. Consent given to be contacted? [pos :: 1 $$ id :: capture_details $$ tt_onUnload :: setDefaults() $$ tt_requirenextclick :: false]
O.1.2.1. Yes
O.1.2.2. No

Q.1.16. Contact Detail Type [pos :: 2 $$ condition :: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ tt_onUnload :: setPhoneNumberValidation('phone_number'); setPatientData(); $$ id :: detail_type $$ tt_requirenextclick :: false]
O.1.16.1. Phone Number
O.1.16.2. Current Residence
O.1.16.3. Both

Q.1.3. First Name [pos :: 3 $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.firstNamesPath + "?name=">> $$ allowFreeText :: true $$ id :: first_name $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes" && (window.parent.dashboard.data.data.names && window.parent.dashboard.data.data.names.length > 0 && window.parent.dashboard.data.data.names[0]["First Name"] ? window.parent.dashboard.data.data.names[0]["First Name"] : "").length < 2]

Q.1.4. Last Name [pos :: 4 $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.lastNamesPath + "?name=">> $$ allowFreeText :: true $$ id :: last_name $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes" && (window.parent.dashboard.data.data.names && window.parent.dashboard.data.data.names.length > 0 && window.parent.dashboard.data.data.names[0]["Family Name"] ? window.parent.dashboard.data.data.names[0]["Family Name"] : "").length < 2]

Q.1.5. Gender [pos :: 5 $$ id :: gender $$ condition :: (window.parent.dashboard.data.data.gender && window.parent.dashboard.data.data.gender.trim().length > 0 ? window.parent.dashboard.data.data.gender.trim() : "").length <= 0 $$ tt_requirenextclick :: false ]
O.1.5.1. Female
O.1.5.2. Male

Q.1.6. Select or Create New Patient [pos :: 6 $$ tt_pageStyleClass :: NoControls $$ optional :: true $$ id :: selected_patient $$ tt_onLoad :: loadNames(); hidekeyboard(); __$('nextButton').onmousedown = "function(){}"; $$ tt_onUnLoad :: __$('nextButton').className = 'green navButton'; __$('nextButton').onmousedown = function(){gotoNextPage()}; if(__$('extras')) __$('buttons').removeChild(__$('extras')); $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes" && (window.parent.dashboard.data.data.names && window.parent.dashboard.data.data.names.length > 0 && window.parent.dashboard.data.data.names[0]["First Name"] ? window.parent.dashboard.data.data.names[0]["First Name"] : "").length < 2]

Q.1.7. Patient [pos :: 7 $$ field_type :: hidden $$ id :: patient $$ value :: ""]

Q.1.32. Region of Origin [pos:: 8 $$ id :: region_of_origin $$ tt_onUnload :: setAjaxUrl(-1) $$ tt_requireNextClick :: false $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes" &&  (window.parent.dashboard.data.data.addresses && window.parent.dashboard.data.data.addresses["Home District"] == null)]
O.1.32.1. Central Region
O.1.32.2. Northern Region
O.1.32.3. Southern Region

Q.1.8. Home district [pos :: 9 $$ id :: home_district $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.districtQueryPath + "?region=&district=">> $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes" && (window.parent.dashboard.data.data.addresses && window.parent.dashboard.data.data.addresses["Home District"] == null) $$ tt_requirenextclick :: false]

Q.1.9. Year of Birth [pos :: 10 $$ id :: birthyear $$ disabled :: true $$ field_type :: number $$ tt_pageStyleClass :: Numeric NumbersWithUnknown $$ tt_onUnLoad :: validateMaxMinYear() $$ condition :: window.parent.dashboard.data.data.birthdate.trim().length == 0]

Q.1.10. Age Estimate [pos :: 11 $$ id :: age_estimate $$ field_type :: number $$ condition :: __$('birthyear').value.trim().toLowerCase() == "unknown" && window.parent.dashboard.data.data.birthdate.trim().length == 0 $$  tt_pageStyleClass::Numeric NumbersOnly $$ tt_onUnLoad :: setEstimatedAgeValue() $$ absoluteMax :: 150 $$ min :: 1 max :: 100]

Q.1.11. Month of Birth [pos :: 12 $$ id :: birthmonth $$ disabled :: true $$ condition ::__$('birthyear').value.trim().toLowerCase() != "unknown" && window.parent.dashboard.data.data.birthdate.trim().length == 0 $$ tt_onUnLoad :: validateAndProcessMonth() $$ allowFreeText :: false $$ tt_pageStyleClass :: LongSelectList NoKeyboard $$ tt_requireNextClick :: false]
O.1.11.1. January
O.1.11.2. February
O.1.11.3. March
O.1.11.4. April
O.1.11.5. May
O.1.11.6. June
O.1.11.7. July
O.1.11.8. August
O.1.11.9. September
O.1.11.10. October
O.1.11.11. November
O.1.11.12. December
O.1.11.13. Unknown

Q.1.12. Day of Birth [pos :: 13 $$ disabled :: true $$ id :: birthday $$ condition :: __$('birthyear').value.trim().toLowerCase() != "unknown" && __$('birthmonth').value.trim().toLowerCase() != "unknown" && window.parent.dashboard.data.data.birthdate.trim().length == 0 $$ tt_onLoad :: monthDaysKeyPad() $$ tt_onUnLoad :: setAgeValues()]

Q.1.13. Select or Create New Patient [pos :: 14 $$ tt_pageStyleClass :: NoControls $$ optional :: true $$ id :: selected_advanced_patient $$ tt_onLoad :: loadNames(true); hidekeyboard(); __$('nextButton').onmousedown = "function(){}"; $$ tt_onUnLoad :: __$('nextButton').className = 'green navButton'; __$('nextButton').onmousedown = function(){gotoNextPage()}; if(__$('extras')) __$('buttons').removeChild(__$('extras')); $$ condition ::  __$("capture_details").value.trim().toLowerCase() == "yes" && (window.parent.dashboard.data.data.names && window.parent.dashboard.data.data.names.length > 0 && window.parent.dashboard.data.data.names[0]["First Name"] ? window.parent.dashboard.data.data.names[0]["First Name"] : "").length < 2]

Q.1.14. Is client pregnant? [pos :: 15 $$ id :: pregnant $$ condition :: __$("gender").value.trim().toLowerCase() == "female" && (window.parent.dashboard.data.data.gender && window.parent.dashboard.data.data.gender.trim().length > 0 ? window.parent.dashboard.data.data.gender.trim().toLowerCase() == "f" : false) $$ tt_requirenextclick :: false ]
O.1.14.1. Yes
O.1.14.2. No

Q.1.15. How many months pregnant? [pos :: 16 $$ id :: months_pregnant $$ field_type :: number $$ tt_pageStyleClass :: Numeric NumbersOnly $$ condition :: __$('pregnant').value.trim().toLowerCase() == 'yes' $$ min :: 1 $$ max :: 10]

Q.1.17. Current Region [pos:: 17 $$ id :: region $$ tt_onUnload :: setAjaxUrl(0)$$ tt_requireNextClick :: false $$ condition :: ((__$("patient").value.trim() == "AUTO") && __$("selected_advanced_patient").value.trim().length <= 0 && __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both') && evalDemographicCondition(0)]
O.1.17.1. Central Region
O.1.17.2. Northern Region
O.1.17.3. Southern Region

Q.1.18. Current District [pos :: 18 $$ id :: district $$ tt_onUnload :: setAjaxUrl(1) $$ tt_requireNextClick :: false $$ condition :: ((__$("patient").value.trim().length <= 0 || __$("patient").value.trim() == "AUTO") && __$("selected_advanced_patient").value.trim().length <= 0 && __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both') && evalDemographicCondition(0)]

Q.1.20. Current T/A [pos:: 19 $$ id:: ta $$ tt_onUnload:: setAjaxUrl(2) $$ tt_requireNextClick :: false $$ condition :: ((__$("patient").value.trim().length <= 0 || __$("patient").value.trim() == "AUTO") && __$("selected_advanced_patient").value.trim().length <= 0 && __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both') && evalDemographicCondition(0)]

Q.1.21. Current Village [pos:: 20 $$ id :: village $$ tt_requireNextClick :: false $$ condition :: __$('ta').value.trim().length > 0 && evalDemographicCondition(0)]

Q.1.22. Current Village Specify [pos :: 21 $$ id :: village_specify $$ tt_requireNextClick :: true $$ condition :: __$('village').value == 'Other']

Q.1.23. Closest Landmark [pos :: 22 $$ id :: closest_landmark $$ condition :: ((__$("patient").value.trim().length <= 0 || __$("patient").value.trim() == "AUTO") && __$("selected_advanced_patient").value.trim().length <= 0 && __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both') && evalDemographicCondition(0)]

Q.1.24. Client Phone Number [pos:: 23 $$ id :: phone_number $$ field_type :: number $$ tt_pageStyleClass :: NumbersWithUnknown $$ tt_onUnload :: saveCellPhoneNumber() $$ condition :: (__$('detail_type').value.trim().toLowerCase() == 'phone number' || __$('detail_type').value.trim().toLowerCase() == 'both') && (!window.parent.dashboard.data.data.attributes["Cell Phone Number"] || (window.parent.dashboard.data.data.attributes["Cell Phone Number"] && String(window.parent.dashboard.data.data.attributes["Cell Phone Number"]).trim().length <= 1))]

Q.1.25. Birthdate [pos :: 24 $$ id :: birthdate $$ field_type :: birthdate $$ estimate_field :: estimate $$ type :: hidden]

Q.1.26. Estimate [pos :: 25 $$ id :: estimate $$ type ::hidden]

Q.1.27. Age [pos :: 26 $$ id :: age $$ type :: hidden]

Q.1.28. Age Group [pos :: 27 $$ id :: age_group $$ type :: hidden]

Q.1.29. Summary[pos :: 28 $$ id :: summary $$ tt_onLoad :: showSummary() $$ condition :: false]

Q.1.30. Client Registration Summary [pos :: 29 $$ tt_onLoad:: calculateAge(); showDetailsSummary() $$ optional :: true $$ tt_pageStyleClass :: NoControls NoKeyboard]

Q.1.31. Client Registration Summary (cont'd) [pos :: 30 $$ tt_onLoad :: updatePregnancy() $$ optional :: true $$ tt_pageStyleClass :: NoControls NoKeyboard]