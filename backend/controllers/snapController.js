const Snap = require("../models/Snap");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "snapstudy" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// GET /api/snaps
exports.getSnaps = async (req, res) => {
  try {
    const snaps = await Snap.find({ userId: req.user.id }).sort({
      createdAt: -1
    });
    res.json(snaps);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch snaps" });
  }
};

// POST /api/snaps  (multipart/form-data)
exports.createSnap = async (req, res) => {
  try {
    const { title, videoUrl, timestamp, note, category, channelName } =
      req.body;

    let imageUrl = null;
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const snap = await Snap.create({
      title,
      videoUrl,
      timestamp: Number(timestamp) || 0,
      note,
      category,
      channelName,
      image: imageUrl,
      userId: req.user.id
    });

    res.status(201).json(snap);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create snap" });
  }
};

// PUT /api/snaps/:id  (full edit form OR just { status })
exports.updateSnap = async (req, res) => {
  try {
    const snap = await Snap.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!snap) {
      return res.status(404).json({ message: "Snap not found" });
    }

    res.json(snap);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update snap" });
  }
};

// PUT /api/snaps/view/:id
exports.markViewed = async (req, res) => {
  try {
    const snap = await Snap.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { lastViewed: Date.now() },
      { new: true }
    );

    if (!snap) {
      return res.status(404).json({ message: "Snap not found" });
    }

    res.json(snap);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update view time" });
  }
};

// DELETE /api/snaps/:id
exports.deleteSnap = async (req, res) => {
  try {
    const snap = await Snap.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!snap) {
      return res.status(404).json({ message: "Snap not found" });
    }

    res.json({ message: "Snap deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete snap" });
  }
};
