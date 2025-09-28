import {
  ADD_INVESTMENT_REQUEST,
  ADD_INVESTMENT_SUCCESS,
  ADD_INVESTMENT_FAIL,
  GET_INVESTMENT_REQUEST,
  GET_INVESTMENT_SUCCESS,
  GET_INVESTMENT_FAIL,
  UPDATE_INVESTMENT_REQUEST,
  UPDATE_INVESTMENT_SUCCESS,
  UPDATE_INVESTMENT_FAIL,
  DELETE_INVESTMENT_REQUEST,
  DELETE_INVESTMENT_SUCCESS,
  DELETE_INVESTMENT_FAIL,
  CLEAR_ERRORS,
} from "../constants/investmentConstants";
import api from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Add Investment Data
export const addInvestment = (addData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_INVESTMENT_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await api.post(
      `${API_URL}/api/v2/newInvestment`,
      addData,
      config
    );
    dispatch({ type: ADD_INVESTMENT_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: ADD_INVESTMENT_FAIL, payload: error.response.data.message, });
  }
};

// GET Investment Data
export const getInvestment = () => async (dispatch) => {
  try {
    dispatch({ type: GET_INVESTMENT_REQUEST });
    const { data } = await api.get(`${API_URL}/api/v2/allInvestment`, {
      withCredentials: true, // Include this option to send cookies with the request
    });
    dispatch({
      type: GET_INVESTMENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_INVESTMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// UPDATE INVESTMENT
export const updateInvestment = (id, investmentData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_INVESTMENT_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await api.put(
      `${API_URL}/api/v2/allInvestment/${id}`,
      investmentData,
      config
    );

    dispatch({ type: UPDATE_INVESTMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_INVESTMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// DELETE INVESTMENT
export const deleteInvestment = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_INVESTMENT_REQUEST });
    const { data } = await api.delete(
      `${API_URL}/api/v2/allInvestment/${id}`,
      {
        withCredentials: true, // Include this option to send cookies with the request
      }
    );
    dispatch({ type: DELETE_INVESTMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_INVESTMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
