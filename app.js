let currentEnabled = true;

// Apply or remove the class based on the enabled flag
function applyState(enabled) {
  if (enabled) {
    document.documentElement.classList.add('odin-focus-enabled');
  } else {
    document.documentElement.classList.remove('odin-focus-enabled');
  }
  currentEnabled = enabled;
}

// Read initial state from storage and apply it
browser.storage.local.get('odinFocusEnabled').then((result) => {
  const enabled = result.odinFocusEnabled !== undefined ? result.odinFocusEnabled : true;
  applyState(enabled);
});

// Listen for toggle messages from the popup or background
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    const newState = message.enabled;
    applyState(newState);
    sendResponse({ success: true, enabled: newState });
  }
  return true; // keep channel open for async response
});