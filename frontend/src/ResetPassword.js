import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {

  const { token } = useParams();

  const [password, setPassword] =
    useState("");

  const handleReset =
    async (e) => {

      e.preventDefault();

      try {
await axios.post(
`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`,
{
  password
}
);
        toast.success(
          "Password reset successful"
        );

      } 
      catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message ||
          "Reset failed"
        );

      }

    };

  return (

    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleReset}
        className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-lg"
      >

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg"
        >

          Reset Password

        </button>

      </form>

    </div>

  );

}