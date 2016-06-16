--
-- Table structure for table `htc_report`
--

DROP TABLE IF EXISTS `htc_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htc_report` (
  `obs_id` int(11) NOT NULL,
  `obs_datetime` datetime DEFAULT NULL,
  `sex_pregnancy` varchar(255) DEFAULT NULL,
  `last_hiv_test` varchar(255) DEFAULT NULL,
  `outcome_summary` varchar(255) DEFAULT NULL,
  `age_group` varchar(255) DEFAULT NULL,
  `partner_present` varchar(255) DEFAULT NULL,
  `result_given_to_client` varchar(255) DEFAULT NULL,
  `htc_access_type` varchar(255) DEFAULT NULL,
  `partner_htc_slips_given` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`obs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DELIMITER $$

DROP TRIGGER IF EXISTS new_obs$$

DROP TRIGGER IF EXISTS obs_update$$

DROP TRIGGER IF EXISTS obs_delete$$

CREATE TRIGGER new_obs 
AFTER INSERT ON `obs` FOR EACH ROW
BEGIN

	DECLARE sex_pregnancy INT(11);
	DECLARE last_hiv_test INT(11);
	DECLARE outcome_summary INT(11);
	DECLARE age_group INT(11);
	DECLARE partner_present INT(11);
	DECLARE result_given_to_client INT(11);
	DECLARE htc_access_type INT(11);
	DECLARE partner_htc_slips_given INT(11);
	
	SELECT concept_id INTO @sex_pregnancy FROM concept_name WHERE name = "Sex/Pregnancy";
	
	SELECT concept_id INTO @last_hiv_test FROM concept_name WHERE name = "Last HIV Test";  

	SELECT concept_id INTO @outcome_summary FROM concept_name WHERE name = "Outcome Summary";  

	SELECT concept_id INTO @age_group FROM concept_name WHERE name = "Age Group";  

	SELECT concept_id INTO @partner_present FROM concept_name WHERE name = "Partner Present at this Session?";  

	SELECT concept_id INTO @result_given_to_client FROM concept_name WHERE name = "Result Given to Client";  

	SELECT concept_id INTO @htc_access_type FROM concept_name WHERE name = "HTS Access Type";

	SELECT concept_id INTO @partner_htc_slips_given FROM concept_name WHERE name = "HTS Family Referral Slips";

	CASE NEW.concept_id
	
		WHEN @sex_pregnancy THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, sex_pregnancy)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @last_hiv_test THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, last_hiv_test)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @outcome_summary THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, outcome_summary)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @age_group THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, age_group)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @partner_present THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, partner_present)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @result_given_to_client THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, result_given_to_client)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @htc_access_type THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, htc_access_type)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_text);
		
		WHEN @partner_htc_slips_given THEN
		
			INSERT INTO htc_report (obs_id, obs_datetime, partner_htc_slips_given)
			VALUES (NEW.obs_id, NEW.obs_datetime, NEW.value_numeric);
		
		ELSE
			BEGIN
			END;
	END CASE;

END$$

CREATE TRIGGER obs_update
AFTER UPDATE ON `obs` FOR EACH ROW
BEGIN

	DECLARE sex_pregnancy INT(11);
	DECLARE last_hiv_test INT(11);
	DECLARE outcome_summary INT(11);
	DECLARE age_group INT(11);
	DECLARE partner_present INT(11);
	DECLARE result_given_to_client INT(11);
	DECLARE htc_access_type INT(11);
	DECLARE partner_htc_slips_given INT(11);

	IF NEW.voided = 1 THEN
	
		DELETE FROM htc_report WHERE obs_id = OLD.obs_id;
		
	ELSE
	
		SELECT concept_id INTO @sex_pregnancy FROM concept_name WHERE name = "Sex/Pregnancy";
	
		SELECT concept_id INTO @last_hiv_test FROM concept_name WHERE name = "Last HIV Test";  

		SELECT concept_id INTO @outcome_summary FROM concept_name WHERE name = "Outcome Summary";  

		SELECT concept_id INTO @age_group FROM concept_name WHERE name = "Age Group";  

		SELECT concept_id INTO @partner_present FROM concept_name WHERE name = "Partner Present at this Session?";  

		SELECT concept_id INTO @result_given_to_client FROM concept_name WHERE name = "Result Given to Client";  

		SELECT concept_id INTO @htc_access_type FROM concept_name WHERE name = "HTS Access Type";

		SELECT concept_id INTO @partner_htc_slips_given FROM concept_name WHERE name = "HTS Family Referral Slips";

		CASE NEW.concept_id
	
			WHEN @sex_pregnancy THEN
		
				UPDATE htc_report SET sex_pregnancy = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @last_hiv_test THEN
		
				UPDATE htc_report SET last_hiv_test = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @outcome_summary THEN
		
				UPDATE htc_report SET outcome_summary = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @age_group THEN
		
				UPDATE htc_report SET age_group = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @partner_present THEN
		
				UPDATE htc_report SET partner_present = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @result_given_to_client THEN
		
				UPDATE htc_report SET result_given_to_client = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @htc_access_type THEN
		
				UPDATE htc_report SET htc_access_type = NEW.value_text WHERE obs_id = NEW.obs_id;
		
			WHEN @partner_htc_slips_given THEN
		
				UPDATE htc_report SET partner_htc_slips_given = NEW.value_numeric WHERE obs_id = NEW.obs_id;
		
			ELSE
				BEGIN
				END;
		END CASE;
		
	END IF;

END$$

CREATE TRIGGER obs_delete
BEFORE DELETE ON `obs` FOR EACH ROW
BEGIN

	DELETE FROM htc_report WHERE obs_id = OLD.obs_id;

END$$

DELIMITER ;
