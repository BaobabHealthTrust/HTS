P.1. HTS VISIT [program: HTS PROGRAM, scope: TODAY, includejs: touchScreenToolkit;hts]
Q.1.1. HTC Access Type [pos: 0, id: htc_acc_type]
O.1.1.1. Routine HTC within Health Service
O.1.1.2. Comes with HTC Family Reference Slip
O.1.1.3. Other (VCT, etc.)
Q.1.2. Last HIV Test [pos: 1, id: last_hiv_test]
O.1.2.1. Never Tested
O.1.2.2. Last Negative
O.1.2.3. Last Positive
O.1.2.4. Last Exposed Infant
O.1.2.5. Last Inconclusive
Q.1.3. Estimate [pos: 2, id: estimate, condition: false]
Q.1.4. Time Since Last Test [pos: 3, id: time_since_last_test, condition: false]
Q.1.5. Time Since Last Test [pos: 4, concept: Time Since Last Test Display, id: time_since_last_test_date, field_type: birthdate, estimate_field: estimate]
Q.1.6. Partner Present at this Session? [pos: 5, id: partner_present, tt_onLoad: updateTimeSinceLastTest()]
O.1.6.1. Yes
O.1.6.2. No
Q.1.7. Client Registration Summary [pos: 7, tt_onLoad: showHTSVisitSummary(), optional: true, tt_pageStyleClass: NoControls NoKeyboard]