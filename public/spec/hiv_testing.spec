P.1. HIV TESTING [program: HTS PROGRAM, scope: TODAY, includejs: touchScreenToolkit;hts]

Q.1.1. First Pass Test Kit 1 Expiry Date [pos: 0, id: fp_lot_1_expiry, condition: false]
Q.1.2. First Pass Test Kit 2 Expiry Date [pos: 1, id: fp_lot_2_expiry, condition: false]
Q.1.3. Immediate Repeat Test Kit 1 Expiry Date [pos: 2, id: im_lot_1_expiry, condition: false]
Q.1.4. Immediate Repeat Test Kit 2 Expiry Date [pos: 3, id: im_lot_2_expiry, condition: false]

Q.1.5. Client Agrees To Be Tested? [pos: 4]
O.1.5.1. No
O.1.5.2. Yes

Q.1.5.2.1. First Pass Test 1 Kit Category [pos: 5, tt_onUnload: setAjaxUrl(3), ajaxURL: /stock_categories?category=]
Q.1.5.2.2. First Pass Test Kit 1 Name [pos: 6, id: item_name, tt_onUnload: setAjaxUrl(4)]
Q.1.5.2.3. First Pass Test Kit 1 Lot Number [pos: 7, id: lot_number1, expiry: fp_lot_1_expiry]
Q.1.5.2.4. First Pass Test 1 Result [pos: 8]
O.1.5.2.4.1. -
O.1.5.2.4.2. +

Q.1.6. Client Registration Summary [pos: 9, tt_onLoad: showHIVTestingSummary(), optional: true, tt_pageStyleClass: NoControls NoKeyboard]