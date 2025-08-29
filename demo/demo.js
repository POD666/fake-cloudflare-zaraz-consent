// Demo integration file showing how to use fake-cloudflare-zaraz-consent in your project
// Now with zaraz-ts integration for enhanced functionality

// In a real project, you would import from the npm package:
// import {
//   initializeZarazConsentTools,
//   quickSetup,
//   initializeWithTools,
//   quickSetupWithTools,
//   ConsentTools,
//   FakeZarazTools
// } from 'fake-cloudflare-zaraz-consent';

// For this demo, we import from the local build
import {
  initializeZarazConsentTools,
  quickSetup,
  // Shared demo utilities
  DEMO_PURPOSES,
} from './dist/index.js';

// Demo-specific default consent (GDPR compliant)
const DEMO_DEFAULT_CONSENT = {
  functional: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

// Import zaraz-ts functions directly
import {
  showConsentModal,
  acceptAllConsent,
  rejectAllConsent,
  waitForConsentAPI,
  onConsentChange,
  getAllConsent,
  hasConsentBeenSet,
  loadScriptIfConsent,
  ifConsentGranted,
  debugConsentState,
  createGlobalConsentTools,
} from 'zaraz-ts';

/**
 * Example 1: Basic setup with custom configuration
 */
export const basicSetup = () => {
  return initializeZarazConsentTools({
    // Use shared demo purposes for consistency
    purposes: DEMO_PURPOSES,

    // Use shared default consent (GDPR compliant)
    defaultConsent: DEMO_DEFAULT_CONSENT,

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

    // Auto-show modal on first visit
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
 * Example 3: Enhanced setup with zaraz-ts
 */
export const enhancedSetup = async () => {
  console.log('🚀 Setting up with enhanced tools...');

  // Initialize fake Zaraz
  const zaraz = quickSetup({
    autoShow: true,
    enableLogging: true,
  });

  // Wait for API to be ready
  await waitForConsentAPI();

  // Enable global console tools for debugging
  await createGlobalConsentTools();

  console.log('✅ Enhanced setup complete!');
  console.log('💡 Try these in browser console:');
  console.log('   - window.zarazConsentTools.debug()');
  console.log('   - window.zarazConsentTools.acceptAll()');
  console.log('   - window.zarazConsentTools.getAll()');

  return zaraz;
};

/**
 * Example 4: Environment-specific initialization
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
 * Enhanced utility functions with zaraz-ts integration
 */
export const enhancedConsentUtils = {
  // Original utilities
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

  // Enhanced utilities with zaraz-ts
  async loadAnalyticsIfConsented() {
    try {
      await ifConsentGranted('analytics', () => {
        console.log('🔍 Loading analytics script...');
        // Simulate loading analytics
        window.gtag?.('config', 'GA_MEASUREMENT_ID');
      }, () => {
        console.log('🚫 Analytics consent not granted');
      });
    } catch (error) {
      console.warn('Analytics loading failed:', error);
    }
  },

  async loadMarketingScriptsIfConsented() {
    try {
      await loadScriptIfConsent(
        'marketing',
        'https://example.com/marketing-script.js'
      );
      console.log('📈 Marketing scripts loaded');
    } catch (error) {
      console.warn('Marketing script loading failed:', error);
    }
  },

  async checkConsentStatus() {
    const hasBeenSet = await hasConsentBeenSet();
    if (!hasBeenSet) {
      console.log('⚠️ User has not set consent preferences yet');
      return null;
    }

    const consent = await getAllConsent();
    console.log('✅ Current consent:', consent);
    return consent;
  },

  async debugConsent() {
    await debugConsentState();
  },

  // Fake Zaraz specific utilities
  checkIfFakeImplementation() {
    const zaraz = window.zaraz;
    const isFake = zaraz && zaraz.constructor.name.includes('Fake');
    console.log(`🎭 Using ${isFake ? 'FAKE' : 'REAL'} Zaraz implementation`);
    return isFake;
  },

  getFakeConfig() {
    const zaraz = window.zaraz;
    if (zaraz && zaraz.getConfig) {
      const config = zaraz.getConfig();
      console.log('⚙️ Fake Zaraz config:', config);
      return config;
    }
    return null;
  },

  clearFakeStorage() {
    const zaraz = window.zaraz;
    if (zaraz && zaraz.clearStorage) {
      zaraz.clearStorage();
      console.log('🗑️ Fake storage cleared');
    }
  },

  simulateEvent(eventName, eventData = {}) {
    const zaraz = window.zaraz;
    if (zaraz && zaraz.queueEvent) {
      zaraz.queueEvent({
        event: eventName,
        data: eventData,
        timestamp: Date.now()
      });
      console.log(`📥 Queued fake event: ${eventName}`, eventData);
    }
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
 * Enhanced example usage patterns with zaraz-ts
 */
export const enhancedUsageExamples = {
  // Example: React-like usage with enhanced tools
  async componentDidMount() {
    // Wait for consent API
    const isReady = await enhancedConsentUtils.waitForReady();

    if (isReady) {
      // Check if we're using fake implementation
      enhancedConsentUtils.checkIfFakeImplementation();

      // Check if analytics is enabled
      if (enhancedConsentUtils.isConsentGranted('analytics')) {
        console.log('🔍 Analytics enabled - initializing tracking');
        await enhancedConsentUtils.loadAnalyticsIfConsented();
      }

      // Listen for consent changes
      const unsubscribe = enhancedConsentUtils.onConsentChange((consent) => {
        console.log('🔄 Consent updated:', consent);

        if (consent.analytics) {
          console.log('🔍 Analytics enabled');
          enhancedConsentUtils.loadAnalyticsIfConsented();
        } else {
          console.log('🚫 Analytics disabled');
        }

        if (consent.marketing) {
          console.log('📈 Marketing enabled');
          enhancedConsentUtils.loadMarketingScriptsIfConsented();
        }
      });

      return unsubscribe;
    }
  },

  // Example: Advanced consent checking
  async checkAdvancedConsent() {
    const status = await enhancedConsentUtils.checkConsentStatus();

    if (!status) {
      console.log('⚠️ No consent set, showing modal...');
      enhancedConsentUtils.showModal();
      return;
    }

    // Load scripts based on consent
    if (status.analytics) {
      await enhancedConsentUtils.loadAnalyticsIfConsented();
    }

    if (status.marketing) {
      await enhancedConsentUtils.loadMarketingScriptsIfConsented();
    }
  },

  // Example: Development debugging
  async debuggingExample() {
    console.log('🔍 Running debugging example...');

    // Check if fake implementation
    const isFake = enhancedConsentUtils.checkIfFakeImplementation();

    if (isFake) {
      // Get fake config
      enhancedConsentUtils.getFakeConfig();

      // Simulate some events
      enhancedConsentUtils.simulateEvent('page_view', { page: '/demo' });
      enhancedConsentUtils.simulateEvent('user_engagement', { engagement_time: 5000 });

      // Debug current state
      await enhancedConsentUtils.debugConsent();
    }
  },

  // Example: Conditional script loading
  async conditionalScriptExample() {
    console.log('📦 Loading scripts based on consent...');

    // Load Google Analytics if analytics consent is granted
    await ifConsentGranted('analytics', () => {
      console.log('🔍 Loading Google Analytics...');
      // In real app: loadScript('https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID');
    });

    // Load marketing pixels if marketing consent is granted
    await ifConsentGranted('marketing', () => {
      console.log('📈 Loading marketing pixels...');
      // In real app: loadScript('https://connect.facebook.net/en_US/fbevents.js');
    });
  }
};

// Auto-initialize for demo purposes
// In a real app, you'd call this from your main application file
console.log('🎬 Demo: Initializing Zaraz Consent Tools...');

// Use the enhanced setup
enhancedSetup().then((zaraz) => {
  console.log('✅ Enhanced demo setup complete!');

  // Export for global access in demo
  window.demoConsentUtils = enhancedConsentUtils;
  window.demoUsageExamples = enhancedUsageExamples;
  window.fakeZarazInstance = zaraz;

  // Run some demo examples
  setTimeout(async () => {
    console.log('🎯 Running demo examples...');
    await enhancedUsageExamples.checkAdvancedConsent();
    await enhancedUsageExamples.debuggingExample();
  }, 2000);
}).catch(error => {
  console.error('❌ Enhanced setup failed, falling back to basic setup:', error);

  // Fallback to basic setup
  const zaraz = initializeForEnvironment();
  window.demoConsentUtils = enhancedConsentUtils;
  window.fakeZarazInstance = zaraz;
});
