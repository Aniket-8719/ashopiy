import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAppLock } from "../../../actions/appLockAction";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa6";

const AddLockModal = () => {
  const dispatch = useDispatch();

  const [workerEmail, setWorkerEmail] = useState("");
  const [features, setFeatures] = useState({
    Earning: false,
    Charts: false,
    Investments: false,
    UdharBook: false,
    CreateProductCategory: false,
    ProductCategory: false,
    History: false,
  });

  const handleFeatureToggle = (feature) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workerEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Get selected features as array
    const selectedFeatures = Object.keys(features).filter(
      (feature) => features[feature]
    );

    // Validate that at least one feature is selected
    if (selectedFeatures.length === 0) {
      toast.error("Please select at least one feature to lock");
      return;
    }

    // Dispatch create action with correct data structure
    dispatch(
      createAppLock({
        workerEmail: workerEmail.trim(),
        features: selectedFeatures,
      })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="workerEmail"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Team Member Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-primary-600 text-sm" />
            </div>
            <input
              type="email"
              id="workerEmail"
              name="workerEmail"
              value={workerEmail}
              onChange={(e) => setWorkerEmail(e.target.value)}
              required
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter team member's email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Feature Access Control
          </label>
          <div className="space-y-3 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            {Object.keys(features).map((feature) => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={feature}
                  checked={features[feature]}
                  onChange={() => handleFeatureToggle(feature)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor={feature}
                  className="ml-3 block text-sm text-neutral-700"
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Checked features will be restricted for this user
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md"
        >
          Create Access Control
        </button>
      </form>
    </>
  );
};

export default AddLockModal;
