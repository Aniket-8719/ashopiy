// src/utils/axiosInstance.js
import axios from "axios";
import store from "../store";
import { logout } from "../actions/userAction";

// ✅ Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // always send cookies
});

// ✅ Response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout()); // auto logout when token expired
    }
    return Promise.reject(error);
  }
);

export default api;
