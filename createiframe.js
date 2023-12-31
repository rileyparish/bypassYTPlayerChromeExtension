let buttonID = "createiframeButton";

// this event triggers only the first time youtube loads
window.addEventListener("load", function(event){
    injectBypassButton();
});

// this event triggers every subsequent page load
document.addEventListener("yt-navigate-finish", function (event) {
    injectBypassButton();
});

function injectBypassButton(){
    // the videoID will only be valid if we're on a watch page
    let videoID = getVideoId(window.location.href);

    // remove the button if it exists
    if(document.getElementById(buttonID)){
        document.getElementById(buttonID).remove();
    }
    
    // now recreate the button so it always has the right data for the current page
    const openTabButton = document.createElement("button");
    openTabButton.innerHTML = "Open iframe ↗";
    openTabButton.id = buttonID;
    openTabButton.addEventListener("click", openTab);
    // this places the button in the top icon bar
    document.getElementById("end").prepend(openTabButton);
    

    // disable the button if we're not on a watch page
    if(videoID) {
        document.getElementById(buttonID).disabled = false;   
    } else{
        document.getElementById(buttonID).disabled = true;
    }
}

function openTab() {
    let videoID = getVideoId(window.location.href);
    // create html for the new web page which will contain the embedded video
    let html = `<iframe width="1271" height="715" src="https://www.youtube.com/embed/${videoID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    // send a message to the background script to open a new tab containing the embedded video
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
