import { useState, useMemo, useCallback } from 'react';
import { Header } from '../../components/Header/Header';
import { Hero } from '../../components/Hero/Hero';
import { ConfigPanel } from '../../components/ConfigPanel/ConfigPanel';
import { QRPreview } from '../../components/QRPreview/QRPreview';
import { Features } from '../../components/Features/Features';
import { Footer } from '../../components/Footer/Footer';
import type { QRConfig, ValidationError } from '../../types';
import './Home.scss';

const DEFAULT_CONFIG: QRConfig = {
  type: 'url',
  value: '',
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  },
  fgColor: '#000000',
  bgColor: '#ffffff',
  size: 256,
};

function validateConfig(config: QRConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  if (config.type === 'url') {
    if (!config.value.trim()) {
      errors.push({ field: 'value', message: 'Please enter a URL' });
    } else {
      try {
        new URL(config.value);
      } catch {
        errors.push({ field: 'value', message: 'Please enter a valid URL (e.g. https://example.com)' });
      }
    }
  }

  if (config.type === 'text') {
    if (!config.value.trim()) {
      errors.push({ field: 'value', message: 'Please enter some text' });
    } else if (config.value.length > 2000) {
      errors.push({ field: 'value', message: 'Text must be under 2000 characters' });
    }
  }

  if (config.type === 'wifi') {
    if (!config.wifi.ssid.trim()) {
      errors.push({ field: 'ssid', message: 'Please enter the network name' });
    }
    if (config.wifi.encryption !== 'nopass' && !config.wifi.password.trim()) {
      errors.push({ field: 'password', message: 'Please enter the Wi-Fi password' });
    }
  }

  return errors;
}

function buildQRData(config: QRConfig): string {
  if (config.type === 'url') {
    return config.value.trim();
  }

  if (config.type === 'text') {
    return config.value.trim();
  }

  if (config.type === 'wifi') {
    const { ssid, password, encryption, hidden } = config.wifi;
    // Wi-Fi QR code format: WIFI:T:<enc>;S:<ssid>;P:<pass>;H:<hidden>;;
    const escapedSsid = ssid.replace(/([\\;,:"'])/g, '\\$1');
    const escapedPass = password.replace(/([\\;,:"'])/g, '\\$1');
    return `WIFI:T:${encryption};S:${escapedSsid};P:${escapedPass};H:${hidden ? 'true' : 'false'};;`;
  }

  return '';
}

export const Home: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => (touched ? validateConfig(config) : []), [config, touched]);

  const qrData = useMemo(() => {
    if (!touched) return '';
    if (errors.length > 0) return '';
    return buildQRData(config);
  }, [config, errors, touched]);

  const handleConfigChange = useCallback((newConfig: QRConfig) => {
    setConfig(newConfig);
    setTouched(true);
  }, []);

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setTouched(false);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="generator" id="generator">
          <div className="generator__header">
            <h2 className="generator__title">Create Your QR Code</h2>
            <p className="generator__subtitle">Configure your QR code and download it in seconds</p>
          </div>

          <div className="generator__layout">
            <div className="generator__left">
              <ConfigPanel
                config={config}
                errors={errors}
                onConfigChange={handleConfigChange}
              />
            </div>

            <div className="generator__right">
              <QRPreview
                config={config}
                qrData={qrData}
                onReset={handleReset}
              />
            </div>
          </div>
        </section>

        <Features />
        <section className="guide">
          <div className="guide__inner">
            <section className="guide__section" aria-labelledby="guide-how-title">
              <h2 className="guide__title" id="guide-how-title">How to Create a QR Code in 3 Simple Steps</h2>
              <p className="guide__intro">
                Use QuickQR Tools as a free QR code generator online. Your code is created in your browser, ready to customize and download.
              </p>
              <ol className="guide__cards">
                <li className="guide__card">
                  <span className="guide__step-number">01</span>
                  <h3 className="guide__card-title">Choose a QR code type</h3>
                  <p className="guide__card-text">Select URL, plain text, or Wi-Fi to match what you want to share.</p>
                </li>
                <li className="guide__card">
                  <span className="guide__step-number">02</span>
                  <h3 className="guide__card-title">Add your content and customize</h3>
                  <p className="guide__card-text">Enter your details, then choose the QR code colors and image size.</p>
                </li>
                <li className="guide__card">
                  <span className="guide__step-number">03</span>
                  <h3 className="guide__card-title">Download and test</h3>
                  <p className="guide__card-text">Scan the preview to check it works, then save your QR code as a PNG.</p>
                </li>
              </ol>
            </section>

            <section className="guide__section" aria-labelledby="guide-uses-title">
              <h2 className="guide__title" id="guide-uses-title">What Can You Use a QR Code For?</h2>
              <div className="guide__cards">
                <article className="guide__card">
                  <h3 className="guide__card-title">URL QR code</h3>
                  <p className="guide__card-text">
                    Link printed materials, menus, or product packaging to a website or online resource that people can open with their camera.
                  </p>
                </article>
                <article className="guide__card">
                  <h3 className="guide__card-title">Text QR code</h3>
                  <p className="guide__card-text">
                    Share short instructions, event details, or other plain text without asking someone to type it out.
                  </p>
                </article>
                <article className="guide__card">
                  <h3 className="guide__card-title">Wi-Fi QR code</h3>
                  <p className="guide__card-text">
                    Let guests join your Wi-Fi network by scanning its QR code instead of manually entering the network name and password.
                  </p>
                </article>
              </div>
            </section>

            <section className="guide__section" aria-labelledby="guide-print-title">
              <h2 className="guide__title" id="guide-print-title">Tips for Printing a Scannable QR Code</h2>
              <div className="guide__tips">
                <p>
                  Before printing your customizable QR code, keep these details in mind for a more reliable scan:
                </p>
                <ul>
                  <li>Use strong contrast between the foreground code and background; a dark code on a light background is easiest to scan.</li>
                  <li>Leave clear space around the code and avoid cropping its edges.</li>
                  <li>Choose a print size suited to the viewing distance, then test-scan the printed result before making copies.</li>
                </ul>
                <p>
                  The QR code PNG download is ready for print or digital use. Always test that it opens the right URL, displays the intended text, or connects to the correct Wi-Fi network.
                </p>
              </div>
            </section>
          </div>
        </section>

        <section className="faq" id="faq">
          <div className="faq__inner">
            <h2 className="faq__title">Frequently Asked Questions</h2>
            <div className="faq__list">
              <article className="faq__item">
                <h3 className="faq__question">Is QuickQR Tools free to use?</h3>
                <p className="faq__answer">
                  Yes. You can create and download QR codes for free, with no account required.
                </p>
              </article>
              <article className="faq__item">
                <h3 className="faq__question">What can I create QR codes for?</h3>
                <p className="faq__answer">
                  Create QR codes for website URLs, plain text, or Wi-Fi network details.
                </p>
              </article>
              <article className="faq__item">
                <h3 className="faq__question">Is my content uploaded?</h3>
                <p className="faq__answer">
                  QR content is encoded and rendered locally in your browser; the QR generation flow does not send it to a server.
                </p>
              </article>
              <article className="faq__item">
                <h3 className="faq__question">Can I customize my QR code?</h3>
                <p className="faq__answer">
                  Yes. Choose foreground and background colors, and select a size from 128×128 to 1024×1024 pixels.
                </p>
              </article>
              <article className="faq__item">
                <h3 className="faq__question">Can I download my QR code?</h3>
                <p className="faq__answer">
                  Yes. Download your generated QR code as a PNG image.
                </p>
              </article>
              <article className="faq__item">
                <h3 className="faq__question">Do QR codes expire?</h3>
                <p className="faq__answer">
                  QR codes have no built-in expiration date. However, an encoded URL may stop working, or Wi-Fi details may change.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
