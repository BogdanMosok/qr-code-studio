import './Footer.scss';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">© {year} QuickQR Tools. Free QR code generator.</p>
        <div className="footer__links">
          <a href="#generator" className="footer__link">Generator</a>
          <a href="#features" className="footer__link">Features</a>
          <a href="#faq" className="footer__link">FAQ</a>
        </div>
      </div>
    </footer>
  );
};
