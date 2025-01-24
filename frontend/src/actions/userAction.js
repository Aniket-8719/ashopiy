import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  CONTACTUS_REQUEST,
  CONTACTUS_SUCCESS,
  CONTACTUS_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${API_URL}/api/v2/loginUser`,
      { email, password },
      config
    );

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
  }
};

//  Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file upload
      },
      withCredentials: true, // Include cookies for authentication
    };

    const { data } = await axios.post(
      `${API_URL}/api/v2/registerUser`, // Replace with your API endpoint
      userData,
      config
    );   
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data?.message || "Server Error",
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v2/me`, {
      withCredentials: true,
    });

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
  }
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${API_URL}/api/v2/logout`, {
      withCredentials: true, // Include this option to send cookies with the request
    });

    dispatch({ type: LOGOUT_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_USER_FAIL, payload: error.response.data.message });
  }
};

//  Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: { "Content-type": "multipart/form-data" },
      withCredentials: true, // Include this option to send cookies with the request
    };
 
    const { data } = await axios.put(
      `${API_URL}/api/v2/me/update`,
      userData,
      config
    );
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-type": "application/json" },
      withCredentials: true, // Include this option to send cookies with the request
    };

    const { data } = await axios.put(
      `${API_URL}/api/v2/password/update`,
      passwords,
      config
    );
    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Include this option to send cookies with the request
    };
    const { data } = await axios.post(
      `${API_URL}/api/v2/password/forgot`,
      email,
      config
    );
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Include this option to send cookies with the request
    };

    const { data } = await axios.put(
      `${API_URL}/api/v2/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get All Users with filters
export const getAllUsers = (queryParams = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_USERS_REQUEST });
      // Make the API call with query parameters
      const { data } = await axios.get(
        `${API_URL}/api/v2/admin/allUsers?${queryParams}`,
        {
          // params: queryParams, // This will append the query parameters to the URL
          withCredentials: true,
        }
      );

      dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
    } catch (error) {
      dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
    }
  };

// get  User Details
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v2/admin/user/${id}`, {
      withCredentials: true, // Include this option to send cookies with the request
    });

    dispatch({ type: USER_DETAILS_SUCCESS, payload: {
      user: data.user,
      dailyData: data.dailyData,
      fullDayData: data.fullDayData,
      investData: data.investData,
      DataNumbers: data.DataNumbers || "",
    }, });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
  }
};

// Update User
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Include this option to send cookies with the request
    };

    const { data } = await axios.put(
      `${API_URL}/api/v2/admin/user/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete User
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`${API_URL}/api/v2/admin/user/${id}`, {
      withCredentials: true, // Include this option to send cookies with the request
    });

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Contact Us page
export const contactUs = (sentData) => async (dispatch) => {
  try {
    dispatch({ type: CONTACTUS_REQUEST });

    // Configuration for the request
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Ensure credentials like cookies are sent
    };

    // Making the POST request to add income
    const { data } = await axios.post(
      `${API_URL}/api/v2/contactUs`,
      sentData,
      config
    );

    // Dispatch success action with response data
    dispatch({
      type: CONTACTUS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // Extract a proper error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Dispatch failure action with the error message
    dispatch({
      type: CONTACTUS_FAIL,
      payload: errorMessage,
    });
  }
};

// clear errors
export const clearError = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
