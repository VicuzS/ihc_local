const db = require('../config/database');

const ratingController = {

    /**
     * Enviar o actualizar calificación
     * POST /api/ratings
     * Requiere autenticación
     */
    submitRating: async (req, res) => {
        try {
            const { id_item, puntuacion, comentario } = req.body;
            const id_usuario = req.user.id_usuario; // Del token JWT

            // Validación básica
            if (!id_item || !puntuacion) {
                return res.status(400).json({
                    success: false,
                    error: 'id_item y puntuacion son requeridos'
                });
            }

            // Validar rango de puntuación
            if (puntuacion < 1 || puntuacion > 5) {
                return res.status(400).json({
                    success: false,
                    error: 'La puntuación debe estar entre 1 y 5'
                });
            }

            // Verificar que el item existe
            const itemExists = await db.query(
                'SELECT id_item FROM item WHERE id_item = ?',
                [id_item]
            );

            if (itemExists.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'El item no existe'
                });
            }

            // Verificar si el usuario ya calificó este item
            const existingRating = await db.query(
                'SELECT id_calificacion FROM calificacion WHERE id_usuario = ? AND id_item = ?',
                [id_usuario, id_item]
            );

            if (existingRating.length > 0) {
                // Actualizar calificación existente
                await db.query(
                    'UPDATE calificacion SET puntuacion = ?, comentario = ?, fecha_calificacion = CURRENT_TIMESTAMP WHERE id_calificacion = ?',
                    [puntuacion, comentario || null, existingRating[0].id_calificacion]
                );

                return res.json({
                    success: true,
                    message: 'Calificación actualizada exitosamente',
                    data: {
                        id_calificacion: existingRating[0].id_calificacion,
                        id_item,
                        puntuacion,
                        comentario,
                        updated: true
                    }
                });
            } else {
                // Crear nueva calificación
                const result = await db.query(
                    'INSERT INTO calificacion (id_usuario, id_item, puntuacion, comentario) VALUES (?, ?, ?, ?)',
                    [id_usuario, id_item, puntuacion, comentario || null]
                );

                return res.status(201).json({
                    success: true,
                    message: 'Calificación creada exitosamente',
                    data: {
                        id_calificacion: result.insertId,
                        id_item,
                        puntuacion,
                        comentario,
                        updated: false
                    }
                });
            }

        } catch (error) {
            console.error('Error al enviar calificación:', error);
            res.status(500).json({
                success: false,
                error: 'Error al procesar la calificación'
            });
        }
    },

    /**
     * Obtener todas las calificaciones de un item
     * GET /api/ratings/item/:id_item
     * Público (no requiere autenticación)
     */
    getRatingsByItem: async (req, res) => {
        try {
            const { id_item } = req.params;

            const ratings = await db.query(
                `SELECT 
          c.id_calificacion,
          c.puntuacion,
          c.comentario,
          c.fecha_calificacion,
          u.nombre as nombre_usuario,
          u.id_usuario
        FROM calificacion c
        INNER JOIN usuario u ON c.id_usuario = u.id_usuario
        WHERE c.id_item = ?
        ORDER BY c.fecha_calificacion DESC`,
                [id_item]
            );

            // Calcular estadísticas
            const stats = await db.query(
                `SELECT 
          ROUND(AVG(puntuacion), 1) as promedio_estrellas,
          COUNT(id_calificacion) as total_votos
        FROM calificacion
        WHERE id_item = ?`,
                [id_item]
            );

            res.json({
                success: true,
                data: {
                    ratings,
                    stats: {
                        promedio_estrellas: stats[0].promedio_estrellas || 0,
                        total_votos: stats[0].total_votos || 0
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener calificaciones:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener las calificaciones'
            });
        }
    },

    /**
     * Obtener la calificación del usuario actual para un item específico
     * GET /api/ratings/user/item/:id_item
     * Requiere autenticación
     */
    getUserRatingForItem: async (req, res) => {
        try {
            const { id_item } = req.params;
            const id_usuario = req.user.id_usuario;

            const rating = await db.query(
                `SELECT 
          id_calificacion,
          puntuacion,
          comentario,
          fecha_calificacion
        FROM calificacion
        WHERE id_usuario = ? AND id_item = ?`,
                [id_usuario, id_item]
            );

            if (rating.length === 0) {
                return res.json({
                    success: true,
                    data: null
                });
            }

            res.json({
                success: true,
                data: rating[0]
            });

        } catch (error) {
            console.error('Error al obtener calificación del usuario:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener la calificación'
            });
        }
    }

};

module.exports = ratingController;
