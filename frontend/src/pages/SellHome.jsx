// src/pages/SellHome.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar1 from "./Navbar1";
import { useAuth } from "../hooks/AuthContext";

function SellHome() {
  const { userEmail } = useAuth();
  const [formData, setFormData] = useState({
    location: "",
    sqft: "",
    price: "",
    description: "",
    propertyType: "",
    name: "",
    phone: "",
    email: "",
  });

  const [photos, setPhotos] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e, key) => {
    setPhotos({ ...photos, [key]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append normal fields
    data.append("location", formData.location);
    data.append("sqft", formData.sqft);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("propertyType", formData.propertyType);
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email); //  backend may expect `user_email`
    data.append("user_email", userEmail);

    // Append photos (each with a matching backend field name)
    if (photos.hall) data.append("hall", photos.hall);
    if (photos.kitchen) data.append("kitchen", photos.kitchen);
    if (photos.bathroom) data.append("bathroom", photos.bathroom);

    // Bedrooms (dynamic)
    Object.keys(photos).forEach((key) => {
      if (key.startsWith("bedroom") && photos[key]) {
        data.append(key, photos[key]); // bedroom1, bedroom2...
      }
    });

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/properties/upload-property/",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.message) {
        alert("Property submitted successfully!");
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Failed to submit property.", error.message);
    }
  };

  const inputClass =
    "w-full bg-transparent border border-gray-500 text-white placeholder-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C1783A]";

  // Generate extra bedroom inputs based on BHK number
  const renderBedroomInputs = () => {
    const bhkNumber = parseInt(formData.propertyType) || 0;
    const bedroomInputs = [];

    if (bhkNumber >= 1) {
      bedroomInputs.push(
        <div key="bedroom1" className="sm:col-span-2">
          <span className="text-sm text-gray-300">Bedroom 1 Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e, "bedroom1")}
            className={`${inputClass} sm:col-span-2`}
            required
          />
        </div>
      );
    }

    for (let i = 2; i <= bhkNumber; i++) {
      bedroomInputs.push(
        <div key={`bedroom${i}`} className="sm:col-span-2">
          <span className="text-sm text-gray-300">Bedroom {i} Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e, `bedroom${i}`)}
            className={`${inputClass} sm:col-span-2`}
            required
          />
        </div>
      );
    }

    return bedroomInputs;
  };

  return (
    <>
      <Navbar1 />
      <div className="min-h-screen bg-[#0C3C3B] py-10 px-4 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-[#033535] shadow-lg rounded-2xl text-white mt-20 p-6 sm:p-10"
        >
          <motion.h2
            className="px-4 py-1 mb-4 text-2xl font-bold rounded mx-auto text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Upload Your Property
          </motion.h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Square Footage */}
            <input
              type="number"
              name="sqft"
              placeholder="Square Footage"
              value={formData.sqft}
              onChange={handleChange}
              className={inputClass}
              required
            />

            {/* Price */}
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className={inputClass}
              required
            />

            {/* Property Type */}
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={`${inputClass} sm:col-span-2 bg-[#033535] text-white appearance-none`}
              required
            >
              <option value="" hidden>
                Select BHK
              </option>
              <option value="1BHK" className="bg-[#033535] text-white">
                1 BHK
              </option>
              <option value="2BHK" className="bg-[#033535] text-white">
                2 BHK
              </option>
              <option value="3BHK" className="bg-[#033535] text-white">
                3 BHK
              </option>
              <option value="4BHK" className="bg-[#033535] text-white">
                4 BHK
              </option>
            </select>

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} sm:col-span-2`}
              rows="4"
            ></textarea>

            {/* Location */}
            <textarea
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className={`${inputClass} sm:col-span-2`}
              rows="4"
              required
            ></textarea>

            {/* Photo Uploads */}
            <label className="sm:col-span-2 font-semibold text-white">
              Upload Photos
            </label>

            {/* Hall Photo */}
            <div className="sm:col-span-2">
              <span className="text-sm text-gray-300">Hall Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, "hall")}
                className={`${inputClass} sm:col-span-2`}
                required
              />
            </div>

            {/* Bedroom Photos */}
            {renderBedroomInputs()}

            {/* Kitchen Photo */}
            <div className="sm:col-span-2">
              <span className="text-sm text-gray-300">Kitchen Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, "kitchen")}
                className={`${inputClass} sm:col-span-2`}
                required
              />
            </div>

            {/* Bathroom Photo */}
            <div className="sm:col-span-2">
              <span className="text-sm text-gray-300">Bathroom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, "bathroom")}
                className={`${inputClass} sm:col-span-2`}
                required
              />
            </div>

            {/* Contact Details */}
            <label className="sm:col-span-2 font-semibold text-white">
              Contact Details
            </label>

            {/* Name */}
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />

            {/* Phone */}
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputClass} sm:col-span-2`}
              required
            />

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#C1783A] text-white py-3 rounded-lg hover:bg-[#a8622f] transition tracking-wide"
              >
                Upload Property
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default SellHome;
