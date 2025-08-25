import Footer1 from "./Footer1";
import ContactUs from "./ContactUs";
import Navbar1 from "./Navbar1";
import Home from "./Home";
import PricePredictor from "./PricePredictor";
import { Element } from "react-scroll";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {

  const components = [
    { id: "home", ele: <Home /> },
    { id: "predict", ele: <PricePredictor/> },
    { id: "contact", ele: <ContactUs/> },
    { id: "about", ele: <Footer1/> },
  ];


  return (
    <>
      <Navbar1 />
      <div className="relative z-0">
        {/* <Element id="home">
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
        </Element> */}
        {components.map((comp) => (
          <Element key={comp.id} id={comp.id}>
            {comp.ele}
          </Element>
        ))}
      </div>
    </>
  );
};

export default HomePage;
