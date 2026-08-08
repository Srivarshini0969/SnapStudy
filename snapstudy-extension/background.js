chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url.includes("youtube.com")) {
    alert("Open a YouTube lecture first");
    return;
  }

  try {
    // Get timestamp + title
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const video = document.querySelector("video");
        return {
          timestamp: video ? Math.floor(video.currentTime) : 0,
          videoUrl: window.location.href,
          title: document.title.replace(" - YouTube", "").trim()
        };
      }
    });

    const data = results[0].result;

    // Take screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
    const blob = await (await fetch(dataUrl)).blob();

    // Get token
    const { token } = await chrome.storage.local.get("token");
    if (!token) {
      alert("Please login first from the extension popup");
      return;
    }

    // Upload
    const formData = new FormData();
    formData.append("title", data.title || "YouTube Lecture");
    formData.append("videoUrl", data.videoUrl);
    formData.append("timestamp", data.timestamp);
    formData.append("note", "");
    formData.append("category", "NONE");
    formData.append("image", blob, "screenshot.png");

    const response = await fetch("https://snapstudy-production.up.railway.app/api/snaps", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});

    if (response.ok) {
      alert("✅ Snap saved! Timestamp: " + data.timestamp + "s");
    } else {
      const err = await response.json();
      alert("Upload failed: " + (err.message || "Error"));
    }
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
});