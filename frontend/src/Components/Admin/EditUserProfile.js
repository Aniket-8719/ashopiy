import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  getUserDetails,
  updateUser,
} from "../../actions/userAction";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../Layouts/Loader";

const EditUserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.singleUser);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profileUpdateDelete);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [agentID, setAgentID] = useState("");

  // Fetch user details and set form values
  useEffect(() => {
    if (!user || user._id !== id) {
      dispatch(getUserDetails(id));
    } else {
      setEmail(user.email || "");
      setRole(user.role || "user");
      setAgentID(user.agentID || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (updateError) {
      toast.error(
        updateError.message || "Something went wrong while updating the user."
      );
      dispatch(clearError());
    }
    if (isUpdated) {
      toast.success("User Updated Successfully");
      navigate("/admin/allUsers");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, id, user, error, updateError, isUpdated, navigate]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("email", email);
    myForm.set("agentID", agentID);
    myForm.set("role", role);

    dispatch(updateUser(id, myForm));
  };

  return (
    <>
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Form Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-2">
                Update User Profile
              </h2>
              <p className="text-neutral-600 text-sm">
                Update user information and permissions
              </p>
            </div>

            <form onSubmit={updateUserSubmitHandler} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email"
                  className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                />
              </div>

              {/* Agent Code */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="agentID"
                  value={agentID}
                  onChange={(e) => setAgentID(e.target.value)}
                  placeholder="Agent Code (optional) - E.g. 24AGTXXXX"
                  className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                />
              </div>

              {/* Role Dropdown */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || updateLoading}
                className={`w-full py-3 flex items-center justify-center text-white font-medium rounded-lg transition-all ${
                  loading || updateLoading
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                } shadow-md hover:shadow-lg text-sm`}
              >
                {loading || updateLoading ? (
                  <Loader />
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditUserProfile;
