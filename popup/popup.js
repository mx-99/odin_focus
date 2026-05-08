// popup.js
const toggleCheckbox = document.getElementById('toggleFocus');
const statusSpan = document.getElementById('status');

// Load current state from storage and update checkbox
async function loadState() {
  try {
    const result = await browser.storage.local.get('odinFocusEnabled');
    const isEnabled = result.odinFocusEnabled !== undefined ? result.odinFocusEnabled : true;
    toggleCheckbox.checked = isEnabled;
  } catch (err) {
    statusSpan.textContent = 'Error loading state';
    console.error(err);
  }
}

// Save state to storage and notify the active tab (if any)
async function setEnabled(enabled) {
  await browser.storage.local.set({ odinFocusEnabled: enabled });
  statusSpan.textContent = enabled ? 'Focus mode ON' : 'Focus mode OFF';
  setTimeout(() => {
    if (statusSpan.textContent !== 'Error loading state') {
      statusSpan.textContent = 'Ready';
    }
  }, 1500);

  // Send message to the currently active tab in the current window
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    try {
      await browser.tabs.sendMessage(tabs[0].id, { action: 'toggle', enabled: enabled });
    } catch (err) {
      // Content script may not be ready or page not supported – that's fine.
      console.debug('Could not send toggle message:', err);
    }
  }
}

// Event listener for toggle change
toggleCheckbox.addEventListener('change', (e) => {
  setEnabled(e.target.checked);
});

// Initial load
loadState();