import axios from "axios";
import {
  GET_TODAY_EARNING_REQUEST,
  GET_TODAY_EARNING_SUCCESS,
  GET_TODAY_EARNING_FAIL,

  ADD_TODAY_EARNING_REQUEST,
  ADD_TODAY_EARNING_SUCCESS,
  ADD_TODAY_EARNING_FAIL,

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

  CLEAR_ERRORS,
} from "../constants/earningConstants";

const API_URL = process.env.REACT_APP_BACKEND_URL;


// Add Today Data
export const addTodayEarning = (addData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TODAY_EARNING_REQUEST });
    const config = {
      headers:   {"Content-Type": "application/json"} ,
      withCredentials: true,
    };

    const { data } = await axios.post(`${API_URL}/api/v2/newIncome`, addData, config);
    dispatch({ type: ADD_TODAY_EARNING_SUCCESS, payload: data.success });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
    dispatch({ type: ADD_TODAY_EARNING_FAIL, payload: errorMessage });
  }
};

// GET Today Data
export const getTodayEarning = (date, month, year) => async (dispatch) => {
  try {
    dispatch({ type: GET_TODAY_EARNING_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v2/todayIncome?date=${date}&month=${month}&year=${year}`);
    dispatch({
      type: GET_TODAY_EARNING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TODAY_EARNING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// update income
export const updateTodayIncome=(id,productData)=> async(dispatch)=>{
  try{
    dispatch({type:UPDATE_TODAY_EARNING_REQUEST});
    const config = {
      headers:   {"Content-Type": "application/json"} ,
      withCredentials: true,
    };
    const {data} = await axios.put(`${API_URL}/api/v2/todayIncome/${id}`, productData, config);

    dispatch({type:UPDATE_TODAY_EARNING_SUCCESS, payload:data})
  }catch(error){
    dispatch({type:UPDATE_TODAY_EARNING_FAIL, payload: error.response.data.message});
  }
}; 

// DELETE Today Data
export const deleteTodayIncome=(id)=> async(dispatch)=>{
  try{
    dispatch({type:DELETE_TODAY_EARNING_REQUEST});
    const {data} = await axios.delete(`${API_URL}/api/v2/todayIncome/${id}`);
    dispatch({type:DELETE_TODAY_EARNING_SUCCESS, payload:data})
    console.log(data.success);
    
  }catch(error){
    dispatch({type:DELETE_TODAY_EARNING_FAIL, payload: error.response.data.message});
  }
}; 

// PER DAY DATA
export const getPerDayData = (month, year) => async (dispatch) => {
  try {
    dispatch({ type: DAY_EARNING_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v2/perMonthIncome?&month=${month}&year=${year}`);
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
    const { data } = await axios.get(`${API_URL}/api/v2/getMonthlyIncome?year=${year}`);
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

// MONTHLY DATA
export const getYearlyData = () => async (dispatch) => {
  try {
    dispatch({ type: YEARLY_EARNING_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v2/getYearlyIncome`);
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

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
