require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const authMiddleware =
  require("./middleware/authMiddleware");
const Snap = require("./models/Snap");
const User = require("./models/User");

const app = express();

/* ===================================
   MIDDLEWARE
=================================== */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ],
    credentials: true
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* ===================================
   MONGODB CONNECTION
=================================== */

mongoose.connect(process.env.MONGO_URI, {

  serverSelectionTimeoutMS: 5000,

  socketTimeoutMS: 45000

})

.then(() => {

  console.log("MongoDB Connected");

  app.listen(
    process.env.PORT,
    () => {

      console.log(
        `Server running on port ${process.env.PORT}`
      );

    }
  );

})

.catch((error) => {

  console.log(
    "MongoDB Connection Error:"
  );

  console.log(error);

});

/* ===================================
   MULTER STORAGE
=================================== */

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        "uploads/"
      );

    },

    filename: (
      req,
      file,
      cb
    ) => {

      cb(

        null,

        Date.now() +
        "-" +
        file.originalname.replace(
          /\s/g,
          "-"
        )

      );

    }

  });

const upload =
  multer({ storage });

/* ===================================
   JWT SECRET
=================================== */

const JWT_SECRET =
  process.env.JWT_SECRET;

/* ===================================
   TIMESTAMP CONVERTER
=================================== */

const convertTimestampToSeconds =
  (time) => {

    if (!time) return 0;

    if (!isNaN(time)) {

      return Number(time);

    }

    const parts =
      time.split(":").map(Number);

    if (parts.length === 2) {

      const [
        minutes,
        seconds
      ] = parts;

      return (
        minutes * 60 +
        seconds
      );

    }

    if (parts.length === 3) {

      const [
        hours,
        minutes,
        seconds
      ] = parts;

      return (
        hours * 3600 +
        minutes * 60 +
        seconds
      );

    }

    return 0;

  };

/* ===================================
   WATCH LINK
=================================== */

const generateWatchLink = (
  videoUrl,
  timestamp
) => {

  if (!videoUrl) return "";

  let cleanUrl = videoUrl

    .replace(
      /([&?])t=\d+s?/g,
      ""
    )

    .replace(
      /([&?])start=\d+/g,
      ""
    );

  cleanUrl =
    cleanUrl.replace(
      /[?&]$/,
      ""
    );

  const separator =
    cleanUrl.includes("?")
      ? "&"
      : "?";

  return (
    `${cleanUrl}${separator}t=${timestamp}s`
  );

};

/* ===================================
   REGISTER
=================================== */

app.post(
  "/api/auth/register",
  async (req, res) => {

    try {

      const {
        name,
        email,
        password
      } = req.body;

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {

        return res.status(400).json({

          message:
            "User already exists"

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const newUser =
        new User({

          name,
          email,

          password:
            hashedPassword

        });

      await newUser.save();

      const token =
        jwt.sign(

          {
            id: newUser._id
          },

          JWT_SECRET,

          {
            expiresIn: "7d"
          }

        );

      res.status(201).json({

        token,

        user: {

          id: newUser._id,
          name: newUser.name,
          email: newUser.email

        }

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Registration failed"

      });

    }

  }
);

/* ===================================
   LOGIN
=================================== */

app.post(
  "/api/auth/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res.status(400).json({

          message:
            "Invalid credentials"

        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({

          message:
            "Invalid credentials"

        });

      }

      const token =
        jwt.sign(

          {
            id: user._id
          },

          JWT_SECRET,

          {
            expiresIn: "7d"
          }

        );

      res.json({

        token,

        user: {

          id: user._id,
          name: user.name,
          email: user.email

        }

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Login failed"

      });

    }

  }
);

/* ===================================
   FORGOT PASSWORD
=================================== */

app.post(
  "/api/auth/forgot-password",
  async (req, res) => {

    try {

      const {
        email,
        newPassword
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res.status(404).json({

          message:
            "User not found"

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.json({

        message:
          "Password updated successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Password reset failed"

      });

    }

  }
);

/* ===================================
   GET SNAPS
=================================== */

app.get( "/api/snaps",
  authMiddleware,
  async (req, res) => {
    try {
      const snaps =
        await Snap.find({ userId: req.user.id })
        .sort({
          lastViewed: -1
        });

      const updatedSnaps =
        snaps.map((snap) => {

          return {

            id: snap._id,

            ...snap._doc,

            watchLink:
              generateWatchLink(
                snap.videoUrl,
                snap.timestamp
              ),

            searchLink:
              `https://www.youtube.com/results?search_query=${
                encodeURIComponent(
                  `${snap.title} ${snap.channelName || ""}`
                )
              }`

          };

        });

      res.json(updatedSnaps);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch snaps"

      });

    }

  }
);

/* ===================================
   CREATE SNAP
=================================== */

app.post("/api/snaps",
  authMiddleware,
  upload.single("image"),

  async (req, res) => {

    try {

      console.log(req.body);

      const {
        title,
        videoUrl,
        timestamp,
        note,
        category,
        channelName
      } = req.body;

      const newSnap =
        new Snap({
          userId: req.user.id,
          title: title || "",
          videoUrl: videoUrl || "",
          note: note || "",
          category: category || "",
          channelName: channelName || "",
          timestamp: convertTimestampToSeconds(
              timestamp
            ),

          image:
            req.file
              ? req.file.filename
              : null,

          lastViewed:
            new Date(),

          status:
            "Pending"

        });

      await newSnap.save();

      console.log(
        "Snap Saved"
      );

      res.status(201).json({

        message:
          "Snap added successfully",

        snap: newSnap

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Snap upload failed"

      });

    }

  }
);
/* ===================================
   UPDATE SNAP
=================================== */

app.put(
  "/api/snaps/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const updatedSnap =
        await Snap.findOneAndUpdate(

          {
            _id: req.params.id,
            userId: req.user.id
          },

          req.body,

          {
            new: true
          }

        );

      res.json(updatedSnap);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Update failed"

      });

    }

  }
);

/* ===================================
   DELETE SNAP
=================================== */

app.delete(
  "/api/snaps/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Snap.findOneAndDelete({

        _id: req.params.id,
        userId: req.user.id

      });

      res.json({

        message:
          "Snap deleted"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Delete failed"

      });

    }

  }
);

/* ===================================
   UPDATE LAST VIEWED
=================================== */

app.put(
  "/api/snaps/view/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const updatedSnap =
        await Snap.findOneAndUpdate(

          {
            _id: req.params.id,
            userId: req.user.id
          },

          {
            lastViewed:
              new Date()
          },

          {
            new: true
          }

        );

      res.json(updatedSnap);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "View update failed"

      });

    }

  }
);