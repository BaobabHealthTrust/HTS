P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]
Q.1.1. Sex/Pregnancy [pos:: 0$$ id:: sex_or_pregnancy$$ type::hidden]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP

Q.1.2. Estimate [pos:: 1$$ id:: estimate$$ type::hidden]

Q.1.3. Age [pos:: 2$$ id:: age$$ type::hidden]

Q.1.4. Age Group [pos:: 3$$ id:: age_group$$ type::hidden]

Q.1.5. Birthdate [pos:: 4$$ id:: birthdate$$ field_type:: birthdate$$ estimate_field:: estimate$$type :: hidden]

Q.1.6. Year of Birth [pos::5 $$ id :: birthyear $$ field_type :: number $$ tt_pageStyleClass::Numeric NumbersWithUnknown $$ tt_onUnLoad ::validateMaxMinYear()]

Q.1.7. Age Estimate [pos :: 6 $$ id :: age_estimate $$ field_type :: number $$ condition :: __$('birthyear').value.trim().toLowerCase() == "unknown" $$  tt_pageStyleClass::Numeric NumbersOnly $$ tt_onUnLoad :: setEstimatedAgeValue()]

Q.1.8. Month of Birth [pos :: 7 $$ id :: birthmonth $$ condition :: __$('birthyear').value.trim().toLowerCase() != "unknown" $$ ajaxURL ::/stock/month $$ tt_onUnLoad :: validateAndProcessMonth() $$ allowFreeText ::false]


Q.1.9. Day of Birth [pos :: 8 $$ id :: birthday $$ condition :: __$('birthyear').value.trim().toLowerCase() != "unknown" && __$('birthmonth').value.trim().toLowerCase() != "unknown" $$ tt_onLoad :: monthDaysKeyPad() $$ tt_onUnLoad::setAgeValues()]

Q.1.10. Gender [pos:: 9$$ id:: gender$$ tt_onLoad:: calculateAge()]
O.1.10.1. Male
O.1.10.2. Female

Q.1.10.2.1. Is client pregnant? [pos:: 10$$ id:: pregnant]
O.1.10.2.1.1. Yes
O.1.10.2.1.2. No

Q.1.10.2.2. How many months pregnant? [pos :: 11 $$ id :: months_pregnant $$ field_type :: number $$ tt_pageStyleClass:: Numeric NumbersOnly $$ condition :: __$('pregnant').value.trim().toLowerCase() == 'yes' $$ min ::1 $$ max :: 10]

Q.1.11. Consent given to be contacted? [pos:: 12$$ id:: capture_details]
O.1.11.1. Yes
O.1.11.2. No

Q.1.12. First Name [pos:: 13$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /fnames_query?name=$$ id:: first_name]

Q.1.13. Family Name [pos:: 14$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /lnames_query?name=$$ id:: last_name]

Q.1.14. Contact Detail Type [pos:: 15 $$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes';$$tt_onUnload:: setPhoneNumberValidation('phone_number')$$ id :: detail_type]
O.1.14.1. Phone Number
O.1.14.2. Current Residence
O.1.14.3. Both

Q.1.15. Client Phone Number [pos:: 16$$ id:: phone_number $$ condition :: __$('detail_type').value.trim().toLowerCase() == 'phone number' || __$('detail_type').value.trim().toLowerCase() == 'both']

Q.1.16. Current Region [pos:: 17 $$ id :: region $$ tt_onUnload:: setAjaxUrl(0)$$ tt_requireNextClick:: false $$ condition :: __$('detail_type').value.trim().toLowerCase() == 'current residence' || __$('detail_type').value.trim().toLowerCase() == 'both']
O.1.16.1. Central Region
O.1.16.2. Northern Region
O.1.16.3. Southern Region

Q.1.17. Current District [pos:: 18$$ id:: district$$ tt_onUnload:: setAjaxUrl(1)$$ tt_requireNextClick:: false $$ condition:: __$('region').value.trim().length > 0]

Q.1.19. Current T/A [pos:: 19 $$ id:: ta$$ tt_onUnload:: setAjaxUrl(2)$$ tt_requireNextClick:: false $$ condition:: __$('district').value.trim().length > 0]

Q.1.20. Current Village [pos:: 20 $$ id:: village$$ tt_requireNextClick:: false $$ condition:: __$('ta').value.trim().length > 0]

Q.1.21. Current Village Specify [pos:: 21 $$ id:: village_specify$$ tt_requireNextClick:: true $$ condition:: __$('village').value == 'Other']

Q.1.22. Closest Landmark [pos:: 22 $$ id:: closest_landmark $$ condition:: __$('village').value.trim().length > 0]

Q.1.23. Client Registration Summary [pos:: 23 $$ tt_onLoad:: showDetailsSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]

Q.1.24. Client Registration Summary (cont'd) [pos:: 24 $$ tt_onLoad:: updatePregnancy()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]