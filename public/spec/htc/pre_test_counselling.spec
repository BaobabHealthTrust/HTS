P.1. PRE TEST COUNSELLING [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.1. Partner Present at this Session? [pos:: 0$$ id:: partner_present]
O.1.1.1. Yes
O.1.1.2. No

Q.1.2. HTS Access Type [pos:: 1$$ id:: htc_acc_type]
O.1.2.1. Routine HTS (PITC) within Health Service
O.1.2.2. Comes with HTS Family Reference Slip
O.1.2.3. Other (VCT, etc.)

Q.1.3. Last HIV Test [pos:: 2$$ id:: last_hiv_test]
O.1.3.1. Never Tested
O.1.3.2. Last Negative
O.1.3.3. Last Positive
O.1.3.4. Last Exposed Infant
O.1.3.5. Last Inconclusive

Q.1.4. Estimate [pos:: 3$$ id:: estimate$$ condition:: false]

Q.1.5. Time Since Last Test [pos:: 4$$ id:: time_since_last_test$$type:: hidden]

Q.1.6. Time Since Last Test Date [pos:: 5$$ concept:: Time Since Last Test$$ id:: time_since_last_test_date$$ field_type:: birthdate$$ estimate_field:: estimate$$estimate_label::Time Estimate in Years$$ condition:: __$('last_hiv_test').value != 'Never Tested']

Q.1.7. Partner HIV Status <sup style="font-size: 14px;"><i>(From tests today if tested together otherwise as reported by client)</i></sup> [pos:: 6$$id::partner_status$$ tt_onUnLoad:: __$("phs").value = __$("touchscreenInput" + tstCurrentPage).value.trim() $$ condition:: __$("partner_present").value == "Yes"]
O.1.7.1. HIV Unknown
O.1.7.2. Partner Negative
O.1.7.3. Partner Positive

Q.1.8. Partner HIV Status [pos:: 7$$ id:: phs$$ value:: No Partner$$ condition:: false]

Q.1.9. Client Risk Category [pos:: 8$$ id:: risk_category]
O.1.9.1. Low Risk
O.1.9.2. On-going Risk
O.1.9.3. High Risk Event in Last 3 months
O.1.9.4. Risk assessment Not Done

Q.1.10. Event in the last 72 hrs? [pos::9 $$id ::last_72 $$ condition:: __$("risk_category").value == "High Risk Event in Last 3 months"]
O.1.10.1. Yes
O.1.10.2. No


Q.1.11. HTS Visit Summary [pos:: 10$$ tt_onLoad:: showHTSVisitSummary(),updateTimeSinceLastTest()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]
