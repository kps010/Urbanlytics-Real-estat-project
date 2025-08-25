import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful form submission
    setSubmitted(true);

    // Optionally clear the message after some time
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="h-screen bg-[#0C3C3B] flex items-center justify-center text-white py-16 px-4 ">
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
            Contact Us
          </motion.h1>

          {/* <motion.h2
            className="text-xl font-semibold mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Schedule a Visit
          </motion.h2> */}

          {/* Success Message */}
          <AnimatePresence>
            {submitted && (
              <motion.p
                className="mb-6 text-green-400 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
              >
                Your request has been submitted successfully.
              </motion.p>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
                required
              />
            </div>

            <textarea
              rows="5"
              placeholder="Submit Request"
              className="w-full bg-transparent border border-white/20 px-4 py-3 rounded outline-none focus:border-white"
              required
            ></textarea>

            <motion.button
              type="submit"
              className="bg-[#B97A41] text-white px-6 py-3 rounded-md mt-4 tracking-wide"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SEND MESSAGE
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactUs;
