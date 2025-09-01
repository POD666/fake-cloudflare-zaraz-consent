import './style.css'
import { initFakeZaraz, isFakeZaraz } from 'fake-cloudflare-zaraz-consent'

// Initialize Zaraz Consent Tools with demo configuration
initFakeZaraz({
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
  defaultConsent: {
    functional: true,
    analytics: false,
    marketing: false,
    preferences: false,
  },
  enableLogging: true,
  enableModal: true,
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
  cookieName: 'fake_cloudflare_zaraz_consent_demo_consent',
  autoShow: true,
})

console.log('✅ Zaraz Consent Tools initialized')

initDemo();

function initDemo() {
  // Hide loading indicator
  const loadingEl = document.getElementById('loading')
  if (loadingEl) {
    loadingEl.style.display = 'none'
  }

  // Initialize demo functionality
  setupEventListeners()
  updateStatus()
  renderPurposes()
  createEventStatusIndicator()

  console.log('✅ Demo interface initialized')
}

function createEventStatusIndicator() {
  // Add an event status indicator after the main status section
  const statusSection = document.getElementById('status')
  if (!statusSection) return

  const eventStatusHTML = `
    <div id="event-status" class="bg-white border border-slate-200 rounded-lg p-6 mb-8 border-l-4 border-l-green-500">
      <h3 class="text-xl font-semibold text-slate-800 mb-4">🎯 Event Listeners Status</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div id="api-ready-status" class="p-3 border border-slate-200 rounded bg-slate-50">
          <div class="font-medium text-slate-800">zarazConsentAPIReady</div>
          <div class="text-sm text-slate-600 mt-1">Waiting for API initialization...</div>
          <div class="text-xs text-slate-500 mt-2">Last triggered: Never</div>
        </div>
        <div id="choices-updated-status" class="p-3 border border-slate-200 rounded bg-slate-50">
          <div class="font-medium text-slate-800">zarazConsentChoicesUpdated</div>
          <div class="text-sm text-slate-600 mt-1">Waiting for consent changes...</div>
          <div class="text-xs text-slate-500 mt-2">Last triggered: Never</div>
        </div>
      </div>
      <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div class="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Try changing consent preferences above to see the
          <code class="bg-blue-100 px-1 rounded">zarazConsentChoicesUpdated</code> event in action!
        </div>
      </div>
    </div>
  `

  statusSection.insertAdjacentHTML('afterend', eventStatusHTML)
}

function setupEventListeners() {
  // Modal controls
  document.getElementById('show-modal')?.addEventListener('click', () => {
    window.zaraz.consent.modal = true
    logAction('Consent modal shown')
  })

  document.getElementById('hide-modal')?.addEventListener('click', () => {
    window.zaraz.consent.modal = false
    logAction('Consent modal hidden')
  })

  // Quick actions
  document.getElementById('accept-all')?.addEventListener('click', () => {
    window.zaraz.consent.set({
      functional: true,
      analytics: true,
      marketing: true,
      preferences: true
    })
    logAction('All consent accepted')
    updateStatus()
  })

  document.getElementById('reject-all')?.addEventListener('click', () => {
    window.zaraz.consent.set({
      functional: true,
      analytics: false,
      marketing: false,
      preferences: false
    })
    logAction('All consent rejected (except functional)')
    updateStatus()
  })

  document.getElementById('reset-consent')?.addEventListener('click', () => {
    window.zaraz.consent.set({
      functional: true,
      analytics: false,
      marketing: false,
      preferences: false
    })
    logAction('Consent reset to defaults')
    updateStatus()
  })

  // Advanced actions
  document.getElementById('simulate-scripts')?.addEventListener('click', () => {
    simulateScriptLoading()
  })

  document.getElementById('debug-consent')?.addEventListener('click', () => {
    debugConsentState()
  })

  document.getElementById('test-advanced')?.addEventListener('click', () => {
    testAdvancedFeatures()
  })

  document.getElementById('send-queued')?.addEventListener('click', () => {
    window.zaraz.consent.sendQueuedEvents()
    logAction('Queued events sent')
  })

  document.getElementById('clear-storage')?.addEventListener('click', () => {
    localStorage.removeItem('fake_cloudflare_zaraz_consent_demo_consent')
    logAction('Storage cleared, reloading page...')
    setTimeout(() => location.reload(), 1000)
  })

  document.getElementById('get-consent')?.addEventListener('click', () => {
    const consent = window.zaraz.consent.getAll()
    logAction(`Current consent: ${JSON.stringify(consent, null, 2)}`)
  })

  document.getElementById('clear-logs')?.addEventListener('click', () => {
    const logsEl = document.getElementById('logs')
    if (logsEl) {
      logsEl.innerHTML = '<div class="text-blue-600 py-1">Logs cleared...</div>'
    }
  })
}

function updateStatus() {
  const statusContentEl = document.getElementById('status-content')
  const codeExampleEl = document.getElementById('code-example')
  const statusOutputEl = document.getElementById('status-output')

  if (!statusContentEl || !codeExampleEl || !statusOutputEl) return

  const consent = window.zaraz.consent.getAll()
  const hasBeenSet = Object.keys(consent).length > 0
  const apiReady = window.zaraz?.consent?.APIReady || false

  // Update status content with enhanced visual indicators
  statusContentEl.innerHTML = `
    <div class="space-y-2">
      <div class="text-sm">
        <strong>API Ready:</strong> <span class="${apiReady ? 'text-green-600' : 'text-orange-600'}">${apiReady ? '✅ Yes' : '⏳ Loading...'}</span>
      </div>
      <div class="text-sm">
        <strong>Consent Set:</strong> <span class="${hasBeenSet ? 'text-green-600' : 'text-orange-600'}">${hasBeenSet ? '✅ Yes' : '⚠️ No'}</span>
      </div>
      <div class="text-sm">
        <strong>Modal Available:</strong> <span class="text-green-600">✅ Yes</span>
      </div>
      <div class="text-sm">
        <strong>Last Updated:</strong> <span class="text-blue-600">${new Date().toLocaleTimeString()}</span>
      </div>
    </div>
    <div class="space-y-1">
      ${Object.entries(consent).map(([purpose, granted]) =>
        `<div class="text-sm flex items-center justify-between">
          <strong class="capitalize">${purpose}:</strong>
          <span class="${granted ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded text-xs font-medium">
            ${granted ? '✅ Granted' : '❌ Denied'}
          </span>
        </div>`
      ).join('')}
    </div>
  `

  // Update code example
  codeExampleEl.textContent = `// Check consent status
const consent = window.zaraz.consent.getAll();
console.log(consent);

// Listen for consent changes
document.addEventListener('zarazConsentChoicesUpdated', (event) => {
  console.log('Consent updated:', event.detail.consent);
});

// Result:`

  // Update status output
  statusOutputEl.textContent = JSON.stringify(consent, null, 2)

  // Add a subtle flash effect to indicate the update
  statusContentEl.style.transition = 'background-color 0.3s ease'
  statusContentEl.style.backgroundColor = '#f0f9ff'
  setTimeout(() => {
    statusContentEl.style.backgroundColor = ''
  }, 300)
}

function renderPurposes() {
  const container = document.getElementById('purposes-container')
  if (!container) return

  const purposes = ['functional', 'analytics', 'marketing', 'preferences']
  const consent = window.zaraz.consent.getAll()

  container.innerHTML = purposes.map(purpose => {
    const isGranted = consent[purpose] || false
    const isRequired = purpose === 'functional'

    return `
      <div class="flex items-center justify-between p-3 border border-slate-200 rounded transition-all duration-300 hover:shadow-sm ${isGranted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
        <div class="flex-1">
          <div class="font-medium text-slate-800 capitalize flex items-center gap-2">
            ${purpose}
            ${isRequired ? '<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Required</span>' : ''}
          </div>
          <div class="text-sm text-slate-600">${isRequired ? 'Essential - Cannot be disabled' : 'Optional - Can be enabled/disabled'}</div>
        </div>
        <div class="flex items-center space-x-3">
          <span class="text-lg ${isGranted ? 'text-green-600' : 'text-red-600'}">
            ${isGranted ? '✅' : '❌'}
          </span>
          <button
            class="px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${
              isGranted
                ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-sm'
                : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-sm'
            } ${isRequired ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}"
            onclick="togglePurpose('${purpose}')"
            ${isRequired ? 'disabled' : ''}
          >
            ${isGranted ? 'Deny' : 'Grant'}
          </button>
        </div>
      </div>
    `
  }).join('')

  // Add a subtle animation to indicate the update
  container.style.transition = 'transform 0.2s ease'
  container.style.transform = 'scale(0.98)'
  setTimeout(() => {
    container.style.transform = 'scale(1)'
  }, 100)
}

function togglePurpose(purpose) {
  if (purpose === 'functional') return // Cannot toggle functional

  const current = window.zaraz.consent.get(purpose)
  window.zaraz.consent.set({ [purpose]: !current })

  logAction(`${purpose} consent ${!current ? 'granted' : 'denied'}`)
  updateStatus()
  renderPurposes()
}

function simulateScriptLoading() {
  const consent = window.zaraz.consent.getAll()
  const loadedScripts = []

  Object.entries(consent).forEach(([purpose, granted]) => {
    if (granted && purpose !== 'functional') {
      loadedScripts.push(`${purpose}-script.js`)
    }
  })

  if (loadedScripts.length > 0) {
    const scriptsListEl = document.getElementById('scripts-list')
    const loadedScriptsEl = document.getElementById('loaded-scripts')

    if (scriptsListEl && loadedScriptsEl) {
      scriptsListEl.innerHTML = loadedScripts.map(script => `<li>${script}</li>`).join('')
      loadedScriptsEl.classList.remove('hidden')
    }

    logAction(`Simulated loading: ${loadedScripts.join(', ')}`)
  } else {
    logAction('No scripts to load (no consent granted)')
  }
}

function debugConsentState() {
  const consent = window.zaraz.consent.getAll()
  const debug = {
    consent,
    hasBeenSet: Object.keys(consent).length > 0,
    timestamp: new Date().toISOString(),
    storage: localStorage.getItem('fake_cloudflare_zaraz_consent_demo_consent')
  }

  logAction(`Debug info: ${JSON.stringify(debug, null, 2)}`)
}

function testAdvancedFeatures() {
  const consent = window.zaraz.consent.getAll()
  const hasAnalytics = window.zaraz.consent.get('analytics')
  const hasMarketing = window.zaraz.consent.get('marketing')

  logAction(`Advanced test results:
- All consent: ${JSON.stringify(consent)}
- Analytics: ${hasAnalytics}
- Marketing: ${hasMarketing}
- Global tools available: ${typeof window.zarazConsentTools !== 'undefined'}`)
}

function logAction(message) {
  const logsEl = document.getElementById('logs')
  if (!logsEl) return

  const timestamp = new Date().toLocaleTimeString()
  const logEntry = document.createElement('div')
  logEntry.className = 'py-2 px-3 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors'
  logEntry.innerHTML = `<span class="text-slate-500 text-xs">[${timestamp}]</span> <span class="text-slate-700">${message}</span>`

  logsEl.appendChild(logEntry)
  logsEl.scrollTop = logsEl.scrollHeight

  // Show a brief flash to indicate new activity
  logEntry.style.backgroundColor = '#dbeafe'
  setTimeout(() => {
    logEntry.style.backgroundColor = ''
  }, 500)

  // Add a visual indicator for new events
  showEventIndicator()
}

function showEventIndicator() {
  // Create or update an event indicator
  let indicator = document.getElementById('event-indicator')
  if (!indicator) {
    indicator = document.createElement('div')
    indicator.id = 'event-indicator'
    indicator.className = 'fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg z-50 transition-all duration-300'
    indicator.innerHTML = '🔔 Event Received'
    document.body.appendChild(indicator)
  }

  // Show the indicator
  indicator.style.opacity = '1'
  indicator.style.transform = 'scale(1)'

  // Hide it after a short delay
  setTimeout(() => {
    indicator.style.opacity = '0'
    indicator.style.transform = 'scale(0.8)'
  }, 2000)
}

// Make togglePurpose available globally for onclick handlers
window.togglePurpose = togglePurpose

// Listen for consent changes
document.addEventListener('zarazConsentAPIReady', () => {
  logAction('🚀 Zaraz Consent API is ready')
  updateStatus()
  renderPurposes()
  updateEventStatus('api-ready', 'API Successfully Initialized', '✅ Ready')
})

document.addEventListener('zarazConsentChoicesUpdated', (event) => {
  const consent = event.detail?.consent || {}
  logAction(`🔄 Consent choices updated: ${JSON.stringify(consent)}`)
  updateStatus()
  renderPurposes()

  // Show which specific purposes changed
  const changedPurposes = Object.entries(consent)
    .map(([purpose, granted]) => `${purpose}: ${granted ? '✅' : '❌'}`)
    .join(', ')
  logAction(`📋 Current state: ${changedPurposes}`)

  updateEventStatus('choices-updated', 'Consent preferences updated', `🔄 ${Object.keys(consent).length} purposes`)
})

function updateEventStatus(eventType, message, status) {
  const statusEl = document.getElementById(`${eventType.replace('-', '-')}-status`)
  if (!statusEl) return

  const timestamp = new Date().toLocaleTimeString()

  statusEl.innerHTML = `
    <div class="font-medium text-slate-800">${eventType === 'api-ready' ? 'zarazConsentAPIReady' : 'zarazConsentChoicesUpdated'}</div>
    <div class="text-sm text-green-600 mt-1">${status} - ${message}</div>
    <div class="text-xs text-slate-500 mt-2">Last triggered: ${timestamp}</div>
  `

  // Add visual feedback
  statusEl.style.backgroundColor = '#f0fdf4'
  statusEl.style.borderColor = '#bbf7d0'
  setTimeout(() => {
    statusEl.style.backgroundColor = '#f8fafc'
    statusEl.style.borderColor = '#e2e8f0'
  }, 1000)
}

// Show global tools status
setTimeout(() => {
  const globalToolsEl = document.getElementById('global-tools-status')
  if (globalToolsEl && typeof window.zarazConsentTools !== 'undefined') {
    globalToolsEl.classList.remove('hidden')
  }
}, 1000)
