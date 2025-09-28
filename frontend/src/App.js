import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DailyEarning from "./Components/Features & Service/Earning/DailyEarning";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import AllCharts from "./Components/Features & Service/Charts/AllCharts";
import AllData from "./Components/Features & Service/History/AllData";
import Investment from "./Components/Features & Service/Investment/Investment";
import { useDispatch, useSelector } from "react-redux";
import { addFullDayEarning } from "./actions/earningAction";
import moment from "moment-timezone";
import Login from "./Components/Users/Login";
import { loadUser } from "./actions/userAction";
import UpdatePassword from "./Components/Users/UpdatePassword";
import ForgotPassword from "./Components/Users/ForgotPassword";
import ResetPassword from "./Components/Users/ResetPassword";
import UserManagement from "./Components/Admin/UserManagement";
import EditProfile from "./Components/Users/EditProfile";
import Profile from "./Components/Users/Profile";
import NotFound from "./Components/Not Found/NotFound";
import ProtectedRoute from "./Components/Protected Route/ProtectedRoute";
import ViewDetails from "./Components/Admin/ViewDetails";
import EditUserProfile from "./Components/Admin/EditUserProfile";
import UdharList from "./Components/Features & Service/UdharBook/UdharList";
import Pricing from "./Components/Payment/Pricing";
import PaymentSummary from "./Components/Payment/PaymentSummary";
import PrivacyPolicy from "./Components/Home/PrivacyPolicy";
import TermsConditions from "./Components/Home/TermsConditions";
import ContactUs from "./Components/Home/ContactUs";
import PaymentSuccess from "./Components/Payment/PaymentSuccess";
import AboutUs from "./Components/Home/AboutUs";
import PaymentHistory from "./Components/Payment/PaymentHistory";
import CancellationAndRefunds from "./Components/Home/CancellationAndRefunds";
import ShippingPolicy from "./Components/Home/ShippingPolicy";
import VideoPlayer from "./Components/Video/VideoPlayer";
import ShoppingList from "./Components/Features & Service/ShoppingList/ShoppingList";
import UpdateMerchantIDForm from "./Components/Users/UpdateMerchantIDForm";
import InvestmentChart from "./Components/Features & Service/Investment/InvestmentChart";
import IncomeChart from "./Components/Features & Service/Earning/IncomeChart";
import ProductCategories from "./Components/Features & Service/Create_Categories/ProductCategories";
import CompleteProfile from "./Components/Users/CompleteProfile";
import Loader from "./Components/Layouts/Loader";
import SetPassword from "./Components/Users/SetPassword";
import AppLockList from "./Components/Features & Service/Lock/AppLockList";
import FeatureProtectedRoute from "./Components/Protected Route/FeatureProtectedRoute";
import Register from "./Components/Users/Register";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser()); // Dispatch an action to check user authentication
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const today = moment()
      .tz("Asia/Kolkata")
      .startOf("day")
      .format("YYYY-MM-DD");
    const previousDay = moment()
      .tz("Asia/Kolkata")
      .subtract(1, "day")
      .startOf("day")
      .format("YYYY-MM-DD");


    try {
      const userProcessedMap =
        JSON.parse(localStorage.getItem("userProcessedMap")) || {};
      const lastProcessedDate = localStorage.getItem("lastProcessedDate");

      if (lastProcessedDate !== today) {
        Object.keys(userProcessedMap).forEach((email) => {
          userProcessedMap[email] = false;
        });
        localStorage.setItem(
          "userProcessedMap",
          JSON.stringify(userProcessedMap)
        );
        localStorage.setItem("lastProcessedDate", today);
      }
      if (!userProcessedMap[user.email]) {
        dispatch(addFullDayEarning({ date: previousDay }));
        userProcessedMap[user.email] = true;
        localStorage.setItem(
          "userProcessedMap",
          JSON.stringify(userProcessedMap)
        );
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [isAuthenticated, user?.email, dispatch]); // Minimal and essential dependencies

  if (loading || loading === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route
          path="/earning"
          element={
            <FeatureProtectedRoute feature="Earning">
              <DailyEarning />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/earning-chart"
          element={
            <FeatureProtectedRoute feature="Earning">
              <IncomeChart />
            </FeatureProtectedRoute>
          }
        />
       
        <Route
          path="/charts"
          element={
            <FeatureProtectedRoute feature="Charts">
              <AllCharts />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/investment"
          element={
            <FeatureProtectedRoute feature="Investments">
              <Investment />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/investment"
          element={
            <FeatureProtectedRoute feature="Investments">
              <Investment />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/investment-chart"
          element={
            <FeatureProtectedRoute feature="Investments">
              <InvestmentChart />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/uDhaarBook"
          element={
            <FeatureProtectedRoute feature="UdharBook">
              <UdharList />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <FeatureProtectedRoute feature="CreateProductCategory">
              <ProductCategories />
            </FeatureProtectedRoute>
          }
        />

        <Route path="/shopping-list" element={<ShoppingList />} />

         <Route
          path="/history"
          element={
            <FeatureProtectedRoute feature="History">
              <AllData />
            </FeatureProtectedRoute>
          }
        />
        <Route
          path="/lock"
          element={
            <FeatureProtectedRoute feature="Lock">
              <AppLockList />
            </FeatureProtectedRoute>
          }
        />


        {/* <Route path="/lock-feature" element={<LockFeature />} /> */}

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
          path="/password/set"
          element={
            <ProtectedRoute requiredRole="user">
              <SetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute requiredRole="user">
              <CompleteProfile />
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
        

        <Route path="/user/merchantId" element={<UpdateMerchantIDForm />} />
  
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/paymentSummary" element={<PaymentSummary />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/cancel-refuds" element={<CancellationAndRefunds />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route exact path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route exact path="/paymentHistory" element={<PaymentHistory />} />
        <Route exact path="/video" element={<VideoPlayer />} />

        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
