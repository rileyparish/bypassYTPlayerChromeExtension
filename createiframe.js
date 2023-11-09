// run this code whenever the youtube page changes
document.addEventListener("yt-navigate-finish", function (event) {
    // the videoID will only be valid if we're on a watch page (nothing happens on the home page)
    let videoID = getVideoId(window.location.href);
    if (videoID != null) {
        injectBypassButton();
    }
});

function injectBypassButton(){
    let buttonID = "createiframeButton";
    // create a button on the page (if one doesn't already exist)
    if(!document.getElementById(buttonID)){
        const openTabButton = document.createElement("button");
        openTabButton.innerHTML = "Open iframe ↗";
        openTabButton.id = buttonID;
        openTabButton.addEventListener("click", openTab);
        document.getElementById("secondary").prepend(openTabButton);
    }
}

function openTab() {
    let videoID = getVideoId(window.location.href);
    // create html for the new web page which will contain the embedded video
    let html = `<iframe width="1271" height="715" src="https://www.youtube.com/embed/${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    // send a message to the background script to open a new tab
    chrome.runtime.sendMessage({ action: "openNewTab", content: html });
}

// parse the url for the videoID (courtesy of the "Return YouTube Dislike" extension)
function getVideoId(url) {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    if (pathname.startsWith("/clip")) {
        return document.querySelector("meta[itemprop='videoId']").content;
    } else {
          if (pathname.startsWith("/shorts")) {
            return pathname.slice(8);
          }
        return urlObject.searchParams.get("v");
    }
}