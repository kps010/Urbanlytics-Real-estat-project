import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios"; // ✅ we'll use axios to call backend

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null); // null = loading
  const [userEmail, setUserEmail] = useState(null);

  // Fetch login status from backend when app loads
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/check-login/");
        if (res.data.loggedIn) {
          setLoggedIn(true);
          setUserEmail(res.data.email);
          console.log(res.data.email)
        } else {
          setLoggedIn(false);
          setUserEmail(null);
        }
      } catch (err) {
        console.error("Error checking login:", err);
        setLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, userEmail, setUserEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use in any component
export const useAuth = () => useContext(AuthContext);
