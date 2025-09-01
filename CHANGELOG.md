# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **BREAKING:** Renamed main export function from `initializeZarazConsentTools` to `initFakeZaraz`
- **BREAKING:** Renamed utility functions: `getZarazConsentTools` → `getFakeZaraz`, `cleanupZarazConsentTools` → `cleanupFakeZaraz`
- **BREAKING:** Removed re-exports of zaraz-ts functions from main package
- **BREAKING:** Moved `DEMO_PURPOSES` from utils to demo directory as it's demo-specific
- **BREAKING:** Changed default cookie name from `cf_consent` to `fake_cf_consent`
- **BREAKING:** Simplified default purposes to single example purpose in config
- **Config:** Default cookie name updated for better clarity in development
- **Config:** Removed default purposes array, replaced with single example purpose
- **Types:** Added comment indicating `required` prop is custom (not in Cloudflare's API)
- **Types:** Enhanced type documentation for better developer experience
- **Storage:** Removed default parameter from ConsentStorage constructor
- **API:** Simplified function names for better developer experience
- **Demo:** Complete rewrite using modern Vite + Tailwind CSS v4 stack
- **Demo:** Migrated from vanilla HTML/CSS to JavaScript ES modules
- **Demo:** Enhanced visual design with Tailwind CSS utility classes
- **Demo:** Improved responsive design and user experience
- **Demo:** Updated to use renamed API functions (`initFakeZaraz`)
- **Demo:** Enhanced real-time consent state tracking and visualization
- **Demo:** Improved event listener demonstrations and status indicators

### Removed

- **BREAKING:** Removed zaraz-ts re-exports - users should import zaraz-ts directly
- **BREAKING:** Removed `DEMO_PURPOSES` export from utils
- **Demo:** Removed old vanilla HTML demo structure
- **Demo:** Removed inline styles and custom CSS
- **Demo:** Removed `scripts/build-demo.js` and related build scripts
- **Demo:** Removed old favicon.svg from demo root
- **Package:** Removed demo-related npm scripts from main package.json
- **Package:** Cleaned up unused scripts (`demo`, `demo:dev`, `demo:build`, `prepublishOnly`)
- **Package:** Removed unnecessary release scripts (`release:patch`, `release:minor`, `release:major`)

### Added

- **Demo:** Complete Vite-based development environment with hot reloading
- **Demo:** Standalone package.json with proper dependencies and scripts
- **Demo:** Tailwind CSS v4 integration with @tailwindcss/vite plugin
- **Demo:** Modern ES module structure with main.js entry point
- **Demo:** Enhanced favicon in proper public/ directory
- **Demo:** Responsive grid layouts and improved mobile experience
- **Demo:** Interactive consent purpose toggles with visual feedback
- **Demo:** Real-time event listener status indicators
- **Demo:** Enhanced logging system with timestamps and visual feedback
- **Demo:** Script loading simulation features
- **Demo:** Advanced debugging tools and consent state analysis
- **Demo:** Event indicator notifications for better user feedback
- **Demo:** Enhanced code examples and documentation
- **Package:** Proper demo workspace with local package linking
- **Package:** Streamlined build and development workflows

### Fixed

- **API:** Consistent function naming throughout the library
- **Demo:** Fixed icon reference path in HTML head
- **Demo:** Improved accessibility and user interaction feedback
- **Demo:** Enhanced error handling and edge cases
- **Dependencies:** Updated package-lock.json with latest dependency versions

### Migration Guide

#### From v1.1.x to Unreleased

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

// After (Unreleased)
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

// After (Unreleased) - import zaraz-ts directly
import { initFakeZaraz } from 'fake-cloudflare-zaraz-consent';
import { waitForConsentAPI, ifConsentGranted } from 'zaraz-ts';
```

**⚠️ Breaking Changes - Demo Purposes:**

```javascript
// Before (v1.1.x)
import { DEMO_PURPOSES } from 'fake-cloudflare-zaraz-consent';

// After (Unreleased) - define your own or copy from demo
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

**🔧 Config Changes:**

The default cookie name changed from `cf_consent` to `fake_cf_consent`. If you relied on the default, you may need to clear existing cookies or specify the old name:

```javascript
// To maintain compatibility with existing cookies
initFakeZaraz({
  cookieName: 'cf_consent', // Use old name
  // ... other config
});
```

## [1.1.2] - 2025-08-29

### Changed

- **BREAKING:** Removed re-exports of zaraz-ts functions
- Users should now import zaraz-ts functions directly
- This provides better tree-shaking and clearer dependency management
- **Internal:** Removed global `globalZarazInstance` variable, now using `window.zaraz` directly
- **Internal:** Added `getWindowZaraz()` utility for safe window.zaraz access
- Simplified instance management and improved memory usage

### Migration Guide

```javascript
// Before (v1.1.1 and earlier)
import {
  waitForConsentAPI,
  ifConsentGranted,
} from 'fake-cloudflare-zaraz-consent';

// After (v1.1.2+)
import { quickSetup } from 'fake-cloudflare-zaraz-consent';
import { waitForConsentAPI, ifConsentGranted } from 'zaraz-ts';
```

## [1.1.1] - 2025-08-29

### ⬆️ Updated

- **zaraz-ts** upgraded to latest version - Latest features and bug fixes

## [1.1.0] - 2025-08-29

### 🚀 Added

- **New utilities module** - Centralized common functions following DRY principles
- **Shared demo purposes** - `DEMO_PURPOSES` and `DEMO_DEFAULT_CONSENT` constants for consistent testing
- **Enhanced logging system** - Centralized logger with consistent formatting across all components
- **Improved error handling** - Standardized error messages and validation functions
- **Async utilities** - `delay()` and `retryWithBackoff()` helper functions

### ⬆️ Updated

- **zaraz-ts** upgraded to latest version
- **Simplified architecture** - Removed the complex tools integration module for direct usage
- **DRY compliance** - Eliminated code duplication across modules
- **Better TypeScript support** - Enhanced type safety and error handling

### 🔧 Changed

- **Logging system** - Unified logging approach using `createLogger()` function
- **Event dispatching** - Centralized custom event handling
- **Purpose validation** - Shared validation logic with consistent error reporting
- **Browser environment checks** - Standardized environment detection

### 🗑️ Removed

- **tools.ts module** - Replaced with direct zaraz-ts usage
- **Duplicate code** - Eliminated repeated logging, validation, and utility functions
- **Complex integration layer** - Simplified to direct function exports

### 🐛 Fixed

- **Consistent error messages** - Standardized across all components
- **Improved timing handling** - Better async/await patterns
- **Enhanced type safety** - Reduced TypeScript strict mode warnings

### 📦 Dependencies

- Updated `zaraz-ts` to latest version

## [1.0.2] - 2025-08-29

### 🚀 Added

- Initial integration with zaraz-ts
- Tools module for enhanced functionality
- Comprehensive demo examples

### 🔧 Changed

- Enhanced package exports
- Improved documentation

## [1.0.1] - 2025-08-28

### 🐛 Fixed

- Package exports configuration
- TypeScript compilation issues

## [1.0.0] - 2025-08-28

### 🚀 Added

- Initial release
- Fake Cloudflare Zaraz implementation
- Consent management API
- Modal consent dialog
- Local storage persistence
- TypeScript support
- Comprehensive demo
- Apache 2.0 license

### 📦 Core Features

- **FakeZaraz class** - Complete Zaraz consent API implementation
- **Consent modal** - Customizable consent management dialog
- **Storage handling** - Cookie and localStorage support
- **Event system** - Custom events for consent changes
- **Purpose management** - Configurable consent purposes
- **Development tools** - Logging and debugging utilities

---

## Migration Guide

### From v1.0.x to v1.1.0

#### ✅ What stays the same:

- All core API functions (`initializeZarazConsentTools`, `quickSetup`, etc.)
- zaraz-ts functions (now directly exported)
- Existing configuration options
- Demo functionality

#### 🔄 What changed:

- **Tools module removed** - Import functions directly from the main package
- **Enhanced utilities** - New shared utilities available for import

#### 📝 Update your imports:

**Before (v1.0.x):**

```javascript
import {
  initializeWithTools,
  quickSetupWithTools,
  ConsentTools,
  FakeZarazTools,
} from 'fake-cloudflare-zaraz-consent';

const { zaraz, tools } = await quickSetupWithTools();
await ConsentTools.ifConsentGranted('analytics', callback);
```

**After (v1.1.0):**

```javascript
import {
  quickSetup,
  waitForConsentAPI,
  ifConsentGranted,
  createGlobalConsentTools,
  DEMO_PURPOSES,
  DEMO_DEFAULT_CONSENT,
} from 'fake-cloudflare-zaraz-consent';

const zaraz = quickSetup();
await waitForConsentAPI();
await ifConsentGranted('analytics', callback);
await createGlobalConsentTools(); // For browser console tools
```

#### 🚀 New utilities available:

```javascript
import {
  createLogger,
  DEMO_PURPOSES,
  DEMO_DEFAULT_CONSENT,
  isBrowserEnvironment,
  validatePurposeIds,
  delay,
  retryWithBackoff,
} from 'fake-cloudflare-zaraz-consent';
```

The migration is straightforward - the core functionality remains the same, but with a cleaner, more direct API!
