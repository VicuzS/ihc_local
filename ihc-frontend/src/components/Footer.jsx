import '../styles/Footer.css';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();
    const location = useLocation();
    
    // Ocultar footer en páginas de admin y login/register
    const hideFooterPaths = ['/menu-admin', '/crear-item', '/login', '/register'];
    if (hideFooterPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>SmartFood</h3>
                    <p className="footer-description">
                        Tu asistente inteligente para una alimentación personalizada y saludable
                    </p>
                    <div className="footer-social">
                        <a href="#" className="social-link" aria-label="Facebook">📘</a>
                        <a href="#" className="social-link" aria-label="Instagram">📷</a>
                        <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Navegación</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Menú del Día</Link></li>
                        <li><Link to="/mis-perfiles">Mis Perfiles</Link></li>
                        <li><Link to="/crear-perfil">Crear Perfil</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Ayuda</h4>
                    <ul className="footer-links">
                        <li><a href="#faq">Preguntas Frecuentes</a></li>
                        <li><a href="#contact">Contacto</a></li>
                        <li><a href="#privacy">Política de Privacidad</a></li>
                        <li><a href="#terms">Términos de Servicio</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Sobre los Perfiles</h4>
                    <p className="footer-info">
                        Los perfiles personalizados te permiten guardar tus preferencias alimenticias y las de tu familia. 
                        Cada perfil filtra el menú según dietas, alergias y gustos específicos.
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} SmartFood. Todos los derechos reservados.</p>
                <p className="footer-credits">Desarrollado con ❤️ para una mejor alimentación</p>
            </div>
        </footer>
    );
}

export default Footer;