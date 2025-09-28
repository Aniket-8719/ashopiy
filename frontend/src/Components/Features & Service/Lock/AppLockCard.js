import { 
  FaLock, 
  FaUser, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 

} from 'react-icons/fa';

const AppLockCard = ({
  worker,
  setIsUpdateModalOpen,
  setUpdateID,
  handleDeleteClick, // Add this prop
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <FaUser className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 text-sm">
              {worker.WorkerEmailId}
            </h3>
            <p className="text-xs text-neutral-500">Team Member</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${
              Object.values(worker.lockedFeatures).some((locked) => locked)
                ? "bg-warning-500"
                : "bg-success-500"
            }`}
          ></span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-medium text-neutral-600 mb-2 uppercase tracking-wide">
          Restricted Features
        </h4>
        <div className="space-y-1">
          {Object.entries(worker.lockedFeatures).map(
            ([feature, locked]) =>
              locked && (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <FaLock className="text-warning-600 text-xs" />
                  <span>{feature}</span>
                </div>
              )
          )}
          {!Object.values(worker.lockedFeatures).some((locked) => locked) && (
            <p className="text-sm text-success-600 flex items-center gap-2">
              <FaCheckCircle className="text-success-500" />
              Full access granted
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-neutral-100">
        <button
          onClick={() => {
            setIsUpdateModalOpen(true);
            setUpdateID(worker._id);
          }}
          className="flex-1 py-2 px-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaEdit className="text-xs" />
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(worker._id)}
          className="flex-1 py-2 px-3 bg-error-600 text-white text-sm font-medium rounded-lg hover:bg-error-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaTrash className="text-xs" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default AppLockCard;
