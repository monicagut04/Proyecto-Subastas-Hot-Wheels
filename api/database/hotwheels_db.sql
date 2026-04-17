-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 04-03-2026 a las 02:42:51
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4
CREATE DATABASE  IF NOT EXISTS `hotwheels_db`;
USE `hotwheels_db`;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hotwheels_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autos`
--

CREATE TABLE `autos` (
  `id_auto` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `nombre_modelo` varchar(100) NOT NULL,
  `marca_fabricante` varchar(50) NOT NULL,
  `numero_serie` varchar(20) DEFAULT NULL,
  `rareza` enum('BASICO','TH','STH','PREMIUM','RLC','CONVENCION') NOT NULL,
  `estado_empaque` enum('BLISTER_PERFECTO','TARJETA_DANADA','LOOSE_NUEVO','LOOSE_JUGADO') NOT NULL,
  `descripcion_detallada` text NOT NULL,
  `estado_actual` enum('DISPONIBLE','EN_SUBASTA','VENDIDO') DEFAULT 'DISPONIBLE',
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autos`
--

INSERT INTO `autos` (`id_auto`, `id_vendedor`, `nombre_modelo`, `marca_fabricante`, `numero_serie`, `rareza`, `estado_empaque`, `descripcion_detallada`, `estado_actual`, `fecha_registro`) VALUES
(1, 2, 'Nissan Skyline GT-R (R34)', 'Nissan', '15/250', 'PREMIUM', 'BLISTER_PERFECTO', 'Edición Boulevard en tarjeta inmaculada. Sin esquinas dobladas (Mint on Card).', 'EN_SUBASTA', '2026-02-20 13:23:16'),
(2, 2, '69 Chevy Camaro', 'Chevrolet', '55/250', 'STH', 'TARJETA_DANADA', 'Pintura Spectraflame verde. La tarjeta tiene una pequeña arruga en la esquina superior derecha (soft corner).', 'VENDIDO', '2026-02-20 13:23:16'),
(3, 2, 'Bone Shaker', 'Hot Wheels Original', '112/250', 'BASICO', 'LOOSE_NUEVO', 'Suelto pero impecable, sacado del blister únicamente para exhibición en vitrina.', 'EN_SUBASTA', '2026-02-20 13:23:16'),
(4, 2, 'Porsche 964', 'Porsche', 'RLC-01', 'RLC', 'BLISTER_PERFECTO', 'Edición RLC limitada. Incluye su caja protectora de acrílico original intacta.', 'DISPONIBLE', '2026-02-20 13:23:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auto_colecciones`
--

CREATE TABLE `auto_colecciones` (
  `id_auto` int(11) NOT NULL,
  `id_coleccion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auto_colecciones`
--

INSERT INTO `auto_colecciones` (`id_auto`, `id_coleccion`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colecciones`
--

CREATE TABLE `colecciones` (
  `id_coleccion` int(11) NOT NULL,
  `nombre_serie` varchar(100) NOT NULL,
  `anio_lanzamiento` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `colecciones`
--

INSERT INTO `colecciones` (`id_coleccion`, `nombre_serie`, `anio_lanzamiento`, `descripcion`) VALUES
(1, 'Car Culture: Boulevard', 2023, 'Modelos super detallados con carrocería de metal y llantas de goma (Real Riders).'),
(2, 'Super Treasure Hunts (STH)', 2024, 'Variantes altamente raras con pintura Spectraflame y llantas de goma escondidas en cajas regulares.'),
(3, 'Mainline', 2024, 'Línea básica de producción masiva, empaque estándar.'),
(4, 'Red Line Club (RLC)', 2023, 'Ediciones exclusivas y limitadas solo para miembros del club oficial de Mattel.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id_imagen` int(11) NOT NULL,
  `id_auto` int(11) NOT NULL,
  `nombre_imagen` varchar(255) NOT NULL,
  `es_portada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes`
--

INSERT INTO `imagenes` (`id_imagen`, `id_auto`, `nombre_imagen`, `es_portada`) VALUES
(1, 1, 'nissanskyline.jpg', 1),
(2, 2, 'chevycamaro.jpg', 1),
(3, 3, 'boneshaker.jpg', 1),
(4, 4, 'porsche964.jpg', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_subasta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `estado_pago` enum('PENDIENTE','COMPLETADO') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_subasta`, `id_usuario`, `monto_total`, `fecha_pago`, `estado_pago`) VALUES
(1, 2, 3, 30000.00, '2026-02-11 09:30:00', 'COMPLETADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pujas`
--

CREATE TABLE `pujas` (
  `id_puja` int(11) NOT NULL,
  `id_subasta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `monto_ofertado` decimal(10,2) NOT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pujas`
--

INSERT INTO `pujas` (`id_puja`, `id_subasta`, `id_usuario`, `monto_ofertado`, `fecha_hora`) VALUES
(1, 1, 3, 16000.00, '2026-02-16 14:30:00'),
(2, 1, 4, 18000.00, '2026-02-17 09:15:00'),
(3, 1, 3, 20000.00, '2026-02-19 16:45:00'),
(4, 2, 4, 27000.00, '2026-02-02 11:00:00'),
(5, 2, 3, 30000.00, '2026-02-09 17:55:00'),
(6, 3, 4, 5500.00, '2026-02-18 12:05:00'),
(7, 3, 3, 6000.00, '2026-02-19 08:20:00'),
(8, 3, 4, 7000.00, '2026-02-20 10:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subastas`
--

CREATE TABLE `subastas` (
  `id_subasta` int(11) NOT NULL,
  `id_auto` int(11) NOT NULL,
  `id_vendedor` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `incremento_minimo` decimal(10,2) DEFAULT 1.00,
  `estado` enum('BORRADOR','ACTIVA','FINALIZADA','CANCELADA') DEFAULT 'BORRADOR',
  `id_ganador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subastas`
--

INSERT INTO `subastas` (`id_subasta`, `id_auto`, `id_vendedor`, `fecha_inicio`, `fecha_fin`, `precio_base`, `incremento_minimo`, `estado`, `id_ganador`) VALUES
(1, 1, 2, '2026-02-15 10:00:00', '2026-03-05 20:00:00', 15000.00, 1000.00, 'ACTIVA', NULL),
(2, 2, 2, '2026-02-01 08:00:00', '2026-02-10 18:00:00', 25000.00, 2000.00, 'FINALIZADA', 3),
(3, 3, 2, '2026-02-18 12:00:00', '2026-03-10 22:00:00', 5000.00, 500.00, 'ACTIVA', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('COMPRADOR','VENDEDOR','ADMIN') NOT NULL,
  `estado` enum('ACTIVO','BLOQUEADO') DEFAULT 'ACTIVO',
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_electronico`, `password_hash`, `rol`, `estado`, `fecha_registro`) VALUES
(1, 'Admin Sistema', 'admin@hw.com', 'hash_simulado_123', 'ADMIN', 'ACTIVO', '2026-02-20 13:23:16'),
(2, 'Andrey Vendedor', 'vendedor@hw.com', 'hash_simulado_123', 'VENDEDOR', 'ACTIVO', '2026-02-20 13:23:16'),
(3, 'Mónica Coleccionista', 'comprador1@hw.com', 'hash_simulado_123', 'COMPRADOR', 'ACTIVO', '2026-02-20 13:23:16'),
(4, 'Carlos Pujador', 'comprador2@hw.com', 'hash_simulado_123', 'COMPRADOR', 'ACTIVO', '2026-02-20 13:23:16');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autos`
--
ALTER TABLE `autos`
  ADD PRIMARY KEY (`id_auto`),
  ADD KEY `id_vendedor` (`id_vendedor`);

--
-- Indices de la tabla `auto_colecciones`
--
ALTER TABLE `auto_colecciones`
  ADD PRIMARY KEY (`id_auto`,`id_coleccion`),
  ADD KEY `id_coleccion` (`id_coleccion`);

--
-- Indices de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD PRIMARY KEY (`id_coleccion`),
  ADD UNIQUE KEY `nombre_serie` (`nombre_serie`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_auto` (`id_auto`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `id_subasta` (`id_subasta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pujas`
--
ALTER TABLE `pujas`
  ADD PRIMARY KEY (`id_puja`),
  ADD KEY `id_subasta` (`id_subasta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `subastas`
--
ALTER TABLE `subastas`
  ADD PRIMARY KEY (`id_subasta`),
  ADD KEY `id_auto` (`id_auto`),
  ADD KEY `id_vendedor` (`id_vendedor`),
  ADD KEY `id_ganador` (`id_ganador`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autos`
--
ALTER TABLE `autos`
  MODIFY `id_auto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  MODIFY `id_coleccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pujas`
--
ALTER TABLE `pujas`
  MODIFY `id_puja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `subastas`
--
ALTER TABLE `subastas`
  MODIFY `id_subasta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `autos`
--
ALTER TABLE `autos`
  ADD CONSTRAINT `autos_ibfk_1` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `auto_colecciones`
--
ALTER TABLE `auto_colecciones`
  ADD CONSTRAINT `auto_colecciones_ibfk_1` FOREIGN KEY (`id_auto`) REFERENCES `autos` (`id_auto`),
  ADD CONSTRAINT `auto_colecciones_ibfk_2` FOREIGN KEY (`id_coleccion`) REFERENCES `colecciones` (`id_coleccion`);

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`id_auto`) REFERENCES `autos` (`id_auto`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id_subasta`),
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pujas`
--
ALTER TABLE `pujas`
  ADD CONSTRAINT `pujas_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id_subasta`),
  ADD CONSTRAINT `pujas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `subastas`
--
ALTER TABLE `subastas`
  ADD CONSTRAINT `subastas_ibfk_1` FOREIGN KEY (`id_auto`) REFERENCES `autos` (`id_auto`),
  ADD CONSTRAINT `subastas_ibfk_2` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `subastas_ibfk_3` FOREIGN KEY (`id_ganador`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- =========================================================================
-- 1. INSERTAR NUEVAS CATEGORÍAS EN LA TABLA 'colecciones'
-- =========================================================================
INSERT INTO `colecciones` (`nombre_serie`, `anio_lanzamiento`, `descripcion`) VALUES
('JDM Legends', 2024, 'Vehículos clásicos y modernos del mercado interno japonés.'),
('Muscle Mania', 2024, 'Autos musculosos americanos clásicos y modernos.'),
('Exotics', 2023, 'Súper autos y vehículos exóticos de alto rendimiento.'),
('HW Flames', 2023, 'Vehículos decorados con las clásicas flamas de Hot Wheels.'),
('Zamac', 2024, 'Ediciones especiales sin pintar, mostrando el metal expuesto (Zink, Aluminum, Magnesium, and Copper).');

-- NOTA TÉCNICA: Como tu tabla tiene AUTO_INCREMENT, y ya tenías 4 colecciones, 
-- estas nuevas tomarán automáticamente los IDs: 5, 6, 7, 8 y 9.

-- =========================================================================
-- 2. VINCULAR LAS CATEGORÍAS A LOS AUTOS EN LA TABLA PUENTE 'auto_colecciones'
-- =========================================================================
-- Recuerda tus autos actuales: 
-- 1 = Nissan Skyline, 2 = Chevy Camaro, 3 = Bone Shaker, 4 = Porsche 964

INSERT INTO `auto_colecciones` (`id_auto`, `id_coleccion`) VALUES
-- Agregamos categorías al Nissan Skyline (ID 1)
(1, 5), -- Le agregamos 'JDM Legends'

-- Agregamos categorías al Chevy Camaro (ID 2)
(2, 6), -- Le agregamos 'Muscle Mania'
(2, 8), -- Le agregamos 'HW Flames'

-- Agregamos categorías al Bone Shaker (ID 3)
(3, 8), -- Le agregamos 'HW Flames'
(3, 9), -- Le agregamos 'Zamac'

-- Agregamos categorías al Porsche 964 (ID 4)
(4, 7); -- Le agregamos 'Exotics'

-- Insertamos la imagen 'global.jpg' como secundaria (es_portada = 0) para los 4 autos registrados
INSERT INTO `imagenes` (`id_auto`, `nombre_imagen`, `es_portada`) VALUES
(1, 'global.jpg', 0),
(2, 'global.jpg', 0),
(3, 'global.jpg', 0),
(4, 'global.jpg', 0);

ALTER TABLE `autos` MODIFY COLUMN `estado_actual` enum('DISPONIBLE','EN_SUBASTA','VENDIDO','INACTIVO') DEFAULT 'DISPONIBLE';

INSERT INTO `usuarios` (`nombre_completo`, `correo_electronico`, `password_hash`, `rol`, `estado`) VALUES
('Vendedor Experto', 'vendedor2@hw.com', 'hash123', 'VENDEDOR', 'ACTIVO'),
('JDM Store', 'vendedor3@hw.com', 'hash123', 'VENDEDOR', 'ACTIVO');

-- 2. Completar Compradores (Faltan 3 para llegar a 5)
INSERT INTO `usuarios` (`nombre_completo`, `correo_electronico`, `password_hash`, `rol`, `estado`) VALUES
('Luis Inversor', 'comprador3@hw.com', 'hash123', 'COMPRADOR', 'ACTIVO'),
('Ana Classics', 'comprador4@hw.com', 'hash123', 'COMPRADOR', 'ACTIVO'),
('Pedro Coleccionista', 'comprador5@hw.com', 'hash123', 'COMPRADOR', 'ACTIVO');

-- 3. Completar Objetos (Falta 1 para llegar a 5)
INSERT INTO `autos` (`id_vendedor`, `nombre_modelo`, `marca_fabricante`, `numero_serie`, `rareza`, `estado_empaque`, `descripcion_detallada`, `estado_actual`) VALUES
(5, 'Datsun 510 Wagon', 'Datsun', 'RLC-02', 'RLC', 'BLISTER_PERFECTO', 'Edición exclusiva RLC, pintura rosa Spectraflame.', 'EN_SUBASTA');

-- Asignar imagen y colección al nuevo auto (ID 5)
INSERT INTO `imagenes` (`id_auto`, `nombre_imagen`, `es_portada`) VALUES (5, 'global.jpg', 1);
INSERT INTO `auto_colecciones` (`id_auto`, `id_coleccion`) VALUES (5, 5); -- JDM Legends

-- 4. Completar Subastas Activas (Faltan 3 activas/programadas para llegar a 5)
INSERT INTO `subastas` (`id_auto`, `id_vendedor`, `fecha_inicio`, `fecha_fin`, `precio_base`, `incremento_minimo`, `estado`) VALUES
(4, 2, '2026-03-01 10:00:00', '2026-03-25 20:00:00', 40000.00, 2500.00, 'ACTIVA'), -- Porsche 964
(5, 5, '2026-03-02 08:00:00', '2026-03-30 18:00:00', 35000.00, 1500.00, 'ACTIVA'); -- Datsun 510