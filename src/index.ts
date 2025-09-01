export * from './types.js';
export * from './config.js';
export * from './storage.js';
export * from './modal.js';
export * from './fake-zaraz.js';
export * from './utils.js';

// Import the getZaraz helper from zaraz-ts
import { getZaraz } from 'zaraz-ts/build/helpers/get-zaraz.js';
import { FakeZaraz } from './fake-zaraz.js';
import { ZarazConfig } from './types.js';
import {
  isBrowserEnvironment,
  createLogger,
  ERROR_MESSAGES,
  isFakeZaraz,
} from './utils.js';

const logger = createLogger('Zaraz Consent Tools', true);

/**
 * Initialize Zaraz Consent Tools with the given configuration
 * This sets up a fake Zaraz instance on the global window object
 * @param config Configuration options for the fake Zaraz instance
 * @returns The created FakeZaraz instance
 */
export function initFakeZaraz(config: Partial<ZarazConfig> = {}): FakeZaraz {
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
export function getFakeZaraz(): FakeZaraz | null {
  const fakeZaraz = getZaraz();
  if (fakeZaraz && !isFakeZaraz(fakeZaraz)) {
    throw new Error(ERROR_MESSAGES.NOT_FAKE_INSTANCE);
  }
  return fakeZaraz;
}

/**
 * Clean up the global Zaraz instance
 */
export function cleanupFakeZaraz(): void {
  const zaraz = getFakeZaraz();
  if (zaraz && zaraz.clearStorage) {
    zaraz.clearStorage();
  }

  if (isBrowserEnvironment()) {
    delete (window as any).zaraz;
  }

  logger.log('Cleaned up');
}
