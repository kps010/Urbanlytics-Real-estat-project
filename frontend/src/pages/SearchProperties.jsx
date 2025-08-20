// src/pages/SearchProperties.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar1 from "./Navbar1";

const SearchProperties = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);

  const fetchProperties = async (query = "") => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/properties/search-property/",
        {
          location: query,
        }
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties", err);
    }
  };

  // Fetch all on page load
  useEffect(() => {
    fetchProperties();
  }, []);

  // Trigger search onChange with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search !== "") {
        fetchProperties(search);
      } else {
        fetchProperties();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Trigger search on Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchProperties(search);
    }
  };

  return (
    <>
      <Navbar1 />
      <div className="min-h-screen bg-[#0C3C3B] p-28">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchProperties(search);
            }}
            onKeyDown={handleKeyPress}
            className="w-full p-3 rounded-2xl border-b shadow-md focus:outline-none focus:ring-0 "
          />
        </div>

        {/* Properties Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.length > 0 ? (
            properties.map((property, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => {
                  navigate(`/search-property/${property.id}`);
                }}
                className="bg-[#022828] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {/* Image */}
                {property.hall && (
                  <img
                    src={`http://127.0.0.1:8000${property.hall}`}
                    alt="Property"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">
                    {property.description}
                  </h2>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <p className="mt-2 text-[#B97A41] font-bold">
                    ₹ {property.price}
                  </p>
                </div>
              </motion.button>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No properties found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchProperties;
