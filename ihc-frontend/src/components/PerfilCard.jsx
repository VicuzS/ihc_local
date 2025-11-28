import '../styles/PerfilCard.css'

function PerfilCard({ nombre, tipo, ultimaModificacion, fechaCreacion, icono }) {
    return (
        <div className="perfilcard-container">
            <div className="perfilcard-left-section">
                <div className={`perfilcard-avatar avatar-${icono.toLowerCase()}`}>
                    {icono.charAt(0)}
                </div>
                <div className="perfilcard-info">
                    <h3>{nombre}</h3>
                    <p className="perfilcard-tipo">{tipo}</p>
                    <p className="perfilcard-fecha">
                        {ultimaModificacion 
                            ? `Última modificación: hace ${ultimaModificacion}` 
                            : `Fecha de creación: ${fechaCreacion}`
                        }
                    </p>
                </div>
            </div>
            <div className="perfilcard-actions">
                <button className="perfilcard-edit-button button-general">✏️ Editar</button>
                <button className="perfilcard-delete-button button-general">🗑️ Eliminar</button>
            </div>
        </div>
    );
}

export default PerfilCard;