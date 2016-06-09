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

Q.1.10. First Pass Test 1 Kit Category [pos:: 9$$ tt_onUnload:: setAjaxUrl(3)$$ ajaxURL:: /stock_categories?category=$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
Q.1.11. First Pass Test Kit 1 Name [pos:: 10$$ id:: item_name1$$ tt_onUnload:: setAjaxUrl(4)$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
Q.1.12. First Pass Test Kit 1 Lot Number [pos:: 11$$ id:: lot_number1$$ expiry:: fp_lot_1_expiry$$ dispatch:: fp_lot_1_dispatch_id$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
Q.1.13. First Pass Test 1 Result [pos:: 12$$ id:: test1_result$$ tt_onLoad:: saveConsumption(__$("fp_lot_1_dispatch_id").value)$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
O.1.13.1. -
O.1.13.2. +

Q.1.14. First Pass Test 2 Kit Category [pos:: 13$$ tt_onUnload:: setAjaxUrl(5)$$ ajaxURL:: /stock_categories?category=$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
Q.1.15. First Pass Test Kit 2 Name [pos:: 14$$ id:: item_name$$ tt_onUnload:: setAjaxUrl(6)$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
Q.1.16. First Pass Test Kit 2 Lot Number [pos:: 15$$ id:: lot_number2$$ expiry:: fp_lot_2_expiry$$ dispatch:: fp_lot_2_dispatch_id$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
Q.1.17. First Pass Test 2 Result [pos:: 16$$ condition:: __$("consent").value == "Yes" && (decodeURIComponent(getCookie("LastHIVTest")) == "Never Tested" || decodeURIComponent(getCookie("LastHIVTest")) == "Last Negative")]
O.1.17.1. -
O.1.17.2. +

Q.1.18. Client Registration Summary [pos:: 17$$ tt_onLoad:: showHIVTestingSummary()$$ optional:: true$$ tt_pageStyleClass:: NoControls NoKeyboard]