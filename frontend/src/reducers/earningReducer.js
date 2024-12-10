import {
  GET_TODAY_EARNING_REQUEST,
  GET_TODAY_EARNING_SUCCESS,
  GET_TODAY_EARNING_FAIL,

  ADD_TODAY_EARNING_REQUEST,
  ADD_TODAY_EARNING_SUCCESS,
  ADD_TODAY_EARNING_FAIL,
  ADD_TODAY_EARNING_RESET,

  UPDATE_TODAY_EARNING_REQUEST,
  UPDATE_TODAY_EARNING_SUCCESS,
  UPDATE_TODAY_EARNING_FAIL,
  UPDATE_TODAY_EARNING_RESET,

  DELETE_TODAY_EARNING_REQUEST,
  DELETE_TODAY_EARNING_SUCCESS,
  DELETE_TODAY_EARNING_FAIL,
  DELETE_TODAY_EARNING_RESET,
 
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
  
  CLEAR_ERRORS,

} from "../constants/earningConstants";

// ADD Today Data
export const addEarningReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TODAY_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_TODAY_EARNING_SUCCESS:
      return {
        ...state,
        loading: false,
        isAdded: true,
      };
    case ADD_TODAY_EARNING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_TODAY_EARNING_RESET:
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

// GET Today Data
export const earningReducer = (state = { todayData: {} }, action) => {
  switch (action.type) {
    case GET_TODAY_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_TODAY_EARNING_SUCCESS:
      return {
        loading: false,
        todayData: action.payload,
        error: null,
      };
    case GET_TODAY_EARNING_FAIL:
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
export const deleteORUpdateEarningReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TODAY_EARNING_REQUEST:
    case UPDATE_TODAY_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_TODAY_EARNING_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload.success,
        message: action.payload.message,
      };
    case UPDATE_TODAY_EARNING_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload.success,
        message: action.payload.message,
      };
    case UPDATE_TODAY_EARNING_FAIL:
    case DELETE_TODAY_EARNING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_TODAY_EARNING_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_TODAY_EARNING_RESET:
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

// PER DAY DATA 
export const perDayReducer = (state = { data: {} }, action) => {
  switch (action.type) {
    case DAY_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DAY_EARNING_SUCCESS:
      return {
        loading: false,
        data: action.payload,
      };
    case DAY_EARNING_FAIL:
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

// MONTHLY DATA
export const monthlyReducer = (state = { data: {} }, action) => {
  switch (action.type) {
    case MONTHLY_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MONTHLY_EARNING_SUCCESS:
      return {
        loading: false,
        data: action.payload,
      };
    case MONTHLY_EARNING_FAIL:
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

// YEARLY DATA
export const yearlyReducer = (state = { data: {} }, action) => {
  switch (action.type) {
    case YEARLY_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case YEARLY_EARNING_SUCCESS:
      return {
        loading: false,
        data: action.payload,
      };
    case YEARLY_EARNING_FAIL:
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

// GET Monthly History
export const monthlyHistoryReducer = (state = { monthlyHistoryData: {} }, action) => {
  switch (action.type) {
    case GET_MONTHLY_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_MONTHLY_HISTORY_SUCCESS:
      return {
        loading: false,
        monthlyHistoryData: action.payload,
      };
    case GET_MONTHLY_HISTORY_FAIL:
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


