// background.js
browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get('odinFocusEnabled').then((result) => {
      if (result.odinFocusEnabled === undefined) {
        browser.storage.local.set({ odinFocusEnabled: true });
      }
    });
  });