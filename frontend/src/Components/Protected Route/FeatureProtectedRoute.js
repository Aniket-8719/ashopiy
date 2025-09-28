import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { hasAccess } from "../../utils/checkAccess";

const FeatureProtectedRoute = ({ children, feature }) => {
  const { user, isAuthenticated, loading, lockedFeatures  } = useSelector((state) => state.user);

  if (loading || loading === undefined) {
    return (
      <div className="flex justify-center items-center mt-20 md:ml-72">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If worker does not have access to feature → redirect to home
  if (!hasAccess(user, feature, lockedFeatures)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default FeatureProtectedRoute;
