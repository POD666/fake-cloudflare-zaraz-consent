import { ZarazConfig, Purpose } from './types.js';

export const DEFAULT_PURPOSES: Purpose[] = [
  {
    id: 'example',
    name: 'Example Purpose',
    description: 'Setup "purposes" via initializeZarazConsentTools',
    order: 1,
    required: true,
  },
];

export const DEFAULT_CONFIG: Required<ZarazConfig> = {
  purposes: DEFAULT_PURPOSES,
  defaultConsent: {},
  enableLogging: true,
  enableModal: true,
  modalConfig: {
    title: 'Cookie Consent',
    description:
      'We use cookies to improve your experience and analyze site usage. Choose which types of cookies you want to allow.',
    acceptAllText: 'Accept All',
    rejectAllText: 'Reject All',
    saveText: 'Save Preferences',
    closeText: 'Close',
    theme: 'light',
    position: 'center',
  },
  cookieName: 'fake_cf_consent',
  autoShow: false,
};
