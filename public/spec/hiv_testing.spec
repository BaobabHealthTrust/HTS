P.1. HIV TESTING [program: HTS PROGRAM, scope: TODAY, includejs: touchScreenToolkit;hts]

Q.1.1. First Pass Test Kit 1 Expiry Date [pos: 0, id: fp_lot_1_expiry, condition: false]
Q.1.2. First Pass Test Kit 2 Expiry Date [pos: 1, id: fp_lot_2_expiry, condition: false]
Q.1.3. Immediate Repeat Test Kit 1 Expiry Date [pos: 2, id: im_lot_1_expiry, condition: false]
Q.1.4. Immediate Repeat Test Kit 2 Expiry Date [pos: 3, id: im_lot_2_expiry, condition: false]

Q.1.5. First Pass Test Kit 1 Dispatch ID [pos: 4, id: fp_lot_1_dispatch_id, condition: false]
Q.1.6. First Pass Test Kit 2 Dispatch ID [pos: 5, id: fp_lot_2_dispatch_id, condition: false]
Q.1.7. Immediate Repeat Test Kit 1 Dispatch ID [pos: 6, id: im_lot_1_dispatch_id, condition: false]
Q.1.8. Immediate Repeat Test Kit 2 Dispatch ID [pos: 7, id: im_lot_2_dispatch_id, condition: false]

Q.1.9. Client Agrees To Be Tested? [pos: 8]
O.1.9.1. No
O.1.9.2. Yes

Q.1.9.2.1. First Pass Test 1 Kit Category [pos: 9, tt_onUnload: setAjaxUrl(3), ajaxURL: /stock_categories?category=]
Q.1.9.2.2. First Pass Test Kit 1 Name [pos: 10, id: item_name, tt_onUnload: setAjaxUrl(4)]
Q.1.9.2.3. First Pass Test Kit 1 Lot Number [pos: 11, id: lot_number1, expiry: fp_lot_1_expiry, dispatch: fp_lot_1_dispatch_id]
Q.1.9.2.4. First Pass Test 1 Result [pos: 12]
O.1.9.2.4.1. -
O.1.9.2.4.2. +

Q.1.10. Client Registration Summary [pos: 13, tt_onLoad: showHIVTestingSummary(), optional: true, tt_pageStyleClass: NoControls NoKeyboard]