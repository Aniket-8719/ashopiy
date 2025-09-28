import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccessFeatures } from "../../../actions/appLockAction";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa6";

const UpdateLockModal = ({ updateID }) => {
  const dispatch = useDispatch();
  const { appLocks } = useSelector((state) => state.appLocks);

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [WorkerEmailId, setWorkerEmailId] = useState("");

  useEffect(() => {
    if (updateID && appLocks) {
      const workerToUpdate = appLocks.find((worker) => worker._id === updateID);
      if (workerToUpdate) {
        setWorkerEmailId(workerToUpdate.WorkerEmailId);

        // Get currently locked features
        const lockedFeatures = Object.entries(workerToUpdate.lockedFeatures)
          .filter(([feature, isLocked]) => isLocked)
          .map(([feature]) => feature);

        setSelectedFeatures(lockedFeatures);
      }
    }
  }, [updateID, appLocks]);

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(feature)) {
        return prev.filter((f) => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedFeatures.length === 0) {
      toast.error("Please select at least one feature to lock");
      return;
    }

    dispatch(updateAccessFeatures(updateID, selectedFeatures));
  };

  const featureOptions = [
    "Earning",
    "Charts",
    "Investments",
    "UdharBook",
    "CreateProductCategory",
    "ProductCategory",
    "History",
  ];
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Team Member
        </label>
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <FaUser className="text-primary-600 text-sm" />
          </div>
          <span className="text-sm font-medium text-neutral-800">
            {WorkerEmailId}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Feature Access Control
        </label>
        <div className="space-y-3 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          {featureOptions.map((feature) => (
            <div key={feature} className="flex items-center">
              <input
                type="checkbox"
                id={feature}
                checked={selectedFeatures.includes(feature)}
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
          Checked features will be restricted
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md"
      >
        Update Access Control
      </button>
    </form>
  );
};

export default UpdateLockModal;
