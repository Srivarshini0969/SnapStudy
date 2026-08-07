document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  try {
    const res = await fetch("https://snapstudy-d5p0.onrender.com/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

    const data = await res.json();

    if (data.token) {
      await chrome.storage.local.set({ token: data.token });
      status.textContent = "✅ Logged in successfully!";
      status.style.color = "green";
    } else {
      status.textContent = data.message || "Login failed";
      status.style.color = "red";
    }
  } catch (err) {
    status.textContent = "Network error";
    status.style.color = "red";
  }
});