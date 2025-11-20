let buttonID = "createiframeButton";

// this event triggers only the first time youtube loads
window.addEventListener("load", function (event) {
    injectBypassButton();
});

// this event triggers every subsequent page load
document.addEventListener("yt-navigate-finish", function (event) {
    injectBypassButton();
});

function injectBypassButton() {
    // the videoID will only be valid if we're on a watch page
    let videoID = getVideoId(window.location.href);

    // remove the button if it exists
    if (document.getElementById(buttonID)) {
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
    if (videoID) {
        document.getElementById(buttonID).disabled = false;
    } else {
        document.getElementById(buttonID).disabled = true;
    }
}

function openTab() {
    let videoID = getVideoId(window.location.href);
    // send a message to the background script to open a new tab which holds the video
    chrome.runtime.sendMessage({ action: "openNewTab", content: videoID });
    return;

    /*
    Error from failed embeded player:
{
  "ns": "yt",
  "el": "embedded",
  "cpn": "mFE-VRx19vHyqmp4",
  "ver": 2,
  "cmt": "0",
  "fs": "0",
  "rt": "2.374",
  "euri": "",
  "lact": 0,
  "cl": "827279819",
  "mos": 0,
  "state": "80",
  "volume": 100,
  "cbr": "Chrome",
  "cbrver": "141.0.0.0",
  "c": "WEB_EMBEDDED_PLAYER",
  "cver": "1.20251102.21.00-canary_experiment_1.20251029.15.00",
  "cplayer": "UNIPLAYER",
  "cos": "Windows",
  "cosver": "10.0",
  "cplatform": "DESKTOP",
  "epm": 1,
  "hl": "en_US",
  "cr": "US",
  "len": "0",
  "fexp": "v1,24004644,131299,363591,26510701,53408,34656,106030,18644,104297,13392,9252,3479,13030,23206,15179,2,79412,5345,764,9720,2887,2498,20831,4228,4174,9396,5649,10673,4729,1257,17192,256,1734,560,1308,9218,532,5549,2536,137,548,5807,2034,1282,1371,2010,2356,64,198,1452,328,5602,817,1850,760,375,670,49,142,144,922,1932,921,1055,186,662,1047,354,313,120,42,231,351,4560,5651,10480,420,16,5862,1807",
  "size": "1238:929",
  "inview": "0",
  "muted": "0",
  "docid": "9fvETktnaRw",
  "vct": "0.000",
  "vd": "NaN",
  "vpl": "",
  "vbu": "",
  "vbs": "",
  "vpa": "1",
  "vsk": "0",
  "ven": "0",
  "vpr": "1",
  "vrs": "0",
  "vns": "0",
  "vec": "null",
  "vemsg": "",
  "vvol": "1",
  "vdom": "1",
  "vsrc": "0",
  "vw": "0",
  "vh": "0",
  "dvf": 0,
  "tvf": 0,
  // this is the important part:
  "debug_error": "{\"errorCode\":\"embedder.identity.missing.referrer\",\"errorDetail\":\"0\",\"errorMessage\":\"<a href='https://www.youtube.com/watch?v=9fvETktnaRw&source_ve_path=MTc4NDI0' target='_blank'>Watch video on YouTube</a>\",\"CO\":\"Error 153\\nVideo player configuration error\",\"mU\":\"0;a6s.0\",\"oN\":2,\"cpn\":\"mFE-VRx19vHyqmp4\"}",
  "relative_loudness": "NaN",
  "user_qual": 0,
  "release_version": "youtube.player.web_20251102_21_RC00",
  "debug_videoId": "9fvETktnaRw",
  "0sz": "true",
  "op": "",
  "yof": "true",
  "dis": "",
  "gpu": "ANGLE_(Google,_Vulkan_1.3.0_(SwiftShader_Device_(Subzero)_(0x0000C0DE)),_SwiftShader_driver)",
  "js": "/s/player/7b9b4e02/player_es6.vflset/en_US/base.js",
  "debug_playbackQuality": "unknown",
  "debug_date": "Mon Nov 03 2025 21:24:59 GMT-0700 (Mountain Standard Time)",
  "origin": "https://www.youtube.com",
  "timestamp": 1762230299261
}

Solution to mising referrer: https://groups.google.com/a/chromium.org/g/chromium-extensions/c/OUJad0q-d_g/m/8ijmLk_TAQAJ
    */
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
