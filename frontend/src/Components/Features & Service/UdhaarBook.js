import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import MetaData from "../Layouts/MetaData";
import { clearErrors } from "../../actions/earningAction";
import { lockList, unLockFeature } from "../../actions/appLockAction";
import { useDispatch, useSelector } from "react-redux";
import { UNLOCK_FEATURE_RESET } from "../../constants/appLockConstant";
import { toast } from "react-toastify";

const UdhaarBook = () => {
    // Lock/Unlock
  // Lock List
  const dispatch = useDispatch();
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockFeature = "Investments"; // You can dynamically change this value as needed

  // State to manage password pop-up visibility and input
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");

  // Assuming LockList is always a single document, as per your description
  const lockedFeatures = LockList[0]?.lockedFeatures || {};

  // Check if the selected feature is locked
  const isFeatureLocked = lockedFeatures[checkLockFeature];

  const handleUnlockClick = () => {
    setIsLocked(true);
  };

  const handlePasswordSubmit = () => {
    // e.preventDefault();
    const addData = {
      featureName: checkLockFeature,
      setPassword: password,
    };
    // Add your logic here to verify the password
    dispatch(unLockFeature(addData));
    setIsLocked(false); // After successful verification, you can unlock the screen
  };

  useEffect(() => {
    if (unLockError) {
      toast.error(unLockError);
      dispatch(clearErrors());
    }
    if (isUnlock) {
      toast.success("Invesment Unlock");
      dispatch({ type: UNLOCK_FEATURE_RESET });
      dispatch(lockList());
    }
  }, [unLockError, isUnlock, isFeatureLocked, dispatch]);
  return (
    <>
    <MetaData title={"UDHAAR BOOK"}/>
      <section className="mt-20 md:mt-0  md:ml-72">
        <div className="flex flex-col items-center justify-center  px-4">
          <div className="flex w-full text-[50px] justify-center  ">
          <Player
            autoplay
            loop
            src="https://lottie.host/0f7b68a7-5f52-4af3-9f9c-5be71335984b/Hc3icCdhIM.json"
            className="w-[350px] h-[350px] md:w-[600px] md:h-[600px]"
          >
          </Player>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center -mt-12 md:-mt-20">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl  mb-8 text-center">
            We're working hard to bring something amazing! Stay tuned.
          </p>
        </div>
      </section>
    </>
  );
};

export default UdhaarBook;
