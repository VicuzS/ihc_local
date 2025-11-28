import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getItems } from '../api/items';
import Navbar from '../components/Navbar';
import RatingSection from '../components/RatingSection';
import '../styles/ItemDetailPage.css';

function ItemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const items = await getItems();
                const foundItem = items.find(i => i.id_item === parseInt(id));

                if (foundItem) {
                    setItem(foundItem);
                } else {
                    // Item no encontrado, redirigir a la página principal
                    navigate('/');
                }
            } catch (error) {
                console.error('Error al cargar detalles del item:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="main-page-container">
                <Navbar />
                <div className="loading-container">
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return null;
    }

    const getNivelPicanteText = (nivel) => {
        switch (nivel) {
            case '0': return 'No picante';
            case '1': return 'Picante bajo';
            case '2': return 'Picante alto';
            default: return 'No especificado';
        }
    };

    return (
        <div className="main-page-container">
            <Navbar />
            <div className="item-detail-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Volver
                </button>

                <div className="item-detail-content">
                    <div className="item-detail-left">
                        <div className="image-container">
                            <img src={`/${item.url_imagen}`} alt={item.nombre} className="item-detail-image" />
                        </div>

                        <div className="item-info-box">
                            <h2>Información Nutricional</h2>
                            <div className="info-row">
                                <span className="info-label">Calorías aproximadas:</span>
                                <span className="info-value">{item.kcal_aprox || 'No especificado'} kcal</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Nivel de picante:</span>
                                <span className="info-value">{getNivelPicanteText(item.nivel_picante)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Sabor base:</span>
                                <span className="info-value">{item.sabor_base || 'No especificado'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="item-detail-right">
                        <div className="item-header-box">
                            <div className="item-header">
                                <h1>{item.nombre}</h1>
                                <span className="item-price">S/ {item.precio}</span>
                            </div>

                            <div className="item-category">
                                <span className="category-badge">{item.categoria}</span>
                            </div>
                        </div>

                        <div className="item-description-box">
                            <h2>Descripción</h2>
                            <p>{item.descripcion || 'No hay descripción disponible para este plato.'}</p>
                        </div>

                        <RatingSection itemId={item.id_item} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetailPage;
