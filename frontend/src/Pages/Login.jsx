import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    if (!isValidEmail(email)) {
      return alert("Please enter valid email");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://job-tracker-app-wrwz.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user?.name || "");
        localStorage.setItem("userEmail", data.user?.email || "");

        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert("Enter email");

    if (!isValidEmail(forgotEmail)) {
      return alert("Enter valid email");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://job-tracker-app-wrwz.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (res.ok) {
        alert("Check your email!");
        setShowForgot(false);
      } else {
        alert("Failed");
      }
    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          {!showForgot ? "Login" : "Forgot Password"}
        </h2>

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border rounded-lg pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>

            <button className="w-full bg-gray-900 text-white py-3 rounded-lg">
              {loading ? "Please wait..." : "Login"}
            </button>

            <p
              className="text-sm text-blue-600 text-right cursor-pointer"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </p>

              <p className="text-gray-800 text-sm text-center mt-6">
           Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
          </form>

          
            
         

        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full p-3 border rounded-lg"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />

            <button className="w-full bg-gray-900 text-white py-3 rounded-lg">
              Send Reset Link
            </button>

            <p
              className="text-sm text-gray-600 text-right cursor-pointer"
              onClick={() => setShowForgot(false)}
            >
              Back to Login
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}