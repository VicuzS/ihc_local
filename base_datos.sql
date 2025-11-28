-- --------------------------------------------------------
-- TABLAS MAESTRAS
-- --------------------------------------------------------

--
-- Estructura de tabla para `usuario`
-- Almacena administradores y clientes registrados [cite: 83, 87]
--
CREATE TABLE `usuario` (
  `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'cliente') NOT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Estructura de tabla para `categoria`
-- Organiza los items (Entradas, Platos fuertes, etc.) [cite: 44]
--
CREATE TABLE `categoria` (
  `id_categoria` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

--
-- Estructura de tabla para `ingrediente`
-- Catálogo pre-cargado de ingredientes [cite: 69]
--
CREATE TABLE `ingrediente` (
  `id_ingrediente` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

--
-- Estructura de tabla para `alergeno`
-- Catálogo pre-cargado de alérgenos [cite: 67]
--
CREATE TABLE `alergeno` (
  `id_alergeno` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

--
-- Estructura de tabla para `etiqueta`
-- Catálogo pre-cargado de etiquetas dietéticas (Vegano, etc.) [cite: 68]
--
CREATE TABLE `etiqueta` (
  `id_etiqueta` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `tipo` ENUM('dieta', 'restriccion', 'general') NOT NULL COMMENT 'dieta=Vegano, restriccion=Sin gluten, general=Otro'
) ENGINE=InnoDB;

--
-- Estructura de tabla para `item`
-- Cada plato, bebida o postre del menú [cite: 52]
--
CREATE TABLE `item` (
  `id_item` INT AUTO_INCREMENT PRIMARY KEY,
  `id_categoria` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `precio` DECIMAL(10, 2) NOT NULL,
  `kcal_aprox` INT,
  `url_imagen` VARCHAR(512),
  `nivel_picante` ENUM('0', '1', '2') DEFAULT '0' COMMENT '0=No, 1=Bajo, 2=Alto',
  `sabor_base` ENUM('dulce', 'salado', 'agridulce'),
  `disponible` BOOLEAN DEFAULT TRUE NOT NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE RESTRICT
) ENGINE=InnoDB;

--
-- Estructura de tabla para `perfil`
-- Perfiles personalizados guardados por los usuarios clientes [cite: 46]
--
CREATE TABLE `perfil` (
  `id_perfil` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `nombre_perfil` VARCHAR(100) NOT NULL,
  `id_dieta_etiqueta` INT COMMENT 'FK a la etiqueta tipo ''dieta'' (Vegano, Omnívoro, etc.)',
  `prefiere_picante` ENUM('0', '1', '2') DEFAULT NULL,
  `prefiere_sabor` ENUM('dulce', 'salado', 'agridulce') DEFAULT NULL,
  `fecha_modificacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`id_dieta_etiqueta`) REFERENCES `etiqueta`(`id_etiqueta`) ON DELETE SET NULL
) ENGINE=InnoDB;


-- --------------------------------------------------------
-- TABLAS PIVOTE (RELACIONES M-M)
-- --------------------------------------------------------

--
-- Relación: item <-> ingrediente [cite: 53]
--
CREATE TABLE `item_ingrediente` (
  `id_item` INT NOT NULL,
  `id_ingrediente` INT NOT NULL,
  PRIMARY KEY (`id_item`, `id_ingrediente`),
  FOREIGN KEY (`id_item`) REFERENCES `item`(`id_item`) ON DELETE CASCADE,
  FOREIGN KEY (`id_ingrediente`) REFERENCES `ingrediente`(`id_ingrediente`) ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Relación: item <-> etiqueta [cite: 54]
--
CREATE TABLE `item_etiqueta` (
  `id_item` INT NOT NULL,
  `id_etiqueta` INT NOT NULL,
  PRIMARY KEY (`id_item`, `id_etiqueta`),
  FOREIGN KEY (`id_item`) REFERENCES `item`(`id_item`) ON DELETE CASCADE,
  FOREIGN KEY (`id_etiqueta`) REFERENCES `etiqueta`(`id_etiqueta`) ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Relación: ingrediente <-> alergeno
-- CLAVE para la detección automática de alérgenos [cite: 55]
--
CREATE TABLE `ingrediente_alergeno` (
  `id_ingrediente` INT NOT NULL,
  `id_alergeno` INT NOT NULL,
  PRIMARY KEY (`id_ingrediente`, `id_alergeno`),
  FOREIGN KEY (`id_ingrediente`) REFERENCES `ingrediente`(`id_ingrediente`) ON DELETE CASCADE,
  FOREIGN KEY (`id_alergeno`) REFERENCES `alergeno`(`id_alergeno`) ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Relación: perfil <-> alergeno
-- Alérgenos que un perfil específico desea evitar [cite: 46]
--
CREATE TABLE `perfil_alergeno_evitado` (
  `id_perfil` INT NOT NULL,
  `id_alergeno` INT NOT NULL,
  PRIMARY KEY (`id_perfil`, `id_alergeno`),
  FOREIGN KEY (`id_perfil`) REFERENCES `perfil`(`id_perfil`) ON DELETE CASCADE,
  FOREIGN KEY (`id_alergeno`) REFERENCES `alergeno`(`id_alergeno`) ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Estructura de tabla para `calificacion`
-- Registra las estrellas (1-5) y comentarios de los usuarios por plato
--
CREATE TABLE `calificacion` (
  `id_calificacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `id_item` INT NOT NULL,
  `puntuacion` TINYINT UNSIGNED NOT NULL COMMENT 'Valor entre 1 y 5',
  `comentario` TEXT DEFAULT NULL,
  `fecha_calificacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Restricciones de Llaves Foráneas
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`id_item`) REFERENCES `item`(`id_item`) ON DELETE CASCADE,

  -- REGLA IMPORTANTE: Un usuario solo puede calificar un mismo plato una vez
  -- Si vuelve a votar, se debe actualizar el registro existente, no crear uno nuevo.
  UNIQUE KEY `unique_voto_usuario_item` (`id_usuario`, `id_item`),

  -- VALIDACIÓN: Asegura que la puntuación sea solo entre 1 y 5 (en MySQL 8.0.16+)
  CONSTRAINT `check_rango_estrellas` CHECK (`puntuacion` >= 1 AND `puntuacion` <= 5)
) ENGINE=InnoDB;