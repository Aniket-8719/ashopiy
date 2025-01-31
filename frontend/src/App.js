import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DailyEarning from "./Components/Features & Service/Earning/DailyEarning";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import AllCharts from "./Components/Features & Service/Charts/AllCharts";
import AllData from "./Components/Features & Service/AllData";
import Investment from "./Components/Features & Service/Investment/Investment";
import { useDispatch, useSelector } from "react-redux";
import { addFullDayEarning } from "./actions/earningAction";
import moment from "moment-timezone";
import Login from "./Components/Users/Login";
import RegistrationForm from "./Components/Users/RegistrationForm";
import { loadUser } from "./actions/userAction";
import UpdatePassword from "./Components/Users/UpdatePassword";
import ForgotPassword from "./Components/Users/ForgotPassword";
import ResetPassword from "./Components/Users/ResetPassword";
import UserManagement from "./Components/Admin/UserManagement";
import EditProfile from "./Components/Users/EditProfile";
import Profile from "./Components/Users/Profile";
// import Billing from "./Components/Features & Service/Billing";
// import StaffManagement from "./Components/Features & Service/StaffManagement";
import NotFound from "./Components/Not Found/NotFound";
import ProtectedRoute from "./Components/Protected Route/ProtectedRoute";
import ViewDetails from "./Components/Admin/ViewDetails";
import EditUserProfile from "./Components/Admin/EditUserProfile";
import AddUdhar from "./Components/UdharBook/AddUdhar";
import UdharList from "./Components/UdharBook/UdharList";
import ShowingCal from "./Components/Staff Management/ShowingCal";
import Pricing from "./Components/Payment/Pricing";
import PaymentSummary from "./Components/Payment/PaymentSummary";
import PrivacyPolicy from "./Components/Home/PrivacyPolicy";
import TermsConditions from "./Components/Home/TermsConditions";
import ContactUs from "./Components/Home/ContactUs";
import LockFeature from "./Components/Users/LockFeature";
import { lockList } from "./actions/appLockAction";
import PaymentSuccess from "./Components/Payment/PaymentSuccess";
import AboutUs from "./Components/Home/AboutUs";
import PaymentHistory from "./Components/Payment/PaymentHistory";
import CancellationAndRefunds from "./Components/Home/CancellationAndRefunds";
import ShippingPolicy from "./Components/Home/ShippingPolicy";
import VideoPlayer from "./Components/Video/VideoPlayer";
import ShoppingList from "./Components/Features & Service/ShoppingList";
import UpdateMerchantIDForm from "./Components/Users/UpdateMerchantIDForm";
import InvestmentChart from "./Components/Features & Service/Investment/InvestmentChart";
import IncomeChart from "./Components/Features & Service/Earning/IncomeChart";

function App() {
  const dispatch = useDispatch();
  const {user,isAuthenticated} = useSelector((state) => state.user);
  const {isLock} = useSelector((state) => state.lockFeature);
 
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
  
    const today = moment().tz("Asia/Kolkata").startOf("day").format("YYYY-MM-DD");
    const previousDay = moment().tz("Asia/Kolkata").subtract(1, 'day').startOf('day').format("YYYY-MM-DD");

    // console.log(previousDay); // This will output the previous day's date in "YYYY-MM-DD" format

    try {
      const userProcessedMap = JSON.parse(localStorage.getItem("userProcessedMap")) || {};
      const lastProcessedDate = localStorage.getItem("lastProcessedDate");
  
      if (lastProcessedDate !== today) {
        Object.keys(userProcessedMap).forEach((email) => {
          userProcessedMap[email] = false;
        });
        localStorage.setItem("userProcessedMap", JSON.stringify(userProcessedMap));
        localStorage.setItem("lastProcessedDate", today);
        // console.log("Reset userProcessedMap for a new day");
      }
      if (!userProcessedMap[user.email]) {
        dispatch(addFullDayEarning({ date: previousDay }));
        userProcessedMap[user.email] = true;
        localStorage.setItem("userProcessedMap", JSON.stringify(userProcessedMap));
        // console.log(`Processed income for user: ${user.email}`);
        // toast.success("Previous income added");
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [isAuthenticated, user?.email, dispatch]); // Minimal and essential dependencies

  useEffect(() => {
    dispatch(loadUser()); // Dispatch an action to check user authentication
  }, [dispatch]);

 // Fetch lockList details when user is authenticated
 useEffect(() => {
  if (isAuthenticated) {     
    dispatch(lockList());   
  }
}, [dispatch, isAuthenticated, isLock]);    
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/earning" element={<DailyEarning />} />
        <Route path="/earning-chart" element={<IncomeChart />} />
        <Route path="/charts" element={<AllCharts />} />
        <Route path="/history" element={<AllData />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/lock-feature" element={<LockFeature />} />

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="user">
             <Profile />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/lock-feature"
          element={
            <ProtectedRoute requiredRole="user">
             <LockFeature />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/me/update"
          element={
            <ProtectedRoute requiredRole="user">
            <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute requiredRole="user">
           <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/allUsers"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <ViewDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/updateUser/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <EditUserProfile />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/user/merchantID"
          element={
            <ProtectedRoute requiredRole="user">
              <UpdateMerchantIDForm />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/user/merchantID" element={<UpdateMerchantIDForm />} /> 
        {/* <Route path="/staffMangement" element={<StaffManagement />} />
        <Route path="/billing" element={<Billing />} /> */}
        <Route path="/addUdhar" element={<AddUdhar />} />
        <Route path="/uDhaarBook" element={<UdharList/>} />
        <Route path="/calender" element={<ShowingCal />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/paymentSummary" element={<PaymentSummary />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/cancel-refuds" element={<CancellationAndRefunds />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route exact path="/paymentsuccess" element={<PaymentSuccess/>} />
        <Route exact path="/paymentHistory" element={<PaymentHistory/>} />
        <Route exact path="/video" element={<VideoPlayer/>} />
        <Route exact path="/investment-chart" element={<InvestmentChart/>} />
        <Route exact path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
