import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  GET_ALL_PRODUCTS_REQUEST,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_PRODUCTS_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "../constants/productConstants";
import api from "../utils/axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Add Product
export const addProduct = (data) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    await api.post(`${API_URL}/api/v2/createCategory`, data, config);

    dispatch({ type: ADD_PRODUCT_SUCCESS });
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Categories
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_PRODUCTS_REQUEST });

    const { data } = await api.get(`${API_URL}/api/v2/allCategories`, {
      withCredentials: true,
    });
    dispatch({ type: GET_ALL_PRODUCTS_SUCCESS, payload: data.categories });
  } catch (error) {
    dispatch({
      type: GET_ALL_PRODUCTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update Category
export const updateProduct = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    await api.put(`${API_URL}/api/v2/category/${id}`, data, config);

    dispatch({ type: UPDATE_PRODUCT_SUCCESS });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Category
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    await api.delete(`${API_URL}/api/v2/category/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: DELETE_PRODUCT_SUCCESS });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
