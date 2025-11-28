import { useState } from "react";
import "../styles/MisPerfilesPage.css"
import PerfilCard from '../components/PerfilCard'
import { useNavigate } from "react-router-dom";

function MisPerfilesPage() {
    const navigate = useNavigate();

    const [perfiles, setPerfiles] = useState([
        {
            id: 1,
            nombre: 'Yo',
            tipo: 'Omnívoro',
            ultimaModificacion: '8 días',
            icono: 'Yo'
        },
        {
            id: 2,
            nombre: 'Hermana',
            tipo: 'Vegano, sin picante',
            ultimaModificacion: '2 días',
            icono: 'Hermana'
        },
        {
            id: 3,
            nombre: 'Padre',
            tipo: 'Vegetariano, sin lactosa, sin soya',
            fechaCreacion: '21/02/2025',
            icono: 'Padre'
        }
    ]);

    const [draggedItem, setDraggedItem] = useState(null);
    const [isDraggingOverTrash, setIsDraggingOverTrash] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [perfilToDelete, setPerfilToDelete] = useState(null);

    // Drag & Drop handlers para reordenar
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;

        const newPerfiles = [...perfiles];
        const draggedProfile = newPerfiles[draggedItem];
        
        newPerfiles.splice(draggedItem, 1);
        newPerfiles.splice(index, 0, draggedProfile);
        
        setPerfiles(newPerfiles);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setIsDraggingOverTrash(false);
    };

    // Handlers para la papelera
    const handleDragOverTrash = (e) => {
        e.preventDefault();
        setIsDraggingOverTrash(true);
    };

    const handleDragLeaveTrash = () => {
        setIsDraggingOverTrash(false);
    };

    const handleDropOnTrash = (e) => {
        e.preventDefault();
        if (draggedItem !== null) {
            const perfil = perfiles[draggedItem];
            setPerfilToDelete(perfil);
            setShowDeleteModal(true);
        }
        setIsDraggingOverTrash(false);
    };

    // Confirmar eliminación
    const confirmDelete = () => {
        if (perfilToDelete) {
            setPerfiles(perfiles.filter(p => p.id !== perfilToDelete.id));
            setShowDeleteModal(false);
            setPerfilToDelete(null);
            setDraggedItem(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPerfilToDelete(null);
        setDraggedItem(null);
    };

    return (
        <div className="misperfiles-main-container">
            <div className="misperfiles-header">
                <div className="misperfiles-usuario-button">
                    <div className="usuario-avatar">
                        👤
                    </div>
                    <span>Usuario</span>
                </div>
            </div>

            <div className="misperfiles-title-section">
                <h1>Mis Perfiles Personalizados</h1>
                <p className="misperfiles-subtitle">
                    Configura tus filtros personalizados para ti y tu familia
                </p>
                <p className="misperfiles-hint">
                    💡 Arrastra los perfiles para reordenarlos o llévalos a la papelera para eliminarlos
                </p>
            </div>

            {/* Zona de papelera */}
            <div 
                className={`trash-zone ${isDraggingOverTrash ? 'trash-active' : ''} ${draggedItem !== null ? 'trash-visible' : ''}`}
                onDragOver={handleDragOverTrash}
                onDragLeave={handleDragLeaveTrash}
                onDrop={handleDropOnTrash}
            >
                <div className="trash-icon">🗑️</div>
                <p className="trash-text">
                    {isDraggingOverTrash ? 'Suelta aquí para eliminar' : 'Arrastra aquí para eliminar'}
                </p>
            </div>

            <div className="misperfiles-list-container">
                {perfiles.map((perfil, index) => (
                    <div
                        key={perfil.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`draggable-perfil ${draggedItem === index ? 'dragging' : ''}`}
                    >
                        <PerfilCard {...perfil} />
                    </div>
                ))}
            </div>

            <div className="misperfiles-footer">
                <button 
                    className="crear-perfil-button button-general"
                    onClick={() => navigate('/crear-perfil')}
                >
                    + Crear Perfil Personalizado
                </button>
                <button onClick={() => {navigate('/')}} className="salir-button button-general">
                    Salir
                </button>
            </div>

            {/* Modal de confirmación */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">⚠️</div>
                        <h2>¿Seguro que quieres borrar el perfil?</h2>
                        <p className="modal-perfil-name">"{perfilToDelete?.nombre}"</p>
                        <p className="modal-warning">Esta acción no se puede deshacer</p>
                        <div className="modal-buttons">
                            <button 
                                className="modal-cancel-button button-general"
                                onClick={cancelDelete}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="modal-confirm-button button-general"
                                onClick={confirmDelete}
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisPerfilesPage;