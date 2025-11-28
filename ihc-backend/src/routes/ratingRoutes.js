const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.get('/item/:id_item', ratingController.getRatingsByItem);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, ratingController.submitRating);
router.get('/user/item/:id_item', authMiddleware, ratingController.getUserRatingForItem);

module.exports = router;
