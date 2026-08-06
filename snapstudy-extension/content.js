chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoData") {
    const video = document.querySelector("video");

    if (!video) {
      sendResponse({ error: "No video found" });
      return true;
    }

    sendResponse({
      timestamp: Math.floor(video.currentTime),
      videoUrl: window.location.href,
      title: document.title.replace(" - YouTube", "").trim()
    });
  }
  return true;
});