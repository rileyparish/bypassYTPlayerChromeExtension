(function () {
  // extract videoId from URI
  const raw = window.location.search.slice(1);
  const videoId = decodeURIComponent(raw);

  const url = `https://www.youtube.com/embed/${videoId}`;

  // create an iframe and inject it into webpage
  const iframe = document.createElement("iframe");
  iframe.width = "1296";
  iframe.height = "729";
  iframe.src = url;
  iframe.title = "YouTube video player";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "cross-origin-with-strict-origin";

  document.getElementById("player").appendChild(iframe);
})();
