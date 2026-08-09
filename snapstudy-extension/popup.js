const status = document.getElementById("status");
const loginSection = document.getElementById("loginSection");
const captureBtn = document.getElementById("captureBtn");
const loginBtn = document.getElementById("loginBtn");

// Check if already logged in
chrome.storage.local.get("token", (result) => {
  if (result.token) {
    status.textContent = "Already logged in!";
    status.style.color = "green";
    loginSection.style.display = "none";
    captureBtn.style.display = "block";
  }
});

// Login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://snapstudy-d5p0.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      await chrome.storage.local.set({ token: data.token });
      status.textContent = "Logged in successfully!";
      status.style.color = "green";
      loginSection.style.display = "none";
      captureBtn.style.display = "block";
    } else {
      status.textContent = data.message || "Login failed";
      status.style.color = "red";
    }
  } catch (err) {
    status.textContent = "Network error";
    status.style.color = "red";
  }
});

// Capture button
captureBtn.addEventListener("click", async () => {
  status.textContent = "Capturing...";
  status.style.color = "blue";

  try {
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes("youtube.com")) {
      status.textContent = "Open a YouTube lecture first";
      status.style.color = "orange";
      return;
    }

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

    // Take screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
    const blob = await (await fetch(dataUrl)).blob();

    // Get token
    const { token } = await chrome.storage.local.get("token");

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
      status.textContent = `Saved! Timestamp: ${data.timestamp}s`;
      status.style.color = "green";
    } else {
      const err = await response.json();
      status.textContent = "Upload failed: " + (err.message || "Error");
      status.style.color = "red";
    }

  } catch (err) {
    console.error(err);
    status.textContent = "Error: " + err.message;
    status.style.color = "red";
  }
});