import MetaData from "../Layouts/MetaData";

import {
  FaHome,
  FaQuestionCircle,
  FaArrowLeft,
  FaRocket,
} from "react-icons/fa";

const NotFound = () => {
  return (
    <>
      <MetaData title={"PAGE NOT FOUND"} />

      <section className="mt-12 lg:mt-20 lg:ml-72">
        <div className="min-h-screen flex items-center justify-center px-4 lg:px-6 bg-gradient-to-br from-neutral-50 to-primary-50">
          <div className="max-w-md w-full text-center">
            {/* Animated 404 */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-primary-600 mb-2 animate-bounce">
                404
              </div>
              <div className="w-24 h-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full mx-auto"></div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-4">
                Page Not Found
              </h1>
              <p className="text-neutral-600 text-lg">
                Oops! The page you're looking for doesn't exist or has been
                moved.
              </p>
            </div>

            {/* Illustration with React Icons */}
            <div className="mb-8 flex justify-center">
              <div className="w-48 h-48 bg-primary-100 rounded-full flex items-center justify-center">
                <FaQuestionCircle className="w-24 h-24 text-primary-600" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 space-y-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <FaHome className="mr-2" />
                Return to Dashboard
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border border-primary-200 hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </button>
            </div>

            {/* Additional Help */}
            <div className="text-sm text-neutral-500 flex items-center justify-center">
              <FaQuestionCircle className="mr-2 text-primary-500" />
              <p>
                Need help?{" "}
                <a
                  href="/support"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
