import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { MdDashboard } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { SiHomeassistantcommunitystore } from "react-icons/si"; 
import { IoMdPricetags } from "react-icons/io";
// import { CiReceipt } from "react-icons/ci";
// import { GiTakeMyMoney } from "react-icons/gi";
// import { TbTransactionRupee } from "react-icons/tb";
// import { GrMoney } from "react-icons/gr";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaChartPie, FaLock, FaUnlock } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoReceiptSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineMenuBook } from "react-icons/md";
import { lockList } from "../../actions/appLockAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

 

const AdminDropdown = ({mobileToggle, setMobileToggle}) => { 
  // const {user,isAuthenticated} = useSelector((state) => state.user);
  const dispatch = useDispatch(); 
  // Lock/Unlock
  // Lock List
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockEarning = "Earning"; // You can dynamically change this value as needed
  const checkLockCharts = "Charts";
  const checkLockInvestments = "Investments";
  const checkLockUdharBook = "UdharBook";
  const checkLockHistory = "UdharBook";

  // State to manage password pop-up visibility and input
  // const [isLocked, setIsLocked] = useState(false);
  // const [password, setPassword] = useState("");

// Assuming LockList is always a single document
const lockedFeatures = LockList[0]?.lockedFeatures || {};

// Check the locked status for each feature
const isEarningLocked = lockedFeatures["Earning"];
const isChartsLocked = lockedFeatures["Charts"];
const isInvestmentsLocked = lockedFeatures["Investments"];
const isUdharBookLocked = lockedFeatures["UdharBook"];
const isHistoryLocked = lockedFeatures["History"];

useEffect(() => {
  if (isUnlock) {
    // Fetch the updated LockList after unlocking a feature
    dispatch(lockList());
  }
}, [isUnlock, dispatch]);

// Function to render lock icon based on the locked status of a feature
const renderLockIcon = (isLocked) => {
  return isLocked && <FaLock className="text-gray-500" />;
};

  return (
    <>
      <div
        className={`bg-white border-r border-r-slate-200 md:border-r-slate-300 w-64 md:w-72 h-screen flex flex-col fixed top-0 pt-4 z-50 md:left-0  animation duration-500 ${
          mobileToggle ? "-left-80" : "left-0"
        }`}
      > 
        <div className="flex items-center justify-between mx-4">
          <div>
           <Link to={"/"} className="md:pl-2 text-2xl font-bold md:text-4xl text-amber-600">ashopiy</Link>
          </div>
          <div 
           onClick={() => setMobileToggle(true)} 
          className=" md:hidden">
            <IoMdClose className="text-2xl text-slate-600"/>
          </div>
        </div>

      <div className="flex flex-col  mt-12 gap-4 overflow-y-auto md:scrollbar-hide hover:scrollbar-show">
        <Link to={"/"} className="flex items-center gap-4  p-2  pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div><SiHomeassistantcommunitystore className="text-xl"/></div>
        <div><h1 className="text-xl">Home</h1></div>
        </Link>

      {  (
        <>
        
        <Link to={"/earning"} className="flex justify-between items-center  p-2  pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div className="flex items-center gap-4">
        <div><IoStatsChartSharp className="text-xl"/></div>
        <div><h1 className="text-xl">Earning</h1></div>
        </div>
        <div className="mr-4">{renderLockIcon(isEarningLocked)}</div>
        </Link>

        <Link to={"/charts"} className="flex justify-between items-center p-2 pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 ">
        <div className="flex items-center gap-4">
        <div><FaChartPie className="text-xl hover:text-blue-500"/></div>
        <div><h1 className="text-xl">Charts</h1></div>
        </div>
        <div className="mr-4">{renderLockIcon(isChartsLocked)}</div>
        </Link>


        <Link to={"/investment"} className="flex justify-between items-center p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
       <div className="flex items-center gap-4">
       <div><FaMoneyBillTrendUp className="text-xl"/></div>
       <div><h1 className="text-xl">Investment</h1></div>
       </div>
        <div className="mr-4">{renderLockIcon(isInvestmentsLocked)}</div>
        </Link>


        <Link to={"/uDhaarBook"} className="flex justify-between items-center p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div className="flex items-center gap-4">
        <div><MdOutlineMenuBook className="text-2xl"/></div>
        <div><h1 className="text-xl">Udhaar Book</h1></div>
        </div>
        <div className="mr-4">{renderLockIcon(isUdharBookLocked)}</div>
        </Link>


        <Link to={"/history"} className="flex justify-between items-center p-2 pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
      <div className="flex items-center gap-4">
      <div><FaMoneyBillTransfer className="text-xl"/></div>
      <div><h1 className="text-xl">History</h1></div>
      </div>
        <div className="mr-4">{renderLockIcon(isHistoryLocked)}</div>
        </Link> 

        {/* <Link to={"/staffMangement"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 opacity-50">
        <div><MdManageAccounts className="text-2xl"/></div>
        <div><h1 className="text-xl">Staff Mangement</h1></div>
        </Link>
        <Link to={"/billing"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 opacity-50">
        <div><IoReceiptSharp className="text-xl"/></div>
        <div><h1 className="text-xl">Billing</h1></div>
        </Link> */}
        </>
      )
      
    }
        <Link to={"/pricing"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 ">
        <div><IoMdPricetags className="text-xl"/></div>
        <div><h1 className="text-xl">Pricing</h1></div>
        </Link>
        
      </div>
      </div>
    </>
  );
};

export default AdminDropdown;
