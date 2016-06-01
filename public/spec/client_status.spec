P.1. Update HIV status [program: HTS PROGRAM, scope: TODAY, includejs: touchScreenToolkit]
Q.1.1. Client Pregnant? [pos: 0, condition: getCookie('gender') == 'F', concept: Patient Pregnant]
O.1.1.1. Yes
O.1.1.2. No
Q.1.2. HTC Access Type [pos: 1]
O.1.2.1. Routine HTC within health service (PITC)
O.1.2.2. Comes with HTC family Ref slip
O.1.2.3. Other
Q.1.3. Last HIV test Result [pos: 2, concept: Last HIV test, id: last]
O.1.3.1. Never tested
O.1.3.2. Negative
O.1.3.3. Positive
O.1.3.4. Exposed Infant
O.1.3.5. Inconclusive
Q.1.4. Last test date [pos: 3, concept: Hiv test date, field_type: date, condition: document.getElementById('last').value.toUpperCase() == "NEVER TESTED"]
Q.1.5. Mother HIV positive [pos: 4, condition: typeof(age) != "undefined" && age < 1, concept: Mother HIV status]
O.1.5.1. Yes
O.1.5.2. No