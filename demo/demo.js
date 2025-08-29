// Demo integration file showing how to use fake-cloudflare-zaraz-consent in your project

// In a real project, you would import from the npm package:
// import { initializeZarazConsentTools, quickSetup } from 'fake-cloudflare-zaraz-consent';

// For this demo, we import from the local build
import {
  initializeZarazConsentTools,
  quickSetup,
  showConsentModal,
  acceptAllConsent,
  rejectAllConsent,
  waitForConsentAPI,
  onConsentChange
} from './dist/index.js';/**
 * Example 1: Basic setup with custom configuration
 */
export const basicSetup = () => {
  return initializeZarazConsentTools({
    // Custom purposes that match your production Zaraz setup
    purposes: [
      {
        id: 'functional',
        name: 'Essential Cookies',
        description: 'Necessary for the website to function properly. These cannot be disabled.',
        order: 1,
        required: true,
      },
      {
        id: 'analytics',
        name: 'Analytics & Performance',
        description: 'Help us understand how visitors interact with our website by collecting usage data.',
        order: 2,
      },
      {
        id: 'marketing',
        name: 'Marketing & Advertising',
        description: 'Used to deliver personalized advertisements and measure their effectiveness.',
        order: 3,
      },
      {
        id: 'preferences',
        name: 'Preferences & Personalization',
        description: 'Remember your settings and preferences to enhance your experience.',
        order: 4,
      },
    ],

    // Default consent - functional always true, others false for GDPR compliance
    defaultConsent: {
      functional: true,
      analytics: false,
      marketing: false,
      preferences: false,
    },

    // Enable detailed logging in development
    enableLogging: true,

    // Enable the consent modal
    enableModal: true,

    // Modal configuration
    modalConfig: {
      title: 'Cookie Preferences',
      description: 'We use cookies to improve your experience and analyze site usage. Please choose which types of cookies you want to allow.',
      acceptAllText: 'Accept All Cookies',
      rejectAllText: 'Reject Non-Essential',
      saveText: 'Save My Preferences',
      closeText: 'Close',
      theme: 'light',
      position: 'center',
    },

    // Use the same cookie name as production
    cookieName: 'demo_consent',

    // Don't auto-show modal - let the app control when to show it
    autoShow: true,
  });
};

/**
 * Example 2: Quick setup for rapid development
 */
export const quickDevelopmentSetup = () => {
  return quickSetup({
    autoShow: true,        // Show modal automatically on first visit
    enableLogging: true,   // Enable console logging
  });
};

/**
 * Example 3: Environment-specific initialization
 */
export const initializeForEnvironment = () => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    console.warn('Zaraz Consent Tools can only be used in browser');
    return null;
  }

  // In a real app, you might check for development mode
  // if (process.env.NODE_ENV !== 'development') {
  //   console.warn('Zaraz Consent Tools should only be used in development');
  //   return null;
  // }

  return basicSetup();
};

/**
 * Utility functions for your app
 */
export const consentUtils = {
  showModal: () => {
    showConsentModal();
  },

  getConsentStatus: () => {
    if (window.zaraz?.consent?.APIReady) {
      return window.zaraz.consent.getAll();
    }
    return null;
  },

  isConsentGranted: (purposeId) => {
    if (window.zaraz?.consent?.APIReady) {
      return window.zaraz.consent.get(purposeId) === true;
    }
    return false;
  },

  acceptAll: () => {
    acceptAllConsent();
  },

  rejectAll: () => {
    rejectAllConsent();
  },

  // Wait for consent API to be ready before using it
  waitForReady: async (timeout = 10000) => {
    try {
      await waitForConsentAPI(timeout);
      console.log('✅ Zaraz Consent API is ready!');
      return true;
    } catch (error) {
      console.error('❌ Timeout waiting for Zaraz Consent API:', error);
      return false;
    }
  },

  // Listen for consent changes
  onConsentChange: (callback) => {
    return onConsentChange(callback);
  }
};

/**
 * Example usage patterns
 */
export const usageExamples = {
  // Example: React-like usage
  async componentDidMount() {
    // Wait for consent API
    const isReady = await consentUtils.waitForReady();

    if (isReady) {
      // Check if analytics is enabled
      if (consentUtils.isConsentGranted('analytics')) {
        // Initialize analytics
        console.log('🔍 Analytics enabled - initializing tracking');
      }

      // Listen for consent changes
      const unsubscribe = consentUtils.onConsentChange((consent) => {
        console.log('🔄 Consent updated:', consent);

        if (consent.analytics) {
          console.log('🔍 Analytics enabled');
        } else {
          console.log('🚫 Analytics disabled');
        }
      });

      // Clean up on unmount
      return unsubscribe;
    }
  },

  // Example: Check consent before loading scripts
  loadConditionalScripts() {
    if (consentUtils.isConsentGranted('marketing')) {
      // Load marketing scripts
      console.log('📈 Loading marketing scripts');
    }

    if (consentUtils.isConsentGranted('analytics')) {
      // Load analytics scripts
      console.log('📊 Loading analytics scripts');
    }
  },

  // Example: Show consent banner
  showConsentBannerIfNeeded() {
    const consent = consentUtils.getConsentStatus();

    // If no consent data exists, show the modal
    if (!consent) {
      consentUtils.showModal();
    }
  }
};

// Auto-initialize for demo purposes
// In a real app, you'd call this from your main application file
console.log('🎬 Demo: Initializing Zaraz Consent Tools...');
initializeForEnvironment();

// Export for global access in demo
window.demoConsentUtils = consentUtils;
window.demoUsageExamples = usageExamples;
