import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, forgotPassword } from "../../actions/userAction";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa6";
import MetaData from "../Layouts/MetaData";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const allPasswordData = new FormData();

    allPasswordData.set("email", email);

    dispatch(forgotPassword(allPasswordData));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    } else {
      toast.success(message);
    }
  }, [dispatch, error, message]);
  return (
    <>
    <MetaData title={"FORGOT PASSWORD"} />
    <section className="lg:ml-72">
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ashopiy
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Sign in to your account
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
                loading
                  ? "bg-neutral-400"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                "Continue with Email"
              )}
            </button>

            <div className="text-center text-sm text-neutral-600">
              <p>
                New to ashopiy?{" "}
                <a
                  href="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create an account
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
    </>
  );
};

export default ForgotPassword;
