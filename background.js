chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // process the request to open a new tab 
    if (message.action === "openNewTab") {
      // Create a new tab with a data URL
      chrome.tabs.create({ url: "data:text/html," + encodeURIComponent(message.content) });
    }
  });