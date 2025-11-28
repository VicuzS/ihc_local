const db = require('../src/config/database');

const seedCategories = async () => {
    const categories = [
        'Entradas',
        'Platos fuertes',
        'Bebidas',
        'Postres',
        'Complementos'
    ];

    console.log('🌱 Iniciando inserción de categorías...');

    try {
        for (const category of categories) {
            // Usamos INSERT IGNORE para evitar duplicados si ya existen
            await db.query('INSERT IGNORE INTO categoria (nombre) VALUES (?)', [category]);
            console.log(`   - Categoría procesada: ${category}`);
        }
        console.log('✅ Categorías insertadas correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al insertar categorías:', error);
        process.exit(1);
    }
};

seedCategories();
