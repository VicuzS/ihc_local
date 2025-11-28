import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import logoOscuro from '../assets/imgs/logoTemaOscuro.png';
import logoClaro from '../assets/imgs/logoTemaClaro.png';
import ThemeToggle from './ThemeToggle';
import authService from '../api/auth';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verificar si hay un usuario logueado al cargar el componente
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            const updatedUser = authService.getCurrentUser();
            setUser(updatedUser);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Removed user dependency to prevent infinite loop

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img
                    src={theme === 'dark' ? logoOscuro : logoClaro}
                    alt="SmartFood Logo"
                    className="navbar-logo"
                />
                <span className="navbar-brand">SMARTFOOD</span>
            </div>

            <div className="navbar-center">
                <Link to="/crear-perfil" className="nav-link">Crear perfil</Link>
                <Link to="/mis-perfiles" className="nav-link">Ver perfiles</Link>
                <Link to="/mis-perfiles" className="nav-link">Seleccionar perfil</Link>
            </div>

            <div className="navbar-right">
                <div className="role-switcher">
                    <Link to="/" className="role-link">CLIENTE</Link>
                    <span className="role-divider">|</span>
                    <Link to="/menu-admin" className="role-link">ADMIN</Link>
                </div>

                <ThemeToggle onThemeChange={handleThemeChange} />

                <div className="auth-controls">
                    <FontAwesomeIcon className="user-icon" icon={faCircleUser} />

                    {user ? (
                        // Mostrar nombre del usuario y botón de logout si está autenticado
                        <>
                            <span style={{ color: 'var(--color-accent)', fontWeight: '600', marginRight: '10px' }}>
                                {user.nombre}
                            </span>
                            <button className="btn-auth" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        // Mostrar botones de Login y Register si no está autenticado
                        <>
                            <button className="btn-auth" onClick={() => navigate('/login')}>Login</button>
                            <button className="btn-auth register" onClick={() => navigate('/register')}>Register</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
