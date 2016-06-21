P.1. CLIENT RISK ASSESSMENT [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.1. Partner HIV Status <sup style="font-size: 14px;"><i>(From tests today if tested together otherwise as reported by client)</i></sup> [pos:: 0$$ tt_onUnLoad:: __$("phs").value = __$("touchscreenInput" + tstCurrentPage).value.trim() $$ condition:: String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"), "HTS VISIT", "Partner Present at this Session?")).trim().toLowerCase() != "no"]
O.1.1.1. No Partner
O.1.1.2. HIV Unknown
O.1.1.3. Partner Negative
O.1.1.4. Partner Positive

Q.1.2. Partner HIV Status [pos:: 1$$ id:: phs$$ value:: No Partner$$ condition:: false]

Q.1.3. Client Risk Category [pos:: 2$$ tt_onUnload:: evaluateReferral()$$ id:: risk_category]
O.1.3.1. Low Risk
O.1.3.2. On-going Risk
O.1.3.3. High Risk Event in Last 3 months
O.1.3.4. Risk assessment Not Done

Q.1.4. Referral for Re-Testing [pos:: 3$$ condition:: false$$ id:: referral]

Q.1.5. Appointment Date Given [pos:: 4$$ id:: appointment$$ field_type:: date]

Q.1.6. HTS Family Referral Slips Given [pos:: 5$$ concept:: HTS Family Referral Slips$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: slips]

Q.1.7. Male Condoms [pos:: 6$$ condition:: evalCondition(6)$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: male]

Q.1.8. Female Condoms [pos:: 7$$ condition:: evalCondition(7)$$ field_type:: number$$ tt_pageStyleClass:: NumbersOnlyWithDecimal$$ id:: female]

Q.1.9. Comments [pos:: 8$$ optional:: true$$ field_type:: textarea$$ id:: comments]

Q.1.10. Summary [pos:: 9$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard$$ tt_onLoad:: showAssessmentSummary()]