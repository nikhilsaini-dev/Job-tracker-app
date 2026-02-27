import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        //  Save token
        localStorage.setItem("token", data.token);

        // Save user info
        localStorage.setItem("userName", data.user.name );
        localStorage.setItem("userEmail", data.user.email );

        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert("Please enter your registered email");

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Check your email for password reset link!");
        setShowForgot(false);
      } else {
        alert(data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {!showForgot ? "Login" : "Forgot Password"}
        </h2>

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className={`w-full bg-gray-900 text-white font-semibold py-3 rounded-lg shadow-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Login"}
            </motion.button>

            <p
              className="text-sm text-blue-600 cursor-pointer hover:underline text-right"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className={`w-full bg-gray-900 text-white font-semibold py-3 rounded-lg shadow-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>

            <p
              className="text-sm text-gray-600 cursor-pointer hover:underline text-right"
              onClick={() => setShowForgot(false)}
            >
              Back to Login
            </p>
          </form>
        )}

        {!showForgot && (
          <p className="text-gray-600 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/" className="text-gray-900 font-semibold hover:underline">
              Register
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}