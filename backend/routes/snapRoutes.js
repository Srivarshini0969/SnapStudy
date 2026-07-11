const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getSnaps,
  createSnap,
  updateSnap,
  markViewed,
  deleteSnap
} = require("../controllers/snapController");

// image comes in as multipart/form-data, keep it in memory (no disk writes)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authMiddleware, getSnaps);
router.post("/", authMiddleware, upload.single("image"), createSnap);
router.put("/view/:id", authMiddleware, markViewed);
router.put("/:id", authMiddleware, updateSnap);
router.delete("/:id", authMiddleware, deleteSnap);

module.exports = router;
