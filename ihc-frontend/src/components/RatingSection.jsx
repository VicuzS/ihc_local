import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import ratingsService from '../api/ratings';
import authService from '../api/auth';
import '../styles/RatingSection.css';

const RatingSection = ({ itemId }) => {
    const [ratings, setRatings] = useState([]);
    const [stats, setStats] = useState({ promedio_estrellas: 0, total_votos: 0 });
    const [userRating, setUserRating] = useState(null);
    const [selectedStars, setSelectedStars] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRatings();
        if (authService.isAuthenticated()) {
            fetchUserRating();
        }
    }, [itemId]);

    const fetchRatings = async () => {
        try {
            const response = await ratingsService.getRatingsByItem(itemId);
            if (response.success) {
                setRatings(response.data.ratings);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error al cargar calificaciones:', error);
        }
    };

    const fetchUserRating = async () => {
        try {
            const response = await ratingsService.getUserRatingForItem(itemId);
            if (response.success && response.data) {
                setUserRating(response.data);
                setSelectedStars(response.data.puntuacion);
                setComment(response.data.comentario || '');
            }
        } catch (error) {
            console.error('Error al cargar calificación del usuario:', error);
        }
    };

    const handleStarClick = (rating) => {
        if (!authService.isAuthenticated()) {
            // Guardar intención de calificar y redirigir al login
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }
        setSelectedStars(rating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authService.isAuthenticated()) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return;
        }

        if (selectedStars === 0) {
            setMessage('Por favor selecciona una calificación');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await ratingsService.submitRating(itemId, selectedStars, comment);

            if (response.success) {
                setMessage(userRating ? 'Calificación actualizada' : 'Calificación enviada');

                // Actualizar la lista de calificaciones
                await fetchRatings();
                await fetchUserRating();

                // Limpiar mensaje después de 3 segundos
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage(error.error || 'Error al enviar calificación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="rating-section">
            <div className="rating-summary">
                <h2>Calificaciones</h2>
                <div className="rating-stats">
                    <div className="average-rating">
                        <span className="rating-number">{stats.promedio_estrellas || 0}</span>
                        <StarRating initialRating={stats.promedio_estrellas || 0} readOnly={true} />
                        <span className="total-votes">{stats.total_votos} {stats.total_votos === 1 ? 'calificación' : 'calificaciones'}</span>
                    </div>
                </div>
            </div>

            <div className="rating-form-container">
                <h3>{userRating ? 'Tu calificación' : 'Califica este plato'}</h3>
                <form onSubmit={handleSubmit} className="rating-form">
                    <div className="star-input">
                        <StarRating
                            initialRating={selectedStars}
                            onRate={handleStarClick}
                            readOnly={false}
                        />
                    </div>
                    <textarea
                        className="comment-input"
                        placeholder="Escribe un comentario (opcional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                    />
                    <button
                        type="submit"
                        className="submit-rating-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : (userRating ? 'Actualizar calificación' : 'Enviar calificación')}
                    </button>
                    {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}
                </form>
            </div>

            <div className="ratings-list">
                <h3>Comentarios ({ratings.length})</h3>
                {ratings.length === 0 ? (
                    <p className="no-ratings">Aún no hay calificaciones. ¡Sé el primero en calificar!</p>
                ) : (
                    ratings.map((rating) => (
                        <div key={rating.id_calificacion} className="rating-card">
                            <div className="rating-header">
                                <div className="user-info">
                                    <span className="user-name">{rating.nombre_usuario}</span>
                                    <span className="rating-date">{formatDate(rating.fecha_calificacion)}</span>
                                </div>
                                <StarRating initialRating={rating.puntuacion} readOnly={true} />
                            </div>
                            {rating.comentario && (
                                <p className="rating-comment">{rating.comentario}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RatingSection;
