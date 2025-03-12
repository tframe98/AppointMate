import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  
  if (!auth || !auth.user) {
    console.log("User not authenticated, redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;