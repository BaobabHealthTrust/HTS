P.1. HTS VISIT [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.1. Partner Present at this Session? [pos:: 0$$ id:: partner_present$$ tt_onLoad:: updateTimeSinceLastTest()]
O.1.1.1. Yes
O.1.1.2. No

Q.1.2. HTS Access Type [pos:: 1$$ id:: htc_acc_type]
O.1.2.1. Routine HTS within Health Service
O.1.2.2. Comes with HTS Family Reference Slip
O.1.2.3. Other (VCT, etc.)

Q.1.3. Last HIV Test [pos:: 2$$ id:: last_hiv_test]
O.1.3.1. Never Tested
O.1.3.2. Last Negative
O.1.3.3. Last Positive
O.1.3.4. Last Exposed Infant
O.1.3.5. Last Inconclusive

Q.1.4. Estimate [pos:: 3$$ id:: estimate$$ condition:: false]

Q.1.5. Time Since Last Test [pos:: 4$$ id:: time_since_last_test$$ condition:: false]

Q.1.6. Time Since Last Test [pos:: 5$$ concept:: Time Since Last Test$$ id:: time_since_last_test_date$$ field_type:: birthdate$$ estimate_field:: estimate$$ condition:: __$('last_hiv_test').value != 'Never Tested']

Q.1.7. HTS Visit Summary [pos:: 6$$ tt_onLoad:: showHTSVisitSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]