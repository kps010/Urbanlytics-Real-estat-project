import React from "react";
import background from "../assets/background.webp";
import Navbar1 from "./Navbar1";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Navbar (Uncomment if needed) */}
      {/* <Navbar1 /> */}

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-[#093b39] via-[#093b39]/90 to-transparent z-0 pointer-events-none" />

      {/* Main content centered */}
      <div className="flex flex-1 flex-col items-center justify-center text-center text-white px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Urbanlytics</h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Discover your perfect home within budget
        </p>

        {/* <div className="flex gap-4 flex-wrap justify-center mb-12">
          <button className="bg-transparent text-white px-6 py-3 rounded-md font-semibold hover:bg-[#072e2e] transition">
            Schedule a Visit
          </button>
          <button className="backdrop-blur-sm bg-white/20 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/30 transition">
            Explore Room
          </button>
        </div> */}
      </div>

      {/* Bottom location info */}
      {/* <div className="absolute bottom-6 w-full text-white text-sm flex flex-col md:flex-row justify-evenly items-center gap-2 px-4 font-medium z-10 text-center drop-shadow-sm">
        <span>5 min walk to Metro Station</span>
        <span>3 min walk to City Mall</span>
        <span>15 min drive to Airport</span>
      </div> */}
    </div>
  );
};

export default Home;
