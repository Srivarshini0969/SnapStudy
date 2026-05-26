import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tesseract from "tesseract.js";
import SearchYoutube from "youtube-search-api";
function App() {

  /* ===================================
     FORM STATES
  =================================== */

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [image, setImage] = useState(null);

  const [note, setNote] = useState("");

  const [category, setCategory] = useState("");
   const [studyTime, setStudyTime] =
  useState(0);
   
  const [channelName, setChannelName] =
    useState("");

    /* ===================================
   AUTH STATES
=================================== */

const [isLogin, setIsLogin] =
  useState(true);

const [authName, setAuthName] =
  useState("");

const [authEmail, setAuthEmail] =
  useState("");

const [authPassword, setAuthPassword] =
  useState("");

const [user, setUser] =
  useState(null);

  const [darkMode, setDarkMode] =
  useState(false);

const [showForgotPassword, setShowForgotPassword] =
  useState(false);

const [forgotEmail, setForgotEmail] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");

  /* ===================================
     DATA STATES
  =================================== */

  const [snaps, setSnaps] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState("");

  /* ===================================
     EDIT STATES
  =================================== */

  const [editingId, setEditingId] =
    useState(null);

  const [editForm, setEditForm] =
    useState({

      title: "",
      videoUrl: "",
      timestamp: "",
      note: "",
      category: "",
      channelName: ""

    });

  /* ===================================
     FORMAT TIMESTAMP
  =================================== */

  const formatTimestamp = (seconds) => {

    if (!seconds && seconds !== 0)
      return "";

    const hrs =
      Math.floor(seconds / 3600);

    const mins =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    // hh:mm:ss
    if (hrs > 0) {

      return `${hrs}:${
        mins.toString().padStart(2, "0")
      }:${
        secs.toString().padStart(2, "0")
      }`;

    }

    // mm:ss
    return `${mins}:${
      secs.toString().padStart(2, "0")
    }`;
  };

  /* ===================================
   FETCH SNAPS
=================================== */
const fetchSnaps = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(

        `${process.env.REACT_APP_API_URL}/api/snaps`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );

    setSnaps(response.data);

  } catch (error) {

    console.log(
      error.response?.data || error
    );

  }

};

  /* ===================================
     WATCH SNAP
  =================================== */
const watchSnap = async (snap) => {

  try {

    await axios.put(

      `${process.env.REACT_APP_API_URL}/api/snaps/view/${snap._id}`,

      {},

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }

    );

    /* =========================
       DIRECT VIDEO
    ========================= */

    if (snap.videoUrl) {

      window.open(
        snap.videoUrl,
        "_blank"
      );

    }

    /* =========================
       OCR SEARCH
    ========================= */

    else {

      const searchQuery =

        `${snap.title || ""}
         ${snap.category || ""}
         lecture`;

      const youtubeUrl =

        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

      window.open(
        youtubeUrl,
        "_blank"
      );

    }

    fetchSnaps();

  } catch (error) {

    console.log(
      error.response?.data || error
    );

  }

};

/* ===================================
   PAGE LOAD
=================================== */

useEffect(() => {

  const savedUser =
    localStorage.getItem("user");

  if (savedUser) {

    setUser(
      JSON.parse(savedUser)
    );

  }

}, []);

/* ===================================
   FETCH USER SNAPS
=================================== */

useEffect(() => {

  if (user) {

    fetchSnaps();

  }

}, [user]);

/* ===================================
   STUDY TIMER
=================================== */

useEffect(() => {

  if (!user) return;

  const timer =
    setInterval(() => {

      setStudyTime(
        (prev) => prev + 1
      );

    }, 1000);


  return () =>
    clearInterval(timer);

}, [user]);

 /*quote*/
const quotes = [

  "Do it until you achieve it.",

  "Consistency beats motivation.",

  "Small progress every day matters.",

  "Discipline creates success.",

  "Keep learning. Keep building."

];

const [quoteIndex, setQuoteIndex] =
  useState(0);

useEffect(() => {

  const interval = setInterval(() => {

    setQuoteIndex((prev) =>

      (prev + 1) % quotes.length

    );

  }, 3000);

  return () =>
    clearInterval(interval);

}, [quotes.length]);

  /* ===================================
     SEARCH + FILTER
  =================================== */
const filteredSnaps = snaps.filter(
  (snap) => {

    const matchesSearch =

      (
        `${snap.title || ""} ${snap.note || ""}`
      )

      .toLowerCase()

      .includes(
        searchTerm.toLowerCase()
      );

    const matchesCategory =

      selectedCategory === "" ||

      snap.category ===
      selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );

  }
);
    /* ===================================
   SUBJECT ANALYTICS
=================================== */

const analytics = {

  DSA: {
    total: 0,
    completed: 0
  },

  Java: {
    total: 0,
    completed: 0
  },

  DBMS: {
    total: 0,
    completed: 0
  },

  "COMPILER DESIGN": {
    total: 0,
    completed: 0
  },

  "GRAPH THEORY": {
    total: 0,
    completed: 0
  },

  "FRONTEND DEVELOPMENT": {
    total: 0,
    completed: 0
  },

  "OPERATING SYSTEMS": {
    total: 0,
    completed: 0
  },

  "COMPUTER NETWORKS": {
    total: 0,
    completed: 0
  }

};

snaps.forEach((snap) => {
  if (
    analytics[snap.category]
  ) {
    analytics[
      snap.category
    ].total++;
    if (
      snap.status ===
      "Completed"
    ) {
      analytics[
        snap.category
      ].completed++;
    }
  }
});

/* ===================================
   AUTH SUBMIT
=================================== */

const handleAuth = async (e) => {

  e.preventDefault();

  try {

    const endpoint =

      isLogin
        ? "login"
        : "register";

    const payload =

      isLogin
        ? {
            email: authEmail,
            password: authPassword
          }
        : {
            name: authName,
            email: authEmail,
            password: authPassword

          };
const emailRegex =
/^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!emailRegex.test(authEmail)) {

  toast.error(
    "Enter valid email"
  );

  return;
}

if (authPassword.length < 6) {

  toast.error(
    "Password must be at least 6 characters"
  );

  return;
}

  const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/auth/${endpoint}`,
  payload
);


    /*----------------------------------------
      LOGIN SUCCESS
    ----------------------------------------*/

    localStorage.setItem(
      "token",
      response.data.token
    );
    localStorage.setItem(
      "user",

      JSON.stringify(
        response.data.user
      )
    );

    setUser(
      response.data.user
    );
    toast.success(
      isLogin
        ? "Login successful!"
        : "Registration successful!"

    );

    /*----------------------------------------
      RESET FORM
    ----------------------------------------*/

    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
  } catch (error) {
    console.log(
      error.response?.data || error
    );
    toast.error(
      error.response?.data?.message ||
      "Authentication failed"
    );
  }
};

/* ===================================
   FORGOT PASSWORD
=================================== */

const handleForgotPassword =
  async (e) => {
    e.preventDefault();
    try {
     await axios.post(
  `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
  {
    email: forgotEmail,
    newPassword
  }
);

      toast.success(
        "Password updated"
      );

      setShowForgotPassword(false);
      setForgotEmail("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      toast.error(
        "Reset failed"
      );
    }
  };

/* ===================================
   LOGOUT
=================================== */

const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  setUser(null);

  toast.success("Logged out");

};

/* ===================================
   OCR TEXT EXTRACTION
=================================== */

const detectSubject = (text) => {

  const upperText =
    text.toUpperCase();
if (

  upperText.includes("ARRAY") ||
  upperText.includes("STRING") ||
  upperText.includes("RECURSION") ||
  upperText.includes("LINKED") ||
  upperText.includes("STACK") ||
  upperText.includes("QUEUE") ||
  upperText.includes("TREE") ||
  upperText.includes("GRAPH") ||
  upperText.includes("AVL") ||
  upperText.includes("BST") ||
  upperText.includes("SORTING") ||
  upperText.includes("SEARCH") ||
  upperText.includes("HEAP") ||
  upperText.includes("HASH")

) {

  return "DSA";

}

  if (
    upperText.includes("DBMS") ||
    upperText.includes("SQL") ||
    upperText.includes("NORMALIZATION")
  ) {
    return "DBMS";
  }

  if (
    upperText.includes("OS") ||
    upperText.includes("DEADLOCK") ||
    upperText.includes("SCHEDULING")
  ) {
    return "OPERATING SYSTEMS";
  }

  if (
    upperText.includes("CN") ||
    upperText.includes("TCP") ||
    upperText.includes("OSI")
  ) {
    return "COMPUTER NETWORKS";
  }

  if (
    upperText.includes("JAVA") ||
    upperText.includes("OOPS")
  ) {
    return "Java";
  }

  if (
    upperText.includes("COMPILER")
  ) {
    return "COMPILER DESIGN";
  }
if (
  upperText.includes("REACT") ||
  upperText.includes("HTML") ||
  upperText.includes("CSS") ||
  upperText.includes("JAVASCRIPT")
) {
  return "FRONTEND DEVELOPMENT";
}
  return "";

};

const extractTextFromImage =
  async (file) => {

    try {

      toast.loading(
        "Detecting topic..."
      );

      const result =
        await Tesseract.recognize(
          file,
          "eng"
        );

      toast.dismiss();

      const rawText =
        result.data.text;
const cleanedText =
  rawText

    // remove special chars
    .replace(/[^a-zA-Z0-9\s]/g, " ")

    // remove extra spaces
    .replace(/\s+/g, " ")

    .split("\n")

    .map((line) =>
      line.trim()
    )

    .filter(
      (line) =>

        line.length > 3 &&

        !line.includes("www") &&

        !line.includes(".com") &&

        !line.includes("http")
    )[0];
   

      if (cleanedText) {
     setTitle( cleanedText);
     toast.success(
  `Topic Detected: ${cleanedText}`
);
        await fetchYoutubeVideo(
  `${cleanedText} ${detectSubject(cleanedText)}`
);

        const detectedSubject =
          detectSubject(
            cleanedText
          );

        if (detectedSubject) {

          setCategory(
            detectedSubject
          );
toast.success(
  `Subject Detected: ${detectedSubject}`
);
        }

        toast.success(
          "Topic detected!"
        );

      }

    } catch (error) {

      toast.dismiss();

      console.log(error);

      toast.error(
        "OCR failed"
      );
    }
  };

  const fetchYoutubeVideo =
  async (topic) => {

    try {

      const result =
        await SearchYoutube.GetListByKeyword(
          `${topic} full lecture`,
          false,
          1
        );

      const firstVideo =
        result.items[0];

      if (firstVideo) {

        const videoId =
          firstVideo.id;

        const videoLink =

          `https://www.youtube.com/watch?v=${videoId}`;

        setVideoUrl(
          videoLink
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

/* ===================================
   UPLOAD SNAP
=================================== */

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!title.trim() && !image) {

  toast.error(
    "Add topic title or upload screenshot"
  );

  return;
}

if (!category && !image) {

  toast.error(
    "Please select subject or upload screenshot for auto-detection"
  );

  return;
}

if (!title.trim()) {

  toast.error(
    "Topic title required"
  );

  return;
}

if (!category) {

  toast.error(
    "Please select subject"
  );

  return;
}
const hasImage = !!image;
  const formData = new FormData();
  formData.append(
    "title",
    title
  );

  formData.append(
    "videoUrl",
    videoUrl
  );

  formData.append(
    "timestamp",
    timestamp
  );

  formData.append(
    "note",
    note
  );

  formData.append(
    "category",
    category
  );

  formData.append(
    "channelName",
    channelName
  );

  if (image) {

    formData.append(
      "image",
      image
    );
  }
 try {

  toast.loading(
    "Uploading snap..."
  );

  await axios.post(
  `${process.env.REACT_APP_API_URL}/api/snaps`,
  formData,
  {
    headers: {
      Authorization:
        `Bearer ${localStorage.getItem("token")}`,

      ...(hasImage && {
        "Content-Type":
          "multipart/form-data"
      })
    }
  }
);

  toast.dismiss();

  toast.success(
    "Snap uploaded successfully!"
  );

  fetchSnaps();

  // RESET FORM

  setTitle("");
  setVideoUrl("");
  setTimestamp("");
  setImage(null);
  setNote("");
  setCategory("");
  setChannelName("");

} catch (error) {

  toast.dismiss();

  console.log(
    error.response?.data || error
  );

  toast.error(
    "Upload failed"
  );

}
};

  /* ===================================
     START EDIT
  =================================== */

  const startEdit = (snap) => {
    setEditingId(snap._id);
    
    setEditForm({
      title: snap.title || "",
      videoUrl:
        snap.videoUrl || "",
      timestamp:
        formatTimestamp(
          snap.timestamp
        ),
      note: snap.note || "",
      category:
        snap.category || "",
      channelName:
        snap.channelName || ""
    });
  };

  /* ===================================
     UPDATE SNAP
  =================================== */

const updateSnap = async (id) => {

  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/snaps/${id}`,
      editForm,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    toast.success(
      "Snap updated successfully!"
    );
    setEditingId(null);
    fetchSnaps();
  } catch (error) {
    console.log(
      error.response?.data || error
    );

    toast.error(
      "Update failed"
    );
  }
};
  const updateStatus = async ( id,status) => {
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/snaps/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    fetchSnaps();
    toast.success(
      "Status updated"
    );
  } catch (error) {
    console.log(
      error.response?.data || error
    );
    toast.error(
      "Status update failed"
    );
  }
};
  /* ===================================
     DELETE SNAP
  =================================== */

  const deleteSnap = async (id) => {
    try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/snaps/${id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      toast.success("Snap deleted");
      fetchSnaps();
    } catch (error) {
      console.log(
        error.response?.data || error
      );
      toast.error("Delete failed");
    }
  };
  return (
<>
      <Toaster position="top-right" />
      <div className={`min-h-screen px-6 py-10 transition-all duration-300
    ${
      darkMode
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-black"
    }
  `}
>

        {/* HEADER + TOGGLE */}
        <div className="flex justify-end mb-4">
  <button
    onClick={() =>
      setDarkMode(!darkMode)
    }
    className="bg-black text-white px-4 py-2 rounded-lg"
  >
    {
      darkMode
        ? "☀️ Light Mode"
        : "🌙 Dark Mode"
    }
  </button>
</div>
    <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-600">
            📚 SnapStudy
          </h1>
          <p
  className={`mt-3 text-lg
    ${
      darkMode
        ? "text-gray-300"
        : "text-gray-600"
    }
  `}
>
    Smart Lecture Capture System
          </p>
        </div>

   {/* AUTH / USER SECTION */}

<div className="max-w-7xl mx-auto mb-10 px-4">
  {
    !user ? (
     <div className={`p-6 rounded-2xl shadow-lg

    ${
      darkMode
        ? "bg-gray-800 text-white"
        : "bg-white text-black"
    }

  `}
>
        <h2 className="text-2xl font-bold mb-5 text-center">
          {
            isLogin
              ? "Login"
              : "Register"
          }
        </h2>
        {
  showForgotPassword ? (

    <form
      onSubmit={handleForgotPassword}
      className="flex flex-col gap-4"
    >

      <input
        type="email"
        placeholder="Enter Email"
        value={forgotEmail}
        onChange={(e) =>
          setForgotEmail(
            e.target.value
          )
        }
        className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
      />

      <input
        type="password"
        placeholder="Enter New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(
            e.target.value
          )
        }
        className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-lg"
      >
        Reset Password
      </button>

      <button
        type="button"
        onClick={() =>
          setShowForgotPassword(false)
        }
        className="text-blue-600"
      >
        Back to Login
      </button>

    </form>

  ) : (

    <form
      onSubmit={handleAuth}
      className="flex flex-col gap-4"
    >
{
        !isLogin && (
          <input
            type="text"
            placeholder="Enter Name"
            value={authName}
            onChange={(e) =>
              setAuthName(
                e.target.value
              )
            }
            className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
          />

        )

      }

      <input
        type="email"
        placeholder="Enter Email"
        value={authEmail}
        onChange={(e) =>
          setAuthEmail(
            e.target.value
          )
        }
        className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}  
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={authPassword}
        onChange={(e) =>
          setAuthPassword(
            e.target.value
          )
        }
        className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}  
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-lg"
      >
        {
          isLogin
            ? "Login"
            : "Register"
        }
      </button>
      {
        isLogin && (
          <button
            type="button"
            onClick={() =>
              setShowForgotPassword(true)
            }
            className="text-blue-600"
          >
            Forgot Password?
          </button>

        )

      }

    </form>

  )
}
   <p className="text-center mt-4">
          {
            isLogin
              ? "Don't have an account?"
              : "Already have an account?"
          }
          <button
         onClick={() =>
      setIsLogin(!isLogin)
            }
  className="text-blue-600 ml-2"
      >
            {
              isLogin
                ? "Register"
                : "Login"
            }
          </button>
        </p>
      </div>
   ) : (

  <div className="space-y-8 w-full">

    {/* USER CARD + LOGOUT */}

    <div
  className={`p-5 rounded-2xl shadow-lg text-center

    ${
      darkMode
        ? "bg-gray-800 text-white"
        : "bg-white text-black"
    }
  `}
>
      <h2 className="text-2xl font-bold mb-2">
        Welcome,
        {" "}
        {user.name}
      </h2>
      <p className={`mb-4

  ${
    darkMode
      ? "text-gray-300"
      : "text-gray-600"
  }
`}>
        {user.email}
      </p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-5 py-2 rounded-lg"
      >
        Logout
      </button>
     <div
  className={`mt-6 text-center transition-all duration-1000

    ${
      darkMode
        ? "text-yellow-300"
        : "text-blue-700"
    }
  `}
>

  <p className="text-2xl font-bold italic tracking-wide">
    "{quotes[quoteIndex]}"
  </p>
</div>

</div>
 {/* UPLOAD FORM  */}

<div
  className={` w-full max-w-3xl mx-auto p-6 rounded-2xl shadow-lg
    ${
      darkMode
        ? "bg-gray-800 text-white"
        : "bg-white text-black"
    }
  `}
>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
 <div
  className={`rounded-2xl p-6 shadow-lg space-y-5
    ${
      darkMode
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200"
        : "bg-gradient-to-br from-blue-50 to-white text-gray-700"
    }
  `}
>

  <h3 className="text-2xl font-bold text-center text-blue-500 animate-pulse">
    🚀 How SnapStudy Works
  </h3>

  <div className="space-y-4 text-sm md:text-base leading-7">

    <div className="border-l-4 border-blue-500 pl-4 hover:scale-105 transition duration-300">
      🎥 <span className="font-bold">
        Save Lectures
      </span>
      <br />
      Add title + YouTube link + subject to instantly revisit lectures later.
      Add channel name for more accurate lecture matching.
    </div>

    <div className="border-l-4 border-green-500 pl-4 hover:scale-105 transition duration-300">
      ⏱️ <span className="font-bold">
        Resume from Timestamp
      </span>
      <br />
      Add timestamps like 52:14 and continue exactly where you stopped watching.
    </div>

    <div className="border-l-4 border-yellow-500 pl-4 hover:scale-105 transition duration-300">
      🖼️ <span className="font-bold">
        Smart OCR Detection
      </span>
      <br />
      Upload screenshots/slides.
      SnapStudy automatically detects topics and suggests YouTube lectures.
    </div>

    <div className="border-l-4 border-pink-500 pl-4 hover:scale-105 transition duration-300">
      📝 <span className="font-bold">
        Quick Revision Notes
      </span>
      <br />
      Save formulas, concepts, revision points and important learning notes.
    </div>

  </div>

</div>
        <input
          type="text"
          placeholder="Topic title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
        />
        <input
          type="text"
          placeholder="YouTube lecture link"
          value={videoUrl}
          onChange={(e) =>
            setVideoUrl(e.target.value)
          }
          className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
        />
        <input
          type="text"
          placeholder="Optional channel name for accurate lecture matching"
          value={channelName}
          onChange={(e) =>
            setChannelName(e.target.value)
          }
          className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
        />
        <input
          type="text"
          placeholder="Resume timestamp (e.g., 52:14)"
          value={timestamp}
          onChange={(e) =>
            setTimestamp(e.target.value)
          }
         className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
        />
   <textarea
  placeholder="Quick revision notes, formulas..."
  value={note}
  onChange={(e) =>
    setNote(e.target.value)
  }
  className={`border p-3 rounded-lg h-32 resize-none
    ${
      darkMode
        ? "bg-gray-700 text-white"
        : "bg-white text-black"
    }
  `}
/>
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        className={`border p-3 rounded-lg
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
        >
          <option value="">
            Select Subject *
          </option>
      <option value="DSA">
            DSA
          </option>
<option value="COMPILER DESIGN">
            COMPILER DESIGN
          </option>
          <option value="Java">
            Java
          </option>
<option value="GRAPH THEORY">
            GRAPH THEORY
          </option>
          <option value="DBMS">
            DBMS
          </option>
<option value="FRONTEND DEVELOPMENT">
            FRONTEND DEVELOPMENT
          </option>
  <option value="BACKEND DEVELOPMENT">
  BACKEND DEVELOPMENT
</option>

<option value="AI/ML">
  AI/ML
</option>
          <option value="OPERATING SYSTEMS">
            OPERATING SYSTEMS
          </option>
          <option value="COMPUTER NETWORKS">
            COMPUTER NETWORKS
          </option>
        </select>
       <input
  type="file"
 onChange={async (e) => {
  const file =
    e.target.files[0];
  setImage(file);
  if (file) {
    await extractTextFromImage(file);
  }
}}
  className="border p-2 rounded-lg"
/>

{
  image && (

    <img
      src={URL.createObjectURL(image)}
      alt="preview"
      className="w-full h-48 object-cover rounded-xl"
    />

  )
}

<button
  type="submit"
  className=" bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
>
  Upload Snap
</button>
      </form>
    </div>
  </div>
    )
  }
</div>
        {user && (
<> 

         {/* SEARCH + FILTERS */}

        <div className="max-w-lg mx-auto mt-10">
          <input
            type="text"
            placeholder="Search snaps..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
   className={`w-full border p-3 rounded-xl
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
          />
        </div>

        {/* FILTERS  */}

  <div className="flex flex-wrap justify-center gap-3 mt-6">
          {
         [
              "All",
              "DSA",
              "Java",
              "DBMS",
              "OPERATING SYSTEMS",
              "GRAPH THEORY",
              "COMPUTER NETWORKS",
              "COMPILER DESIGN",
              "FRONTEND DEVELOPMENT",
              "BACKEND DEVELOPMENT",
                 "AI/ML",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setSelectedCategory(
                    item === "All"
                      ? ""
                      : item
                  )
                }
className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {item}
              </button>
            ))
          }
        </div>

        {/* SNAPS  */}

      <div className="mt-14">

        {/* ANALYTICS */}

<div className="max-w-7xl mx-auto mb-14">
  <h2 className="text-3xl font-bold text-center mb-8">
    Study Analytics
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
    {
      Object.entries(
        analytics
      ).map(
        ([subject, data]) => (
          <div
            key={subject}
    className={`rounded-2xl shadow-lg p-5 text-center
  ${
    darkMode
      ? "bg-gray-800 text-white"
      : "bg-white text-black"
  }
`}
          >
       <h3 className="text-2xl font-bold text-blue-600 mb-3">
          {subject}
          </h3>
    <p className={`mb-2
  ${
    darkMode
      ? "text-gray-300"
      : "text-gray-700"
  }
`}>
        Total Topics:
              {" "}
        {data.total}
          </p>
    <p className={`text-green-600 font-semibold
  ${
    darkMode
      ? "text-green-400"
      : "text-green-600"
  }
`}>
        Completed:
  {" "}
     {data.completed}
    </p>
    </div>
        )
      )
    }
  </div>
</div>
<div
  className={`text-center mb-8 text-lg font-semibold

    ${
      darkMode
        ? "text-yellow-300"
        : "text-blue-700"
    }

  `}
>
  Study Time:
  {" "}
  {
    Math.floor(studyTime / 60)
  }
  min
  {" "}
  {
    studyTime % 60
  }
  sec

</div>

  {/* CONTINUE WATCHING + RECENTLY UPLOADED */}

  <h2 className="text-3xl font-bold mb-6 text-center">
    Continue Watching
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto mb-14">
    {
 snaps
  .filter(
    (snap) =>

      snap.videoUrl &&
      snap.lastViewed

  )
  .sort(
    (a, b) =>

      new Date(b.lastViewed) -
      new Date(a.lastViewed)

  )
  .slice(0, 10)
  .map((snap) => (
     <div
 key={snap._id}
 className={` rounded-2xl shadow-lg p-5

  ${
    darkMode
      ? "bg-gray-800 text-white"
      : "bg-white text-black"
  }
`}
     >
   <h3 className="text-xl font-bold mb-3">
     {snap.title}
       </h3>
            {
     snap.timestamp > 0 && (
      <p className={`mb-4

  ${
    darkMode
      ? "text-gray-300"
      : "text-gray-600"
  }
`}>
      ⏱ Resume at:
       {" "}
    {
     formatTimestamp(
    snap.timestamp
    )
       }
        </p>
      )
          }
      <button
 onClick={() =>  watchSnap(snap)
      }
 className="bg-green-500 text-white px-4 py-2 rounded-lg"
     >
  {
  snap.videoUrl
    ? "Continue"
    : "Resume Search"
}
   </button>
          </div>
        ))
    }
  </div>

  {/* UPLOADED SNAPS */}

  <h2 className="text-3xl font-bold mb-8 text-center">
    Uploaded Snaps
  </h2>
          {
            filteredSnaps.length ===
              0 && (
  <p className="text-center text-gray-500">
                No snaps found
              </p>
            )
          }
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
       {
    filteredSnaps.map(
      (snap) => (
   <div
  key={snap._id}
  className={`rounded-2xl shadow-lg overflow-hidden min-h-[420px] 
    p-2 hover:shadow-2xl transition duration-300
    ${
      darkMode
        ? "bg-gray-800 text-white"
        : "bg-white text-black"
    }
  `}
>
 {
     snap.image && (
        <img
        src={snap.image}
         alt="snap"
      className="w-full h-56 object-cover"
      />
  )
 }
  <div className="p-5">
    {
    editingId === snap._id ? (

  <div className="flex flex-col gap-3">

    <input
      type="text"
      value={editForm.title}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          title: e.target.value
        })
      }
      className="border p-2 rounded text-black"
    />

    <textarea
      value={editForm.note}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          note: e.target.value
        })
      }
      className="border p-2 rounded text-black"
    />

    <select
      value={editForm.category}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          category: e.target.value
        })
      }
      className="border p-2 rounded text-black"
    >

      <option value="DSA">
        DSA
      </option>

      <option value="Java">
        Java
      </option>

      <option value="DBMS">
        DBMS
      </option>

      <option value="GRAPH THEORY">
        GRAPH THEORY
      </option>

      <option value="COMPILER DESIGN">
        COMPILER DESIGN
      </option>

      <option value="OPERATING SYSTEMS">
        OPERATING SYSTEMS
      </option>

      <option value="COMPUTER NETWORKS">
        COMPUTER NETWORKS
      </option>

      <option value="FRONTEND DEVELOPMENT">
        FRONTEND DEVELOPMENT
      </option>

      <option value="BACKEND DEVELOPMENT">
  BACKEND DEVELOPMENT
</option>

<option value="AI/ML">
  AI/ML
</option>

    </select>
<button
  onClick={() =>
    updateSnap(snap._id)
  }
  className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
  Save
</button>
  
    <button
      onClick={() =>
        setEditingId(null)
      }
      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
    >
      Cancel
    </button>

  </div>

) : (
 <>
<h3 className="text-2xl font-semibold mb-3">
     {snap.title}
      </h3>
       {
 snap.timestamp >
  0 && (
<p className={`mb-2
    ${
      darkMode
        ? "text-gray-300"
        : "text-gray-600"
    }
  `}
>
         ⏱ Timestamp:
      {" "}
     {formatTimestamp(
    snap.timestamp
 )
 }
     </p>
      )
 }
 {
 snap.category && (
<p className="text-sm text-blue-600 font-semibold mb-2">
        📘 Subject: {" "}
   {
            snap.category
             }
       </p>
   )
  }
  {
 snap.note && (
 <p
  className={`mb-4 whitespace-pre-wrap
    ${
      darkMode
        ? "text-gray-300"
        : "text-gray-700"
    }
  `}
>
             {snap.note}
     </p>
 )
  }
 <div className="flex flex-wrap gap-2 items-center">
<button

  onClick={() => {

    if (snap.videoUrl) {

      window.open(
        snap.watchLink,
        "_blank"
      );

    } else {

      const searchQuery =

        `${snap.title || ""}
         ${snap.channelName || ""}
         ${snap.category || ""}
         lecture`;

      const youtubeUrl =

        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

      window.open(
        youtubeUrl,
        "_blank"
      );

    }

  }}

  className="bg-green-500 text-white px-4 py-2 rounded-lg"

>

  {
    snap.videoUrl
      ? "Continue"
      : "Resume Search"
  }

</button>


 <button
     onClick={() =>
       startEdit(
     snap
       )
    }
       className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
      >
    Edit
          </button>
          
      {/* STATUS DROPDOWN */}

  <select
    value={
      snap.status || "Pending"
    }
    onChange={(e) =>
      updateStatus(
        snap._id,
        e.target.value
      )
    }
   className={`w-full border rounded px-3 py-2 text-sm
  ${
    darkMode
      ? "bg-gray-700 text-white"
      : "bg-white text-black"
  }
`}
  >

    <option value="Pending">
      Pending
    </option>

    <option value="Revising">
      Revising
    </option>

    <option value="Completed">
      Completed
    </option>

  </select>
         <button
     onClick={() =>
         deleteSnap(
        snap._id
            )
        }
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
     Delete
       </button>
 </div>
 </>
   )
}
  </div>
 </div>

                )
              )

            }

           </div>

        </div>

      </>

        )}

    </div>

    </>

  );

}

export default App;