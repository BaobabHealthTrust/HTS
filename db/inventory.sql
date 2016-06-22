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

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispatch`
--

DROP TABLE IF EXISTS `dispatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispatch` (
  `dispatch_id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `dispatch_quantity` int(11) DEFAULT NULL,
  `dispatch_datetime` datetime DEFAULT NULL,
  `dispatch_who_dispatched` varchar(45) DEFAULT NULL,
  `dispatch_who_received` varchar(45) DEFAULT NULL,
  `dispatch_who_authorised` varchar(45) DEFAULT NULL,
  `dispatch_destination` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`dispatch_id`),
  KEY `fk_dispatch_1_idx` (`stock_id`),
  KEY `fk_dispatch_2_idx` (`dispatch_who_dispatched`,`dispatch_who_received`,`dispatch_who_authorised`),
  CONSTRAINT `fk_dispatch_1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`stock_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispatch`
--

LOCK TABLES `dispatch` WRITE;
/*!40000 ALTER TABLE `dispatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `system_id` varchar(45) NOT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`system_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('admin','System','Admin', NOW(), NULL, NULL, NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt` (
  `receipt_id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `receipt_quantity` int(11) DEFAULT NULL,
  `receipt_datetime` datetime DEFAULT NULL,
  `receipt_who_received` varchar(45) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`receipt_id`),
  KEY `fk_receipt_1_idx` (`stock_id`),
  CONSTRAINT `fk_receipt_1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`stock_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt`
--

LOCK TABLES `receipt` WRITE;
/*!40000 ALTER TABLE `receipt` DISABLE KEYS */;
/*!40000 ALTER TABLE `receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `stock_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `reorder_level` int(11) DEFAULT NULL,
  `dispatch_id` int(11) NOT NULL DEFAULT '0',
  `dispatch_quantity` int(11) DEFAULT NULL,
  `dispatch_datetime` datetime DEFAULT NULL,
  `dispatch_who_dispatched` varchar(255) DEFAULT NULL,
  `dispatch_who_received` varchar(255) DEFAULT NULL,
  `dispatch_who_authorised` varchar(255) DEFAULT NULL,
  `dispatch_destination` varchar(255) DEFAULT NULL,
  `transfer_id` int(11) NOT NULL DEFAULT '0',
  `transfer_dispatch_id` int(11) DEFAULT NULL,
  `transfer_quantity` int(11) DEFAULT NULL,
  `transfer_who_transfered` varchar(255) DEFAULT NULL,
  `transfer_who_received` varchar(255) DEFAULT NULL,
  `transfer_who_authorised` varchar(255) DEFAULT NULL,
  `transfer_destination` varchar(255) DEFAULT NULL,
  `transfer_datetime` datetime DEFAULT NULL,
  `receipt_id` int(11) NOT NULL DEFAULT '0',
  `batch_number` varchar(255) DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `receipt_quantity` int(11) DEFAULT NULL,
  `receipt_datetime` datetime DEFAULT NULL,
  `receipt_who_received` varchar(255) DEFAULT NULL,
  `consumption_id` int(11) NOT NULL DEFAULT '0',
  `consumption_type` varchar(64) DEFAULT NULL,
  `who_consumed` varchar(255) DEFAULT NULL,
  `consumption_location` varchar(255) DEFAULT NULL,
  `consumption_quantity` int(11) DEFAULT NULL, 
  `date_consumed` datetime DEFAULT NULL, 
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock` (
  `stock_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `reorder_level` int(11) DEFAULT NULL,
  `last_order_size` int(11) DEFAULT NULL,
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_attribute`
--

DROP TABLE IF EXISTS `stock_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_attribute` (
  `stock_attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) DEFAULT NULL,
  `stock_attribute_type_id` int(11) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`stock_attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_attribute`
--

LOCK TABLES `stock_attribute` WRITE;
/*!40000 ALTER TABLE `stock_attribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_attribute_type`
--

DROP TABLE IF EXISTS `stock_attribute_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_attribute_type` (
  `stock_attribute_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`stock_attribute_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_attribute_type`
--

LOCK TABLES `stock_attribute_type` WRITE;
/*!40000 ALTER TABLE `stock_attribute_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_attribute_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumption`
--

DROP TABLE IF EXISTS `consumption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consumption` (
  `consumption_id` INT NOT NULL AUTO_INCREMENT,
  `consumption_type_id` INT NOT NULL,
  `dispatch_id` INT NOT NULL,
  `consumption_quantity` int(11) DEFAULT NULL,
  `who_consumed` VARCHAR(255) NULL,
  `date_consumed` datetime DEFAULT NULL, 
  `reason_for_consumption` VARCHAR(255) NULL, 
  `location` VARCHAR(255) NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  `voided` TINYINT NULL,
  `voided_by` VARCHAR(45) NULL,
  `void_reason` VARCHAR(255) NULL,
  `date_voided` DATETIME NULL,
  PRIMARY KEY (`consumption_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `consumption_type`
--

DROP TABLE IF EXISTS `consumption_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consumption_type` (
  `consumption_type_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`consumption_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `region`
--

LOCK TABLES `consumption_type` WRITE;
/*!40000 ALTER TABLE `consumption_type` DISABLE KEYS */;
INSERT INTO `consumption_type` VALUES (1,'Normal use', NOW(), 'admin', NULL, NULL),(2,'Damaged', NOW(), 'admin', NULL, NULL),
  (3,'Disposal', NOW(), 'admin', NULL, NULL), (4,'Quality Control', NOW(), 'admin', NULL, NULL),
  (5,'PT', NOW(), 'admin', NULL, NULL), (6,'Training', NOW(), 'admin', NULL, NULL), (7,'Expired', NOW(), 'admin', NULL, NULL);
/*!40000 ALTER TABLE `consumption_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_batch`
--

DROP TABLE IF EXISTS `stock_batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_batch` (
  `stock_batch_id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) DEFAULT NULL,
  `batch_number` varchar(45) DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`stock_batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_batch`
--

LOCK TABLES `stock_batch` WRITE;
/*!40000 ALTER TABLE `stock_batch` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_batch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfer`
--

DROP TABLE IF EXISTS `transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transfer` (
  `transfer_id` int(11) NOT NULL AUTO_INCREMENT,
  `dispatch_id` int(11) DEFAULT NULL,
  `transfer_quantity` int(11) DEFAULT NULL,
  `transfer_who_transfered` varchar(45) DEFAULT NULL,
  `transfer_who_received` varchar(45) DEFAULT NULL,
  `transfer_who_authorised` varchar(45) DEFAULT NULL COMMENT '\n',
  `transfer_destination` varchar(255) DEFAULT NULL,
  `transfer_datetime` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `creator` varchar(45) DEFAULT NULL,
  `date_changed` datetime DEFAULT NULL,
  `changed_by` varchar(45) DEFAULT NULL,
  `voided` tinyint(4) DEFAULT NULL,
  `void_reason` varchar(255) DEFAULT NULL,
  `date_voided` datetime DEFAULT NULL,
  `voided_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`transfer_id`),
  KEY `fk_transfer_1_idx` (`dispatch_id`),
  CONSTRAINT `fk_transfer_1` FOREIGN KEY (`dispatch_id`) REFERENCES `dispatch` (`dispatch_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer`
--

LOCK TABLES `transfer` WRITE;
/*!40000 ALTER TABLE `transfer` DISABLE KEYS */;
/*!40000 ALTER TABLE `transfer` ENABLE KEYS */;
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
