import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/verify/${token}`
        );

        setMessage(response.data.message || "Email verified successfully");
        toast.success("Email verified successfully");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Verification failed";

        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmail();
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-3">Email Verification</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
