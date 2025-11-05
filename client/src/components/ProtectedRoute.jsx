// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config/baseurl";
import { addUser } from "../utils/userSlice";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Agar user already Redux mein hai
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // API call karke verify karo
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        dispatch(addUser(res?.data?.user));
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);

        if (error?.response?.status === 401) {
          navigate("/login", { replace: true });
        }
        console.log("Auth Error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate, dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - Render children
  return children;
};

export default ProtectedRoute;
