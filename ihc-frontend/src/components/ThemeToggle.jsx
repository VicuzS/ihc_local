import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import '../styles/ThemeToggle.css';

const ThemeToggle = ({ onThemeChange }) => {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to 'dark'
        return localStorage.getItem('theme') || 'dark';
    });

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        // Save to localStorage
        localStorage.setItem('theme', theme);
        // Notify parent component
        if (onThemeChange) {
            onThemeChange(theme);
        }
    }, [theme, onThemeChange]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="theme-toggle-container">
            <button
                className="theme-toggle-button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                <div className={`toggle-slider ${theme}`}>
                    <FontAwesomeIcon
                        icon={theme === 'dark' ? faMoon : faSun}
                        className="toggle-icon"
                    />
                </div>
            </button>
        </div>
    );
};

export default ThemeToggle;
