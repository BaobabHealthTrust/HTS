P.1. PRE TEST COUNSELLING [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts;pre_test_counseling]

Q.1.1. Do you have a partner? [pos :: 0 $$ id :: partner $$ condition :: ageLimit() && !hasPartner() $$ tt_requirenextclick :: false]
O.1.1.1. Yes
O.1.1.2. No

Q.1.2. Partner Present at this Session? [pos :: 1 $$ id :: partner_present $$ condition :: ((__$('partner') && __$('partner').value == "Yes" && ageLimit()) || (ageLimit() && hasPartner() && hasPartner() && noPartnerToday())) $$ tt_requirenextclick :: false]
O.1.2.1. Yes
O.1.2.2. No

Q.1.17. Does the partner give consent to be contacted?[pos :: 2 $$ id :: partner_contacted $$ condition :: __$('partner_present').value == "Yes" $$ tt_requirenextclick :: false]
O.1.17.1. Yes
O.1.17.2. No

Q.1.18. Partner Contact Detail Type [pos :: 3 $$ condition :: (__$('partner') && __$('partner').value == "Yes" && __$('partner_present') && __$('partner_contacted').value == "Yes") || (hasPartner() && __$('partner_present') && __$('partner_contacted').value == "Yes") $$ tt_onUnload :: partnerContactType = __$("touchscreenInput" + tstCurrentPage).value; setPhoneNumberValidation('phone_number'); setPatientData(); $$ id :: partner_detail_type $$ tt_requirenextclick :: false]
O.1.18.1. Phone Number
O.1.18.2. Current Residence
O.1.18.3. Both

Q.1.16. Define relationship [pos :: 4 $$ id :: relationship $$ tt_onLoad :: partnerContactType = __$("partner_detail_type").value.trim(); loadCustomPage() $$ tt_pageStyleClass :: NoControls NoKeyboard $$ optional :: true $$ condition :: __$('partner') && __$('partner').value == "Yes" && __$('partner_present') && __$('partner_contacted').value == "Yes" ]

Q.1.3. HTS Access Type [pos :: 5 $$ id :: htc_acc_type $$ tt_requirenextclick :: false $$ tt_onLoad :: if(!(__$('partner') && (__$('partner').value == "Yes") || (ageLimit() && hasPartner()) || noPartnerToday()) && __$("partner_present")) {__$("partner_present").value = (noPartnerToday() ? "No" : "Yes");} $$ tt_pagestyleclass :: longSelectList]
O.1.3.1. Routine HTS (PITC) within Health Service
O.1.3.2. Comes with HTS Family Reference Slip
O.1.3.3. Other (VCT, etc.)

Q.1.19. PITC Location [pos :: 6 $$ id :: pitc_location $$ ajaxUrl :: /list_locations?name= $$ condition :: __$("htc_acc_type").value.trim() == "Routine HTS (PITC) within Health Service"]

Q.1.4. Last HIV Test [pos :: 7 $$ id :: last_hiv_test $$ tt_requirenextclick :: false $$ tt_onUnload :: updatePartner("PRE TEST COUNSELLING", "Partner HIV Status", __$("touchscreenInput" + tstCurrentPage).value); updatePartnerObs();  $$ tt_pagestyleclass :: longSelectList]
O.1.4.1. Never Tested
O.1.4.2. Last Negative
O.1.4.3. Last Positive
O.1.4.4. Last Inconclusive
C.1.4.5. Last Exposed Infant

Q.1.5. Estimate [pos :: 8 $$ id :: estimate $$ condition :: false]

Q.1.6. Time Since Last Test [pos :: 9 $$ id :: time_since_last_test $$ type :: hidden]

Q.1.7. Duration in Days [pos :: 10 $$ id :: duration_in_days $$ type :: hidden]

Q.1.8. Time Since Last Test Date [pos :: 11 $$ id :: time_since_last_test_date $$ type :: hidden $$ value :: 1900-01-01 ]

Q.1.9. Duration Control [pos :: 12 $$ id :: duration_ago $$ tt_onLoad :: showTimeSinceLastDate() $$ tt_pageStyleClass :: NoControls NoKeyboard $$ condition :: __$("last_hiv_test").value.trim().length > 0 && ['Never Tested', 'Last Exposed Infant'].indexOf(__$('last_hiv_test').value) < 0 $$ optional :: true $$ helpText :: Time Since Last Test Date]

Q.1.10. Captured Duration Value [pos :: 13 $$ id :: captured_value $$ tt_onLoad :: __$('touchscreenInput' + tstCurrentPage).value = __$('duration_ago').value $$ condition:: __$('last_hiv_test').value != 'Never Tested' $$ condition :: false]

Q.1.11. Partner HIV Status <sup style="font-size: 14px;"><i>(From tests today if tested together otherwise as reported by client)</i></sup> [pos :: 14 $$ id :: partner_status $$ tt_onUnLoad :: __$("phs").value = __$("touchscreenInput" + tstCurrentPage).value.trim(); if(false) updatePartner("PRE TEST COUNSELLING", "Last HIV Test", __$("touchscreenInput" + tstCurrentPage).value); $$ condition:: __$('partner').value == "Yes" || !noPartnerToday() $$ tt_requirenextclick :: false $$ concept :: Partner HIV Status $$ tt_pagestyleclass :: longSelectList]
O.1.11.1. Partner Negative
O.1.11.2. Partner Positive
O.1.11.3. HIV Unknown

Q.1.12. Partner HIV Status [pos :: 15 $$ id :: phs $$ value :: No Partner $$ condition :: false]

Q.1.13. Client Risk Category [pos :: 16 $$ id :: risk_category $$ tt_requirenextclick :: false $$ tt_pagestyleclass :: longSelectList]
O.1.13.1. Low Risk
O.1.13.2. On-going Risk
O.1.13.3. High Risk Event in Last 3 months
O.1.13.4. Risk assessment Not Done

Q.1.14. Event in the last 72 hrs? [pos :: 17 $$ id :: last_72 $$ condition :: __$("risk_category").value == "High Risk Event in Last 3 months" $$ tt_requirenextclick :: false]
O.1.14.1. Yes
O.1.14.2. No


Q.1.15. HTS Visit Summary [pos :: 18 $$ tt_onLoad :: setTimeSinceLastDate(); showHTSVisitSummary(); updateTimeSinceLastTest(); $$ optional :: true $$ tt_pageStyleClass :: NoControls NoKeyboard]
