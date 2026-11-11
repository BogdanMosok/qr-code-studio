export type QRCodeType = 'url' | 'text' | 'wifi';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface QRConfig {
  type: QRCodeType;
  value: string;
  wifi: WifiConfig;
  fgColor: string;
  bgColor: string;
  size: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
