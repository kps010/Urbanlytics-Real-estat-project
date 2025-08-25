// src/components/Footer.jsx
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import logo from "../assets/Adobe Express - file.png";
const Footer1 = () => {
  return (
    <footer className="bg-[#0C3C3B] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p>Ahmedabad</p>
          {/* <p>742 Evergreen Terrace</p> */}
          {/* <p>Brooklyn, NY 11201</p> */}
        </motion.div>

        {/* Logo and Socials */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-3xl font-bold">
            <img
              src={logo} // Replace with your logo path
              alt="Urbanlytics"
              className="h-8"
            />
            Urbanlytics
          </div>
          <div className="flex gap-3">
            <button className="bg-white/10 p-3 rounded-md hover:bg-white/20">
              <FaFacebookF />
            </button>
            <button className="bg-white/10 p-3 rounded-md hover:bg-white/20">
              <FaXTwitter />
            </button>
            <button className="bg-white/10 p-3 rounded-md hover:bg-white/20">
              <FaInstagram />
            </button>
            <button className="bg-white/10 p-3 rounded-md hover:bg-white/20">
              <FaYoutube />
            </button>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p>T. +91 33333 92969</p>
          <p>M. contact@urbanlytics.com</p>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-white/20 pt-5 text-center text-sm px-4 max-w-7xl mx-auto">
        <p className="text-white">
          Copyright © 2025 Urbanlytics. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer1;
