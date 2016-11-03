-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: htc_inventory
-- ------------------------------------------------------
-- Server version	5.5.49-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--


DROP TABLE IF EXISTS `proficiency_test`;

CREATE TABLE `proficiency_test` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `proficiency_test_date` varchar(255) NOT NULL,
  `hts_provider_id` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `pt_panel_lot_number` varchar(255) NOT NULL,
  `dts_pack` varchar(500) NOT NULL,
  `test_kit_1_name` varchar(255) NOT NULL,
  `test_kit_1_lot_number` varchar(255) NOT NULL,
  `test_kit_1_expiry` varchar(255) NOT NULL,
  `test_kit_2_name` varchar(255) NOT NULL,
  `test_kit_2_lot_number` varchar(255) NOT NULL,
  `test_kit_2_expiry` varchar(255) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `voided` tinyint(1) NOT NULL,
  `voided_reason` varchar(255) NOT NULL,
  `voided_date` varchar(255) NOT NULL,
  `voided_by` varchar(255) NOT NULL,
  `approved` varchar(3) NOT NULL DEFAULT '',
  `approved_by` varchar(255) NOT NULL,
  `score` int(3) NOT NULL DEFAULT '-1',
  `action_plan` varchar(1000) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `proficiency_test_result`;

CREATE TABLE `proficiency_test_result` (
  `result_id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `panel_number` int(1) NOT NULL,
  `first_pass_test_1` char(1) NOT NULL,
  `first_pass_test_1_time` varchar(10) NOT NULL,
  `first_pass_test_2` char(1) NOT NULL,
  `first_pass_test_2_time` char(10) NOT NULL,
  `im_pass_test_1` char(1) NOT NULL,
  `im_pass_test_1_time` char(10) NOT NULL,
  `im_pass_test_2` char(1) NOT NULL,
  `im_pass_test_2_time` char(10) NOT NULL,
  `final_result` char(1) NOT NULL,
  `official_result` varchar(255) NOT NULL,
  PRIMARY KEY (`result_id`),
  KEY `pid` (`pid`),
  CONSTRAINT `proficiency_test_result_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `proficiency_test` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `proficiency_test_official_result`;

CREATE TABLE `proficiency_test_official_result` (
  `proficiency_test_official_result_id` int(11) NOT NULL AUTO_INCREMENT,
  `pt_panel_lot_number` varchar(255) NOT NULL,
  `panel_1` varchar(255) NOT NULL,
  `panel_2` varchar(255) NOT NULL,
  `panel_3` varchar(255) NOT NULL,
  `panel_4` varchar(255) NOT NULL,
  `panel_5` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(255) NOT NULL,
  `date_changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `changed_by` datetime NOT NULL,
  `voided` int(1) NOT NULL DEFAULT '0',
  `voided_by` varchar(255) NOT NULL,
  `date_voided` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`proficiency_test_official_result_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `quality_assurance`;

CREATE TABLE `quality_assurance` (
  `quality_assurance_test_id` int(11) NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(255) NOT NULL,
  `qc_test_date` varchar(255) NOT NULL,
  `sample_type` varchar(255) NOT NULL,
  `test_kit_name` varchar(255) NOT NULL,
  `test_kit_lot_number` varchar(255) NOT NULL,
  `test_kit_expiry_date` varchar(255) NOT NULL,
  `sample_name` varchar(255) NOT NULL,
  `sample_name_lot_number` varchar(255) NOT NULL,
  `sample_expiry_date` varchar(255) NOT NULL,
  `control_line_seen` varchar(3) NOT NULL,
  `quality_test_result` varchar(255) NOT NULL,
  `outcome` varchar(255) NOT NULL,
  `interpretation` varchar(255) NOT NULL,
  `supervisor_code` varchar(255) NOT NULL,
  `voided` tinyint(1) NOT NULL,
  `voided_reason` varchar(255) NOT NULL,
  `voided_date` varchar(255) NOT NULL,
  `voided_by` varchar(255) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `approval_status` varchar(255) NOT NULL DEFAULT '',
  `reason_for_approval` varchar(255) NOT NULL,
  `comments` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `changed_by` varchar(255) NOT NULL,
  PRIMARY KEY (`quality_assurance_test_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;


LOCK TABLES `quality_assurance` WRITE;
/*!40000 ALTER TABLE `quality_assurance` DISABLE KEYS */;
/*!40000 ALTER TABLE `quality_assurance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-02 11:54:03
