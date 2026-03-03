-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hotwheels_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `auto_colecciones`
--

DROP TABLE IF EXISTS `auto_colecciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auto_colecciones` (
  `id_auto` int(11) NOT NULL,
  `id_coleccion` int(11) NOT NULL,
  PRIMARY KEY (`id_auto`,`id_coleccion`),
  KEY `id_coleccion` (`id_coleccion`),
  CONSTRAINT `auto_colecciones_ibfk_1` FOREIGN KEY (`id_auto`) REFERENCES `autos` (`id_auto`),
  CONSTRAINT `auto_colecciones_ibfk_2` FOREIGN KEY (`id_coleccion`) REFERENCES `colecciones` (`id_coleccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_colecciones`
--

LOCK TABLES `auto_colecciones` WRITE;
/*!40000 ALTER TABLE `auto_colecciones` DISABLE KEYS */;
INSERT INTO `auto_colecciones` VALUES (1,1),(2,2),(3,3),(4,4);
/*!40000 ALTER TABLE `auto_colecciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `autos`
--

DROP TABLE IF EXISTS `autos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autos` (
  `id_auto` int(11) NOT NULL AUTO_INCREMENT,
  `id_vendedor` int(11) NOT NULL,
  `nombre_modelo` varchar(100) NOT NULL,
  `marca_fabricante` varchar(50) NOT NULL,
  `numero_serie` varchar(20) DEFAULT NULL,
  `rareza` enum('BASICO','TH','STH','PREMIUM','RLC','CONVENCION') NOT NULL,
  `estado_empaque` enum('BLISTER_PERFECTO','TARJETA_DANADA','LOOSE_NUEVO','LOOSE_JUGADO') NOT NULL,
  `descripcion_detallada` text NOT NULL,
  `estado_actual` enum('DISPONIBLE','EN_SUBASTA','VENDIDO') DEFAULT 'DISPONIBLE',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_auto`),
  KEY `id_vendedor` (`id_vendedor`),
  CONSTRAINT `autos_ibfk_1` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autos`
--

LOCK TABLES `autos` WRITE;
/*!40000 ALTER TABLE `autos` DISABLE KEYS */;
INSERT INTO `autos` VALUES (1,2,'Nissan Skyline GT-R (R34)','Nissan','15/250','PREMIUM','BLISTER_PERFECTO','Edición Boulevard en tarjeta inmaculada. Sin esquinas dobladas (Mint on Card).','EN_SUBASTA','2026-02-20 13:23:16'),(2,2,'69 Chevy Camaro','Chevrolet','55/250','STH','TARJETA_DANADA','Pintura Spectraflame verde. La tarjeta tiene una pequeña arruga en la esquina superior derecha (soft corner).','VENDIDO','2026-02-20 13:23:16'),(3,2,'Bone Shaker','Hot Wheels Original','112/250','BASICO','LOOSE_NUEVO','Suelto pero impecable, sacado del blister únicamente para exhibición en vitrina.','EN_SUBASTA','2026-02-20 13:23:16'),(4,2,'Porsche 964','Porsche','RLC-01','RLC','BLISTER_PERFECTO','Edición RLC limitada. Incluye su caja protectora de acrílico original intacta.','DISPONIBLE','2026-02-20 13:23:16');
/*!40000 ALTER TABLE `autos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colecciones`
--

DROP TABLE IF EXISTS `colecciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colecciones` (
  `id_coleccion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_serie` varchar(100) NOT NULL,
  `anio_lanzamiento` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_coleccion`),
  UNIQUE KEY `nombre_serie` (`nombre_serie`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colecciones`
--

LOCK TABLES `colecciones` WRITE;
/*!40000 ALTER TABLE `colecciones` DISABLE KEYS */;
INSERT INTO `colecciones` VALUES (1,'Car Culture: Boulevard',2023,'Modelos super detallados con carrocería de metal y llantas de goma (Real Riders).'),(2,'Super Treasure Hunts (STH)',2024,'Variantes altamente raras con pintura Spectraflame y llantas de goma escondidas en cajas regulares.'),(3,'Mainline',2024,'Línea básica de producción masiva, empaque estándar.'),(4,'Red Line Club (RLC)',2023,'Ediciones exclusivas y limitadas solo para miembros del club oficial de Mattel.');
/*!40000 ALTER TABLE `colecciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes`
--

DROP TABLE IF EXISTS `imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes` (
  `id_imagen` int(11) NOT NULL AUTO_INCREMENT,
  `id_auto` int(11) NOT NULL,
  `nombre_imagen` varchar(255) NOT NULL,
  `es_portada` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_imagen`),
  KEY `id_auto` (`id_auto`),
  CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`id_auto`) REFERENCES `autos` (`id_auto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes`
--

LOCK TABLES `imagenes` WRITE;
/*!40000 ALTER TABLE `imagenes` DISABLE KEYS */;
INSERT INTO `imagenes` VALUES (1,1,'https://hwcollectorsnews.com/wp-content/uploads/2020/02/Nissan-Skyline-GT-R-R34-c.jpg',1),(2,2,'https://hwcollectorsnews.com/wp-content/uploads/2021/01/69-Camaro-STH.jpg',1),(3,3,'https://hwcollectorsnews.com/wp-content/uploads/2019/02/Bone-Shaker-black.jpg',1),(4,4,'https://hwcollectorsnews.com/wp-content/uploads/2022/10/Porsche-964-RLC.jpg',1);
/*!40000 ALTER TABLE `imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_subasta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `estado_pago` enum('PENDIENTE','COMPLETADO') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_pago`),
  UNIQUE KEY `id_subasta` (`id_subasta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id_subasta`),
  CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,2,3,30000.00,'2026-02-11 09:30:00','COMPLETADO');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pujas`
--

DROP TABLE IF EXISTS `pujas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pujas` (
  `id_puja` int(11) NOT NULL AUTO_INCREMENT,
  `id_subasta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `monto_ofertado` decimal(10,2) NOT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_puja`),
  KEY `id_subasta` (`id_subasta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pujas_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id_subasta`),
  CONSTRAINT `pujas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pujas`
--

LOCK TABLES `pujas` WRITE;
/*!40000 ALTER TABLE `pujas` DISABLE KEYS */;
INSERT INTO `pujas` VALUES (1,1,3,16000.00,'2026-02-16 14:30:00'),(2,1,4,18000.00,'2026-02-17 09:15:00'),(3,1,3,20000.00,'2026-02-19 16:45:00'),(4,2,4,27000.00,'2026-02-02 11:00:00'),(5,2,3,30000.00,'2026-02-09 17:55:00'),(6,3,4,5500.00,'2026-02-18 12:05:00'),(7,3,3,6000.00,'2026-02-19 08:20:00'),(8,3,4,7000.00,'2026-02-20 10:00:00');
/*!40000 ALTER TABLE `pujas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subastas`
--

DROP TABLE IF EXISTS `subastas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subastas` (
  `id_subasta` int(11) NOT NULL AUTO_INCREMENT,
  `id_auto` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `incremento_minimo` decimal(10,2) DEFAULT 1.00,
  `estado` enum('BORRADOR','ACTIVA','FINALIZADA','CANCELADA') DEFAULT 'BORRADOR',
  `id_ganador` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_subasta`),
  KEY `id_auto` (`id_auto`),
  KEY `id_vendedor` (`id_vendedor`),
  KEY `id_ganador` (`id_ganador`),
  CONSTRAINT `subastas_ibfk_1` FOREIGN KEY (`id_auto`) REFERENCES `autos` (`id_auto`),
  CONSTRAINT `subastas_ibfk_2` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `subastas_ibfk_3` FOREIGN KEY (`id_ganador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subastas`
--

LOCK TABLES `subastas` WRITE;
/*!40000 ALTER TABLE `subastas` DISABLE KEYS */;
INSERT INTO `subastas` VALUES (1,1,2,'2026-02-15 10:00:00','2026-03-05 20:00:00',15000.00,1000.00,'ACTIVA',NULL),(2,2,2,'2026-02-01 08:00:00','2026-02-10 18:00:00',25000.00,2000.00,'FINALIZADA',3),(3,3,2,'2026-02-18 12:00:00','2026-03-10 22:00:00',5000.00,500.00,'ACTIVA',NULL);
/*!40000 ALTER TABLE `subastas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('COMPRADOR','VENDEDOR','ADMIN') NOT NULL,
  `estado` enum('ACTIVO','BLOQUEADO') DEFAULT 'ACTIVO',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin Sistema','admin@hw.com','hash_simulado_123','ADMIN','ACTIVO','2026-02-20 13:23:16'),(2,'Andrey Vendedor','vendedor@hw.com','hash_simulado_123','VENDEDOR','ACTIVO','2026-02-20 13:23:16'),(3,'Mónica Coleccionista','comprador1@hw.com','hash_simulado_123','COMPRADOR','ACTIVO','2026-02-20 13:23:16'),(4,'Carlos Pujador','comprador2@hw.com','hash_simulado_123','COMPRADOR','ACTIVO','2026-02-20 13:23:16');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-24 23:29:26
