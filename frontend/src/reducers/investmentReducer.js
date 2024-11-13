import { CLEAR_ERRORS } from "../constants/earningConstants";
import {
  ADD_INVESTMENT_REQUEST,
  ADD_INVESTMENT_SUCCESS,
  ADD_INVESTMENT_FAIL,
  ADD_INVESTMENT_RESET,

  GET_INVESTMENT_REQUEST,
  GET_INVESTMENT_SUCCESS,
  GET_INVESTMENT_FAIL,

  UPDATE_INVESTMENT_REQUEST,
  UPDATE_INVESTMENT_SUCCESS,
  UPDATE_INVESTMENT_FAIL,
  UPDATE_INVESTMENT_RESET,

  DELETE_INVESTMENT_REQUEST,
  DELETE_INVESTMENT_SUCCESS,
  DELETE_INVESTMENT_FAIL,
  DELETE_INVESTMENT_RESET, 

} from "../constants/investmentConstants";

// ADD Investment Data
export const addInvestmentReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_INVESTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_INVESTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAdded: action.payload,
      };
    case ADD_INVESTMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_INVESTMENT_RESET:
      return {
        ...state,
        isAdded: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// GET Investment Data
export const getInvestmentReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_INVESTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_INVESTMENT_SUCCESS:
      return {
        loading: false,
        ...action.payload,
      };
    case GET_INVESTMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// DELETE/UPDATE Today data
export const deleteORUpdateInvestmentReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_INVESTMENT_REQUEST:
    case UPDATE_INVESTMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_INVESTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload.success,
        message: action.payload.message,
      };
    case UPDATE_INVESTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload.success,
        message: action.payload.message,
      };
    case UPDATE_INVESTMENT_FAIL:
    case DELETE_INVESTMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_INVESTMENT_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_INVESTMENT_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
