import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import HomeButton from "./HomeButton";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/properties/property_details/${propertyId}/`
        );
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        navigate("/"); // redirect if not found
      }
    };
    fetchProperty();
  }, [propertyId, navigate]);

  if (!property)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  const baseURL = "http://127.0.0.1:8000";
  const images = [
    { src: property.hall, label: "Hall" },
    { src: property.kitchen, label: "Kitchen" },
    { src: property.bathroom, label: "Bathroom" },
    { src: property.bedroom1, label: "Bedroom 1" },
    { src: property.bedroom2, label: "Bedroom 2" },
    { src: property.bedroom3, label: "Bedroom 3" },
    { src: property.bedroom4, label: "Bedroom 4" },
  ]
    .filter((img) => img.src) // remove null/undefined
    .map((img) => ({ ...img, src: `${baseURL}${img.src}` }));

  return (
    <div className="bg-[#0C3C3B] min-h-screen p-6">
      <HomeButton />
      <motion.div
        className="max-w-6xl mx-auto bg-[#033535] shadow-md rounded-2xl p-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-bold text-[#B97A41] mb-4">
          {property.description}
        </h2>
        <p className="text-gray-300 mb-2">
          <span className="font-semibold">Location:</span> {property.location}
        </p>
        <p className="text-gray-300 mb-2">
          <span className="font-semibold">Type:</span> {property.propertyType}
        </p>
        <p className="text-gray-300 mb-2">
          <span className="font-semibold">Square Footage:</span> {property.sqft}{" "}
          sqft
        </p>
        <p className="text-[#B97A41] font-bold text-xl mb-4">
          ₹{property.price}
        </p>

        <h3 className="text-xl font-semibold text-[#B97A41] mb-3">
          Contact Info
        </h3>
        <p className="text-gray-300">Name: {property.name}</p>
        <p className="text-gray-300">Email: {property.email}</p>
        <p className="text-gray-300 mb-4">Phone: {property.phone}</p>

        <h3 className="text-xl font-semibold text-[#B97A41] mb-3">Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div key={i} className="flex flex-col items-center ">
              <motion.img
                src={img.src}
                alt={img.label}
                className="w-full h-48 object-cover rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
              />
              <span className="mt-2 text-gray-300 font-medium">
                {img.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyDetails;
