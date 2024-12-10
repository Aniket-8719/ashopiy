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
      toast.error(updateError.message || "Something went wrong while updating the user.");
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
      <section className="mt-14 md:mt-18  md:ml-72">
        <div className="bg-gray-50 flex items-center justify-center mt-14 md:mt-20">
          <div className="w-full max-w-3xl bg-white shadow-lg rounded-sm p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Update User Profile
            </h2>
            <form onSubmit={updateUserSubmitHandler} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Agent Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Agent Code<span>(optional)</span>
                </label>
                <input
                  type="text"
                  name="agentID"
                  value={agentID}
                  onChange={(e) => setAgentID(e.target.value)}
                  placeholder="E.g. 24AGTXXXX"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || updateLoading}
                className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading || updateLoading ? (
                 <Loader/>
                ) : (
                  "Update"
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
