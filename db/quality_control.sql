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

DROP TABLE IF EXISTS `quality_assurance`;

CREATE TABLE `quality_assurance` (
  `quality_assurance_test_id` int(11) NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(255) NOT NULL,
  `sample_type` varchar(255) NOT NULL,
  `test_kit_name` varchar(255) NOT NULL,
  `test_kit_lot_number` varchar(255) NOT NULL,
  `sample_name` varchar(255) NOT NULL,
  `sample_name_lot_number` varchar(255) NOT NULL,
  `control_line_seen` varchar(3) NOT NULL,
  `quality_test_result` varchar(255) NOT NULL,
  `outcome` varchar(255) NOT NULL,
  `interpretation` varchar(255) NOT NULL,
  `supervisor_code` varchar(255) NOT NULL,
  `voided` tinyint(1) NOT NULL,
  `voided_reason` varchar(255) NOT NULL,
  `voided_date` varchar(255) NOT NULL,
  `voided_by` varchar(255) NOT NULL,
  `tested_by` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date_changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `changed_by` varchar(255) NOT NULL,
  PRIMARY KEY (`quality_assurance_test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
