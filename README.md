# 🍪 Fake Cloudflare Zaraz Consent

[![npm version](https://badge.fury.io/js/fake-cloudflare-zaraz-consent.svg)](https://badge.fury.io/js/fake-cloudflare-zaraz-consent)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A development tool that provides a fake Cloudflare Zaraz consent management system for local development. Perfect for testing consent-dependent features without requiring a live Zaraz instance.

**🌐 [Try the online demo →](https://pod666.github.io/fake-cloudflare-zaraz-consent/)**

> **📚 API Reference**: This package implements the official [Cloudflare Zaraz Consent Management API](https://developers.cloudflare.com/zaraz/consent-management/api/). All methods and behaviors match the production Zaraz consent system.

## ✨ Features

- 🎯 **Drop-in replacement** for Cloudflare Zaraz consent API
- 🖼️ **Built-in consent modal** with customizable styling
- 💾 **Persistent storage** via cookies and localStorage
- 🔧 **Fully configurable** purposes and consent preferences
- 📝 **Rich TypeScript support** with comprehensive type definitions
- 🚀 **Zero dependencies** - lightweight and fast
- 🎨 **Accessible UI** with keyboard navigation and focus trapping
- ⚡ **Direct zaraz-ts integration** - All functions exported directly for seamless usage
- 🛠️ **Development utilities** - Shared constants, logging helpers, and validation functions
- 🎯 **DRY compliant codebase** - Centralized utilities eliminate code duplication

## 🚀 Quick Start

### Installation

```bash
npm install --save-dev fake-cloudflare-zaraz-consent
```

### Basic Usage

```typescript
import { initFakeZaraz } from 'fake-cloudflare-zaraz-consent';

// Initialize with default configuration
const zaraz = initFakeZaraz();

// Access the consent API (same as real Zaraz)
window.zaraz.consent.get('analytics'); // false
window.zaraz.consent.set({ analytics: true });
window.zaraz.consent.modal = true; // Show consent modal
```

### Quick Setup for Common Use Cases

```typescript
import { quickSetup } from 'fake-cloudflare-zaraz-consent';

// One-liner setup with sensible defaults
quickSetup({
  autoShow: true, // Show modal automatically
  enableLogging: true, // Enable console logging
});
```

### 🚀 Enhanced Setup with zaraz-ts

This package works seamlessly with [zaraz-ts](https://www.npmjs.com/package/zaraz-ts). You'll need to import zaraz-ts functions directly:

```typescript
// Import fake Zaraz setup functions
import {
  quickSetup,
  initFakeZaraz,
  // Shared utilities
  createLogger,
} from 'fake-cloudflare-zaraz-consent';

// Import zaraz-ts functions directly
import {
  waitForConsentAPI,
  ifConsentGranted,
  loadScriptIfConsent,
  createGlobalConsentTools,
  debugConsentState,
  onConsentChange,
  getAllConsent,
  setConsentPreferences,
} from 'zaraz-ts';

// Setup fake Zaraz
const zaraz = quickSetup({
  autoShow: true,
  enableLogging: true,
});

// Wait for API to be ready
await waitForConsentAPI();

// Enable browser console debugging tools
await createGlobalConsentTools();

// Use advanced features directly
await loadScriptIfConsent('analytics', 'https://analytics.js');
await ifConsentGranted('marketing', () => {
  console.log('Marketing enabled!');
});

// Debug current state
await debugConsentState();

// Use shared utilities
const logger = createLogger('My App', true);
logger.log('App initialized');

// Check if using fake implementation
const isFake = zaraz.constructor.name.includes('Fake');
```

## 🎮 Live Demo

Experience the package in action with our interactive demo, or run it locally:

```bash
# Run the demo (uses standalone Vite setup)
cd demo
npm install
npm run dev

# The demo will be available at http://localhost:3000
```

The local demo includes a modern Vite + Tailwind CSS setup with:

- ✅ **Real-time consent status** display with responsive design
- 🎛️ **Interactive controls** for testing all API methods
- 📝 **Live logging** with timestamps and visual feedback
- 🖼️ **Modal demonstration** with enhanced accessibility
- 🔧 **Developer tools** for debugging consent flow
- 🎨 **Modern UI** with Tailwind CSS v4 styling

## 📖 API Reference

> **💡 Complete API Documentation**: See the official [Cloudflare Zaraz Consent Management API docs](https://developers.cloudflare.com/zaraz/consent-management/api/) for detailed information about all methods and properties.

### Core Functions

#### `initFakeZaraz(config?)`

Initializes the fake Zaraz instance with optional configuration.

```typescript
import { initFakeZaraz, ZarazConfig } from 'fake-cloudflare-zaraz-consent';

const config: Partial<ZarazConfig> = {
  purposes: [
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Track website usage',
      order: 1,
      required: false,
    },
  ],
  defaultConsent: { analytics: false },
  enableLogging: true,
  enableModal: true,
  autoShow: false,
};

const zaraz = initFakeZaraz(config);
```

#### `quickSetup(options?)`

Quick setup with common defaults for development.

```typescript
import { quickSetup } from 'fake-cloudflare-zaraz-consent';

quickSetup({
  autoShow: true,           // Auto-show modal on first visit
  enableLogging: true,      // Enable console output
  customPurposes: [...]     // Override default purposes
});
```

#### 🚀 NEW! `quickSetupWithTools(options?)`

**⚠️ DEPRECATED:** This function has been removed. Use `quickSetup()` and import zaraz-ts functions directly:

```typescript
import { quickSetup } from 'fake-cloudflare-zaraz-consent';
import { createGlobalConsentTools } from 'zaraz-ts';

const zaraz = quickSetup({
  autoShow: true,
  enableLogging: true,
});

// Enable global tools separately
await createGlobalConsentTools();
```

#### 🚀 NEW! `initializeWithTools(config?)`

**⚠️ DEPRECATED:** This function has been removed. Use `initFakeZaraz()` and import zaraz-ts functions directly:

```typescript
import { initFakeZaraz } from 'fake-cloudflare-zaraz-consent';
import { createGlobalConsentTools } from 'zaraz-ts';

const zaraz = initFakeZaraz({
  purposes: [...],
  defaultConsent: {...},
  enableLogging: true,
});

// Enable enhanced tools separately
await createGlobalConsentTools();
```

### Consent API

Once initialized, access the API via `window.zaraz.consent`:

```typescript
// Check if API is ready
window.zaraz.consent.APIReady; // boolean

// Get consent for specific purpose
window.zaraz.consent.get('analytics'); // boolean | undefined

// Set consent for multiple purposes
window.zaraz.consent.set({
  analytics: true,
  marketing: false,
});

// Get all consent preferences
window.zaraz.consent.getAll(); // { [purposeId]: boolean }

// Set all purposes to same value
window.zaraz.consent.setAll(true); // Accept all
window.zaraz.consent.setAll(false); // Reject all

// Modal control
window.zaraz.consent.modal = true; // Show modal
window.zaraz.consent.modal = false; // Hide modal

// Available purposes
window.zaraz.consent.purposes; // { [id]: Purpose }

// Send queued events (for testing)
window.zaraz.consent.sendQueuedEvents();
```

### Utility Functions

```typescript
import {
  getFakeZaraz,
  isZarazEnabled,
  isZarazConsentAPIReady,
  showConsentModal,
  acceptAllConsent,
  rejectAllConsent,
  // Enhanced utilities from zaraz-ts (import separately)
} from 'fake-cloudflare-zaraz-consent';

// Import zaraz-ts utilities directly
import {
  waitForConsentAPI,
  onConsentChange,
  loadScriptIfConsent,
  ifConsentGranted,
  hasConsentBeenSet,
  getPurposeInfo,
} from 'zaraz-ts';

// Basic utilities
const zaraz = getFakeZaraz();
if (isZarazEnabled() && isZarazConsentAPIReady()) {
  // Zaraz is ready to use
}

await waitForConsentAPI(5000); // timeout in ms

const unsubscribe = onConsentChange((consent) => {
  console.log('Consent updated:', consent);
});

// Enhanced utilities with zaraz-ts
await loadScriptIfConsent('analytics', 'script.js');
await ifConsentGranted('marketing', () => {
  // Marketing code
});

const hasBeenSet = await hasConsentBeenSet();
const purposeInfo = await getPurposeInfo('analytics');

// Fake-specific utilities
const zarazInstance = getFakeZaraz();
if (zarazInstance?.constructor.name.includes('Fake')) {
  // This is the fake implementation
  console.log('Using fake Zaraz for development');
}
```

## 🔧 Configuration

### Purpose Configuration

```typescript
interface Purpose {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // User-friendly description
  order: number; // Display order
  required?: boolean; // Cannot be disabled (custom property, not in Cloudflare API)
}

const customPurposes: Purpose[] = [
  {
    id: 'functional',
    name: 'Essential Cookies',
    description: 'Required for basic site functionality',
    order: 1,
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Help us improve our website',
    order: 2,
  },
];
```

### Modal Customization

```typescript
const modalConfig = {
  title: 'Cookie Preferences',
  description: 'We use cookies to enhance your experience...',
  acceptAllText: 'Accept All',
  rejectAllText: 'Reject All',
  saveText: 'Save Preferences',
  closeText: 'Close',
  theme: 'light' | 'dark',
  position: 'center' | 'bottom',
};
```

## 🎨 Examples

### React Integration

```typescript
// hooks/useConsent.ts
import { useEffect, useState } from 'react';
import {
  isZarazConsentAPIReady,
  getFakeZaraz,
} from 'fake-cloudflare-zaraz-consent';
import {
  onConsentChange,
  hasConsentBeenSet,
  loadScriptIfConsent,
} from 'zaraz-ts';

export const useConsent = () => {
  const [consent, setConsent] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(isZarazConsentAPIReady());

    if (isReady) {
      setConsent(window.zaraz.consent.getAll());
    }

    const unsubscribe = onConsentChange(setConsent);
    return unsubscribe;
  }, [isReady]);

  return { consent, isReady };
};

// Enhanced hook with zaraz-ts
export const useEnhancedConsent = () => {
  const { consent, isReady } = useConsent();
  const [hasBeenSet, setHasBeenSet] = useState(false);

  useEffect(() => {
    if (isReady) {
      hasConsentBeenSet().then(setHasBeenSet);
    }
  }, [isReady]);

  const loadScriptIfConsentGranted = async (
    purposeId: string,
    scriptSrc: string
  ) => {
    return loadScriptIfConsent(purposeId, scriptSrc);
  };

  return {
    consent,
    isReady,
    hasBeenSet,
    loadScriptIfConsent: loadScriptIfConsentGranted,
  };
};

// Component usage
const AnalyticsComponent = () => {
  const { consent, isReady, loadScriptIfConsent } = useEnhancedConsent();

  useEffect(() => {
    if (isReady && consent.analytics) {
      loadScriptIfConsent('analytics', 'https://analytics.js');
    }
  }, [consent.analytics, isReady]);

  if (!isReady || !consent.analytics) {
    return <div>Analytics disabled</div>;
  }

  return <div>Analytics enabled!</div>;
};
```

### Testing Setup

```typescript
// test-setup.ts
import {
  initFakeZaraz,
  cleanupFakeZaraz,
  getFakeZaraz,
} from 'fake-cloudflare-zaraz-consent';

beforeEach(() => {
  initFakeZaraz({
    enableLogging: false, // Quiet during tests
    enableModal: false, // No UI in tests
    defaultConsent: {
      functional: true,
      analytics: false,
    },
  });
});

afterEach(() => {
  cleanupFakeZaraz();

  // Clear fake storage if using fake implementation
  const zaraz = getFakeZaraz();
  if (zaraz?.constructor.name.includes('Fake')) {
    // Clear cookies and localStorage manually if needed
    document.cookie =
      'fake_cf_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('fake_cf_consent');
  }
});

// Enhanced testing utilities
describe('Consent functionality', () => {
  it('should handle conditional script loading', async () => {
    const { ifConsentGranted } = await import('zaraz-ts');

    let scriptLoaded = false;
    await ifConsentGranted('analytics', () => {
      scriptLoaded = true;
    });

    expect(scriptLoaded).toBe(false); // analytics disabled by default
  });
});
```

## 🌍 Environment-Specific Usage

### Development Only

```typescript
// Only load in development
if (process.env.NODE_ENV === 'development') {
  import('fake-cloudflare-zaraz-consent').then(({ quickSetup }) => {
    quickSetup({
      autoShow: true,
    });

    // Enable global tools separately
    import('zaraz-ts').then(({ createGlobalConsentTools }) => {
      createGlobalConsentTools(); // Enables browser console debugging
    });
  });
}
```

### Production Detection

```typescript
// Check if running fake vs real Zaraz
import { getFakeZaraz } from 'fake-cloudflare-zaraz-consent';

const zaraz = getFakeZaraz();
const isRealZaraz = !zaraz?.constructor.name.includes('Fake');
```

### Browser Console Debugging

When using zaraz-ts with `createGlobalConsentTools()`, you get access to convenient debugging tools:

```javascript
// First enable global tools (from zaraz-ts)
import { createGlobalConsentTools } from 'zaraz-ts';
await createGlobalConsentTools();

// Then available in browser console
window.zarazConsentTools.debug(); // Debug current state
window.zarazConsentTools.acceptAll(); // Accept all consent
window.zarazConsentTools.rejectAll(); // Reject all consent
window.zarazConsentTools.getAll(); // Get all consent status
window.zarazConsentTools.showModal(); // Show consent modal
```

## 📦 What's Included

- **Core API**: Full [Zaraz consent API](https://developers.cloudflare.com/zaraz/consent-management/api/) implementation
- **Modal UI**: Accessible consent dialog with customization
- **Storage**: Persistent consent via cookies + localStorage backup
- **Events**: Standard Zaraz events (`zarazConsentAPIReady`, `zarazConsentChoicesUpdated`)
- **TypeScript**: Complete type definitions
- **Utilities**: Helper functions for common operations
- **🚀 Enhanced Integration**: Seamless integration with [zaraz-ts](https://www.npmjs.com/package/zaraz-ts)
- **🛠️ Development Tools**: Advanced debugging and console utilities (via zaraz-ts)
- **📦 Conditional Loading**: Smart script loading based on consent status (via zaraz-ts)

## 🔄 Migration Guide

### From v1.1.x to v2.0.0

**⚠️ Breaking Changes - API Renamed:**

```javascript
// Before (v1.1.x)
import {
  initializeZarazConsentTools,
  getZarazConsentTools,
  cleanupZarazConsentTools,
} from 'fake-cloudflare-zaraz-consent';

const zaraz = initializeZarazConsentTools(config);
const currentZaraz = getZarazConsentTools();
cleanupZarazConsentTools();

// After (v2.0.0)
import {
  initFakeZaraz,
  getFakeZaraz,
  cleanupFakeZaraz,
} from 'fake-cloudflare-zaraz-consent';

const zaraz = initFakeZaraz(config);
const currentZaraz = getFakeZaraz();
cleanupFakeZaraz();
```

**⚠️ Breaking Changes - zaraz-ts Functions:**

```javascript
// Before (v1.1.x) - zaraz-ts functions were re-exported
import {
  initializeZarazConsentTools,
  waitForConsentAPI,
  ifConsentGranted,
} from 'fake-cloudflare-zaraz-consent';

// After (v2.0.0) - import zaraz-ts directly
import { initFakeZaraz } from 'fake-cloudflare-zaraz-consent';
import { waitForConsentAPI, ifConsentGranted } from 'zaraz-ts';
```

**⚠️ Breaking Changes - Cookie Name:**

The default cookie name changed from `cf_consent` to `fake_cf_consent`. If you relied on the default, you may need to clear existing cookies or specify the old name:

```javascript
// To maintain compatibility with existing cookies
initFakeZaraz({
  cookieName: 'cf_consent', // Use old name
  // ... other config
});
```

**⚠️ Breaking Changes - Demo Purposes:**

```javascript
// Before (v1.1.x)
import { DEMO_PURPOSES } from 'fake-cloudflare-zaraz-consent';

// After (v2.0.0) - define your own or copy from demo
const purposes = [
  {
    id: 'functional',
    name: 'Essential Cookies',
    description: 'Necessary for the website to function properly.',
    order: 1,
    required: true,
  },
  // ... other purposes
];
```

## 🤝 Contributing

Contributions welcome! Please read the [integration guide](./INTEGRATION.md) for detailed examples.

## � Publishing

This package uses [np](https://github.com/sindresorhus/np) for streamlined publishing:

```bash
# Interactive release (will prompt for version)
npm run release

# Dry run (test without publishing)
npm run release:dry
```

The publishing process:

1. ✅ Runs build and tests
2. 🏷️ Creates git tag
3. 📦 Publishes to npm
4. 🚀 Creates GitHub release

### Automated Publishing

The package includes GitHub Actions workflows for automated publishing:

- **CI Workflow** (`.github/workflows/ci.yml`): Runs on all pushes and PRs

  - Tests on Node.js 16, 18, and 20
  - Type checks and builds
  - Builds demo artifacts

- **Publish Workflow** (`.github/workflows/publish.yml`): Runs when a GitHub release is published
  - Automatically publishes to npm
  - Requires `NPM_TOKEN` secret in repository settings

#### Setup for Automated Publishing:

1. **Generate npm token**: Visit [npm tokens](https://www.npmjs.com/settings/tokens) and create an "Automation" token
2. **Add to GitHub secrets**: Go to repository Settings → Secrets → Actions, add `NPM_TOKEN`
3. **Create release**: Use `npm run release` or create release manually on GitHub

The workflow will automatically publish to npm when you create a GitHub release! 🚀

## �📄 License

Apache 2.0 - see [LICENSE](./LICENSE) file for details.

---

**Note**: This is a development tool. In production, use real Cloudflare Zaraz for consent management.
