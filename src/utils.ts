/**
 * Shared utility functions to avoid code duplication (DRY principle)
 */

/**
 * Centralized logging function with consistent formatting
 */
export function createLogger(prefix: string, enabled: boolean = true) {
  return {
    log: (message: string, data?: any) => {
      if (!enabled) return;

      const fullPrefix = `[${prefix}]`;
      if (data !== undefined) {
        console.log(`${fullPrefix} ${message}`, data);
      } else {
        console.log(`${fullPrefix} ${message}`);
      }
    },

    warn: (message: string, data?: any) => {
      if (!enabled) return;

      const fullPrefix = `[${prefix}]`;
      if (data !== undefined) {
        console.warn(`${fullPrefix} ${message}`, data);
      } else {
        console.warn(`${fullPrefix} ${message}`);
      }
    },

    error: (message: string, data?: any) => {
      if (!enabled) return;

      const fullPrefix = `[${prefix}]`;
      if (data !== undefined) {
        console.error(`${fullPrefix} ${message}`, data);
      } else {
        console.error(`${fullPrefix} ${message}`);
      }
    },
  };
}

/**
 * Browser environment check
 */
export function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Standard error messages
 */
export const ERROR_MESSAGES = {
  NOT_BROWSER: 'This function can only be used in a browser environment',
  API_NOT_READY: 'Zaraz Consent API is not ready',
  INVALID_PURPOSE: 'Invalid purpose ID provided',
  METHOD_NOT_AVAILABLE: 'Method not available in current Zaraz instance',
} as const;

/**
 * Validate purpose IDs against available purposes
 */
export function validatePurposeIds(
  purposeIds: string[],
  availablePurposes: Record<string, any>,
  logger?: ReturnType<typeof createLogger>
): string[] {
  const invalid = purposeIds.filter((id) => !availablePurposes[id]);

  if (invalid.length > 0 && logger) {
    logger.warn(`Invalid purpose IDs: ${invalid.join(', ')}`, {
      invalidPurposes: invalid,
      availablePurposes: Object.keys(availablePurposes),
    });
  }

  return invalid;
}

/**
 * Dispatch custom event safely
 */
export function dispatchCustomEvent(
  eventName: string,
  detail: any,
  logger?: ReturnType<typeof createLogger>
): void {
  if (!isBrowserEnvironment()) {
    logger?.warn('Cannot dispatch event: not in browser environment');
    return;
  }

  try {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
    logger?.log(`Event dispatched: ${eventName}`, detail);
  } catch (error) {
    logger?.error(`Failed to dispatch event: ${eventName}`, error);
  }
}

/**
 * Common default purposes for demos and testing
 */
export const DEMO_PURPOSES = [
  {
    id: 'functional',
    name: 'Essential Cookies',
    description:
      'Necessary for the website to function properly. These cannot be disabled.',
    order: 1,
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics & Performance',
    description:
      'Help us understand how visitors interact with our website by collecting usage data.',
    order: 2,
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    description:
      'Used to deliver personalized advertisements and measure their effectiveness.',
    order: 3,
  },
  {
    id: 'preferences',
    name: 'Preferences & Personalization',
    description:
      'Remember your settings and preferences to enhance your experience.',
    order: 4,
  },
];

/**
 * Async timeout utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T> | T,
  maxAttempts: number = 3,
  baseDelay: number = 100
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff: 100ms, 200ms, 400ms, etc.
      const delayMs = baseDelay * Math.pow(2, attempt - 1);
      await delay(delayMs);
    }
  }

  throw lastError;
}
