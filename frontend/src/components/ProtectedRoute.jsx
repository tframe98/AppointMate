import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth === undefined || auth === null) {
    console.error("Auth context not available. Ensure AuthProvider is wrapping your app.");
    return <Navigate to="/login" />;
  }

  if (auth.isLoading) {
    console.log("Checking authentication status...");
    return <p>Loading...</p>;
  }

  if (!auth.user) {
    console.log("User not authenticated, redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;