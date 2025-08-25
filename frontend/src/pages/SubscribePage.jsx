// src/pages/SubscribePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";

const plans = {
  basic: 499,
  premium: 999,
  elite: 1999,
};

const SubscribePage = () => {
  const { userEmail } = useAuth();
  const navigate = useNavigate();
  const { name } = useParams(); //  Assume route: /subscribe/:name/:email
  const normalizedPlan = name?.toLowerCase();
  const [activeMethod, setActiveMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  const amount = plans[normalizedPlan] || 0;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validation
    if (activeMethod === "card") {
      if (
        !cardDetails.name ||
        !/^\d{16}$/.test(cardDetails.number) ||
        !/^\d{2}\/\d{2}$/.test(cardDetails.expiry) ||
        !/^\d{3}$/.test(cardDetails.cvv)
      ) {
        alert("Please enter valid card details!");
        return;
      }
    } else if (activeMethod === "gpay") {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        alert("Please enter a valid UPI ID!");
        return;
      }
    } else {
      alert("Please select a payment method!");
      return;
    }

    try {
      //  Call Django backend API
      const res = await axios.post("http://127.0.0.1:8000/api/subscribe/", {
        email: userEmail,
        plan: normalizedPlan,
        payment_method: activeMethod,
        amount: amount.toString(),
      });

      if (res.status === 201) {
        alert(` Subscription successful! Plan: ${name}`);
        navigate("/profile"); // redirect after payment
      }
    } catch (err) {
      console.error(err);
      alert(" Subscription failed! Try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen relative  flex justify-center text-white items-center bg-[#0C3C3B] p-6">
        <button
          className="absolute top-4 left-4 px-4 py-2 bg-transparent font-semibold rounded-lg cursor-pointer  hover:text-[#B97A41] transition duration-300 z-50"
          onClick={() => {
            navigate("/profile");
          }}
        >
          Back
        </button>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-[#033535] shadow-lg p-6 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Subscribe</h1>

          <form onSubmit={handlePayment} className="space-y-4 text-black">
            {/* Amount */}
            <div>
              <label className="block mb-1 text-gray-600">Amount</label>
              <input
                type="text"
                value={`₹ ${amount}`}
                readOnly
                className="w-full p-3 border border-black rounded-xl bg-transparent focus:outline-none"
              />
            </div>

            {/* Payment Options */}
            <div className="rounded-xl border border-black overflow-hidden">
              {/* Card Payment */}
              <div className="border-b border-black">
                <button
                  type="button"
                  onClick={() => setActiveMethod("card")}
                  className="w-full flex items-center p-3 gap-3 text-left"
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      activeMethod === "card"
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-400"
                    }`}
                  >
                    {activeMethod === "card" && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </span>
                  <span className="font-medium">💳 Card Payment</span>
                </button>

                <AnimatePresence>
                  {activeMethod === "card" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-3 space-y-3"
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={handleCardChange}
                        className="w-full p-3 border border-black rounded-xl focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="number"
                        placeholder="Card Number (16 digits)"
                        maxLength={16}
                        value={cardDetails.number}
                        onChange={handleCardChange}
                        className="w-full p-3 border border-black rounded-xl focus:outline-none"
                        required
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={handleCardChange}
                          className="w-1/2 p-3 border border-black rounded-xl focus:outline-none"
                          required
                        />
                        <input
                          type="password"
                          name="cvv"
                          placeholder="CVV"
                          maxLength={3}
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          className="w-1/2 p-3 border border-black rounded-xl focus:outline-none"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Google Pay */}
              <div>
                <button
                  type="button"
                  onClick={() => setActiveMethod("gpay")}
                  className="w-full flex items-center p-3 gap-3 text-left"
                >
                  <span
                    className={`w-5 h-5 rounded-full border border-black flex items-center justify-center ${
                      activeMethod === "gpay"
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-400"
                    }`}
                  >
                    {activeMethod === "gpay" && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </span>
                  <span className="font-medium">📱 Google Pay (UPI)</span>
                </button>

                <AnimatePresence>
                  {activeMethod === "gpay" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-3 space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g., username@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full p-3 border border-black rounded-xl focus:outline-none"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-[#B97A41] text-white py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Pay Now
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default SubscribePage;
