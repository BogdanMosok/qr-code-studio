import { useEffect, useRef, useState } from 'react';
import './Header.scss';

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !menuRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileOpen]);

  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <a href="/" className="header__logo" aria-label="QR Studio home">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#7c3aed" />
            <rect x="6" y="6" width="8" height="8" rx="1.5" fill="white" />
            <rect x="18" y="6" width="8" height="8" rx="1.5" fill="white" />
            <rect x="6" y="18" width="8" height="8" rx="1.5" fill="white" />
            <rect x="20" y="20" width="4" height="4" rx="1" fill="white" />
          </svg>
          QR Studio
        </a>

        <nav
          ref={menuRef}
          id="primary-navigation"
          className={`header__nav${mobileOpen ? ' header__nav--open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#generator" className="header__link" onClick={() => setMobileOpen(false)}>Generator</a>
          <a href="#features" className="header__link" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#faq" className="header__link" onClick={() => setMobileOpen(false)}>FAQ</a>
        </nav>

        <div className="header__actions">
          <button
            ref={menuButtonRef}
            type="button"
            className={`header__mobile-menu${mobileOpen ? ' header__mobile-menu--open' : ''}`}
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="primary-navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line className="header__menu-line header__menu-line--top" x1="3" y1="6" x2="21" y2="6" />
              <line className="header__menu-line header__menu-line--middle" x1="3" y1="12" x2="21" y2="12" />
              <line className="header__menu-line header__menu-line--bottom" x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button type="button" className="header__cta" onClick={scrollToGenerator}>
            Create QR Code
          </button>
        </div>
      </div>
    </header>
  );
};
