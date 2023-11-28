-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-11-2023 a las 20:52:06
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gymprocontrol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `IDArea` int(11) NOT NULL,
  `NombreArea` varchar(255) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `CapacidadMaxima` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`IDArea`, `NombreArea`, `Descripcion`, `CapacidadMaxima`) VALUES
(1, 'Área cardiovascular', 'En la area Cardiovascular es especificamente para usuarios que usan caminadoras,bicicletas o cualquier otro aparato para hacer cardio', 5),
(2, 'Área de peso libre\r\n\r\n', 'En el area de Peso Libre encontraras mancuernas con peso desde 2.5k a superiores', 15),
(3, 'Área de peso integrado', 'En el area de peso integrado encontraras las maquinas de peso, desde bancas, smith entre otras', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicaciones`
--

CREATE TABLE `comunicaciones` (
  `IDComunicacion` int(11) NOT NULL,
  `IDMiembro` int(11) DEFAULT NULL,
  `FechaComunicacion` datetime NOT NULL,
  `TipoComunicacion` varchar(255) NOT NULL,
  `Contenido` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controlacceso`
--

CREATE TABLE `controlacceso` (
  `IDControlAcceso` int(11) NOT NULL,
  `IDMiembro` int(11) DEFAULT NULL,
  `FechaHoraEntrada` datetime NOT NULL,
  `FechaHoraSalida` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `IDEmpleado` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Apellidos` varchar(255) NOT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `FechaInicio` date DEFAULT NULL,
  `FechaFin` date DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Rol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`IDEmpleado`, `Nombre`, `Apellidos`, `FechaNacimiento`, `FechaInicio`, `FechaFin`, `Telefono`, `Email`, `Rol`) VALUES
(1, 'Franco', 'Sanchez', '2023-11-08', '2023-11-08', NULL, '939300009', NULL, 'Director');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventarioequipos`
--

CREATE TABLE `inventarioequipos` (
  `IDEquipo` int(11) NOT NULL,
  `NombreEquipo` varchar(255) NOT NULL,
  `Tipo` varchar(255) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Estado` varchar(50) DEFAULT NULL CHECK (`Estado` in ('Nuevo','Bueno','Regular','Necesita reparación','Fuera de servicio')),
  `Ubicacion` varchar(255) NOT NULL,
  `FechaCompra` date DEFAULT NULL,
  `Proveedor` varchar(255) DEFAULT NULL,
  `Costo` decimal(10,2) DEFAULT NULL,
  `FechaUltimoMantenimiento` date DEFAULT NULL,
  `Observaciones` text DEFAULT NULL,
  `MantenimientoProgramado` date DEFAULT NULL,
  `IDArea` int(11) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `inventarioequipos`
--

INSERT INTO `inventarioequipos` (`IDEquipo`, `NombreEquipo`, `Tipo`, `Cantidad`, `Estado`, `Ubicacion`, `FechaCompra`, `Proveedor`, `Costo`, `FechaUltimoMantenimiento`, `Observaciones`, `MantenimientoProgramado`, `IDArea`) VALUES
(5, 'Bicicleta spining', 'Pecho', 5, 'Bueno', 'd', '2023-11-15', 'uu', 0.00, '2023-11-14', 'hjh', '2023-12-01', 1),
(6, 'JSJS', 'Espalda', 444, 'Bueno', 'Zona de Pesas', '2023-11-23', 'NJJ', 45454345.00, '2023-12-01', '54tr', '2023-11-28', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembros`
--

CREATE TABLE `miembros` (
  `IDMiembro` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Apellidos` varchar(255) NOT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `FechaInicio` date DEFAULT NULL,
  `FechaFin` date DEFAULT NULL,
  `ContactoEmergencia` varchar(255) DEFAULT NULL,
  `Direccion` text DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `EstadoMembresia` enum('Activa','Inactiva','Vencida') NOT NULL DEFAULT 'Activa',
  `Costo` decimal(10,2) DEFAULT NULL,
  `DuracionMembresia` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembros`
--

INSERT INTO `miembros` (`IDMiembro`, `Nombre`, `Apellidos`, `FechaNacimiento`, `FechaInicio`, `FechaFin`, `ContactoEmergencia`, `Direccion`, `Telefono`, `Email`, `EstadoMembresia`, `Costo`, `DuracionMembresia`) VALUES
(9, 'RODRIGO', 'RENDON', '2003-03-07', '2023-11-19', '2023-11-20', '3929239329', 'LOPEZ RAYON SN', '+527822511250', 'ti43243fddf@uvp.edu.mx', 'Vencida', NULL, NULL),
(16, 'Nayeli', 'Olivares Flores', '1990-12-11', '2023-11-27', '2023-12-27', '3929239329', 'LAS CRUCESBA S/N', '+527971530940', 'nayeli.olivares@uvp.edu.mx', 'Activa', 250.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `IDPago` int(11) NOT NULL,
  `IDMiembro` int(11) DEFAULT NULL,
  `FechaPago` date NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `MetodoPago` varchar(255) NOT NULL,
  `ReferenciaPago` varchar(255) DEFAULT NULL,
  `EstadoPago` enum('Completado','Pendiente','Cancelado') NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Disparadores `pagos`
--
DELIMITER $$
CREATE TRIGGER `AfterPagoInsert` AFTER INSERT ON `pagos` FOR EACH ROW BEGIN
  DECLARE duracion INT;
  IF NEW.Monto = 250 THEN
    SET duracion = 1;
  ELSEIF NEW.Monto = 500 THEN
    SET duracion = 3;
  END IF;
  UPDATE Miembros SET FechaFin = DATE_ADD(NEW.FechaPago, INTERVAL duracion MONTH) WHERE IDMiembro = NEW.IDMiembro;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `IDProducto` int(11) NOT NULL,
  `NombreProducto` varchar(255) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservaciones`
--

CREATE TABLE `reservaciones` (
  `IDReservacion` int(11) NOT NULL,
  `IDMiembro` int(11) DEFAULT NULL,
  `FechaHoraReservacion` datetime NOT NULL,
  `TipoReservacion` varchar(255) NOT NULL,
  `Comentarios` text DEFAULT NULL,
  `EstadoReservacion` enum('Activa','Cancelada') DEFAULT NULL,
  `IDArea` int(11) DEFAULT NULL,
  `IDEquipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservaciones`
--

INSERT INTO `reservaciones` (`IDReservacion`, `IDMiembro`, `FechaHoraReservacion`, `TipoReservacion`, `Comentarios`, `EstadoReservacion`, `IDArea`, `IDEquipo`) VALUES
(29, 9, '2023-11-17 02:30:00', 'personal', 'Ninguno', 'Cancelada', 1, 5),
(42, 16, '2023-11-28 18:48:00', 'personal', '', 'Activa', 2, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `useraccounts`
--

CREATE TABLE `useraccounts` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` enum('admin','user','guest') NOT NULL,
  `EmployeeID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `useraccounts`
--

INSERT INTO `useraccounts` (`UserID`, `Username`, `PasswordHash`, `Role`, `EmployeeID`) VALUES
(2, 'franco', '$2b$10$Vk58UrBUXydJDnqg/vLpv.j11M1cU0gmciTAUGbjwXy0uDdxzlHUm', 'admin', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `IDVenta` int(11) NOT NULL,
  `IDMiembro` int(11) DEFAULT NULL,
  `IDProducto` int(11) DEFAULT NULL,
  `FechaHoraVenta` datetime NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `PrecioTotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`IDArea`);

--
-- Indices de la tabla `comunicaciones`
--
ALTER TABLE `comunicaciones`
  ADD PRIMARY KEY (`IDComunicacion`),
  ADD KEY `IDMiembro` (`IDMiembro`);

--
-- Indices de la tabla `controlacceso`
--
ALTER TABLE `controlacceso`
  ADD PRIMARY KEY (`IDControlAcceso`),
  ADD KEY `IDMiembro` (`IDMiembro`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`IDEmpleado`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indices de la tabla `inventarioequipos`
--
ALTER TABLE `inventarioequipos`
  ADD PRIMARY KEY (`IDEquipo`),
  ADD KEY `IDArea` (`IDArea`);

--
-- Indices de la tabla `miembros`
--
ALTER TABLE `miembros`
  ADD PRIMARY KEY (`IDMiembro`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`IDPago`),
  ADD KEY `IDMiembro` (`IDMiembro`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`IDProducto`);

--
-- Indices de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD PRIMARY KEY (`IDReservacion`),
  ADD KEY `IDMiembro` (`IDMiembro`),
  ADD KEY `IDArea` (`IDArea`),
  ADD KEY `IDEquipo` (`IDEquipo`);

--
-- Indices de la tabla `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`IDVenta`),
  ADD KEY `IDMiembro` (`IDMiembro`),
  ADD KEY `IDProducto` (`IDProducto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `IDArea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `comunicaciones`
--
ALTER TABLE `comunicaciones`
  MODIFY `IDComunicacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `controlacceso`
--
ALTER TABLE `controlacceso`
  MODIFY `IDControlAcceso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `IDEmpleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `inventarioequipos`
--
ALTER TABLE `inventarioequipos`
  MODIFY `IDEquipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `miembros`
--
ALTER TABLE `miembros`
  MODIFY `IDMiembro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `IDPago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `IDProducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  MODIFY `IDReservacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `useraccounts`
--
ALTER TABLE `useraccounts`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `IDVenta` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comunicaciones`
--
ALTER TABLE `comunicaciones`
  ADD CONSTRAINT `comunicaciones_ibfk_1` FOREIGN KEY (`IDMiembro`) REFERENCES `miembros` (`IDMiembro`);

--
-- Filtros para la tabla `controlacceso`
--
ALTER TABLE `controlacceso`
  ADD CONSTRAINT `controlacceso_ibfk_1` FOREIGN KEY (`IDMiembro`) REFERENCES `miembros` (`IDMiembro`);

--
-- Filtros para la tabla `inventarioequipos`
--
ALTER TABLE `inventarioequipos`
  ADD CONSTRAINT `inventarioequipos_ibfk_1` FOREIGN KEY (`IDArea`) REFERENCES `areas` (`IDArea`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`IDMiembro`) REFERENCES `miembros` (`IDMiembro`);

--
-- Filtros para la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD CONSTRAINT `reservaciones_ibfk_1` FOREIGN KEY (`IDMiembro`) REFERENCES `miembros` (`IDMiembro`),
  ADD CONSTRAINT `reservaciones_ibfk_2` FOREIGN KEY (`IDArea`) REFERENCES `areas` (`IDArea`),
  ADD CONSTRAINT `reservaciones_ibfk_3` FOREIGN KEY (`IDEquipo`) REFERENCES `inventarioequipos` (`IDEquipo`);

--
-- Filtros para la tabla `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD CONSTRAINT `useraccounts_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `empleados` (`IDEmpleado`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`IDMiembro`) REFERENCES `miembros` (`IDMiembro`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`IDProducto`) REFERENCES `productos` (`IDProducto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
