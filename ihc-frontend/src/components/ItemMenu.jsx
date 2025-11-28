import '../styles/ItemMenu.css'
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';

function ItemMenu({ item }) {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // Prevent default behavior
        e.preventDefault();

        // Navigate using window.location for a hard navigation
        window.location.href = `/item/${item.id_item}`;
    };

    return (
        <div className='item-menu-container' onClick={handleCardClick}>
            <p>{item.nombre}</p>
            <img src={`/${item.url_imagen}`} alt="item" />
            <div className='item-menu-avaliable-container row'>
                <p>Compatibilidad</p>
                <div className='avaliable-view'></div>
            </div>
            <div className='item-menu-price-container row'>
                <p>Precio</p>
                <span>S/{item.precio}</span>
            </div>
            <div className="item-rating-container">
                <StarRating
                    initialRating={item.promedio_estrellas || 0}
                    readOnly={true}
                />
                <span className="vote-count">
                    ({item.total_votos || 0} {item.total_votos === 1 ? 'voto' : 'votos'})
                </span>
            </div>
        </div>
    );
}

export default ItemMenu;