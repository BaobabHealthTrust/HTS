P.1. HIV TESTING [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]

Q.1.1. First Pass Test Kit 1 Expiry Date [pos:: 0$$ id:: fp_lot_1_expiry$$ condition:: false]
Q.1.2. First Pass Test Kit 2 Expiry Date [pos:: 1$$ id:: fp_lot_2_expiry$$ condition:: false]
Q.1.3. Immediate Repeat Test Kit 1 Expiry Date [pos:: 2$$ id:: im_lot_1_expiry$$ condition:: false]
Q.1.4. Immediate Repeat Test Kit 2 Expiry Date [pos:: 3$$ id:: im_lot_2_expiry$$ condition:: false]

Q.1.5. First Pass Test Kit 1 Dispatch ID [pos:: 4$$ id:: fp_lot_1_dispatch_id$$ condition:: false]
Q.1.6. First Pass Test Kit 2 Dispatch ID [pos:: 5$$ id:: fp_lot_2_dispatch_id$$ condition:: false]
Q.1.7. Immediate Repeat Test Kit 1 Dispatch ID [pos:: 6$$ id:: im_lot_1_dispatch_id$$ condition:: false]
Q.1.8. Immediate Repeat Test Kit 2 Dispatch ID [pos:: 7$$ id:: im_lot_2_dispatch_id$$ condition:: false]

Q.1.9. Client Agrees To Be Tested? [pos:: 8$$ id:: consent]
O.1.9.1. No
O.1.9.2. Yes

Q.1.10. First Pass Test 1 Kit Category [pos:: 9$$ tt_onUnload:: setAjaxUrl(3)$$ ajaxURL:: /stock_categories?category=$$ condition:: evalCondition(0)]
Q.1.11. First Pass Test Kit 1 Name [pos:: 10$$ id:: fp_item_name1$$ tt_onUnload:: setAjaxUrl(4)$$ condition:: evalCondition(0)]
Q.1.12. First Pass Test Kit 1 Lot Number [pos:: 11$$ id:: fp_lot_number1$$ expiry:: fp_lot_1_expiry$$ dispatch:: fp_lot_1_dispatch_id$$ condition:: evalCondition(0)]
Q.1.13. First Pass Test 1 Result [pos:: 12$$ id:: fp_test1_result$$ tt_onLoad:: saveConsumption(__$("fp_lot_1_dispatch_id").value); loadSerialTest(__$("fp_test1_result"), __$("fp_test1_duration"))$$ condition:: evalCondition(1)$$ tt_pageStyleClass:: NoControls NoKeyboard$$ optional:: true$$ tt_onUnload:: activateNavBtn()]
O.1.13.1. -
O.1.13.2. +

Q.1.14. First Pass Test 2 Kit Category [pos:: 13$$ tt_onUnload:: setAjaxUrl(5)$$ ajaxURL:: /stock_categories?category=$$ condition:: evalCondition(2)]
Q.1.15. First Pass Test Kit 2 Name [pos:: 14$$ id:: fp_item_name2$$ tt_onUnload:: setAjaxUrl(6)$$ condition:: evalCondition(2)]
Q.1.16. First Pass Test Kit 2 Lot Number [pos:: 15$$ id:: fp_lot_number2$$ expiry:: fp_lot_2_expiry$$ dispatch:: fp_lot_2_dispatch_id$$ condition:: evalCondition(2)]
Q.1.17. First Pass Test 2 Result [pos:: 16$$ id:: fp_test2_result$$ condition:: evalCondition(3)$$ tt_onLoad:: saveConsumption(__$("fp_lot_2_dispatch_id").value); loadSerialTest(__$("fp_test2_result"), __$("fp_test2_duration"))$$ tt_pageStyleClass:: NoControls NoKeyboard$$ optional:: true$$ tt_onUnload:: activateNavBtn()]
O.1.17.1. -
O.1.17.2. +

Q.1.18. First Pass Test 1 & 2 Parallel Tests [pos:: 17$$ id:: fp_parallel$$ tt_onLoad:: saveConsumption(__$("fp_lot_1_dispatch_id").value); saveConsumption(__$("fp_lot_2_dispatch_id").value); loadPassParallelTests(__$("fp_test1_result"), __$("fp_test1_duration"), __$("fp_test2_result"), __$("fp_test2_duration"))$$ condition:: evalCondition(4)$$ tt_pageStyleClass:: NoControls NoKeyboard$$ optional:: true$$ tt_onUnload:: activateNavBtn()]

Q.1.19. Immediate Repeat Tester [pos:: 18$$ id:: im_tester$$ condition:: evalCondition(5)$$ ajaxURL:: /list_users?name=]

Q.1.20. Immediate Repeat Test 1 Kit Category [pos:: 19$$ tt_onUnload:: setAjaxUrl(7)$$ ajaxURL:: /stock_categories?category=$$ condition:: evalCondition(5)]
Q.1.21. Immediate Repeat Test Kit 1 Name [pos:: 20$$ id:: im_item_name1$$ tt_onUnload:: setAjaxUrl(8)$$ condition:: evalCondition(5)]
Q.1.22. Immediate Repeat Test Kit 1 Lot Number [pos:: 21$$ id:: im_lot_number1$$ expiry:: im_lot_1_expiry$$ dispatch:: im_lot_1_dispatch_id$$ condition:: evalCondition(5)]
Q.1.23. Immediate Repeat Test 1 Result [pos:: 22$$ id:: im_test1_result$$ tt_onLoad:: saveConsumption(__$("im_lot_1_dispatch_id").value)$$ condition:: false]
O.1.23.1. -
O.1.23.2. +

Q.1.24. Immediate Repeat Test 2 Kit Category [pos:: 23$$ tt_onUnload:: setAjaxUrl(9)$$ ajaxURL:: /stock_categories?category=$$ condition:: evalCondition(5)]
Q.1.25. Immediate Repeat Test Kit 2 Name [pos:: 24$$ id:: im_item_name2$$ tt_onUnload:: setAjaxUrl(10)$$ condition:: evalCondition(5)]
Q.1.26. Immediate Repeat Test Kit 2 Lot Number [pos:: 25$$ id:: im_lot_number2$$ expiry:: im_lot_2_expiry$$ dispatch:: im_lot_2_dispatch_id$$ condition:: evalCondition(5)]
Q.1.27. Immediate Repeat Test 2 Result [pos:: 26$$ id:: im_test2_result$$ tt_onLoad:: saveConsumption(__$("im_lot_2_dispatch_id").value)$$ condition:: false]
O.1.27.1. -
O.1.27.2. +

Q.1.28. Immediate Repeat Test 1 & 2 Parallel Tests [pos:: 27$$ id:: fp_parallel$$ tt_onLoad:: saveConsumption(__$("fp_lot_1_dispatch_id").value); saveConsumption(__$("fp_lot_2_dispatch_id").value); loadPassParallelTests(__$("im_test1_result"), __$("im_test1_duration"), __$("im_test2_result"), __$("im_test2_duration"))$$ condition:: evalCondition(5)$$ tt_pageStyleClass:: NoControls NoKeyboard$$ optional:: true$$ tt_onUnload:: activateNavBtn()]

Q.1.29. First Pass Test Kit 1 Testing Duration (Minutes) [pos:: 28$$ id:: fp_test1_duration$$ condition:: false]
Q.1.30. First Pass Test Kit 2 Testing Duration (Minutes) [pos:: 29$$ id:: fp_test2_duration$$ condition:: false]
Q.1.31. Immediate Repeat Test Kit 1 Testing Duration (Minutes) [pos:: 30$$ id:: im_test1_duration$$ condition:: false]
Q.1.32. Immediate Repeat Test Kit 2 Testing Duration (Minutes) [pos:: 31$$ id:: im_test2_duration$$ condition:: false]

Q.1.33. Client Registration Summary [pos:: 32$$ tt_onLoad:: showHIVTestingSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]