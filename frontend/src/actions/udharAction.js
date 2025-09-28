import {
  ADD_UDHAR_REQUEST,
  ADD_UDHAR_SUCCESS,
  ADD_UDHAR_FAIL,

  GET_UDHAR_REQUEST,
  GET_UDHAR_SUCCESS,
  GET_UDHAR_FAIL,

  GET_SINGLE_UDHAR_REQUEST,
  GET_SINGLE_UDHAR_SUCCESS,
  GET_SINGLE_UDHAR_FAIL,

  DELETE_UDHAR_REQUEST,
  DELETE_UDHAR_SUCCESS,
  DELETE_UDHAR_FAIL,

  UPDATE_UDHAR_REQUEST,
  UPDATE_UDHAR_SUCCESS,
  UPDATE_UDHAR_FAIL,

  CLEAR_ERRORS,
} from "../constants/udharConstants";
import api from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Add Udhar Data
export const addUdhar = (addData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_UDHAR_REQUEST });

    // Configuration for the request
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Ensure credentials like cookies are sent
    };

    // Making the POST request to add income
    const { data } = await api.post(
      `${API_URL}/api/v2/createUdhar`,
      addData,
      config
    );

    // Dispatch success action with response data
    dispatch({
      type: ADD_UDHAR_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // Extract a proper error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Dispatch failure action with the error message
    dispatch({
      type: ADD_UDHAR_FAIL,
      payload: errorMessage,
    });
  }
};

// GET Udhar Data
export const getAllUdhar = (searchQuery) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_UDHAR_REQUEST });
      const { data } = await api.get(
        `${API_URL}/api/v2/allUdhars?search=${searchQuery}`,
        {
          withCredentials: true, // Include this option to send cookies with the request
        }
      );
      dispatch({
        type: GET_UDHAR_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_UDHAR_FAIL,
        payload: error.response.data.message || "Failed to fetch earnings",
      });
    }
  };

// get  Single Udhar Details
export const getSingleUdhar = (id) => async (dispatch) => {
    try {
      dispatch({ type: GET_SINGLE_UDHAR_REQUEST });
      const { data } = await api.get(`${API_URL}/api/v2/udhar/${id}`, {
        withCredentials: true, // Include this option to send cookies with the request
      });
  
      dispatch({ type: GET_SINGLE_UDHAR_SUCCESS, payload: data.udhar });
    } catch (error) {
      dispatch({ type: GET_SINGLE_UDHAR_FAIL, payload: error.response.data.message });
    }
  };

// UPDATE Udhar
export const updateUdhar = (id, addData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_UDHAR_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await api.put(
      `${API_URL}/api/v2/udhar/${id}`,
      addData,
      config
    );

    dispatch({ type: UPDATE_UDHAR_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_UDHAR_FAIL,
      payload: error.response.data.message,
    });
  }
};

// DELETE udhar Data
export const deleteUdhar = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_UDHAR_REQUEST });
    const { data } = await api.delete(`${API_URL}/api/v2/udhar/${id}`, {
      withCredentials: true, // Include this option to send cookies with the request
    });
    dispatch({ type: DELETE_UDHAR_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_UDHAR_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
