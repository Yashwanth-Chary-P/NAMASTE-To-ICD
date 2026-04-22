import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // ❌ Not logged in → go to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // ✅ Logged in → allow
  return children;
};

export default PrivateRoute;