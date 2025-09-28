import { useSelector } from "react-redux";
import ShopkeeperProfileForm from "./ShopkeeperProfileForm";
import WorkerProfileForm from "./WorkerProfileForm";

const CompleteProfile = () => {
  const { user } = useSelector((state) => state.user);

  return (
  <section className=" lg:bg-gray-300 lg:ml-72">
      <div className=" flex items-center justify-center py-8 mt-14 lg:mt-18">
      {user.role === "shopkeeper" ? (
        <ShopkeeperProfileForm user={user} />
      ) : (
        <WorkerProfileForm user={user} />
      )}
    </div>
  </section>
  );
};

export default CompleteProfile;