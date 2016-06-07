P.1. HTS CLIENT REGISTRATION [program: HTS PROGRAM, scope: TODAY, includejs: touchScreenToolkit;pat_reg]
Q.1.1. Sex/Pregnancy [pos: 0, id: sex_or_pregnancy, condition: false]
O.1.1.1. M
O.1.1.2. FNP
O.1.1.3. FP
Q.1.2. Estimate [pos: 1, id: estimate, condition: false]
Q.1.3. Age [pos: 2, id: age, condition: false]
Q.1.4. Age Group [pos: 3, id: age_group, condition: false]
Q.1.5. Birthdate [pos: 4, id: birthdate, field_type: birthdate, estimate_field: estimate]
Q.1.6. Gender [pos: 5, id: gender, tt_onLoad: calculateAge()]
O.1.6.1. Male
O.1.6.2. Female
Q.1.6.2.1. Is client pregnant? [pos: 6, id: pregnant]
O.1.6.2.1.1. Yes
O.1.6.2.1.2. No
Q.1.7. Client Registration Summary [pos: 7, tt_onLoad: updatePregnancy(), optional: true, tt_pageStyleClass: NoControls NoKeyboard]