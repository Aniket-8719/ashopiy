import {
  ADD_UDHAR_REQUEST,
  ADD_UDHAR_SUCCESS,
  ADD_UDHAR_FAIL,
  ADD_UDHAR_RESET,

  GET_UDHAR_REQUEST,
  GET_UDHAR_SUCCESS,
  GET_UDHAR_FAIL,

  GET_SINGLE_UDHAR_REQUEST,
  GET_SINGLE_UDHAR_SUCCESS,
  GET_SINGLE_UDHAR_FAIL,
  
  DELETE_UDHAR_REQUEST,
  DELETE_UDHAR_SUCCESS,
  DELETE_UDHAR_FAIL,
  DELETE_UDHAR_RESET,
  
  UPDATE_UDHAR_REQUEST,
  UPDATE_UDHAR_SUCCESS,
  UPDATE_UDHAR_FAIL,
  UPDATE_UDHAR_RESET,
  
  CLEAR_ERRORS,
} from "../constants/udharConstants";

// ADD Udhar Data
export const addUdharReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_UDHAR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_UDHAR_SUCCESS:
      return {
        ...state,
        loading: false,
        isAdded: true,
      };
    case ADD_UDHAR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_UDHAR_RESET:
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

// GET Udhar Data
export const getUdharReducer = (state = { }, action) => {
  switch (action.type) {
    case GET_UDHAR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_UDHAR_SUCCESS:
      return {
        loading: false,
        udharData: action.payload,
        error: null,
      };
    case GET_UDHAR_FAIL:
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

  // Single Udhar Details
  export const getSingleUdharReducer = (state = {  }, action) => {
    switch (action.type) {
      case GET_SINGLE_UDHAR_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case GET_SINGLE_UDHAR_SUCCESS:
        return {
          ...state,
          loading: false,
          singleUdharDetails: action.payload,
        };
  
      case GET_SINGLE_UDHAR_FAIL:
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

// DELETE/UPDATE Udhar data
export const deleteORUpdateUdharReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_UDHAR_REQUEST:
    case UPDATE_UDHAR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_UDHAR_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload.success,
        message: action.payload.message,
      };
    case UPDATE_UDHAR_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload.success,
        message: action.payload.message,
      };
    case DELETE_UDHAR_FAIL:
    case UPDATE_UDHAR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_UDHAR_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_UDHAR_RESET:
      return {
        ...state,
        isUpdated: false,
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
