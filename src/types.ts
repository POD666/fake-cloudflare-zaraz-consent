// Re-export and extend types from zaraz-ts
import type { zaraz } from 'zaraz-ts';

// Re-export the zaraz type
export type { zaraz } from 'zaraz-ts';

// Use the same type signature as zaraz-ts for consent preferences
export type ConsentPreferences = { [key: string]: boolean };

// Extract the base consent type from zaraz-ts
type BaseZarazConsent = typeof zaraz.consent;

// Custom types specific to our fake implementation
export interface Purpose {
  id: string;
  name: string;
  description: string;
  order: number;
  // Custom prop, CF doesn't have it
  required?: boolean;
}

// Extend the base zaraz consent API with our additional functionality
export interface ZarazConsentAPI extends BaseZarazConsent {
  APIReady: boolean;
  modal: boolean;
  purposes: { [purposeId: string]: Purpose };
}

// Extend the base zaraz type with our consent API
// TODO: contribute to zaraz-ts
export interface ZarazGlobal extends Omit<typeof zaraz, 'consent'> {
  consent: ZarazConsentAPI;
  showConsentModal?: () => void;
}

export interface ZarazConfig {
  purposes?: Purpose[];
  defaultConsent?: ConsentPreferences;
  enableLogging?: boolean;
  enableModal?: boolean;
  modalConfig?: ModalConfig;
  cookieName?: string;
  autoShow?: boolean;
}

export interface ModalConfig {
  title?: string;
  description?: string;
  acceptAllText?: string;
  rejectAllText?: string;
  saveText?: string;
  closeText?: string;
  theme?: 'light' | 'dark';
  position?: 'center' | 'bottom';
}
