P.1. PRE TEST COUNSELLING [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.1. Do you have a partner? [pos:: 0$$ id:: partner]
O.1.1.1. Yes
O.1.1.2. No

Q.1.2. Partner Present at this Session? [pos:: 1$$ id:: partner_present$$ condition:: __$('partner').value == "Yes"]
O.1.2.1. Yes
O.1.2.2. No

Q.1.3. HTS Access Type [pos:: 2$$ id:: htc_acc_type]
O.1.3.1. Routine HTS (PITC) within Health Service
O.1.3.2. Comes with HTS Family Reference Slip
O.1.3.3. Other (VCT, etc.)

Q.1.4. Last HIV Test [pos:: 3$$ id:: last_hiv_test]
O.1.4.1. Never Tested
O.1.4.2. Last Negative
O.1.4.3. Last Positive
O.1.4.4. Last Exposed Infant
O.1.4.5. Last Inconclusive

Q.1.5. Estimate [pos:: 4$$ id:: estimate$$ condition:: false]

Q.1.6. Time Since Last Test [pos:: 5$$ id:: time_since_last_test$$type:: hidden]

Q.1.7. Duration in Days [pos:: 6$$ id:: duration_in_days$$type:: hidden]

Q.1.8. Time Since Last Test Date [pos:: 7$$ id:: time_since_last_test_date$$type:: hidden]

Q.1.9. Duration Control [pos:: 8$$ id:: duration_ago$$ tt_onLoad:: showTimeSinceLastDate()$$ tt_pageStyleClass:: NoControls NoKeyboard $$ condition:: __$('last_hiv_test').value != 'Never Tested' $$ optional :: true $$ helpText :: Time Since Last Test Date]

Q.1.10. Captured Duration Value [pos :: 9 $$ id :: captured_value $$ tt_onLoad :: __$('touchscreenInput' + tstCurrentPage).value = __$('duration_ago').value $$ condition:: __$('last_hiv_test').value != 'Never Tested' $$ condition :: false]

Q.1.11. Partner HIV Status <sup style="font-size: 14px;"><i>(From tests today if tested together otherwise as reported by client)</i></sup> [pos:: 10$$id::partner_status$$ tt_onUnLoad:: __$("phs").value = __$("touchscreenInput" + tstCurrentPage).value.trim()$$ condition:: __$('partner').value == "Yes"]
O.1.11.1. HIV Unknown
O.1.11.2. Partner Negative
O.1.11.3. Partner Positive

Q.1.12. Partner HIV Status [pos:: 11$$ id:: phs$$ value:: No Partner$$ condition:: false]

Q.1.13. Client Risk Category [pos:: 12$$ id:: risk_category]
O.1.13.1. Low Risk
O.1.13.2. On-going Risk
O.1.13.3. High Risk Event in Last 3 months
O.1.13.4. Risk assessment Not Done

Q.1.14. Event in the last 72 hrs? [pos::13 $$id ::last_72 $$ condition:: __$("risk_category").value == "High Risk Event in Last 3 months"]
O.1.14.1. Yes
O.1.14.2. No


Q.1.15. HTS Visit Summary [pos:: 14$$ tt_onLoad::setTimeSinceLastDate(), showHTSVisitSummary(),updateTimeSinceLastTest()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]
