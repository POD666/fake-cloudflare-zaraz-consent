# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
