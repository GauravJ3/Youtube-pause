let activeYouTubeTabId = null;

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (currentTab) => {
    if (currentTab.url.includes("youtube.com")) {
      activeYouTubeTabId = tab.tabId;
      chrome.tabs.sendMessage(activeYouTubeTabId, { action: "resumeVideo" });
    } else if (activeYouTubeTabId) {
      chrome.tabs.sendMessage(activeYouTubeTabId, { action: "pauseVideo" });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (activeYouTubeTabId && tabId === activeYouTubeTabId && changeInfo.status === "complete" && tab.url.includes("youtube.com")) {
    chrome.tabs.sendMessage(tabId, { action: "resumeVideo" });
  } else if (activeYouTubeTabId && tabId === activeYouTubeTabId && !tab.url.includes("youtube.com")) {
    chrome.tabs.sendMessage(tabId, { action: "pauseVideo" });
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE && activeYouTubeTabId) {
    chrome.tabs.sendMessage(activeYouTubeTabId, { action: "pauseVideo" });
  } else if (activeYouTubeTabId) {
    chrome.tabs.sendMessage(activeYouTubeTabId, { action: "resumeVideo" });
  }
});
