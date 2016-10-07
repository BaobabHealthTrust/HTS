P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]
Q.1.1. Sex/Pregnancy [pos:: 0$$ id:: sex_or_pregnancy$$ type::hidden]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP

Q.1.2. Estimate [pos:: 1$$ id:: estimate$$ type::hidden]

Q.1.3. Age [pos:: 2$$ id:: age$$ type::hidden]

Q.1.4. Age Group [pos:: 3$$ id:: age_group$$ type::hidden]

Q.1.5. Birthdate [pos:: 4$$ id:: birthdate$$ estimate_field:: estimate$$tt_onLoad::getDatePickerCustom()]

Q.1.6. Gender [pos:: 5$$ id:: gender$$ tt_onLoad:: calculateAge()]
O.1.6.1. Male
O.1.6.2. Female

Q.1.6.2.1. Is client pregnant? [pos:: 6$$ id:: pregnant]
O.1.6.2.1.1. Yes
O.1.6.2.1.2. No

Q.1.7. Consent given to be contacted? [pos:: 7$$ id:: capture_details]
O.1.7.1. Yes
O.1.7.2. No

Q.1.8. First Name [pos:: 8$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /fnames_query?name=$$ id:: first_name]

Q.1.9. Family Name [pos:: 9$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /lnames_query?name=$$ id:: last_name]

Q.1.10. Contact Detail Type [pos:: 10 $$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes';$$tt_onUnload:: setPhoneNumberValidation('phone_number')$$ id :: detail_type]
O.1.10.1. Phone Number
O.1.10.2. Current Residence
O.1.10.3. Both

Q.1.11. Client Phone Number [pos:: 11$$ id:: phone_number $$ condition :: __$('detail_type').value.trim().toLowerCase() == 'phone number' || __$('detail_type').value.trim().toLowerCase() == 'both']

Q.1.12. Current Region [pos:: 12 $$ id :: region $$ tt_onUnload:: setAjaxUrl(0)$$ tt_requireNextClick:: false $$ condition :: __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both']
O.1.12.1. Central Region
O.1.12.2. Northern Region
O.1.12.3. Southern Region

Q.1.13. Current District [pos:: 13$$ id:: district$$ tt_onUnload:: setAjaxUrl(1)$$ tt_requireNextClick:: false $$ condition:: __$('region').value.trim().length > 0]

Q.1.14. Current T/A [pos:: 14$$ id:: ta$$ tt_onUnload:: setAjaxUrl(2)$$ tt_requireNextClick:: false $$ condition:: __$('district').value.trim().length > 0]

Q.1.15. Current Village [pos:: 15$$ id:: village$$ tt_requireNextClick:: false $$ condition:: __$('ta').value.trim().length > 0]

Q.1.16. Current Village Specify [pos:: 16$$ id:: village_specify$$ tt_requireNextClick:: true $$ condition:: __$('village').value == 'Other']

Q.1.17. Closest Landmark [pos:: 17$$ id:: closest_landmark $$ condition:: __$('village').value.trim().length > 0]

Q.1.18. Client Registration Summary [pos:: 18$$ tt_onLoad:: showDetailsSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]

Q.1.19. Client Registration Summary (cont'd) [pos:: 19$$ tt_onLoad:: updatePregnancy()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]