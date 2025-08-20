import Footer1 from "./Footer1";
import ContactUs from "./ContactUs";
import Navbar1 from "./Navbar1";
import Home from "./Home";
import PricePredictor from "./PricePredictor";
import { Element } from "react-scroll";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {

  return (
    <>
      <Navbar1 />
      <div className="relative z-0">
        <Element id="home">
          <Home />
        </Element>
        <Element id="predict">
          <PricePredictor />
        </Element>
        <Element id="contact">
          <ContactUs />
        </Element>
        <Element id="about">
          <Footer1 />
        </Element>
      </div>
    </>
  );
};

export default HomePage;
