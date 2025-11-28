const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación
 * Verifica el token JWT en el header Authorization
 * Adjunta los datos del usuario decodificados a req.user
 */
const authMiddleware = (req, res, next) => {
    try {
        // Extraer token del header Authorization (formato: "Bearer TOKEN")
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No se proporcionó token de autenticación'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar y decodificar el token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'smartfood-secret-key-2024'
        );

        // Adjuntar datos del usuario al request
        req.user = decoded;

        // Continuar con el siguiente middleware/controlador
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Token inválido'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expirado. Por favor, inicia sesión nuevamente'
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Error de autenticación'
        });
    }
};

module.exports = authMiddleware;
