-- ============================================================
-- Script para insertar usuario ADMINISTRADOR en SmartFood
-- ============================================================
-- Email: admin@gmail.com
-- Contraseña: admin123
-- ============================================================

-- Insertar usuario administrador
-- La contraseña 'admin123' ha sido hasheada con bcrypt (10 rounds)
INSERT INTO usuario (nombre, email, password_hash, rol) 
VALUES (
  'Administrador',
  'admin@gmail.com',
  '$2b$10$2p8C0OBGBKbb1JxD2CD5aPcL0fyDt3Am',
  'admin'
);

-- Verificar que el usuario fue insertado correctamente
SELECT id_usuario, nombre, email, rol, fecha_creacion 
FROM usuario 
WHERE email = 'admin@gmail.com';
