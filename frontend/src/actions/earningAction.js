import {
  GET_TODAY_EARNING_REQUEST,
  GET_TODAY_EARNING_SUCCESS,
  GET_TODAY_EARNING_FAIL,
  ADD_TODAY_EARNING_REQUEST,
  ADD_TODAY_EARNING_SUCCESS,
  ADD_TODAY_EARNING_FAIL,
  FULLDAY_EARNING_REQUEST,
  FULLDAY_EARNING_SUCCESS,
  FULLDAY_EARNING_FAIL,
  UPDATE_TODAY_EARNING_REQUEST,
  UPDATE_TODAY_EARNING_SUCCESS,
  UPDATE_TODAY_EARNING_FAIL,
  DELETE_TODAY_EARNING_REQUEST,
  DELETE_TODAY_EARNING_SUCCESS,
  DELETE_TODAY_EARNING_FAIL,
  DAY_EARNING_REQUEST,
  DAY_EARNING_SUCCESS,
  DAY_EARNING_FAIL,
  MONTHLY_EARNING_REQUEST,
  MONTHLY_EARNING_SUCCESS,
  MONTHLY_EARNING_FAIL,
  YEARLY_EARNING_REQUEST,
  YEARLY_EARNING_SUCCESS,
  YEARLY_EARNING_FAIL,
  GET_MONTHLY_HISTORY_REQUEST,
  GET_MONTHLY_HISTORY_SUCCESS,
  GET_MONTHLY_HISTORY_FAIL,
  GET_COMPLETE_DATA_REQUEST,
  GET_COMPLETE_DATA_SUCCESS,
  GET_COMPLETE_DATA_FAIL,
  CLEAR_ERRORS,
} from "../constants/earningConstants";
import api from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Add Today Data
export const addTodayEarning = (addData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TODAY_EARNING_REQUEST });

    // Configuration for the request
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Ensure credentials like cookies are sent
    };

    // Making the POST request to add income
    const { data } = await api.post(
      `${API_URL}/api/v2/newIncome`,
      addData,
      config
    );

    // Dispatch success action with response data
    dispatch({
      type: ADD_TODAY_EARNING_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // Extract a proper error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Dispatch failure action with the error message
    dispatch({
      type: ADD_TODAY_EARNING_FAIL,
      payload: errorMessage,
    });
  }
};

// Add Complete Day Data
export const addFullDayEarning = (addData) => async (dispatch) => {
  try {
    dispatch({ type: FULLDAY_EARNING_REQUEST });

    // Configuration for the request
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Ensure credentials like cookies are sent
    };

 
    const { data } = await api.post(
      `${API_URL}/api/v2/addFullDayIncome`,
      addData,
      config
    );

    // Dispatch success action with response data
    dispatch({
      type: FULLDAY_EARNING_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // Extract a proper error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Dispatch failure action with the error message
    dispatch({
      type: FULLDAY_EARNING_FAIL,
      payload: errorMessage,
    });
  }
};

// GET Today Data
export const getTodayEarning = (date, month, year) => async (dispatch) => {
  try {
    dispatch({ type: GET_TODAY_EARNING_REQUEST });
    const { data } = await api.get(
      `${API_URL}/api/v2/todayIncome?date=${date}&month=${month}&year=${year}`,
      {
        withCredentials: true, // Include this option to send cookies with the request
      }
    );
    dispatch({
      type: GET_TODAY_EARNING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TODAY_EARNING_FAIL,
      payload: error.response.data.message || "Failed to fetch earnings",
    });
  }
};

// update income
export const updateTodayIncome = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TODAY_EARNING_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await api.put(
      `${API_URL}/api/v2/todayIncome/${id}`,
      productData,
      config
    );

    dispatch({ type: UPDATE_TODAY_EARNING_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_TODAY_EARNING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// DELETE Today Data
export const deleteTodayIncome = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TODAY_EARNING_REQUEST });
    const { data } = await api.delete(`${API_URL}/api/v2/todayIncome/${id}`, {
      withCredentials: true, // Include this option to send cookies with the request
    });
    dispatch({ type: DELETE_TODAY_EARNING_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_TODAY_EARNING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// PER DAY DATA
export const getPerDayData = (month, year) => async (dispatch) => {
  try {
    dispatch({ type: DAY_EARNING_REQUEST });
    const { data } = await api.get(
      `${API_URL}/api/v2/perMonthIncome?&month=${month}&year=${year}`,
      {
        withCredentials: true, // Include this option to send cookies with the request
      }
    );
    dispatch({
      type: DAY_EARNING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DAY_EARNING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// MONTHLY DATA
export const getMonthlyData = (year) => async (dispatch) => {
  try {
    dispatch({ type: MONTHLY_EARNING_REQUEST });
    const { data } = await api.get(
      `${API_URL}/api/v2/getMonthlyIncome?year=${year}`,
      {
        withCredentials: true, // Include this option to send cookies with the request
      }
    );
    dispatch({
      type: MONTHLY_EARNING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MONTHLY_EARNING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// YEARLY DATA
export const getYearlyData = () => async (dispatch) => {
  try {
    dispatch({ type: YEARLY_EARNING_REQUEST });
    const { data } = await api.get(`${API_URL}/api/v2/getYearlyIncome`, {
      withCredentials: true, // Include this option to send cookies with the request
    });
    dispatch({
      type: YEARLY_EARNING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: YEARLY_EARNING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Monthly History
export const getMonthlyHistory = (month, year) => async (dispatch) => {
  try {
    dispatch({ type: GET_MONTHLY_HISTORY_REQUEST });
    const { data } = await api.get(
      `${API_URL}/api/v2/monthlyHistory?&month=${month}&year=${year}`,
      {
        withCredentials: true, // Include this option to send cookies with the request
      }
    );
    dispatch({
      type: GET_MONTHLY_HISTORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_MONTHLY_HISTORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Monthly History
export const getCompleteData = () => async (dispatch) => {
  try {
    dispatch({ type: GET_COMPLETE_DATA_REQUEST });
    const { data } = await api.get(
      `${API_URL}/api/v2/completeData`,
      {
        withCredentials: true, // Include this option to send cookies with the request
      }
    );
    dispatch({
      type: GET_COMPLETE_DATA_SUCCESS,
      payload: data.fullDayIncome,
    });
  } catch (error) {
    dispatch({
      type: GET_COMPLETE_DATA_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
