chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url || !tab.url.includes("youtube.com")) {
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2500);
    return;
  }

  try {
    // Get video data
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

    if (!data || !data.videoUrl) {
      throw new Error("Could not get video data");
    }

    // Take screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
    const blob = await (await fetch(dataUrl)).blob();

    // Get token
    const { token } = await chrome.storage.local.get("token");
    if (!token) {
      chrome.action.setBadgeText({ text: "LOGIN" });
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
      setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
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

    const response = await fetch("https://snapstudy-d5p0.onrender.com/api/snaps", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      // Success
      chrome.action.setBadgeText({ text: "OK" });
      chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
      setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
    } else {
      const err = await response.json();
      console.error("Upload failed:", err);
      chrome.action.setBadgeText({ text: "ERR" });
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
      setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
    }

  } catch (err) {
    console.error(err);
    chrome.action.setBadgeText({ text: "ERR" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
  }
});