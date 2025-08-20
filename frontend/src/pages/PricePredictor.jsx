import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PricePredictor = () => {
  const [sqft, setSqft] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLocations(
      [
        "Ambawadi",
        "Ambli",
        "Bhadaj",
        "Bodakdev",
        "Bopal",
        "Chandkheda",
        "Chharodi",
        "Drive In Road",
        "Ellisbridge",
        "Ghatlodiya",
        "Ghodasar",
        "Gota",
        "Ghuma",
        "Gurukul",
        "Hathijan",
        "Isanpur",
        "Jagatpur",
        "Jodhpur",
        "Maninagar",
        "Makarba",
        "Memnagar",
        "Motera",
        "Naranpura",
        "Naroda",
        "Navrangpura",
        "New Ranip",
        "Nikol",
        "Paldi",
        "Prahlad Nagar",
        "Ranip",
        "Ramdev Nagar",
        "Sarkhej",
        "Satellite",
        "Science City",
        "Shela",
        "Shilaj",
        "Sola",
        "South Bopal",
        "Thaltej",
        "Vaishnodevi Circle",
        "Vastral",
        "Vastrapur",
        "Vejalpur",
        "Zundal",
      ].sort()
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/predict/", {
        sqft,
        location,
      });
      setResult(`Estimated Price: ₹${res.data.price.toLocaleString()}`);
      setSubmitted(true);
    } catch (err) {
      setResult("Something went wrong. Try again." + err);
      console.log(err);
      setSubmitted(true);
    }
    setLoading(false);

    setTimeout(() => setSubmitted(false), 3000);
  };
  
  return (

<section className="min-h-screen bg-[#0C3C3B] flex items-center justify-center px-4 py-8">
  <motion.div
    className="w-full max-w-2xl bg-[#033535] p-8 rounded-xl shadow-xl text-white"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, amount: 0.3 }} // 👈 triggers when 30% of card is visible
  >
    <motion.h1
      className="text-2xl font-bold px-4 py-1 mb-4 flex justify-center rounded mx-auto"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      viewport={{ once: true }}
    >
      Price Predictor
    </motion.h1>

    <motion.h2
      className="text-lg font-semibold mb-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
    >
      Estimate Your Property Price
    </motion.h2>

    {/* Success message */}
    <AnimatePresence>
      {submitted && result && (
        <motion.p
          className="mb-6 text-green-400 font-medium text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {result}
        </motion.p>
      )}
    </AnimatePresence>

    {/* Form */}
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row gap-4">
        <input
          type="number"
          placeholder="Enter square footage"
          value={sqft}
          onChange={(e) => setSqft(e.target.value)}
          className="flex-1 bg-[#022e2e] text-white border border-white/20 px-4 py-3 rounded outline-none focus:border-white placeholder-gray-400"
          min="0"
          required
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 bg-[#022e2e] text-white border border-white/20 px-4 py-3 rounded outline-none focus:border-white placeholder-gray-400"
          required
        >
          <option value="" disabled hidden>
            Select Location
          </option>
          {locations.map((loc, index) => (
            <option key={index} value={loc} className="text-white">
              {loc}
            </option>
          ))}
        </select>
      </div>

      <motion.button
        type="submit"
        className="bg-[#B97A41] text-white px-6 py-3 rounded-md w-full font-medium mt-4 hover:bg-[#a96f37] transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict Price"}
      </motion.button>
    </form>
  </motion.div>
</section>
);
};

export default PricePredictor;
