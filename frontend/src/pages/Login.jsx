import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Eye icons
import HomeButton from "./HomeButton";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";

const Login = () => {
  const { setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        pass,
      });
      setResult(res.data.message);

      if (res.data.user) {
        setLoggedIn(true); // ✅ set context to true on success
        navigate("/");
      }
    } catch (error) {
      setResult(error.response?.data?.message || "Login failed");
    }
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
            Login
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
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            {/* Password Field with Eye Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white pr-10"
                required
                onChange={(e) => {
                  setPass(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <motion.button
              type="submit"
              className="bg-[#B97A41] text-white px-6 py-3 rounded-md mt-4 tracking-wide w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LOGIN
            </motion.button>
          </form>

          {/* ✅ Signup Link */}
          <p className="mt-6 text-white/70 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#B97A41] hover:underline hover:text-[#d18f55] transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
