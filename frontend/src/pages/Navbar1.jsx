// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Button, Link as ScrollLink } from "react-scroll";
import { FaUserCircle } from "react-icons/fa";
import {
  Link as PageLink,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";

axios.defaults.withCredentials = true;

const Navbar1 = () => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <nav className="fixed left-0 right-0 z-50 bg-[#0C3C3B] text-white py-4 rounded-xl max-w-7xl mx-auto mt-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          Urbanlytics
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link
            to="/#predict"
            className="hover:text-[#B97A41] cursor-pointer"
            // onClick={() => {
            //   handleScroll("predict");
            // }}
          >
            Price Predictor
          </Link>
          <Link
            to="/search-property"
            className="hover:text-[#B97A41] cursor-pointer"
          >
            Search Property
          </Link>
          <Link
            to="/upload-property"
            className="hover:text-[#B97A41] cursor-pointer"
            // onClick={() => {
            //   navigate("/upload-property");
            // }}
          >
            Upload Property
          </Link>
          <Link
            to="/#contact"
            className="hover:text-[#B97A41] cursor-pointer"
            // onClick={() => {
            //   handleScroll("contact");
            // }}
          >
            Contact Us
          </Link>
          <Link
            to="/#about"
            className="hover:text-[#B97A41] cursor-pointer"
            // onClick={() => {
            //   handleScroll("about");
            // }}
          >
            About Us
          </Link>
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          {loggedIn ? (
            <Button
              className="flex items-center gap-2  font-medium"
              onClick={() => navigate("/profile")} //  navigate to profile page
            >
              <FaUserCircle size={30} />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#B97A41] hover:bg-[#a06833] px-4 py-2 rounded-md text-white font-medium tracking-wide"
            >
              Login / Sign Up
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="h-6 w-6 fill-current text-white"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L9.17 12l7.72-7.71z"
                />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden text-center font-medium">
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            activeClass="text-[#B97A41]"
            className="hover:text-[#B97A41] cursor-pointer"
          >
            Home
          </ScrollLink>
          <Button
            activeClass="text-[#B97A41]"
            className="hover:text-[#B97A41] cursor-pointer"
          >
            Search Property
          </Button>
          <ScrollLink
            to="predict"
            smooth={true}
            duration={500}
            activeClass="text-[#B97A41]"
            className="hover:text-[#B97A41] cursor-pointer"
          >
            Price Predictor
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            activeClass="text-[#B97A41]"
            className="hover:text-[#B97A41] cursor-pointer"
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="contact"
            smooth={true}
            duration={500}
            activeClass="text-[#B97A41]"
            className="hover:text-[#B97A41] cursor-pointer"
          >
            Contact
          </ScrollLink>
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-[#B97A41] hover:bg-[#a06833] px-4 py-2 rounded-md text-white"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar1;
