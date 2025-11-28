import { useState, useEffect } from 'react';
import '../styles/MenuAdminPage.css';
import logoOscuro from '../assets/imgs/logoTemaOscuro.png';
import logoClaro from '../assets/imgs/logoTemaClaro.png';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate, Link } from 'react-router-dom';

function MenuAdminPage() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const [selectedCategory, setSelectedCategory] = useState('Entrada');
  const [menuItems, setMenuItems] = useState({
    'Entrada': [],
    'Plato fuerte': [],
    'Fondo': [],
    'Bebida': []
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la base de datos
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      // ==========================================
      // DATOS DE EJEMPLO - Reemplazar con tu API
      // ==========================================
      // Descomentar esta línea cuando tengas tu backend:
      // const response = await fetch('/api/menu-items');
      // const data = await response.json();

      // Datos de ejemplo (eliminar cuando conectes con la BD)
      const data = [
        { id: 1, nombre: 'Ceviche', precio: 22, ingredientes: 'Limón, Pescado, Cebolla roja', etiquetas: ['Picante', 'Sin gluten'], estado: true, disponibles: 2, categoria: 'Entrada' },
        { id: 2, nombre: 'Ful mdammas', precio: 25, ingredientes: 'Habas, Cebolla roja, Tomate', etiquetas: ['Vegano'], estado: false, disponibles: 3, categoria: 'Entrada' },
        { id: 3, nombre: 'Ají de gallina', precio: 18, ingredientes: 'Pechuga de pollo, Ají amarillo', etiquetas: ['Gluten'], estado: true, disponibles: 5, categoria: 'Entrada' },
        { id: 4, nombre: 'Lomo saltado', precio: 17, ingredientes: 'Cebolla roja, Lomo, Tomate', etiquetas: ['Salado'], estado: true, disponibles: 4, categoria: 'Entrada' },
        { id: 5, nombre: 'Hummus', precio: 22, ingredientes: 'Garbanzos, Ajo, Tahini', etiquetas: ['Vegano', 'Sin gluten'], estado: true, disponibles: 3, categoria: 'Entrada' },
        { id: 6, nombre: 'Lasaña de verduras', precio: 24, ingredientes: 'Espinaca, Berenjena, Queso', etiquetas: ['Vegetariano'], estado: false, disponibles: 2, categoria: 'Entrada' },

        { id: 7, nombre: 'Arroz con pollo', precio: 28, ingredientes: 'Arroz, Pollo, Culantro', etiquetas: ['Sin gluten'], estado: true, disponibles: 6, categoria: 'Plato fuerte' },
        { id: 8, nombre: 'Tallarines rojos', precio: 26, ingredientes: 'Tallarines, Carne molida, Albahaca', etiquetas: ['Picante'], estado: true, disponibles: 4, categoria: 'Plato fuerte' },
        { id: 9, nombre: 'Chaufa de carne', precio: 30, ingredientes: 'Arroz, Carne, Cebolla china', etiquetas: ['Salado'], estado: false, disponibles: 3, categoria: 'Plato fuerte' },

        { id: 10, nombre: 'Sopa de pollo', precio: 15, ingredientes: 'Pollo, Fideos, Zanahoria', etiquetas: ['Sin gluten'], estado: true, disponibles: 8, categoria: 'Fondo' },
        { id: 11, nombre: 'Chupe de camarones', precio: 35, ingredientes: 'Camarones, Papa, Huevo', etiquetas: ['Picante'], estado: true, disponibles: 5, categoria: 'Fondo' },

        { id: 12, nombre: 'Chicha morada', precio: 8, ingredientes: 'Maíz morado, Piña, Canela', etiquetas: ['Vegano', 'Sin gluten'], estado: true, disponibles: 10, categoria: 'Bebida' },
        { id: 13, nombre: 'Limonada', precio: 6, ingredientes: 'Limón, Azúcar, Agua', etiquetas: ['Vegano'], estado: true, disponibles: 12, categoria: 'Bebida' },
        { id: 14, nombre: 'Inca Kola', precio: 5, ingredientes: 'Gaseosa', etiquetas: [], estado: false, disponibles: 0, categoria: 'Bebida' }
      ];
      // ==========================================

      // Agrupar items por categoría
      const groupedItems = {
        'Entrada': [],
        'Plato fuerte': [],
        'Fondo': [],
        'Bebida': []
      };

      data.forEach(item => {
        if (groupedItems[item.categoria]) {
          groupedItems[item.categoria].push(item);
        }
      });

      setMenuItems(groupedItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Entrada', 'Plato fuerte', 'Fondo', 'Bebida'];

  const currentItems = menuItems[selectedCategory] || [];
  const totalItems = currentItems.length;
  const availableItems = currentItems.filter(item => item.estado).length;

  const toggleItemStatus = async (id) => {
    try {
      // ==========================================
      // VERSIÓN LOCAL (sin backend)
      // ==========================================
      // Actualizar estado local inmediatamente
      setMenuItems(prev => {
        const updated = { ...prev };
        updated[selectedCategory] = updated[selectedCategory].map(item =>
          item.id === id ? { ...item, estado: !item.estado } : item
        );
        return updated;
      });

      // ==========================================
      // VERSIÓN CON BACKEND (descomentar cuando tengas tu API)
      // ==========================================
      /*
      const response = await fetch(`/api/menu-items/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        // Actualizar estado local después de confirmar con el servidor
        setMenuItems(prev => {
          const updated = { ...prev };
          updated[selectedCategory] = updated[selectedCategory].map(item =>
            item.id === id ? { ...item, estado: !item.estado } : item
          );
          return updated;
        });
      } else {
        console.error('Error al actualizar el estado en el servidor');
      }
      */

    } catch (error) {
      console.error('Error toggling item status:', error);
    }
  };

  return (
    <div className="menu-admin-container">
      <div className='navigate-rol-container row'>
        <Link to="/">CLIENTE</Link>
        <Link to="/menu-admin">ADMIN</Link>
      </div>
      <header className="menu-admin-header">
        <div className="header-left">
          <img src={theme === 'dark' ? logoOscuro : logoClaro} alt="SmartFood Logo" className="logo" />
        </div>
        <div className="header-center">
          <div className="stats-box">
            <span className="stats-number">{totalItems}</span>
            <span className="stats-label">Entradas totales</span>
          </div>
          <div className="stats-box">
            <span className="stats-number">{availableItems}</span>
            <span className="stats-label">Entradas disponibles</span>
          </div>
        </div>
        <div className="header-right">
          <ThemeToggle onThemeChange={handleThemeChange} />
          <div className="user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="admin-badge">Admin</div>
        </div>
      </header>

      <div className="menu-admin-content">
        <aside className="categories-sidebar">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </aside>

        <main className="items-main">
          <div className="items-header">
            <button className="refresh-button" onClick={fetchMenuItems}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              Actualizar
            </button>
            <button onClick={() => { navigate('/crear-item') }} className="add-item-button">+ Agregar Item</button>
          </div>

          <div className="items-table">
            <div className="table-header">
              <div className="table-cell">Nombre</div>
              <div className="table-cell">Precio</div>
              <div className="table-cell">Ingredientes</div>
              <div className="table-cell">Etiquetas</div>
              <div className="table-cell">Estado</div>
            </div>

            <div className="table-body">
              {loading ? (
                <div className="loading-message">Cargando items...</div>
              ) : currentItems.length === 0 ? (
                <div className="empty-message">No hay items en esta categoría</div>
              ) : (
                currentItems.map(item => (
                  <div key={item.id} className="table-row">
                    <div className="table-cell">{item.nombre}</div>
                    <div className="table-cell">S/ {item.precio}</div>
                    <div className="table-cell">{item.ingredientes}</div>
                    <div className="table-cell">
                      {Array.isArray(item.etiquetas) && item.etiquetas.length > 0 ? (
                        <>
                          <span className={`tag ${item.etiquetas[0].toLowerCase()}`}>
                            {item.etiquetas[0]}
                          </span>
                          {item.etiquetas.length > 1 && (
                            <span className="extra-tags-badge">+{item.etiquetas.length - 1}</span>
                          )}
                        </>
                      ) : item.etiquetas && typeof item.etiquetas === 'string' ? (
                        <span className={`tag ${item.etiquetas.toLowerCase()}`}>
                          {item.etiquetas}
                        </span>
                      ) : null}
                    </div>
                    <div className="table-cell">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={item.estado}
                          onChange={() => toggleItemStatus(item.id)}
                        />
                        <span className="menu-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MenuAdminPage;