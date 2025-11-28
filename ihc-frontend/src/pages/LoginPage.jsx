import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import logoOscuro from '../assets/imgs/logoTemaOscuro.png';
import logoClaro from '../assets/imgs/logoTemaClaro.png';
import authService from '../api/auth';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);
            console.log('Login exitoso:', response.data.user);

            // Redirigir según rol
            if (response.data.user.rol === 'admin') {
                navigate('/menu-admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError(error.error || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <Link to="/" className="back-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver
                </Link>
                <ThemeToggle onThemeChange={handleThemeChange} />
            </div>

            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-logo-container">
                        <img
                            src={theme === 'dark' ? logoOscuro : logoClaro}
                            alt="SmartFood Logo"
                            className="auth-logo"
                        />
                        <h1>Bienvenido de nuevo</h1>
                        <p className="auth-subtitle">Ingresa a tu cuenta para continuar</p>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ejemplo@correo.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-actions">
                            <Link to="/forgot-password" className="forgot-password">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
