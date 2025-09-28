import {
  LOCK_FEATURE_REQUEST,
  LOCK_FEATURE_SUCCESS,
  LOCK_FEATURE_FAIL,
  GET_LOCK_LIST_REQUEST,
  GET_LOCK_LIST_SUCCESS,
  GET_LOCK_LIST_FAIL,
  UNLOCK_FEATURE_REQUEST,
  UNLOCK_FEATURE_SUCCESS,
  UNLOCK_FEATURE_FAIL,
  CREATE_APPLOCK_REQUEST,
  CREATE_APPLOCK_SUCCESS,
  CREATE_APPLOCK_FAIL,
  GET_ALL_APPLOCKS_REQUEST,
  GET_ALL_APPLOCKS_SUCCESS,
  GET_ALL_APPLOCKS_FAIL,
  UPDATE_ACCESS_FEATURES_REQUEST,
  UPDATE_ACCESS_FEATURES_SUCCESS,
  UPDATE_ACCESS_FEATURES_FAIL,
  DELETE_APPLOCK_REQUEST,
  DELETE_APPLOCK_SUCCESS,
  DELETE_APPLOCK_FAIL,
  CLEAR_ERRORS,
} from "../constants/appLockConstant";
import api from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// lock feature
export const lockFeature = (addData) => async (dispatch) => {
  try {
    dispatch({ type: LOCK_FEATURE_REQUEST });

    // Configuration for the request
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Ensure credentials like cookies are sent
    };

    // Making the POST request to add income
    const { data } = await api.post(
      `${API_URL}/api/v2/lockFeature`,
      addData,
      config
    );

    // Dispatch success action with response data
    dispatch({
      type: LOCK_FEATURE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // Extract a proper error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Dispatch failure action with the error message
    dispatch({
      type: LOCK_FEATURE_FAIL,
      payload: errorMessage,
    });
  }
};

// lock feature
export const unLockFeature = (addData) => async (dispatch) => {
  try {
    dispatch({ type: UNLOCK_FEATURE_REQUEST });

    // Configuration for the request
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Ensure credentials like cookies are sent
    };

    // Making the POST request to add income
    const { data } = await api.post(
      `${API_URL}/api/v2/unlockFeature`,
      addData,
      config
    );

    // Dispatch success action with response data
    dispatch({
      type: UNLOCK_FEATURE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // Extract a proper error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Dispatch failure action with the error message
    dispatch({
      type: UNLOCK_FEATURE_FAIL,
      payload: errorMessage,
    });
  }
};

// // Lock/Unlock List
export const lockList = () => async (dispatch) => {
  try {
    dispatch({ type: GET_LOCK_LIST_REQUEST });
    const { data } = await api.get(`${API_URL}/api/v2/lockFeatureList`, {
      withCredentials: true,
    });
    dispatch({
      type: GET_LOCK_LIST_SUCCESS,
      payload: data.lockfeaturelist,
    });
  } catch (error) {
    dispatch({
      type: GET_LOCK_LIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create AppLock for a worker
export const createAppLock = (appLockData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_APPLOCK_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await api.post(
      `${API_URL}/api/v2/create-lock`,
      appLockData,
      config
    );

    dispatch({
      type: CREATE_APPLOCK_SUCCESS,
      payload: data.document,
    });
  } catch (error) {
    dispatch({
      type: CREATE_APPLOCK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all AppLocks for shopkeeper
export const getAllAppLocks = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_APPLOCKS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await api.get(`${API_URL}/api/v2/all-locks`, config);

    dispatch({
      type: GET_ALL_APPLOCKS_SUCCESS,
      payload: data.documents,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_APPLOCKS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update access features
export const updateAccessFeatures = (id, features) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ACCESS_FEATURES_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await api.put(
      `${API_URL}/api/v2/updateLock/${id}`,
      { features },
      config
    );

    dispatch({
      type: UPDATE_ACCESS_FEATURES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ACCESS_FEATURES_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete AppLock
export const deleteAppLock = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_APPLOCK_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await api.delete(
      `${API_URL}/api/v2/deleteLock/${id}`,
      config
    );

    dispatch({
      type: DELETE_APPLOCK_SUCCESS,
      payload: data, 
    });
  } catch (error) {
    dispatch({
      type: DELETE_APPLOCK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
