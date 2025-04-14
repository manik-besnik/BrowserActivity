let activeTabId = null;
let startTime = null;
let currentUrl = null;

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

async function logTimeSpent(tabId, url) {
  if (!url || !startTime) return;

  const endTime = Date.now();
  const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
  const domain = getDomain(url);
  const date = getTodayDate();

  if (!domain) return;

  chrome.storage.local.get(["activityLogs"], (result) => {
    const logs = result.activityLogs || {};

    if (!logs[date]) logs[date] = {};
    if (!logs[date][domain]) logs[date][domain] = [];

    logs[date][domain].push({
      url,
      timeSpent,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString()
    });

    chrome.storage.local.set({ activityLogs: logs });
  });
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (activeTabId !== null) {
    const tab = await chrome.tabs.get(activeTabId);
    await logTimeSpent(activeTabId, tab.url);
  }

  const newTab = await chrome.tabs.get(tabId);
  activeTabId = tabId;
  startTime = Date.now();
  currentUrl = newTab.url;
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    await logTimeSpent(tabId, currentUrl);
    startTime = Date.now();
    currentUrl = tab.url;
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (activeTabId !== null) {
      const tab = await chrome.tabs.get(activeTabId);
      await logTimeSpent(activeTabId, tab.url);
      activeTabId = null;
      startTime = null;
      currentUrl = null;
    }
  }
});
