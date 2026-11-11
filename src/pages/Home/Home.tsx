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
      <Footer />
    </>
  );
};
