require("dotenv").config();

const crypto = require("crypto");
const User = require("./models/User");
const { Resend } = require("resend");
const resend = new Resend(process.env.EMAIL_PASS);

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage
} = require( "multer-storage-cloudinary"
);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const authMiddleware =
  require("./middleware/authMiddleware");
const Snap = require("./models/Snap");


const app = express();

/* ===================================
   MIDDLEWARE
=================================== */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://snap-study-six.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ===================================
   MONGODB CONNECTION
=================================== */

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,

  socketTimeoutMS: 45000

})

.then(() => {

  console.log("MongoDB Connected");
app.get("/test", (req, res) => {
  res.send("Backend working");
});

app.get("/test-mail", async (req, res) => {

  try {

    await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "srivarshiniyamala56@gmail.com",
  subject: "Test Mail",
  html: "<h1>Resend working</h1>"
});

    res.send("Mail sent");

  } catch (error) {

    console.log(error);

    res.send(error);

  }

});

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
   JWT SECRET
=================================== */

const JWT_SECRET =
  process.env.JWT_SECRET;
 

const storage =
  new CloudinaryStorage({

    cloudinary,

    params: {

      folder: "snapstudy",

      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "webp"
      ]

    }

  });

const upload =
  multer({ storage });

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

app.post("/api/auth/register", async (req, res) => {
  try {
    let { name, email, password, secretName } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    secretName = secretName?.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Only Gmail addresses are allowed"
      });
    }

    if (!name || name.length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!secretName || secretName.length < 3) {
      return res.status(400).json({ message: "Secret name must be at least 3 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecretName = await bcrypt.hash(secretName, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    const newUser = new User({ name, email, password: hashedPassword, secretName: hashedSecretName, verificationToken, verificationExpires: Date.now() + 24 * 60 * 60 * 1000

    });
    await newUser.save();
const verifyLink =
`${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

await resend.emails.send({

from:"onboarding@resend.dev",

to:email,

subject:"Verify your SnapStudy Account",

html:`

<h2>Welcome to SnapStudy</h2>

<p>Please verify your email.</p>

<a href="${verifyLink}">
Verify Email
</a>

`

});

    res.status(201).json({

message:
"Registration successful. Please verify your email."

});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ===================================
   LOGIN
=================================== */

app.post(
  "/api/auth/login",
  async (req, res) => {

    try {

      let {
email,
password
}=req.body;

email = email.trim().toLowerCase();

const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Only Gmail addresses are allowed"
  });
}

const user = await User.findOne({
  email
});

      if (!user) {

        return res.status(400).json({

          message:
            "Invalid credentials"

        });

      }

if(!user.isVerified){

return res.status(400).json({

message:
"Please verify your email before logging in."

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

let {
email,
secretName
}=req.body;

email=email.trim().toLowerCase();
secretName=secretName.trim();
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Only Gmail addresses are allowed"
  });
}
if (!email || !secretName) {
  return res.status(400).json({
    message: "Email and secret name required"
  });
}

const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}
 if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email before logging in."
  });
}

if (user.secretName) {
  const isSecretMatch = await bcrypt.compare(secretName, user.secretName);
  if (!isSecretMatch) {
    return res.status(400).json({
      message: "Secret name doesn't match our records"
    });
  }
}


      const resetToken =
        crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpires =
        Date.now() + 3600000;

      await user.save();

      const resetLink =
`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
console.log("Sending reset email...");
      
await resend.emails.send({
  from: "onboarding@resend.dev",
  to: user.email,
  subject: "SnapStudy Password Reset",
  html: `<h2>Reset Password</h2><a href="${resetLink}">Reset Password</a>`
});
      console.log("Reset email sent successfully");

      res.json({
  message: "Reset email sent",
  resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
});

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Email sending failed"
      });

    }

  }
);

/* ===================================
   RESET PASSWORD
=================================== */

app.post(
"/api/auth/reset-password/:token",
async (req, res) => {

  try {

    const { password } =
      req.body;

    const user =
      await User.findOne({

        resetPasswordToken:
          req.params.token,

        resetPasswordExpires:
          { $gt: Date.now() }

      });

    if (!user) {

      return res
        .status(400)
        .json({

          message:
            "Invalid or expired token"

        });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpires =
      undefined;

    await user.save();

    res.json({

      message:
        "Password reset successful"

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Reset failed"

    });

  }

});

/* ===================================
   VERIFY EMAIL
=================================== */

app.get(
"/api/auth/verify/:token",

async(req,res)=>{

try{

const user =
await User.findOne({

verificationToken:
req.params.token,

verificationExpires:{
$gt:Date.now()
}

});

if(!user){

return res.status(400).json({

message:
"Invalid or expired verification link"

});

}

user.isVerified=true;

user.verificationToken=undefined;

user.verificationExpires=undefined;

await user.save();

res.json({

message:
"Email verified successfully"

});

}

catch(error){

console.log(error);

res.status(500).json({

message:
"Verification failed"

});

}

});

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

      if (!title) {
  return res.status(400).json({
    message: "Title required"
  });
}

if (
  !req.file &&
  !videoUrl &&
  !note &&
  !channelName
) {

  return res.status(400).json({

    message:
      "Add YouTube link, channel name, notes, or screenshot"

  });

}
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

          image: req.file
    ? req.file.path
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

      const updatedData = {
        ...req.body
      };

      // convert timestamp properly
      if (req.body.timestamp) {

        updatedData.timestamp =
          convertTimestampToSeconds(
            req.body.timestamp
          );

      }

      const updatedSnap =
        await Snap.findOneAndUpdate(

          {
            _id: req.params.id,
            userId: req.user.id
          },

          updatedData,

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
