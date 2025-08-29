import {
  ZarazConfig,
  ZarazGlobal,
  ZarazConsentAPI,
  ConsentPreferences,
  Purpose,
  ModalConfig,
} from './types.js';
import { DEFAULT_CONFIG } from './config.js';
import { ConsentStorage } from './storage.js';
import { ConsentModal } from './modal.js';
import {
  createLogger,
  validatePurposeIds,
  dispatchCustomEvent,
  delay,
} from './utils.js';

export class FakeZaraz implements ZarazGlobal {
  public consent: ZarazConsentAPI;
  private config: Required<ZarazConfig>;
  private storage: ConsentStorage;
  private modal: ConsentModal | null = null;
  private queuedEvents: any[] = [];
  private modalVisible: boolean = false;
  private currentConsent: ConsentPreferences;
  private logger: ReturnType<typeof createLogger>;

  constructor(config: Partial<ZarazConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.storage = new ConsentStorage(this.config.cookieName);
    this.logger = createLogger('Fake Zaraz', this.config.enableLogging);

    // Load existing consent or use defaults
    const savedConsent = this.storage.load();
    const initialConsent = savedConsent || this.config.defaultConsent;
    this.currentConsent = { ...initialConsent };

    this.consent = this.createConsentAPI();

    this.logger.log('Initialized', {
      purposes: this.config.purposes.map((p) => p.id),
      initialConsent,
      fromStorage: !!savedConsent,
    });

    // Set up auto-show if enabled
    if (this.config.autoShow && !savedConsent) {
      delay(100).then(() => this.showConsentModal());
    }

    // Dispatch ready event
    delay(50).then(() => {
      this.consent.APIReady = true;
      dispatchCustomEvent('zarazConsentAPIReady', {}, this.logger);
      this.logger.log('Consent API is ready');
    });
  }

  showConsentModal = (): void => {
    if (!this.config.enableModal) {
      this.logger.log('Consent modal is disabled');
      return;
    }

    if (this.modal) {
      this.logger.log('Consent modal is already shown');
      return;
    }

    const currentConsent = this.getCurrentConsent();

    this.modal = new ConsentModal(
      this.config.modalConfig as Required<ModalConfig>,
      this.config.purposes,
      currentConsent,
      (newConsent) => {
        this.handleConsentUpdate(newConsent);
      },
      () => {
        // Called whenever modal is hidden (by any means)
        this.modal = null;
        this.modalVisible = false;
      }
    );

    this.modalVisible = true;
    this.modal.show();
    this.logger.log('Consent modal shown');
  };

  private createConsentAPI(): ZarazConsentAPI {
    const self = this; // Store reference to this

    // Create purposes object
    const purposes: { [id: string]: Purpose } = {};
    this.config.purposes.forEach((purpose) => {
      purposes[purpose.id] = { ...purpose };
    });

    return {
      APIReady: false,

      get modal() {
        return self.modalVisible;
      },

      set modal(value: boolean) {
        if (value && !self.modalVisible) {
          self.showConsentModal();
        } else if (!value && self.modalVisible && self.modal) {
          self.modal.hide();
          // Note: modalVisible will be set to false by the onHide callback
        }
      },

      purposes,

      get: (purposeId: string): boolean | undefined => {
        if (!purposes[purposeId]) {
          self.logger.warn(`Purpose "${purposeId}" does not exist`, {
            availablePurposes: Object.keys(purposes),
          });
          return undefined;
        }
        const result = self.currentConsent[purposeId] || false;
        self.logger.log(`Get consent for "${purposeId}": ${result}`);
        return result;
      },

      set: (consentPreferences: ConsentPreferences): void => {
        self.logger.log('Setting consent', consentPreferences);

        // Validate purpose IDs
        const invalidPurposes = validatePurposeIds(
          Object.keys(consentPreferences),
          purposes,
          self.logger
        );

        // Update consent for valid purposes
        Object.entries(consentPreferences).forEach(([purposeId, granted]) => {
          if (purposes[purposeId]) {
            self.currentConsent[purposeId] = granted;
          }
        });

        self.handleConsentUpdate(self.currentConsent);
      },

      getAll: (): ConsentPreferences => {
        const result = { ...self.currentConsent };
        self.logger.log('Get all consent', result);
        return result;
      },

      setAll: (consentStatus: boolean): void => {
        self.logger.log(`Setting all consent to: ${consentStatus}`);

        const newConsent: ConsentPreferences = {};
        self.config.purposes.forEach((purpose) => {
          // Required purposes are always true
          newConsent[purpose.id] = purpose.required || consentStatus;
        });

        self.currentConsent = newConsent;
        self.handleConsentUpdate(self.currentConsent);
      },

      getAllCheckboxes: (): ConsentPreferences => {
        // For local dev, checkboxes state is same as consent state
        const result = { ...self.currentConsent };
        self.logger.log('Get all checkboxes', result);
        return result;
      },

      setCheckboxes: (checkboxesStatus: ConsentPreferences): void => {
        self.logger.log('Setting checkboxes', checkboxesStatus);
        // For local dev, setting checkboxes is same as setting consent

        // Validate purpose IDs
        validatePurposeIds(
          Object.keys(checkboxesStatus),
          purposes,
          self.logger
        );

        // Update consent for valid purposes
        Object.entries(checkboxesStatus).forEach(([purposeId, granted]) => {
          if (purposes[purposeId]) {
            self.currentConsent[purposeId] = granted;
          }
        });

        self.handleConsentUpdate(self.currentConsent);
      },

      setAllCheckboxes: (checkboxStatus: boolean): void => {
        self.logger.log(`Setting all checkboxes to: ${checkboxStatus}`);
        // For local dev, setting all checkboxes is same as setting all consent
        const newConsent: ConsentPreferences = {};
        self.config.purposes.forEach((purpose) => {
          // Required purposes are always true
          newConsent[purpose.id] = purpose.required || checkboxStatus;
        });

        self.currentConsent = newConsent;
        self.handleConsentUpdate(self.currentConsent);
      },

      sendQueuedEvents: (): void => {
        self.logger.log(`Sending ${self.queuedEvents.length} queued events`);

        if (self.queuedEvents.length > 0) {
          // Simulate sending events
          self.queuedEvents.forEach((event, index) => {
            self.logger.log(`Sending queued event ${index + 1}`, event);
          });

          self.queuedEvents = [];
          self.logger.log('All queued events sent');
        }
      },
    };
  }

  private getCurrentConsent(): ConsentPreferences {
    return { ...this.currentConsent };
  }

  private handleConsentUpdate(newConsent: ConsentPreferences): void {
    // Update internal state
    this.currentConsent = { ...newConsent };

    // Save to storage
    this.storage.save(newConsent);

    // Dispatch event
    dispatchCustomEvent(
      'zarazConsentChoicesUpdated',
      { consent: newConsent },
      this.logger
    );

    this.logger.log('Consent updated', newConsent);
  }

  // Remove the dispatchEvent method since we're using the shared utility

  // Utility methods for testing
  public getConfig(): Required<ZarazConfig> {
    return { ...this.config };
  }

  public clearStorage(): void {
    this.storage.clear();
    this.logger.log('Storage cleared');
  }

  public queueEvent(event: any): void {
    this.queuedEvents.push(event);
    this.logger.log('Event queued', event);
  }
}
