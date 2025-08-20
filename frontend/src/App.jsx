import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellHome from "./pages/SellHome";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./hooks/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import ContactUs from "./pages/ContactUs";
import HomeButton from "./pages/HomeButton";
import Navbar1 from "./pages/Navbar1";
import SubscribePage from "./pages/SubscribePage";
import SearchProperties from "./pages/SearchProperties";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload-property" element={<SellHome />} />
            <Route path="/search-property" element={<SearchProperties />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subscribe/:name" element={<SubscribePage />} />
            <Route
              path="/search-property/:propertyId"
              element={<PropertyDetails />}
            />
          </Routes>
        </Router>
        {/* <ProfilePage/> */}
        {/* <ContactUs/> */}
      </AuthProvider>
    </>
  );
}

export default App;
