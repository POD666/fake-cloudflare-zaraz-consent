export * from './types.js';
export * from './config.js';
export * from './storage.js';
export * from './modal.js';
export * from './fake-zaraz.js';
export * from './utils.js';

// Re-export zaraz-ts functions for Node.js environments
export * from 'zaraz-ts';

// Import the getZaraz helper from zaraz-ts
import { getZaraz } from 'zaraz-ts/build/helpers/get-zaraz.js';
import { FakeZaraz } from './fake-zaraz.js';
import { ZarazConfig } from './types.js';
import { isBrowserEnvironment, createLogger, ERROR_MESSAGES } from './utils.js';

const logger = createLogger('Zaraz Consent Tools', true);

/**
 * Initialize Zaraz Consent Tools with the given configuration
 * This sets up a fake Zaraz instance on the global window object
 * @param config Configuration options for the fake Zaraz instance
 * @returns The created FakeZaraz instance
 */
export function initializeZarazConsentTools(
  config: Partial<ZarazConfig> = {}
): FakeZaraz {
  if (!isBrowserEnvironment()) {
    throw new Error(ERROR_MESSAGES.NOT_BROWSER);
  }

  // Create new instance
  const newInstance = new FakeZaraz(config);

  // Attach to window
  (window as any).zaraz = newInstance;

  logger.log('Initialized and attached to window.zaraz');

  return newInstance;
}

/**
 * Get the current global Zaraz instance
 * @returns The current FakeZaraz instance or null if not initialized
 */
export function getZarazConsentTools(): FakeZaraz | null {
  return getZaraz();
}

/**
 * Clean up the global Zaraz instance
 */
export function cleanupZarazConsentTools(): void {
  const zaraz = (window as any).zaraz;
  if (zaraz && zaraz.clearStorage) {
    zaraz.clearStorage();
  }

  if (isBrowserEnvironment()) {
    delete (window as any).zaraz;
  }

  logger.log('Cleaned up');
}

/**
 * Quick setup function for common use cases
 * Creates a Zaraz instance with sensible defaults for local development
 */
export function quickSetup(
  options: {
    autoShow?: boolean;
    enableLogging?: boolean;
    customPurposes?: any[];
  } = {}
): FakeZaraz {
  const config: Partial<ZarazConfig> = {
    enableLogging: options.enableLogging !== false, // default to true
    autoShow: options.autoShow || false,
    enableModal: true,
    ...(options.customPurposes && { purposes: options.customPurposes }),
  };

  return initializeZarazConsentTools(config);
}
