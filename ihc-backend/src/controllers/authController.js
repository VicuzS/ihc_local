const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {

    // Registrar nuevo usuario
    register: async (req, res) => {
        try {
            const { nombre, email, password, rol } = req.body;

            // Validación básica
            if (!nombre || !email || !password || !rol) {
                return res.status(400).json({
                    success: false,
                    error: 'Nombre, email, contraseña y rol son requeridos'
                });
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Formato de email inválido'
                });
            }

            // Validar que el rol sea válido
            if (!['admin', 'cliente'].includes(rol)) {
                return res.status(400).json({
                    success: false,
                    error: 'Rol inválido. Debe ser "admin" o "cliente"'
                });
            }

            // Validar longitud de contraseña
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: 'La contraseña debe tener al menos 6 caracteres'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await db.query(
                'SELECT id_usuario FROM usuario WHERE email = ?',
                [email]
            );

            if (existingUser.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: 'El email ya está registrado'
                });
            }

            // Hash de la contraseña
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(password, saltRounds);

            // Insertar usuario en la base de datos
            const result = await db.query(
                'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
                [nombre, email, password_hash, rol]
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    id_usuario: result.insertId,
                    nombre,
                    email,
                    rol
                }
            });

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({
                success: false,
                error: 'Error al registrar el usuario'
            });
        }
    },

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validación básica
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario por email
            const users = await db.query(
                'SELECT id_usuario, nombre, email, password_hash, rol, fecha_creacion FROM usuario WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            const user = users[0];

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // Generar JWT token
            const token = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol
                },
                process.env.JWT_SECRET || 'smartfood-secret-key-2024',
                { expiresIn: '24h' }
            );

            // Remover password_hash de la respuesta
            delete user.password_hash;

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    token,
                    user
                }
            });

        } catch (error) {
            console.error('Error al hacer login:', error);
            res.status(500).json({
                success: false,
                error: 'Error al procesar el login'
            });
        }
    }

};

module.exports = authController;
