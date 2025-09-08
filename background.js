let siteDatabase = [];

// Load the database from the JSON file when the extension starts
async function loadDatabase() {
  const response = await fetch(chrome.runtime.getURL('database.json'));
  siteDatabase = await response.json();
  console.log("Site database loaded:", siteDatabase);
}

loadDatabase();

// This function checks the URL and updates the icon
function updateActionIcon(tabId, url) {
  if (!url || !url.startsWith('http')) {
    return;
  }
  
  const currentDomain = new URL(url).hostname.replace('www.', '');
  const siteInfo = siteDatabase.find(site => currentDomain.includes(site.domain));
  let iconPath = "icons/icon48.png"; // Default icon

  if (siteInfo) {
    if (siteInfo.rating === 'green') {
      iconPath = 'icons/icon-green.png';
    } else if (siteInfo.rating === 'yellow') {
      iconPath = 'icons/icon-yellow.png';
    } else if (siteInfo.rating === 'red') {
      iconPath = 'icons/icon-red.png';
    }
  }
  
  chrome.action.setIcon({ path: iconPath, tabId: tabId });
}

// Listen for when a tab is updated (e.g., URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We only need to act when the URL is present and the tab is fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    updateActionIcon(tabId, tab.url);
  }
});

// Listen for when the user switches to a different tab
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      updateActionIcon(tab.id, tab.url);
    }
  });
});
// Listen for content script asking about site safety
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // This part for the content script banner remains the same
  if (msg.action === "checkSite" && msg.url) {
    const currentDomain = new URL(msg.url).hostname.replace('www.', '');
    const siteInfo = siteDatabase.find(site => currentDomain.includes(site.domain));

    if (siteInfo) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "showBanner",
        rating: siteInfo.rating,
        recommendation: siteInfo.recommendation
      });
    }
  }

  // ADD THIS NEW PART to handle requests from the popup
  if (msg.action === "getSiteInfo" && msg.url) {
    const currentDomain = new URL(msg.url).hostname.replace('www.', '');
    const siteInfo = siteDatabase.find(site => currentDomain.includes(site.domain));
    sendResponse(siteInfo); // Send the found info back to the popup
    return true; // Indicates you will send a response asynchronously
  }
});