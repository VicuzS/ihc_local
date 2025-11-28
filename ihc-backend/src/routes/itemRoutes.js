const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET /api/items/filters - Obtener opciones de filtrado
router.get('/filters', itemController.getFilterOptions);

// GET /api/items - Obtener todos los items disponibles
router.get('/', itemController.getAllItems);

// POST /api/items - Crear un nuevo item (con imagen)
const upload = require('../middleware/uploadMiddleware');
router.post('/', upload.single('image'), itemController.createItem);

module.exports = router;
