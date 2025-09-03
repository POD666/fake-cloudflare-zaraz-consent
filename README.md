# 🍪 Fake Cloudflare Zaraz Consent

[![npm version](https://badge.fury.io/js/@imviidx%2Ffake-cloudflare-zaraz-consent.svg)](https://badge.fury.io/js/@imviidx%2Ffake-cloudflare-zaraz-consent)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A development tool that provides a fake Cloudflare Zaraz consent management system for local development. Perfect for testing consent-dependent features without requiring a live Zaraz instance.

**🌐 [Try the online demo →](https://imviidx.github.io/fake-cloudflare-zaraz-consent/)**

> **📚 API Reference**: This package implements the official [Cloudflare Zaraz Consent Management API](https://developers.cloudflare.com/zaraz/consent-management/api/). All methods and behaviors match the production Zaraz consent system.

## ✨ Features

- 🎯 **Drop-in replacement** for Cloudflare Zaraz consent API
- 🖼️ **Built-in consent modal** with customizable styling
- 📝 **TypeScript support** with comprehensive type definitions
- 🛠️ **Development utilities** - Shared constants, logging helpers, and validation

## 🚀 Quick Start

### Installation

```bash
npm install --save-dev @imviidx/fake-cloudflare-zaraz-consent
```

### Basic Usage

```typescript
import { initFakeZaraz } from '@imviidx/fake-cloudflare-zaraz-consent';

// Initialize with default configuration
const zaraz = initFakeZaraz();

// Access the consent API (same as real Zaraz)
window.zaraz.consent.get('analytics'); // false
window.zaraz.consent.set({ analytics: true });
window.zaraz.consent.modal = true; // Show consent modal
```

### 🚀 Enhanced Setup with zaraz-ts

This package works seamlessly with [zaraz-ts](https://www.npmjs.com/package/zaraz-ts). You can use zaraz-ts for type-safe access to the consent API:

```typescript
// Import fake Zaraz setup functions
import {
  initFakeZaraz,
  createLogger,
} from '@imviidx/fake-cloudflare-zaraz-consent';

// Import zaraz-ts for type-safe API access
import { zaraz } from 'zaraz-ts';

// Use zaraz-ts for type-safe access
const analyticsConsent = zaraz.consent.get('analytics');
zaraz.consent.set({ analytics: true, marketing: false });

// All standard Zaraz consent API is available
const allConsent = zaraz.consent.getAll();
zaraz.consent.setAll(true); // Accept all

// Use shared utilities
const logger = createLogger('My App', true);
logger.log('App initialized');
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

## 📖 API Reference

> **💡 Complete API Documentation**: See the official [Cloudflare Zaraz Consent Management API docs](https://developers.cloudflare.com/zaraz/consent-management/api/) for detailed information about all methods and properties.

### Core Functions

#### `initFakeZaraz(config?)`

Initializes the fake Zaraz instance with optional configuration.

```typescript
import {
  initFakeZaraz,
  ZarazConfig,
} from '@imviidx/fake-cloudflare-zaraz-consent';

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

### Consent API

Once initialized, access the API via `window.zaraz.consent` or `zaraz-ts`:

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

## 🌍 Environment-Specific Usage

### Development Only

```typescript
// Only load in development
if (process.env.NODE_ENV === 'development') {
  import('@imviidx/fake-cloudflare-zaraz-consent').then(({ initFakeZaraz }) => {
    initFakeZaraz({
      ...
    });
  });
}
```

### Production Detection

```typescript
// Check if running fake vs real Zaraz
import { isFakeZaraz } from '@imviidx/fake-cloudflare-zaraz-consent';

isFakeZaraz(window.zaraz);
// true or false
```

### Browser Console Debugging

You can access the consent API directly in the browser console for debugging:

```javascript
// Available in browser console once initialized
window.zaraz.consent.getAll(); // Get all consent status
window.zaraz.consent.get('analytics'); // Get specific consent
window.zaraz.consent.set({ analytics: true }); // Set consent
window.zaraz.consent.setAll(true); // Accept all
window.zaraz.consent.setAll(false); // Reject all
window.zaraz.consent.modal = true; // Show modal

// Check available purposes
console.log(window.zaraz.consent.purposes);
```

## 📦 What's Included

- **Core API**: Full [Zaraz consent API](https://developers.cloudflare.com/zaraz/consent-management/api/) implementation
- **Modal UI**: Accessible consent dialog with customization
- **Storage**: Persistent consent via cookies + localStorage backup
- **Events**: Standard Zaraz events (`zarazConsentAPIReady`, `zarazConsentChoicesUpdated`)
- **TypeScript**: Complete type definitions
- **Utilities**: Helper functions for common operations
- **🚀 Enhanced Integration**: Seamless integration with [zaraz-ts](https://www.npmjs.com/package/zaraz-ts) for type-safe API access
- **🛠️ Development Tools**: Direct console API access for debugging
- **📦 Standard API**: Complete implementation of Cloudflare Zaraz consent API

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

## �📄 License

Apache 2.0 - see [LICENSE](./LICENSE) file for details.

---

**Note**: This is a development tool. In production, use real Cloudflare Zaraz for consent management.
