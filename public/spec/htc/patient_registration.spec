P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]
Q.1.1. Sex/Pregnancy [pos:: 0$$ id:: sex_or_pregnancy$$ condition:: false]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP
Q.1.2. Estimate [pos:: 1$$ id:: estimate$$ condition:: false]
Q.1.3. Age [pos:: 2$$ id:: age$$ condition:: false]
Q.1.4. Age Group [pos:: 3$$ id:: age_group$$ condition:: false]
Q.1.5. Birthdate [pos:: 4$$ id:: birthdate$$ field_type:: birthdate$$ estimate_field:: estimate]
Q.1.6. Gender [pos:: 5$$ id:: gender$$ tt_onLoad:: calculateAge()]
O.1.6.1. Male
O.1.6.2. Female
Q.1.6.2.1. Is client pregnant? [pos:: 6$$ id:: pregnant]
O.1.6.2.1.1. Yes
O.1.6.2.1.2. No
Q.1.7. Consent given to capture personal details? [pos:: 7$$ id:: capture_details]
O.1.7.1. Yes
O.1.7.2. No
Q.1.8. First Name [pos:: 8$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /fnames_query?name=$$ id:: first_name]
Q.1.9. Family Name [pos:: 9$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /lnames_query?name=$$ id:: last_name]
Q.1.10. Contact Detail Type [pos:: 10 $$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes';$$tt_onUnload:: setPhoneNumberValidatetion('phone_number')]
O.1.10.1. Phone Number
Q.1.10.1.1. Client Phone Number [pos:: 11$$ id:: phone_number]
O.1.10.2. Current Residence
Q.1.10.2.1. Current Region [pos:: 12$$ tt_onUnload:: setAjaxUrl(0)$$ tt_requireNextClick:: false]
O.1.10.2.1.1. Central Region
O.1.10.2.1.2. Northern Region
O.1.10.2.1.3. Southern Region
Q.1.10.2.2. Current District [pos:: 13$$ id:: district$$ tt_onUnload:: setAjaxUrl(1)$$ tt_requireNextClick:: false]
Q.1.10.2.3. Current T/A [pos:: 14$$ id:: ta$$ tt_onUnload:: setAjaxUrl(2)$$ tt_requireNextClick:: false]
Q.1.10.2.4. Current Village [pos:: 15$$ id:: village$$ tt_requireNextClick:: false]
Q.1.10.2.5. Closest Landmark [pos:: 16$$ id:: closest_landmark]
Q.1.12. Client Registration Summary [pos:: 18$$ tt_onLoad:: showDetailsSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]
Q.1.13. Client Registration Summary (cont'd) [pos:: 19$$ tt_onLoad:: updatePregnancy()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]