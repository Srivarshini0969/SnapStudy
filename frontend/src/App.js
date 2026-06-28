import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

import ResetPassword from "./ResetPassword";
import { Routes, Route } from "react-router-dom";
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
const [registerSecretName,
  setRegisterSecretName] =
  useState("");

const [forgotSecretName,
  setForgotSecretName] =useState("");
    const [image, setImage] = useState(null);

  const [note, setNote] = useState("");

  const [category, setCategory] = useState("");
   const [studyTime, setStudyTime] =
  useState(0);
   
  const [channelName, setChannelName] =
    useState("");
  const [resetLink, setResetLink] = useState("");
    
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

 try{

   if(savedUser){

      setUser(
        JSON.parse(savedUser)
      );

   }

 }catch{

   localStorage.removeItem("user");

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

`${snap.title || ""} ${snap.note || ""}
${snap.category || ""}`
.toLowerCase()
.includes(searchTerm.toLowerCase());

     

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

  "DSA": {
    total: 0,
    completed: 0
  },

  "JavaScript": {
    total: 0,
    completed: 0
  },

  "Python": {
  total:0,
  completed:0
},

"Java": {
  total:0,
  completed:0
},

"ReactJS": {
  total:0,
  completed:0
},

"NodeJS": {
  total:0,
  completed:0
},

  "DBMS": {
    total: 0,
    completed: 0
  },

  "COMPILER DESIGN": {
    total: 0,
    completed: 0
  },
  
  "BACKEND DEVELOPMENT": {
    total:0,
    completed:0
},

"AI/ML":{
    total:0,
    completed:0
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

const barData = Object.entries(analytics).map(
  ([subject, data]) => ({
    subject,
    completed: data.completed,
    pending: data.total - data.completed,
  })
);

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
    password: authPassword,
    secretName: registerSecretName
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
    setRegisterSecretName("");
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
const handleForgotPassword = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
      { 
        email: forgotEmail,
        secretName: forgotSecretName
       }
    );
    setResetLink(response.data.resetLink);
    toast.success("Reset link generated!");
    setForgotEmail("");
    setForgotSecretName("");
  } catch (error) {
    console.log(error);
    toast.error("Reset failed");
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
  upperText.includes("PYTHON")
) {
  return "Python";
}
  if (
    upperText.includes("JAVA") ||
upperText.includes("OOPS") ||
upperText.includes("JVM") ||
upperText.includes("JDK")
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
upperText.includes("JSX") ||
upperText.includes("HOOK") ||
upperText.includes("COMPONENT")
){
 return "ReactJS";
}
if (
 upperText.includes("JAVASCRIPT")
){
 return "JavaScript";
}

if (
 upperText.includes("HTML") ||
 upperText.includes("CSS")
){
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
.replace(/[^a-zA-Z0-9\s]/g," ")
.replace(/\s+/g," ")
.trim();
     if (cleanedText) {

  const lines = rawText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 3);

  const stopWords = [
    "department",
    "university",
    "college",
    "faculty",
    "semester",
    "academic",
    "year",
    "session",
    "lecture",
    "page",
    "www",
    "http",
    "copyright",
    "slide",
    "unit"
  ];

  const topic =
    lines.find(line => {

      const lower = line.toLowerCase();

      if (line.length < 5 || line.length > 60)
        return false;

      if (stopWords.some(word => lower.includes(word)))
        return false;

      const words = line.split(/\s+/);

      return words.length >= 2 && words.length <= 8;

    }) || lines[0];

  const detectedSubject =
    detectSubject(cleanedText);

  setTitle(topic);

  if (detectedSubject) {
    setCategory(detectedSubject);

    toast.success(
      `Subject Detected: ${detectedSubject}`
    );
  }

  toast.success(
    `Detected Topic: ${topic}`
  );

  if (topic && topic.length > 3) {
    await fetchYoutubeVideo(
      topic,
      detectedSubject
    );
  }

}
        
      }

    catch (error) {

      toast.dismiss();

      console.log(error);

      toast.error(
        "OCR failed"
      );
    }
  };

const fetchYoutubeVideo = async (topic, subject = "") => {

  const loading = toast.loading("Searching YouTube lecture...");

  try {
const searchQuery =
  `${topic} ${subject}`.trim() + " full lecture";

const result =
  await SearchYoutube.GetListByKeyword(
    searchQuery,
    false,
    1
  );
    
    console.log("Search Query:",searchQuery);
    console.log("YouTube Result:", result);
    console.log("Items:", result?.items);
    console.log("First Video:", result?.items?.[0]);

    toast.dismiss(loading);

    const firstVideo = result?.items?.[0];

    if (!firstVideo) {

      toast.error("No lecture found.");

      return;
    }

    const videoId =
  firstVideo.id?.videoId ||
  firstVideo.videoId ||
  firstVideo.id;
   if (!videoId) {
  toast.error("Invalid YouTube result.");
  return;
}
    const videoLink =
      `https://www.youtube.com/watch?v=${videoId}`;

    setVideoUrl(videoLink);

  } catch (error) {

    toast.dismiss(loading);

    console.error("YouTube Error:", error);

    toast.error(
      "Couldn't find a YouTube lecture. You can add the link manually."
    );

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



if (!title.trim()) {

  toast.error(
    "Topic title required"
  );

  return;
}


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

  if (category) {

  formData.append(
    "category",
    category
  );

}

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
 `Bearer ${localStorage.getItem("token")}`
}     
      })
    
  

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

} 
catch (error) {

  toast.dismiss();

  console.log("UPLOAD ERROR:", error);

  console.log("SERVER:", error.response);

  console.log("DATA:", error.response?.data);

  toast.error(
    error.response?.data?.message || "Upload failed"
  );
    }
        
  }

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
    toast.success(`Marked as ${status}`);
fetchSnaps();
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
toast.success("Snap updated successfully!");

setEditingId(null);

setEditForm({
  title: "",
  videoUrl: "",
  timestamp: "",
  note: "",
  category: "",
  channelName: ""
});
      fetchSnaps();
    } catch (error) {
      console.log(
        error.response?.data || error
      );
      toast.error("Delete failed");
    }
  };

  const completedCount = snaps.filter(
  (snap) => snap.status === "Completed"
).length;

const pendingCount = snaps.filter(
  (snap) => snap.status !== "Completed"
).length;

const studyMinutes = Math.floor(studyTime / 60);

const pieData = [
  {
    name: "Completed",
    value: completedCount,
  },
  {
    name: "Pending",
    value: pendingCount,
  },
];

const COLORS = [
  "#22c55e",
  "#f59e0b",
];

  return (

<Routes>

<Route
  path="/"
  element={
<>
  <div className="background-blur">
  <div className="blur-circle blur1"></div>
  <div className="blur-circle blur2"></div>
  <div className="blur-circle blur3"></div>
</div>

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

<div className="w-full max-w-7xl mx-auto mb-10 px-4">  {
    !user ? (
<div className={`w-full max-w-2xl mx-auto p-6 rounded-2xl shadow-lg
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
  type="text"
  placeholder="Enter your secret name"
value={forgotSecretName}
onChange={(e) =>
  setForgotSecretName(e.target.value)
}
  className={`border p-3 rounded-lg
    ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}
  `}
/>
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

    

      <button
        type="submit"
className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-3 rounded-lg"      >
        Reset Password
      </button>
      
{resetLink && (
  
    <a href={resetLink}
    className="bg-green-500 text-white py-3 rounded-lg text-center block"
  >
    Click here to Reset Password
  </a>
)}
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
      {
  !isLogin && (
    <input
      type="text"
      placeholder="Enter Secret Name"
value={registerSecretName}
onChange={(e) =>
  setRegisterSecretName(e.target.value)
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
className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-3 rounded-lg"      >
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
<div className="flex flex-col md:flex-row justify-between items-center">

  {/* LEFT */}

  <div className="flex items-center gap-5">

    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg
      ${
        darkMode
          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
          : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
      }`}
    >
{user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>

    <div className="text-left">

      <h2 className="text-3xl font-bold">

        👋 Welcome,

        <span className="text-blue-500">
          {" "}
          {user.name}
        </span>

      </h2>

      <p
        className={`mt-1 ${
          darkMode
            ? "text-gray-300"
            : "text-gray-600"
        }`}
      >
        {user.email}
      </p>

    </div>

  </div>

  {/* RIGHT */}

  <div className="mt-6 md:mt-0 flex gap-4">

    <div
      className={`px-5 py-3 rounded-xl shadow ${
        darkMode
          ? "bg-orange-900"
          : "bg-orange-50"
      }`}
    >
      <p className="text-2xl">🔥</p>

      <p className="font-bold">
         {completedCount}
      </p>

      <p className="text-sm">
         Completed
      </p>

    </div>

    <div
      className={`px-5 py-3 rounded-xl shadow ${
        darkMode
          ? "bg-blue-900"
          : "bg-blue-50"
      }`}
    >
      <p className="text-2xl">
        📚
      </p>

      <p className="font-bold">
        {snaps.length}
      </p>

      <p className="text-sm">
        Snaps
      </p>

    </div>

  </div>

</div>

{/* Rotating Quote */}

<div
  className={`mt-6 text-center transition-all duration-1000
  ${
    darkMode
      ? "text-yellow-300"
      : "text-blue-700"
  }`}
>

<p className="text-xl italic font-semibold min-h-[32px]">

    "{quotes[quoteIndex]}"

  </p>

</div>

{/* Logout */}

<div className="mt-6 flex justify-center">

<button

onClick={logout}

className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition duration-300"
>

Logout

</button>

</div>
</div>

 {/* UPLOAD FORM  */}

<div
  className={` w-full max-w-5xl mx-auto p-6 rounded-2xl shadow-lg
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
            Select Subject (optional)
          </option>
      <option value="DSA">
            DSA
          </option>
<option value="COMPILER DESIGN">
            COMPILER DESIGN
          </option>
          <option value="JavaScript">
            JavaScript
          </option>
 <option value="Python">
  Python
</option>
<option value="ReactJS">
  ReactJS
</option>
<option value="Java">
  Java
</option>

<option value="NodeJS">
  NodeJS
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
              "Python",
              "Java",
              "DBMS",
              "OPERATING SYSTEMS",
              "JavaScript",
              "ReactJS",
              "NodeJS",
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
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

  <div className={`rounded-2xl shadow-xl p-6 hover:scale-110 transition duration-300
${
darkMode
? "bg-gray-800 text-white"
: "bg-white"
}`}
>
    <p className="text-4xl mb-2">📚</p>
<h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        {snaps.length}
    </h2>
    <p className="text-gray-500">
      Total Snaps
    </p>
  </div>

  <div className={`rounded-2xl shadow-lg p-6 hover:scale-105 transition
${
darkMode
? "bg-gray-800 text-white"
: "bg-white"
}`}
  >
    <p className="text-4xl mb-2">✅</p>
    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
      {completedCount}
    </h2>
    <p className="text-gray-500">
      Completed
    </p>
  </div>

  <div className={`rounded-2xl shadow-lg p-6 hover:scale-105 transition
${
darkMode
? "bg-gray-800 text-white"
: "bg-white"
}`}
  >
    <p className="text-4xl mb-2">⏳</p>
    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
      {pendingCount}
    </h2>
    <p className="text-gray-500">
      Pending
    </p>
  </div>

  <div className={`rounded-2xl shadow-xl p-6 hover:scale-110 transition duration-300
${
darkMode
? "bg-gray-800 text-white"
: "bg-white"
}`}
>
    <p className="text-4xl mb-2">⏱️</p>
    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
      {studyMinutes}m </h2>
    <p className="text-gray-500">
      Study Time
    </p>
  </div>

</div>
  </div>

        {/* ANALYTICS */}
<div className="max-w-7xl mx-auto my-14">

<h2 className="text-3xl font-bold text-center mb-8">
📊 Study Dashboard
</h2>

<div className="grid md:grid-cols-2 gap-8">

{/* PIE CHART */}

<div
className={`rounded-2xl shadow-xl p-6
${
darkMode
? "bg-gray-800"
: "bg-white"
}`}
>

<h3 className="text-xl font-bold mb-5 text-center">
Completed vs Pending
</h3>

<div style={{ width: "100%", height: 350 }}>

<ResponsiveContainer>

<PieChart>

<Pie
data={pieData}
cx="50%"
cy="50%"
outerRadius={120}
dataKey="value"
label
>

{
pieData.map((entry,index)=>(
<Cell
key={index}
fill={COLORS[index]}
/>
))
}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

{/* BAR CHART */}

<div
className={`rounded-2xl shadow-xl p-6
${
darkMode
? "bg-gray-800"
: "bg-white"
}`}
>

<h3 className="text-xl font-bold mb-5 text-center">
Subject Wise Progress
</h3>

<div style={{ width: "100%", height: 350 }}>

<ResponsiveContainer>

<BarChart
data={barData}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="subject"/>

<YAxis/>

<Tooltip/>

<Legend/>

<Bar
dataKey="completed"
fill="#22c55e"
/>

<Bar
dataKey="pending"
fill="#f59e0b"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

</div>

</div>

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

      <option value="Python">
        Python
      </option>

       <option value="Java">
        Java
      </option>

      <option value="JavaScript">
        JavaScript
      </option>

      <option value="ReactJS">
        ReactJS
      </option>

      <option value="NodeJS">
        NodeJS
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
  onClick={() => watchSnap(snap)}
  className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
  {snap.videoUrl ? "Continue" : "Resume Search"}
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

}
/>

<Route
    path="/reset-password/:token"
    element={<ResetPassword />}
/>

</Routes>

);

}
export default App;