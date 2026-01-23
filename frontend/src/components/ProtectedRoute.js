import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const user = localStorage.getItem("user");

  // If route requires authentication and user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // If route should NOT be accessible when logged in (like login/register pages)
  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;