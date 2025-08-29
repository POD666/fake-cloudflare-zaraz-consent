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
import { initializeZarazConsentTools } from 'fake-cloudflare-zaraz-consent';

// Initialize with default configuration
const zaraz = initializeZarazConsentTools();

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

This package now includes **direct integration** with [zaraz-ts](https://www.npmjs.com/package/zaraz-ts). Import functions directly from that package:

```typescript
// Import fake Zaraz setup functions
import {
  quickSetup,
  initializeZarazConsentTools,
  // Shared utilities
  DEMO_PURPOSES,
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

// Setup fake Zaraz with shared demo purposes
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
# Quick demo (if package is already built)
npm run demo

# Development demo (builds and watches for changes)
npm run demo:dev

# Or build demo files manually first
npm run demo:build && npm run demo
```

The local demo will start a server at `http://localhost:3000` with a comprehensive demo showing:

- ✅ **Real-time consent status** display
- 🎛️ **Interactive controls** for testing all API methods
- 📝 **Live logging** of all consent operations
- 🖼️ **Modal demonstration** with customizable themes
- 🔧 **Developer tools** for debugging consent flow

## 📖 API Reference

> **💡 Complete API Documentation**: See the official [Cloudflare Zaraz Consent Management API docs](https://developers.cloudflare.com/zaraz/consent-management/api/) for detailed information about all methods and properties.

### Core Functions

#### `initializeZarazConsentTools(config?)`

Initializes the fake Zaraz instance with optional configuration.

```typescript
import {
  initializeZarazConsentTools,
  ZarazConfig,
} from 'fake-cloudflare-zaraz-consent';

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

const zaraz = initializeZarazConsentTools(config);
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

Enhanced quick setup that integrates with zaraz-ts for additional functionality.

```typescript
import { quickSetupWithTools } from 'fake-cloudflare-zaraz-consent';

const { zaraz, tools } = await quickSetupWithTools({
  autoShow: true,
  enableLogging: true,
  enableGlobalTools: true, // Enables window.zarazConsentTools
});
```

#### 🚀 NEW! `initializeWithTools(config?)`

Full initialization with enhanced tools integration.

```typescript
import { initializeWithTools } from 'fake-cloudflare-zaraz-consent';

const { zaraz, tools } = await initializeWithTools({
  purposes: [...],
  defaultConsent: {...},
  enableLogging: true,
});
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
  getZaraz,
  isZarazEnabled,
  isZarazConsentAPIReady,
  showConsentModal,
  acceptAllConsent,
  rejectAllConsent,
  waitForConsentAPI,
  onConsentChange,
  // Enhanced utilities
  ConsentTools,
  FakeZarazTools,
} from 'fake-cloudflare-zaraz-consent';

// Basic utilities
const zaraz = getZaraz();
if (isZarazEnabled() && isZarazConsentAPIReady()) {
  // Zaraz is ready to use
}

await waitForConsentAPI(5000); // timeout in ms

const unsubscribe = onConsentChange((consent) => {
  console.log('Consent updated:', consent);
});

// Enhanced utilities with zaraz-ts
await ConsentTools.loadScriptIfConsent('analytics', 'script.js');
await ConsentTools.ifConsentGranted('marketing', () => {
  // Marketing code
});

const hasBeenSet = await ConsentTools.hasConsentBeenSet();
const purposeInfo = await ConsentTools.getPurposeInfo('analytics');

// Fake-specific utilities
if (FakeZarazTools.isFakeZaraz()) {
  const config = FakeZarazTools.getFakeConfig();
  FakeZarazTools.clearFakeStorage();
  FakeZarazTools.queueFakeEvent({ event: 'test' });
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
  required?: boolean; // Cannot be disabled
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
  onConsentChange,
  isZarazConsentAPIReady,
  ConsentTools,
} from 'fake-cloudflare-zaraz-consent';

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
      ConsentTools.hasConsentBeenSet().then(setHasBeenSet);
    }
  }, [isReady]);

  const loadScriptIfConsent = async (purposeId: string, scriptSrc: string) => {
    return ConsentTools.loadScriptIfConsent(purposeId, scriptSrc);
  };

  return { consent, isReady, hasBeenSet, loadScriptIfConsent };
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
  initializeZarazConsentTools,
  cleanupZarazConsentTools,
  FakeZarazTools,
} from 'fake-cloudflare-zaraz-consent';

beforeEach(() => {
  initializeZarazConsentTools({
    enableLogging: false, // Quiet during tests
    enableModal: false, // No UI in tests
    defaultConsent: {
      functional: true,
      analytics: false,
    },
  });
});

afterEach(() => {
  cleanupZarazConsentTools();

  // Clear fake storage if using fake implementation
  if (FakeZarazTools.isFakeZaraz()) {
    FakeZarazTools.clearFakeStorage();
  }
});

// Enhanced testing utilities
describe('Consent functionality', () => {
  it('should handle conditional script loading', async () => {
    const { ConsentTools } = await import('fake-cloudflare-zaraz-consent');

    let scriptLoaded = false;
    await ConsentTools.ifConsentGranted('analytics', () => {
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
  import('fake-cloudflare-zaraz-consent').then(({ quickSetupWithTools }) => {
    quickSetupWithTools({
      autoShow: true,
      enableGlobalTools: true, // Enables browser console debugging
    });
  });
}
```

### Production Detection

```typescript
// Check if running fake vs real Zaraz
import { FakeZarazTools } from 'fake-cloudflare-zaraz-consent';

const isRealZaraz = !FakeZarazTools.isFakeZaraz();
```

### Browser Console Debugging

When `enableGlobalTools` is enabled, you get access to convenient debugging tools:

```javascript
// Available in browser console
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
- **🛠️ Development Tools**: Advanced debugging and console utilities
- **📦 Conditional Loading**: Smart script loading based on consent status

## 🤝 Contributing

Contributions welcome! Please read the [integration guide](./INTEGRATION.md) for detailed examples.

## � Publishing

This package uses [np](https://github.com/sindresorhus/np) for streamlined publishing:

```bash
# Interactive release (will prompt for version)
npm run release

# Specific version bumps
npm run release:patch   # 1.0.0 → 1.0.1
npm run release:minor   # 1.0.0 → 1.1.0
npm run release:major   # 1.0.0 → 2.0.0

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
