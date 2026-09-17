# SnapStudy

### AI-Powered Lecture Revision & Timestamp Navigation Platform

SnapStudy is a smart lecture capture and revision platform designed to help students save important moments from long YouTube lectures and revisit them quickly.

Instead of searching through an entire lecture again, students can save a lecture screenshot, exact timestamp, notes, and subject information in one place. Later, they can continue watching directly from the saved timestamp.

---

## Live Demo

**Frontend:**  
https://snap-study-six.vercel.app

---

## Problem Statement

While studying from long YouTube lectures, students often find an important concept but later struggle to remember exactly where it was explained.

Searching through the entire video again wastes time.

SnapStudy solves this problem by combining:

- Lecture screenshot
- Exact video timestamp
- Revision notes
- Subject organization
- OCR-based topic detection
- Revision status tracking
- Direct timestamp-based video navigation

---

## Key Features

### 1. Smart Lecture Capture

Students can save important lecture moments along with:

- Topic title
- YouTube lecture link
- Exact timestamp
- Channel name
- Revision notes
- Subject
- Screenshot

---

### 2. Timestamp Resume Navigation

Saved lectures can be opened directly from the stored timestamp.

For example:

YouTube Video
       ↓
Saved Timestamp: 3:01:36
       ↓
Click "Continue"
       ↓
YouTube opens at the saved point


## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Snap Management
![Snap Management](./screenshots/snap-management.png)

### Mobile UI
![Mobile UI](./screenshots/mobile-ui.png)

### OCR Detection
![OCR Detection](./screenshots/ocr-detection.png)

### Continue Watching
![Continue Watching](./screenshots/continue-watching.png)

### Authentication
![Authentication](./screenshots/authentication.png)

---

## Chrome Extension

SnapStudy includes a **Chrome Extension built using Chrome Extension Manifest V3**.

The extension allows students to capture an important moment while watching a YouTube lecture and save it directly to SnapStudy.

### How It Works

```text
YouTube Lecture
       ↓
Chrome Extension
       ↓
Capture Screenshot + Current Timestamp
       ↓
Send Lecture Data to Backend
       ↓
Cloudinary → Screenshot
MongoDB → Snap Details + Timestamp
       ↓
SnapStudy React App
       ↓
Uploaded Snaps
       ↓
Click "Continue"
       ↓
YouTube Opens at Saved Timestamp
```

### Extension Components

- `manifest.json` — Chrome Extension configuration
- `popup.html` — Extension popup interface
- `popup.js` — Handles capture and communication logic
- `content.js` — Interacts with the YouTube page
- `background.js` — Handles extension background operations

### Main Functionality

The extension captures:

- YouTube lecture URL
- Current lecture timestamp
- Lecture title
- Screenshot of the current tab

The captured information is sent to the SnapStudy backend and associated with the authenticated user.

The screenshot is stored using **Cloudinary**, while lecture details and timestamp information are stored in **MongoDB**.

When the saved snap is opened from the React application, the **Continue** option uses the stored timestamp to open the YouTube lecture from that exact point.

### Example


Student is watching a YouTube lecture
             ↓
Important concept at 52:14
             ↓
Click SnapStudy Extension
             ↓
Screenshot + 52:14 captured
             ↓
Saved as a Snap
             ↓
Later click "Continue"
             ↓
Lecture opens at 52:14
