UPDATE encounter SET patient_program_id = (SELECT patient_program_id FROM patient_program p WHERE p.patient_id = encounter.patient_id LIMIT 1) WHERE encounter_id > 1;
