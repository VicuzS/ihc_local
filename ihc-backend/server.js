const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const itemRoutes = require('./src/routes/itemRoutes');
const authRoutes = require('./src/routes/authRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');


// Configurar variables de entorno
dotenv.config(); //Esto carga el .env para despues poder usar process.env."ALGUNA VAIRABLE DE ENTORNO", ejemplo: process.env.PORT.

const app = express();
const PORT = process.env.PORT || 3000; //Por ahora estará usando el 3000 porque aun no deployamos backend xd

// ========================================
// MIDDLEWARES GLOBALES
// ========================================

//Hay muchos middlewares, pero estos dos son los más importantes, cuando el front hace una peticion, tal peticion antes de llegar a las rutas del backend pasan por aqui
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend React
  credentials: true
}));

app.use(express.json());

// ========================================
// RUTAS
// ========================================
app.get('/', (req, res) => {
  res.json({
    message: 'SmartFood API',
    version: '1.0.0',
    status: 'running'
  });
});

// Rutas de la API
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ratings', ratingRoutes);


// Ruta 404 (debe ir después de todas las rutas)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
});