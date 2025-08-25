import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HomeButton from "./HomeButton";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios"

const Signup = () => {
  const { setLoggedIn } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(pass)) {
      setResult(
        "Password must be at least 8 characters, include uppercase, lowercase, and a number"
      );
      return;
    }

    // Confirm password check
    if (pass !== conPass) {
      setResult("Passwords do not match");
      return;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setResult("Phone number must be exactly 10 digits");
      return;
    }

  
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register/", {
        name,
        email,
        pass,
        phone,
      });
      
      setResult(res.data.message)
      if (res.data.user) {
        setLoggedIn(true); //  set context to true on success
        navigate("/");
      }
    } catch (error) {
      setResult(error.response?.data?.message || "Registration failed"+error);
    }
    // If all checks pass → send to backend
  };

  return (
    <section className="h-screen bg-[#0C3C3B] flex items-center justify-center text-white py-16 px-4">
      <HomeButton />
      <motion.div
        className="w-full max-w-2xl bg-[#033535] p-8 rounded-xl shadow-xl text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="px-4 py-1 mb-4 text-2xl font-bold rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Sign Up
          </motion.h1>

          {/* Success Message */}
          <AnimatePresence>
            {submitted && (
              <motion.p
                className="mb-6 text-green-400 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {result}
              </motion.p>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
              required
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
                required
                onChange={(e) => setPass(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 text-gray-300 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
                required
                onChange={(e) => setConPass(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 text-gray-300 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <motion.button
              type="submit"
              className="bg-[#B97A41] text-white px-6 py-3 rounded-md mt-4 tracking-wide w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SIGN UP
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-sm text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#B97A41] hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Signup;
