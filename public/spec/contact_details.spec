P.1. HTS CLIENT REGISTRATION [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]
Q.1.1. Client Details Can Be Captured? [pos:: 0$$ id:: capture_details]
O.1.1.1. Yes
O.1.1.2. No
Q.1.2. First Name [pos:: 1$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /fnames_query?name=]
Q.1.3. Family Name [pos:: 2$$ allowFreeText:: true$$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes'; $$ ajaxURL:: /lnames_query?name=]
Q.1.4. Contact Detail Type [pos:: 3 $$ condition:: __$('capture_details').value.trim().toLowerCase() == 'yes';]
O.1.4.1. Phone Number
Q.1.4.1.1. Client Phone Number [pos:: 4$$ id:: phone_number]
O.1.4.2. Current Residence
Q.1.4.2.1. Current Region [pos:: 5$$ tt_onUnload:: setAjaxUrl(0)$$ tt_requireNextClick:: false]
O.1.4.2.1.1. Central Region
O.1.4.2.1.2. Northern Region
O.1.4.2.1.3. Southern Region
Q.1.4.2.2. Current District [pos:: 6$$ id:: district$$ tt_onUnload:: setAjaxUrl(1)$$ tt_requireNextClick:: false]
Q.1.4.2.3. Current T/A [pos:: 7$$ id:: ta$$ tt_onUnload:: setAjaxUrl(2)$$ tt_requireNextClick:: false]
Q.1.4.2.4. Current Village [pos:: 8$$ id:: village$$ tt_requireNextClick:: false]
Q.1.4.2.5. Closest Landmark [pos:: 9$$ id:: closest_landmark]
Q.1.5. Client Registration Summary [pos:: 10$$ tt_onLoad:: showDetailsSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]