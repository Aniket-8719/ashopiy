import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Layouts/Loader";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading || loading === undefined) {
    return (
      <div className="flex justify-center items-center mt-20  md:ml-72">
        <Loader />
      </div>
    );
  }

  // If user is not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin rights but user is not admin → redirect to home
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise → allow access
  return children;

};

export default ProtectedRoute;
