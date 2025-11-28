const db = require('../config/database');

const itemController = {

  // Obtener todos los items disponibles
  getAllItems: async (req, res) => {
    try {
      const query = `
        SELECT 
          i.id_item,
          i.nombre,
          i.descripcion,
          i.precio,
          i.kcal_aprox,
          i.url_imagen,
          i.nivel_picante,
          i.sabor_base,
          i.disponible,
          c.nombre as categoria,
          ROUND(AVG(cal.puntuacion), 1) as promedio_estrellas,
          COUNT(DISTINCT cal.id_calificacion) as total_votos,
          GROUP_CONCAT(DISTINCT e.nombre) as etiquetas,
          GROUP_CONCAT(DISTINCT a.nombre) as alergenos
        FROM item i
        INNER JOIN categoria c ON i.id_categoria = c.id_categoria
        LEFT JOIN calificacion cal ON i.id_item = cal.id_item
        LEFT JOIN item_etiqueta ie ON i.id_item = ie.id_item
        LEFT JOIN etiqueta e ON ie.id_etiqueta = e.id_etiqueta
        LEFT JOIN item_ingrediente ii ON i.id_item = ii.id_item
        LEFT JOIN ingrediente ing ON ii.id_ingrediente = ing.id_ingrediente
        LEFT JOIN ingrediente_alergeno ia ON ing.id_ingrediente = ia.id_ingrediente
        LEFT JOIN alergeno a ON ia.id_alergeno = a.id_alergeno
        WHERE i.disponible = 1
        GROUP BY i.id_item, i.nombre, i.descripcion, i.precio, i.kcal_aprox, 
                 i.url_imagen, i.nivel_picante, i.sabor_base, i.disponible, c.nombre
        ORDER BY c.id_categoria, i.nombre
      `;

      const items = await db.query(query);

      // Procesar los resultados para convertir las cadenas separadas por comas en arrays
      const itemsProcessed = items.map(item => ({
        ...item,
        etiquetas: item.etiquetas ? item.etiquetas.split(',') : [],
        alergenos: item.alergenos ? item.alergenos.split(',') : []
      }));

      res.json(itemsProcessed);

    } catch (error) {
      console.error('Error al obtener items:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener los items'
      });
    }
  },

  // Crear un nuevo item
  createItem: async (req, res) => {
    const connection = await db.pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        nombre,
        descripcion,
        precio,
        kcal_aprox,
        nivel_picante,
        sabor_base,
        id_categoria,
        ingredientes, // Array of strings
        etiquetas,    // Array of strings (names)
        alergenos     // Array of strings (names)
      } = req.body;

      const url_imagen = req.file ? `/uploads/${req.file.filename}` : null;

      // 1. Insertar Item
      const [itemResult] = await connection.query(
        `INSERT INTO item (nombre, descripcion, precio, kcal_aprox, url_imagen, nivel_picante, sabor_base, id_categoria, disponible) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [nombre, descripcion, precio, kcal_aprox, url_imagen, nivel_picante, sabor_base, id_categoria]
      );
      const id_item = itemResult.insertId;

      // 2. Procesar Ingredientes (Insertar si no existen y vincular)
      if (ingredientes) {
        const ingredientesList = Array.isArray(ingredientes) ? ingredientes : JSON.parse(ingredientes);
        for (const nombreIngrediente of ingredientesList) {
          // Insertar ingrediente si no existe (IGNORE)
          await connection.query('INSERT IGNORE INTO ingrediente (nombre) VALUES (?)', [nombreIngrediente]);

          // Obtener ID del ingrediente
          const [ingResult] = await connection.query('SELECT id_ingrediente FROM ingrediente WHERE nombre = ?', [nombreIngrediente]);
          const id_ingrediente = ingResult[0].id_ingrediente;

          // Vincular item con ingrediente
          await connection.query('INSERT INTO item_ingrediente (id_item, id_ingrediente) VALUES (?, ?)', [id_item, id_ingrediente]);
        }
      }

      // 3. Procesar Etiquetas (Estilo de vida)
      if (etiquetas) {
        const etiquetasList = Array.isArray(etiquetas) ? etiquetas : JSON.parse(etiquetas);
        for (const nombreEtiqueta of etiquetasList) {
          // Obtener ID de la etiqueta (asumimos que ya existen en la BD, si no, se podrían crear)
          const [tagResult] = await connection.query('SELECT id_etiqueta FROM etiqueta WHERE nombre = ?', [nombreEtiqueta]);
          if (tagResult.length > 0) {
            await connection.query('INSERT INTO item_etiqueta (id_item, id_etiqueta) VALUES (?, ?)', [id_item, tagResult[0].id_etiqueta]);
          }
        }
      }

      // 4. Procesar Alérgenos
      // Nota: El esquema original vincula alérgenos a ingredientes. 
      // Para simplificar y cumplir con el requerimiento de "definir sus alérgenos" directamente para el plato,
      // vamos a vincular estos alérgenos al primer ingrediente del plato o crear un ingrediente "Base" si es necesario.
      // ESTRATEGIA PRAGMÁTICA: Si el usuario selecciona alérgenos, nos aseguramos que estén vinculados a los ingredientes del plato.
      // Pero dado que la relación es Ingrediente -> Alérgeno, y aquí estamos creando el plato...
      // Vamos a asumir que si el usuario selecciona "Nueces", es porque alguno de los ingredientes tiene nueces.
      // Para efectos de visualización y filtrado (que usa item -> ingrediente -> alergeno), necesitamos que esa cadena exista.
      // SOLUCIÓN: Crear un ingrediente oculto o usar uno existente para vincular los alérgenos, O
      // Insertar los alérgenos vinculados a TODOS los ingredientes de este plato? No, eso es incorrecto.
      // MEJOR SOLUCIÓN: Crear un ingrediente llamado "Base [NombrePlato]" y vincularle los alérgenos seleccionados.

      if (alergenos) {
        const alergenosList = Array.isArray(alergenos) ? alergenos : JSON.parse(alergenos);
        if (alergenosList.length > 0) {
          // Crear ingrediente base para contener los alérgenos del plato
          const baseIngredientName = `Base ${nombre}`;
          await connection.query('INSERT INTO ingrediente (nombre) VALUES (?)', [baseIngredientName]);
          const [baseIngResult] = await connection.query('SELECT id_ingrediente FROM ingrediente WHERE nombre = ?', [baseIngredientName]);
          const id_base_ingrediente = baseIngResult[0].id_ingrediente;

          // Vincular este ingrediente al item
          await connection.query('INSERT INTO item_ingrediente (id_item, id_ingrediente) VALUES (?, ?)', [id_item, id_base_ingrediente]);

          // Vincular alérgenos a este ingrediente base
          for (const nombreAlergeno of alergenosList) {
            const [alergenoResult] = await connection.query('SELECT id_alergeno FROM alergeno WHERE nombre = ?', [nombreAlergeno]);
            if (alergenoResult.length > 0) {
              await connection.query('INSERT IGNORE INTO ingrediente_alergeno (id_ingrediente, id_alergeno) VALUES (?, ?)', [id_base_ingrediente, alergenoResult[0].id_alergeno]);
            }
          }
        }
      }

      await connection.commit();
      res.status(201).json({ success: true, message: 'Item creado exitosamente', id_item });

    } catch (error) {
      await connection.rollback();
      console.error('Error al crear item:', error);
      res.status(500).json({ success: false, error: 'Error al crear el item' });
    } finally {
      connection.release();
    }
  },

  // Obtener opciones de filtrado (etiquetas, alérgenos y categorías)
  getFilterOptions: async (req, res) => {
    try {
      const etiquetasQuery = "SELECT nombre FROM etiqueta ORDER BY nombre";
      const alergenosQuery = "SELECT nombre FROM alergeno ORDER BY nombre";
      const categoriasQuery = "SELECT nombre FROM categoria ORDER BY nombre";

      const [etiquetas, alergenos, categorias] = await Promise.all([
        db.query(etiquetasQuery),
        db.query(alergenosQuery),
        db.query(categoriasQuery)
      ]);

      res.json({
        etiquetas: etiquetas.map(e => e.nombre),
        alergenos: alergenos.map(a => a.nombre),
        categorias: categorias.map(c => c.nombre)
      });

    } catch (error) {
      console.error('Error al obtener opciones de filtro:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener opciones de filtro'
      });
    }
  }

};

module.exports = itemController;