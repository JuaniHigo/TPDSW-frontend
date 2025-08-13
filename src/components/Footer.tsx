import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-socials">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    {/* Ícono de Instagram */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    {/* Ícono de X (Twitter) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
            </div>
            <div className="footer-copyright">
                <p>&copy; {currentYear} kicket. Todos los derechos reservados.</p>
            </div>
            {/* Dejamos un div vacío a la derecha para mantener el centrado del copyright */}
            <div className="footer-placeholder"></div>
        </footer>
    );
};

export default Footer;