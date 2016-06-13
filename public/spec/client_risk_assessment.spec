P.1. CLIENT RISK ASSESSMENT [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]
Q.1.1. Client Risk Category [pos:: 0$$ tt_onUnload:: evaluateReferral()$$ id:: risk_category]
O.1.1.1. Low Risk
O.1.1.2. On-going Risk
O.1.1.3. High Risk Event in Last 3 months
O.1.1.4. Risk assessment Not Done

Q.1.2. Referral for Re-Testing [pos:: 1$$ condition:: false$$ id:: referral]

Q.1.3. Appointment Date Given [pos:: 2$$ id:: appointment$$ field_type:: date]

Q.1.4. HTC Family Referral Slips Given [pos:: 3$$ concept:: HTC Family Referral Slips$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal]

Q.1.5. Male Condoms [pos:: 4$$ condition:: evalCondition(6)$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal]

Q.1.6. Female Condoms [pos:: 5$$ condition:: evalCondition(7)$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal]

Q.1.7. Comments [pos:: 6$$ optional:: true$$ field_type:: textarea]

Q.1.8. Summary [pos:: 7$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard$$ tt_onLoad:: showAssessmentSummary()]