const iframeHosts = [
  'www.youtube.com',
];
chrome.runtime.onInstalled.addListener(() => {
  const RULE = {
    id: 1,
    condition: {
      initiatorDomains: [chrome.runtime.id],
      requestDomains: iframeHosts,
      resourceTypes: ['sub_frame'],
    },
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        { header: 'referer', value: chrome.runtime.id, operation: 'set' },
      ],
    },
  };
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE.id],
    addRules: [RULE],
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // process the request to open a new tab 
  if (message.action === "openNewTab") {
    console.log(message.content);
    // Create a new tab with a data URL
    chrome.tabs.create({
      url: chrome.runtime.getURL("videoPage.html?" + encodeURIComponent(message.content))
    });
  }
});