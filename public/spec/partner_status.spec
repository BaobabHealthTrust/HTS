P.1. PARTNER STATUS [program:: HTS PROGRAM$$ scope:: TODAY$$ includejs:: touchScreenToolkit;hts]
Q.1.1. Partner HIV Status <sup style="font-size: 14px;"><i>(From tests today if tested together otherwise as reported by client)</i></sup> [pos:: 0$$ tt_onUnLoad:: __$("phs").value = __$("touchscreenInput" + tstCurrentPage).value.trim() $$ condition:: String(window.parent.dashboard.queryActiveObs("HTS PROGRAM", (new Date()).format("YYYY-mm-dd"), "HTS VISIT", "Partner Present at this Session?")).trim().toLowerCase() != "no"]
O.1.1.1. No Partner
O.1.1.2. HIV Unknown
O.1.1.3. Partner Negative
O.1.1.4. Partner Positive
Q.1.2. Partner HIV Status [pos:: 1$$ id:: phs$$ value:: No Partner$$ condition:: false]
C.1.3. Partner Status Summary [pos:: 2]