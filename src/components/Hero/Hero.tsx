import './Hero.scss';

export const Hero: React.FC = () => {
  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero__badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        100% Free · No sign-up required
      </div>

      <h1 className="hero__title">
        Free QR Code Generator – Create QR Codes
        <span> Instantly Online</span>
      </h1>

      <p className="hero__subtitle">
        Create beautiful QR codes for URLs, text, and Wi-Fi networks. Customize colors, sizes, and download as PNG — all for free.
      </p>

      <button type="button" className="hero__cta" onClick={scrollToGenerator}>
        Start Creating
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </section>
  );
};
