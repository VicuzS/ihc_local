const db = require('./src/config/database');

async function resetAdmin() {
    try {
        console.log('Eliminando usuario admin existente...');
        await db.query('DELETE FROM usuario WHERE email = ?', ['admin@gmail.com']);
        console.log('Usuario admin eliminado.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetAdmin();
