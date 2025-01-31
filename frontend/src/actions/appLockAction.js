import axios from "axios";
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
    
    CLEAR_ERRORS,
  } from "../constants/appLockConstant";

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
      const { data } = await axios.post(
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
      const { data } = await axios.post(
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

// Lock/Unlock List
export const lockList = () => async (dispatch) => {
    try {
      dispatch({ type: GET_LOCK_LIST_REQUEST });
      const { data } = await axios.get(
        `${API_URL}/api/v2/lockFeatureList`,
        {
          withCredentials: true, 
        }
      );
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

// clear Errors
  export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };