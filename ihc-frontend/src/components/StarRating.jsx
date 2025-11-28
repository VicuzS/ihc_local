import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../styles/StarRating.css';

const StarRating = ({ initialRating = 0, onRate, readOnly = false }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleClick = (value, event) => {
        if (!readOnly) {
            // Stop event propagation to prevent interfering with parent onClick handlers
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            setRating(value);
            if (onRate) {
                onRate(value);
            }
        }
    };

    const handleContainerClick = (e) => {
        // Always stop propagation on the container to prevent Link navigation interference
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="star-rating" onClick={handleContainerClick}>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className="star"
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                        size="lg"
                        onMouseEnter={() => !readOnly && setHover(ratingValue)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        onClick={(e) => handleClick(ratingValue, e)}
                        style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
