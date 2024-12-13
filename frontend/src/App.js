import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import DailyEarning from "./Components/Features & Service/DailyEarning";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar/Navbar";
import AllCharts from "./Components/Features & Service/Charts/AllCharts";
import AllData from "./Components/Features & Service/AllData";
import Investment from "./Components/Features & Service/Investment";
import { useDispatch, useSelector } from "react-redux";
import { addFullDayEarning } from "./actions/earningAction";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import Login from "./Components/Users/Login";
import RegistrationForm from "./Components/Users/RegistrationForm";
import { loadUser } from "./actions/userAction";
import UpdatePassword from "./Components/Users/UpdatePassword";
import ForgotPassword from "./Components/Users/ForgotPassword";
import ResetPassword from "./Components/Users/ResetPassword";
import UserManagement from "./Components/Admin/UserManagement";
import EditProfile from "./Components/Users/EditProfile";
import Profile from "./Components/Users/Profile";
import Billing from "./Components/Features & Service/Billing";
import StaffManagement from "./Components/Features & Service/StaffManagement";
import NotFound from "./Components/Not Found/NotFound";
import ProtectedRoute from "./Components/Protected Route/ProtectedRoute";
import ViewDetails from "./Components/Admin/ViewDetails";
import EditUserProfile from "./Components/Admin/EditUserProfile";
import UdhaarBook from "./Components/Features & Service/UdhaarBook";

function App() {
  const dispatch = useDispatch();
  const {user,isAuthenticated} = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      console.log("Skipping as user is not authenticated or email is missing.");
      return;
    }
  
    const today = moment().tz("Asia/Kolkata").startOf("day").format("YYYY-MM-DD");
  
    try {
      const userProcessedMap = JSON.parse(localStorage.getItem("userProcessedMap")) || {};
      const lastProcessedDate = localStorage.getItem("lastProcessedDate");
  
      if (lastProcessedDate !== today) {
        Object.keys(userProcessedMap).forEach((email) => {
          userProcessedMap[email] = false;
        });
        localStorage.setItem("userProcessedMap", JSON.stringify(userProcessedMap));
        localStorage.setItem("lastProcessedDate", today);
        console.log("Reset userProcessedMap for a new day");
      }
  
      if (!userProcessedMap[user.email]) {
        dispatch(addFullDayEarning({ date: today }));
        userProcessedMap[user.email] = true;
        localStorage.setItem("userProcessedMap", JSON.stringify(userProcessedMap));
        console.log(`Processed income for user: ${user.email}`);
        toast.success("Previous income added");
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [isAuthenticated, user?.email, dispatch]); // Minimal and essential dependencies
  
  useEffect(() => {
    dispatch(loadUser()); // Dispatch an action to check user authentication
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/me/update" element={<EditProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
        <Route path="/earning" element={<DailyEarning />} />
        <Route path="/charts" element={<AllCharts />} />
        <Route path="/history" element={<AllData />} />
        <Route path="/investment" element={<Investment />} />
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
        <Route path="/staffMangement" element={<StaffManagement />} />
        <Route path="/uDhaarBook" element={<UdhaarBook />} />
        <Route path="/billing" element={<Billing />} />
        <Route exact path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
