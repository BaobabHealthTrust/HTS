P.1. RAPID ANTIBODY TEST [program: EARLY INFANT DIAGNOSIS PROGRAM, scope: TODAY]
C.1.1. Given an exposed child under 24 months, when the child is being enrolled:

Q.1.1.1. Rapid Antibody Testing Sample Date [pos: 0, field_type: date, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.2. Rapid Antibody Testing Age (months) [pos: 1, concept: Rapid Antibody Testing Age, field_type: number, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.3. Rapid Antibody Testing HTC Serial No [pos: 2, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.4. Rapid Antibody Testing Result [pos: 3, condition: <%= @patient.age_in_months.to_i < 24 %>]
O.1.1.4.1. Negative
O.1.1.4.2. Positive
O.1.1.4.3. Inconclusive

C.1.2. When the child is older than 12 months but less than 24 months
Q.1.2.1. Rapid Antibody Testing Sample Date 2 [pos: 4, field_type: date, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.2. Rapid Antibody Testing Age 2 (months) [pos: 5, concept: Rapid Antibody Testing Age 2, field_type: number, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.3. Rapid Antibody Testing HTC Serial No 2 [pos: 6, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.4. Rapid Antibody Testing Result 2 [pos: 7, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]
O.1.2.4.1. Negative
O.1.2.4.2. Positive
O.1.2.4.3. Inconclusive

C.1.3. When the child is older than 24 months
Q.1.3.1. Rapid Antibody Testing Sample Date 3 [pos: 8, field_type: date, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.2. Rapid Antibody Testing Age 3 (months) [pos: 9, concept: Rapid Antibody Testing Age 3, field_type: number, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.3. Rapid Antibody Testing HTC Serial No 3 [pos: 10, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.4. Rapid Antibody Testing Result 3 [pos: 11, condition: <%= @patient.age_in_months.to_i > 24 %>]
O.1.3.4.1. Negative
O.1.3.4.2. Positive
O.1.3.4.3. Inconclusive





