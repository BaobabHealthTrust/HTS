P.1. DNA-PCR TEST [program: EARLY INFANT DIAGNOSIS PROGRAM, scope: TODAY]
C.1.1. Given an exposed child under 24 months, when the child is being enrolled:
Q.1.1.1. DNA-PCR Testing Sample Date [pos: 0, field_type: date, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.2. DNA-PCR Testing Sample ID [pos: 1, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.3. DNA-PCR Testing Result received Date [pos: 2, field_type: date, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.4. DNA-PCR Testing Result [pos: 3, condition: <%= @patient.age_in_months.to_i < 24 %>]
O.1.1.4.1. Negative
O.1.1.4.2. Positive

Q.1.1.5. DNA-PCR Testing Result given Date [pos: 4, field_type: date, condition: <%= @patient.age_in_months.to_i < 24 %>]

Q.1.1.6. DNA-PCR Testing Result given Age (months) [pos: 5, concept: DNA-PCR Testing Result given Age, field_type: number, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i < 24 %>]

C.1.2. When the child is older than 12 months but less than 24 months
Q.1.2.1. DNA-PCR Testing Sample Date 2 [pos: 6, field_type: date, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.2. DNA-PCR Testing Sample ID 2 [pos: 7, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.3. DNA-PCR Testing Result received Date 2 [pos: 8, field_type: date, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.4. DNA-PCR Testing Result 2 [pos: 9, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]
O.1.2.4.1. Negative
O.1.2.4.2. Positive

Q.1.2.5. DNA-PCR Testing Result given Date 2 [pos: 10, field_type: date, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>]

Q.1.2.6. DNA-PCR Testing Result given Age 2 (months) [pos: 11, concept: DNA-PCR Testing Result given Age 2, field_type: number, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i > 12 and @patient.age_in_months.to_i < 24 %>] 

C.1.3. When the child is older than 24 months
Q.1.3.1. DNA-PCR Testing Sample Date 3 [pos: 12, field_type: date, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.2. DNA-PCR Testing Sample ID 3 [pos: 13, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.3. DNA-PCR Testing Result received Date 3 [pos: 14, field_type: date, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.4. DNA-PCR Testing Result 2 [pos: 15, condition: <%= @patient.age_in_months.to_i > 24 %>]
O.1.3.4.1. Negative
O.1.3.4.2. Positive

Q.1.3.5. DNA-PCR Testing Result given Date 3 [pos: 16, field_type: date, condition: <%= @patient.age_in_months.to_i > 24 %>]

Q.1.3.6. DNA-PCR Testing Result given Age 3 (months) [pos: 17, concept: DNA-PCR Testing Result given Age 3, field_type: number, tt_pageStyleClass: NumbersOnlyWithUnknown, condition: <%= @patient.age_in_months.to_i > 24 %>] 


