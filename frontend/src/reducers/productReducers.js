import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  ADD_PRODUCT_RESET,
  GET_ALL_PRODUCTS_REQUEST,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_PRODUCTS_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_RESET,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_RESET,
  CLEAR_ERRORS,
} from "../constants/productConstants";

// Add Product
export const addProductReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_PRODUCT_REQUEST:
      return { loading: true };
    case ADD_PRODUCT_SUCCESS:
      return { loading: false, isAdded: true };
    case ADD_PRODUCT_FAIL:
      return { loading: false, error: action.payload };
    case ADD_PRODUCT_RESET:
      return { isAdded: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Get All Products
export const getAllProductsReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS_REQUEST:
      return { loading: true, categories: [] };
    case GET_ALL_PRODUCTS_SUCCESS:
      return { loading: false, categories: action.payload };
    case GET_ALL_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Update Product
export const updateProductReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT_REQUEST:
      return { loading: true };
    case UPDATE_PRODUCT_SUCCESS:
      return { loading: false, isUpdated: true };
    case UPDATE_PRODUCT_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_PRODUCT_RESET:
      return { isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Delete Product
export const deleteProductReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
      return { loading: true };
    case DELETE_PRODUCT_SUCCESS:
      return { loading: false, isDeleted: true };
    case DELETE_PRODUCT_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_PRODUCT_RESET:
      return { isDeleted: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
