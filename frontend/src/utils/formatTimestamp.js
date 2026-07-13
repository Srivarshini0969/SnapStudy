/* ===================================
     FORMAT TIMESTAMP
  =================================== */
  
const formatTimestamp = (seconds) => {
  if (!seconds && seconds !== 0) return "";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // hh:mm:ss
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  // mm:ss
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default formatTimestamp;