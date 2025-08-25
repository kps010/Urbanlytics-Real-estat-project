// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";
import HomeButton from "./HomeButton";
import { FaTrash } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setLoggedIn, userEmail, setUserEmail } = useAuth();
  const [userData, setUserData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // toggle edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
  });
  const [activePlan, setActivePlan] = useState(null); //  Missing

  useEffect(() => {
    // Fetch user details
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/user-profile/", {
          params: { email: userEmail },
        });
        if (res.data.success) {
          setUserData(res.data.user);
          setFormData(res.data.user);
        } else {
          console.log(res.data.error);
        }

        const res1 = await axios.post(
          "http://127.0.0.1:8000/api/properties/get-property/",
          {
            email: userEmail,
          }
        );

        if (res1.data.success) {
          setProperties(res1.data.properties);
        } else {
          console.log(res1.data.error);
        }

        const res2 = await axios.get(
          `http://127.0.0.1:8000/api/subscriptions/${userEmail}/`
        );

        const subscriptions = res2.data;
        // Find the active subscription
        const active = subscriptions.find((sub) => sub.is_active);
        setActivePlan(active ? active.plan_name : null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchData();
  }, [userEmail]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://127.0.0.1:8000/api/update-profile/", {
        email: userEmail,
        ...formData,
      });
      if (res.data.success) {
        setUserData(formData); //  update local state
        setUserData(formData);
        setIsEditing(false);
      } else {
        console.log(res.data.error);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/logout/", {
        userEmail,
      });
      if (res.data.success) {
        setLoggedIn(false);
        setUserEmail(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/properties/delete-property/",
        { id }
      );
      if (res.data.message) {
        console.log(res.data.message);
        setProperties((prev) => prev.filter((prop) => prop.id !== id));
        // navigate("/profile");
      } else {
        console.log(res.data.error);
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const plans = [
    {
      title: "Basic",
      price: "₹499/month",
      features: ["5 listings", "Basic support"],
    },
    {
      title: "Pro",
      price: "₹999/month",
      features: ["20 listings", "Priority support"],
    },
    {
      title: "Elite",
      price: "₹1999/month",
      features: ["Unlimited listings", "Dedicated support"],
    },
  ];

  return (
    <>
      <div className="bg-[#0C3C3B] w-full mx-auto p-6">
        <HomeButton />
        {/* Profile Info */}
        <motion.div
          className="bg-[#033535] shadow-md rounded-2xl p-6 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`block w-full px-3 py-1 rounded-md bg-transparent focus:outline-none focus:ring-0
  ${isEditing ? "border-b border-black text-black " : "text-[#B97A41]"}`}
            />
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              readOnly
              className="block w-full rounded-md px-3 py-1 bg-transparent text-gray-400 cursor-not-allowed"
            />
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`block w-full rounded-md px-3 py-1 bg-transparent focus:outline-none focus:ring-0
  ${isEditing ? "border-b border-black text-black " : "text-[#B97A41]"}
              }`}
            />
          </div>
          {isEditing ? (
            <div className="flex">
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="bg-transparent text-white cursor-pointer hover:text-[#a06833] px-4 py-2 rounded-md"
              >
                cancle
              </button>
              <button
                onClick={handleUpdate}
                className="bg-[#B97A41] hover:bg-[#a06833] text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-[#B97A41] hover:bg-[#a06833] text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
          )}
        </motion.div>

        {/* Uploaded Properties */}
        <motion.div
          className="mt-8 bg-[#033535] shadow-md rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold text-[#B97A41] mb-4">
            Uploaded Properties
          </h3>
          {properties.length > 0 ? (
            <button className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop, i) => (
                <motion.button
                  key={i}
                  className="bg-[#022828] shadow-lg rounded-xl p-4"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    navigate(`/search-property/${prop.id}`);
                  }}
                >
                  {/* Show Hall Image if exists */}
                  {prop.hall && (
                    <img
                      src={prop.hall}
                      alt="Hall"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-semibold text-lg">{prop.description}</h4>
                  <p className="text-sm text-gray-600">{prop.location}</p>
                  <p className="text-[#B97A41] font-bold">₹{prop.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevents triggering navigate
                      handleRemove(prop.id); // your remove handler
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    <FaTrash size={15} />
                    Remove
                  </button>
                </motion.button>
              ))}
            </button>
          ) : (
            <p className="text-gray-500">No properties uploaded yet.</p>
          )}
        </motion.div>

        {/* Premium Plans */}
        <motion.div
          className="mt-10 bg-[#033535] shadow-md rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold text-[#B97A41] mb-4">
            Premium Plans
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {plans
              .filter(
                (plan) =>
                  !activePlan ||
                  plan.title.toLowerCase().trim() ===
                    activePlan.toLowerCase().trim()
              ) // Show only active plan if exists
              .map((plan, i) => (
                <motion.div
                  key={i}
                  className={`bg-[#022828] shadow-lg rounded-2xl p-6 text-center ${
                    activePlan === plan.title
                      ? "border-2 border-yellow-400"
                      : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-lg font-bold text-[#B97A41]">
                    {plan.title} {activePlan === plan.title && "(Active)"}
                  </h4>
                  <p className="text-xl font-semibold my-2">{plan.price}</p>
                  <ul className="text-gray-600 mb-4">
                    {plan.features.map((f, idx) => (
                      <li key={idx}>• {f}</li>
                    ))}
                  </ul>
                  {activePlan !== plan.title && (
                    <a href={`/subscribe/${plan.title}`} className="text-white">
                      Buy Now
                    </a>
                  )}
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Logout */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-[#B97A41] hover:bg-[#a06833] text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
