-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: eventease
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `postalarea`
--

DROP TABLE IF EXISTS `postalarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postalarea` (
  `PostalCode` varchar(10) NOT NULL,
  `City` varchar(100) NOT NULL,
  PRIMARY KEY (`PostalCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postalarea`
--

LOCK TABLES `postalarea` WRITE;
/*!40000 ALTER TABLE `postalarea` DISABLE KEYS */;
INSERT INTO `postalarea` VALUES ('N6G000','New Dana'),('N6G001','Tiffanyport'),('N6G002','East Maria'),('N6G003','Amyton'),('N6G004','Lawrencehaven'),('N6G005','Johnnyside'),('N6G006','Port Jeffreychester'),('N6G007','New Christopher'),('N6G008','South Chelseashire'),('N6G009','Clarkbury'),('N6G010','Edwardsville'),('N6G011','Ortiztown'),('N6G012','Gabrielleville'),('N6G013','Gregoryborough'),('N6G014','Lawsonview'),('N6G015','North Kathleen'),('N6G016','Allenfort'),('N6G017','East Joshua'),('N6G018','New Heather'),('N6G019','Kaitlinbury'),('N6G020','Lake Joshua'),('N6G021','Boothport'),('N6G022','South Kathleen'),('N6G023','West Jeffrey'),('N6G024','Jesusland'),('N6G025','Port Brandon'),('N6G026','South Kelly'),('N6G027','Howellburgh'),('N6G028','Smithport'),('N6G029','Schultztown'),('N6G030','Mortonville'),('N6G031','West Ryan'),('N6G032','South Lindsay'),('N6G033','Port Jeffery'),('N6G034','South Lisa'),('N6G035','West Charles'),('N6G036','West Kevin'),('N6G037','North Karen'),('N6G038','South Darrellville'),('N6G039','Victoriatown'),('N6G040','New Kevin'),('N6G041','Alexanderland'),('N6G042','South Lynn'),('N6G043','Myerston'),('N6G044','South Justintown'),('N6G045','Conniefort'),('N6G046','New Karenfort'),('N6G047','Greershire'),('N6G048','Lisaborough'),('N6G049','Amyside');
/*!40000 ALTER TABLE `postalarea` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-18 12:24:31
