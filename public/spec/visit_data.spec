P.1. EID VISIT [program: CHRONIC CARE PROGRAM, scope: TODAY, includejs: touchScreenToolkit]
C.1. Given an enrolled exposed child under 24 months, when they come for a visit, 	capture the following data:
Q.1.1. Visit date [pos: 0, field_type: date]
Q.1.2. Age [pos: 1, field_type: number, tt_pageStyleClass: NumbersOnly]
Q.1.3. Baby ARVs at Birth [pos: 2]
O.1.3.1. None
O.1.3.2. NVP
O.1.3.3. NVP AZT
O.1.3.4. AZT
O.1.3.5. Other
Q.1.4. Specify [condition: document.getElementById("1.3").value == "Other"]