import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoMdPricetags } from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaChartPie } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlineMenuBook, MdCategory } from "react-icons/md";
import { useSelector } from "react-redux";
import OneLineDaysLeft from "../Payment/OneLineDaysLeft";
import { RiFileList3Fill } from "react-icons/ri";
import { SiAuthentik } from "react-icons/si";
import { hasAccess } from "../../utils/checkAccess";

const SideNavbar = ({ mobileToggle, setMobileToggle }) => {
  const { user, lockedFeatures } = useSelector((state) => state.user);

  return (
    <>
      <div
        className={`bg-white border-r border-neutral-200 w-64  md:w-72 h-screen flex flex-col fixed top-0 pt-4 z-50 lg:left-0 transition-all duration-300 ${
          mobileToggle ? "-left-80" : "left-0"
        }`}
      >
        <div className="flex items-center justify-between mx-4 mb-6">
          <div>
            <Link
              to={"/"}
              className="text-2xl  font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            >
              ashopiy
            </Link>
          </div>
          <div 
            onClick={() => setMobileToggle(true)} 
            className="lg:hidden p-1 rounded hover:bg-neutral-100 transition-colors"
          >
            <IoMdClose className="text-xl text-neutral-600" />
          </div>
        </div>

        <div className="flex flex-col mt-4 gap-1 overflow-y-auto px-2">
          <Link
            to={"/"}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            <SiHomeassistantcommunitystore className="text-xl text-neutral-600" />
            <span className="text-base font-medium">Home</span>
          </Link>

          {hasAccess(user, "Earning", lockedFeatures) && (
            <Link
              to={"/earning"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <IoStatsChartSharp className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Earning</span>
            </Link>
          )}

          {hasAccess(user, "Charts", lockedFeatures) && (
            <Link
              to={"/charts"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <FaChartPie className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Charts</span>
            </Link>
          )}

          {hasAccess(user, "Investments", lockedFeatures) && (
            <Link
              to={"/investment"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <FaMoneyBillTrendUp className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Investment</span>
            </Link>
          )}

          {hasAccess(user, "UdharBook", lockedFeatures) && (
            <Link
              to={"/uDhaarBook"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <MdOutlineMenuBook className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Udhaar Book</span>
            </Link>
          )}

          {hasAccess(user, "CreateProductCategory", lockedFeatures) && (
            <Link
              to={"/categories"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <MdCategory className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Create Category</span>
            </Link>
          )}

          {hasAccess(user, "History", lockedFeatures) && (
            <Link
              to={"/history"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <FaMoneyBillTransfer className="text-xl text-neutral-600" />
              <span className="text-base font-medium">History</span>
            </Link>
          )}

          {hasAccess(user, "Lock", lockedFeatures) && (
            <Link
              to={"/lock"}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <SiAuthentik className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Lock System</span>
            </Link>
          )}

          <Link
            to={"/shopping-list"}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            <RiFileList3Fill className="text-xl text-neutral-600" />
            <span className="text-base font-medium">Shopping List</span>
          </Link>

          <Link
            to={"/pricing"}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IoMdPricetags className="text-xl text-neutral-600" />
              <span className="text-base font-medium">Pricing</span>
            </div>
            <OneLineDaysLeft />
          </Link>
        </div>
      </div>
    </>
  );
};

export default SideNavbar;