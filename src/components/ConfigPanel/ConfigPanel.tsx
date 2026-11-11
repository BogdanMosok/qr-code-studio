import type { ReactElement } from 'react';
import type { QRConfig, QRCodeType, WifiEncryption, ValidationError } from '../../types';
import './ConfigPanel.scss';

interface ConfigPanelProps {
  config: QRConfig;
  errors: ValidationError[];
  onConfigChange: (config: QRConfig) => void;
}

const QR_TYPES: { value: QRCodeType; label: string; icon: ReactElement }[] = [
  {
    value: 'url',
    label: 'URL',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    value: 'text',
    label: 'Text',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 6.1H3M21 12.1H3M15.1 18H3" />
      </svg>
    ),
  },
  {
    value: 'wifi',
    label: 'Wi-Fi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
    ),
  },
];

const SIZES = [128, 256, 512, 1024];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, errors, onConfigChange }) => {
  const getError = (field: string): string | undefined =>
    errors.find((e) => e.field === field)?.message;

  const updateConfig = (partial: Partial<QRConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  return (
    <div className="config-panel">
      {/* QR Type Selector */}
      <div className="config-panel__section">
        <span className="config-panel__label">QR Code Type</span>
        <div className="config-panel__types">
          {QR_TYPES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              className={`config-panel__type-btn ${config.type === value ? 'config-panel__type-btn--active' : ''}`}
              aria-pressed={config.type === value}
              onClick={() => updateConfig({ type: value, value: '' })}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="config-panel__section">
        <span className="config-panel__label">Content</span>

        {config.type === 'url' && (
          <div className="config-panel__input-group">
            <label className="config-panel__input-label" htmlFor="qr-url">
              Website URL
            </label>
            <input
              id="qr-url"
              type="url"
              className={`config-panel__input ${getError('value') ? 'config-panel__input--error' : ''}`}
              aria-invalid={Boolean(getError('value'))}
              placeholder="https://example.com"
              value={config.value}
              onChange={(e) => updateConfig({ value: e.target.value })}
            />
            {getError('value') && (
              <div className="config-panel__error">{getError('value')}</div>
            )}
          </div>
        )}

        {config.type === 'text' && (
          <div className="config-panel__input-group">
            <label className="config-panel__input-label" htmlFor="qr-text">
              Your Text
            </label>
            <textarea
              id="qr-text"
              className={`config-panel__input ${getError('value') ? 'config-panel__input--error' : ''}`}
              aria-invalid={Boolean(getError('value'))}
              placeholder="Enter your text here..."
              rows={4}
              value={config.value}
              onChange={(e) => updateConfig({ value: e.target.value })}
              style={{ resize: 'vertical' }}
            />
            {getError('value') && (
              <div className="config-panel__error">{getError('value')}</div>
            )}
          </div>
        )}

        {config.type === 'wifi' && (
          <>
            <div className="config-panel__input-group">
              <label className="config-panel__input-label" htmlFor="wifi-ssid">
                Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                className={`config-panel__input ${getError('ssid') ? 'config-panel__input--error' : ''}`}
                aria-invalid={Boolean(getError('ssid'))}
                placeholder="My Wi-Fi Network"
                value={config.wifi.ssid}
                onChange={(e) =>
                  updateConfig({ wifi: { ...config.wifi, ssid: e.target.value } })
                }
              />
              {getError('ssid') && (
                <div className="config-panel__error">{getError('ssid')}</div>
              )}
            </div>

            <div className="config-panel__input-group">
              <label className="config-panel__input-label" htmlFor="wifi-password">
                Password
              </label>
              <input
                id="wifi-password"
                type="password"
                className={`config-panel__input ${getError('password') ? 'config-panel__input--error' : ''}`}
                aria-invalid={Boolean(getError('password'))}
                placeholder="Enter Wi-Fi password"
                value={config.wifi.password}
                onChange={(e) =>
                  updateConfig({ wifi: { ...config.wifi, password: e.target.value } })
                }
              />
              {getError('password') && (
                <div className="config-panel__error">{getError('password')}</div>
              )}
            </div>

            <div className="config-panel__input-group">
              <label className="config-panel__input-label" htmlFor="wifi-encryption">
                Encryption
              </label>
              <select
                id="wifi-encryption"
                className="config-panel__select"
                value={config.wifi.encryption}
                onChange={(e) =>
                  updateConfig({
                    wifi: { ...config.wifi, encryption: e.target.value as WifiEncryption },
                  })
                }
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>

            <div className="config-panel__input-group">
              <label className="config-panel__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="config-panel__checkbox"
                  checked={config.wifi.hidden}
                  onChange={(e) =>
                    updateConfig({ wifi: { ...config.wifi, hidden: e.target.checked } })
                  }
                />
                <span className="config-panel__checkbox-label">Hidden network</span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Color Customization */}
      <div className="config-panel__section">
        <span className="config-panel__label">Colors</span>
        <div className="config-panel__colors">
          <div className="config-panel__color-field">
            <input
              type="color"
              className="config-panel__color-input"
              value={config.fgColor}
              onChange={(e) => updateConfig({ fgColor: e.target.value })}
              aria-label="Foreground color"
            />
            <div className="config-panel__color-text">
              <span className="config-panel__color-name">Foreground</span>
              <span className="config-panel__color-value">{config.fgColor}</span>
            </div>
          </div>
          <div className="config-panel__color-field">
            <input
              type="color"
              className="config-panel__color-input"
              value={config.bgColor}
              onChange={(e) => updateConfig({ bgColor: e.target.value })}
              aria-label="Background color"
            />
            <div className="config-panel__color-text">
              <span className="config-panel__color-name">Background</span>
              <span className="config-panel__color-value">{config.bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Selector */}
      <div className="config-panel__section">
        <span className="config-panel__label">Size</span>
        <div className="config-panel__sizes">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`config-panel__size-btn ${config.size === size ? 'config-panel__size-btn--active' : ''}`}
              onClick={() => updateConfig({ size })}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
