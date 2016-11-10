P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;registration;hts]

Q.1.1. Sex/Pregnancy [pos :: 0 $$ id :: sex_or_pregnancy $$ type :: hidden]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP

Q.1.2. Consent given to be contacted? [pos :: 1 $$ id :: capture_details]
O.1.2.1. Yes
O.1.2.2. No

Q.1.16. Contact Detail Type [pos :: 2 $$ condition :: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ tt_onUnload :: setPhoneNumberValidation('phone_number') $$ id :: detail_type]
O.1.16.1. Phone Number
O.1.16.2. Current Residence
O.1.16.3. Both

Q.1.3. First Name [pos :: 3 $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.firstNamesPath + "?name=">> $$ allowFreeText :: true $$ id :: first_name $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes"]

Q.1.4. Last Name [pos :: 4 $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.lastNamesPath + "?name=">> $$ allowFreeText :: true $$ id :: last_name $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes"]

Q.1.5. Gender [pos :: 5 $$ id :: gender]
O.1.5.1. Female
O.1.5.2. Male

Q.1.6. Select or Create New Patient [pos :: 6 $$ tt_pageStyleClass :: NoControls $$ optional :: true $$ id :: selected_patient $$ tt_onLoad :: loadNames(); hidekeyboard(); __$('nextButton').onmousedown = "function(){}"; $$ tt_onUnLoad :: __$('nextButton').className = 'green navButton'; __$('nextButton').onmousedown = function(){gotoNextPage()}; if(__$('extras')) __$('buttons').removeChild(__$('extras')); $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes"]

Q.1.7. Patient [pos :: 7 $$ field_type :: hidden $$ id :: patient]

Q.1.8. Home district [pos :: 8 $$ id :: home_district $$ ajaxURL :: <<window.parent.patient.settings.ddePath + window.parent.patient.settings.districtQueryPath + "?region=&district=">> $$ condition :: __$("capture_details").value.trim().toLowerCase() == "yes" && __$("patient").value.trim().length <= 0 ]

Q.1.9. Year of Birth [pos :: 9 $$ id :: birthyear $$ disabled :: true $$ field_type :: number $$ tt_pageStyleClass :: Numeric NumbersWithUnknown $$ tt_onUnLoad :: validateMaxMinYear() $$ condition :: (__$("capture_details").value.trim().toLowerCase() == "no" || __$("patient").value.trim().length <= 0)]

Q.1.10. Age Estimate [pos :: 10 $$ id :: age_estimate $$ field_type :: number $$ condition :: __$("patient").value.trim().length <= 0 && __$('birthyear').value.trim().toLowerCase() == "unknown" $$  tt_pageStyleClass::Numeric NumbersOnly $$ tt_onUnLoad :: setEstimatedAgeValue() $$ absoluteMax :: 150 $$ min :: 1 max :: 100]

Q.1.11. Month of Birth [pos :: 11 $$ id :: birthmonth $$ disabled :: true $$ condition :: __$("patient").value.trim().length <= 0 && __$('birthyear').value.trim().toLowerCase() != "unknown" $$ tt_onUnLoad :: validateAndProcessMonth() $$ allowFreeText :: false $$ tt_pageStyleClass :: LongSelectList NoKeyboard]
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

Q.1.12. Day of Birth [pos :: 12 $$ disabled :: true $$ id :: birthday $$ condition :: __$("patient").value.trim().length <= 0 && __$('birthyear').value.trim().toLowerCase() != "unknown" && __$('birthmonth').value.trim().toLowerCase() != "unknown" $$ tt_onLoad :: monthDaysKeyPad() $$ tt_onUnLoad :: setAgeValues()]

Q.1.13. Select or Create New Patient [pos :: 13 $$ tt_pageStyleClass :: NoControls $$ optional :: true $$ id :: selected_advanced_patient $$ tt_onLoad :: loadNames(true); hidekeyboard(); __$('nextButton').onmousedown = "function(){}"; $$ tt_onUnLoad :: __$('nextButton').className = 'green navButton'; __$('nextButton').onmousedown = function(){gotoNextPage()}; if(__$('extras')) __$('buttons').removeChild(__$('extras')); $$ condition :: __$("patient").value.trim().length <= 0 &&  __$("capture_details").value.trim().toLowerCase() == "yes" ]

Q.1.14. Is client pregnant? [pos :: 14 $$ id :: pregnant $$ condition :: __$("gender").value.trim().toLowerCase() == "female" ]
O.1.14.1. Yes
O.1.14.2. No

Q.1.15. How many months pregnant? [pos :: 15 $$ id :: months_pregnant $$ field_type :: number $$ tt_pageStyleClass :: Numeric NumbersOnly $$ condition :: __$('pregnant').value.trim().toLowerCase() == 'yes' $$ min :: 1 $$ max :: 10]

Q.1.17. Current Region [pos:: 16 $$ id :: region $$ tt_onUnload :: setAjaxUrl(0)$$ tt_requireNextClick :: false $$ condition :: __$("patient").value.trim().length <= 0 && __$("selected_advanced_patient").value.trim().length <= 0 && __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both']
O.1.17.1. Central Region
O.1.17.2. Northern Region
O.1.17.3. Southern Region

Q.1.18. Current District [pos :: 17 $$ id :: district $$ tt_onUnload :: setAjaxUrl(1) $$ tt_requireNextClick :: false $$ condition :: __$("patient").value.trim().length <= 0 && __$("selected_advanced_patient").value.trim().length <= 0 && __$('region').value.trim().length > 0]

Q.1.20. Current T/A [pos:: 18 $$ id:: ta $$ tt_onUnload:: setAjaxUrl(2) $$ tt_requireNextClick :: false $$ condition :: __$('district').value.trim().length > 0]

Q.1.21. Current Village [pos:: 19 $$ id :: village $$ tt_requireNextClick :: false $$ condition :: __$('ta').value.trim().length > 0]

Q.1.22. Current Village Specify [pos :: 20 $$ id :: village_specify $$ tt_requireNextClick :: true $$ condition :: __$('village').value == 'Other']

Q.1.23. Closest Landmark [pos :: 21 $$ id :: closest_landmark $$ condition :: __$('village').value.trim().length > 0]

Q.1.24. Client Phone Number [pos:: 22 $$ id :: phone_number $$ condition :: __$('detail_type').value.trim().toLowerCase() == 'phone number' || __$('detail_type').value.trim().toLowerCase() == 'both']

Q.1.25. Birthdate [pos :: 23 $$ id :: birthdate $$ field_type :: birthdate $$ estimate_field :: estimate $$ type :: hidden]

Q.1.26. Estimate [pos :: 24 $$ id :: estimate $$ type ::hidden]

Q.1.27. Age [pos :: 25 $$ id :: age $$ type :: hidden]

Q.1.28. Age Group [pos :: 26 $$ id :: age_group $$ type :: hidden]

Q.1.29. Summary[pos :: 27 $$ id :: summary $$ tt_onLoad :: showSummary() $$ condition :: false]

Q.1.30. Client Registration Summary [pos :: 28 $$ tt_onLoad:: calculateAge(); showDetailsSummary() $$ optional :: true $$ tt_pageStyleClass :: NoControls NoKeyboard]

Q.1.31. Client Registration Summary (cont'd) [pos :: 29 $$ tt_onLoad :: updatePregnancy() $$ optional :: true $$ tt_pageStyleClass :: NoControls NoKeyboard]