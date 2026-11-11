import { useEffect, useRef, useCallback, useState } from 'react';
import QRCode from 'qrcode';
import type { QRConfig } from '../../types';
import './QRPreview.scss';

interface QRPreviewProps {
  config: QRConfig;
  qrData: string;
  onReset: () => void;
}

interface PreviewError {
  key: string;
  message: string;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ config, qrData, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasData = qrData.length > 0;
  const generationKey = JSON.stringify([
    qrData,
    config.size,
    config.fgColor,
    config.bgColor,
  ]);
  const [previewError, setPreviewError] = useState<PreviewError | null>(null);
  const error = previewError?.key === generationKey ? previewError.message : null;

  useEffect(() => {
    if (!canvasRef.current || !hasData) return;

    let active = true;
    QRCode.toCanvas(canvasRef.current, qrData, {
      width: config.size,
      margin: 2,
      color: {
        dark: config.fgColor,
        light: config.bgColor,
      },
      errorCorrectionLevel: 'M',
    }).catch(() => {
      if (active) {
        setPreviewError({
          key: generationKey,
          message: 'Unable to generate this QR code. Check the content and try again.',
        });
      }
    });

    return () => {
      active = false;
    };
  }, [qrData, config.size, config.fgColor, config.bgColor, generationKey, hasData]);

  const handleDownload = useCallback(() => {
    if (!hasData) return;

    setPreviewError(null);
    QRCode.toDataURL(qrData, {
      width: config.size,
      margin: 2,
      color: {
        dark: config.fgColor,
        light: config.bgColor,
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        const link = document.createElement('a');
        link.download = `qr-code-${config.size}x${config.size}.png`;
        link.href = url;
        document.body.append(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        setPreviewError({
          key: generationKey,
          message: 'Unable to download the PNG. Please try again.',
        });
      });
  }, [qrData, config, generationKey, hasData]);

  // Display size is capped at 260px for the preview
  const displaySize = Math.min(config.size, 260);

  return (
    <div className="qr-preview">
      <div className="qr-preview__card">
        {hasData ? (
          <canvas
            ref={canvasRef}
            className="qr-preview__canvas"
            style={{ width: displaySize, height: displaySize }}
          />
        ) : (
          <div className="qr-preview__placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="15.5" y="15.5" width="4" height="4" rx="0.5" />
            </svg>
            <p>Enter content to generate your QR code</p>
          </div>
        )}
      </div>

      <div className="qr-preview__actions">
        <button
          type="button"
          className="qr-preview__download"
          onClick={handleDownload}
          disabled={!hasData}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PNG
        </button>
        <button
          type="button"
          className="qr-preview__reset"
          onClick={onReset}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset
        </button>
      </div>

      {error && (
        <p className="qr-preview__error" role="alert">
          {error}
        </p>
      )}

      {hasData && (
        <p className="qr-preview__info">
          {config.size} × {config.size}px · PNG
        </p>
      )}
    </div>
  );
};
