import {
    GET_LOCK_LIST_REQUEST,
    GET_LOCK_LIST_SUCCESS,
    GET_LOCK_LIST_FAIL,
    
    LOCK_FEATURE_REQUEST,
    LOCK_FEATURE_SUCCESS,
    LOCK_FEATURE_RESET,
    LOCK_FEATURE_FAIL,

    UNLOCK_FEATURE_REQUEST,
    UNLOCK_FEATURE_SUCCESS,
    UNLOCK_FEATURE_FAIL,
    UNLOCK_FEATURE_RESET,
    
    CLEAR_ERRORS,
} from "../constants/appLockConstant";

// Lock Feature 
export const lockFeatureReducer = (state = {}, action) => {
  switch (action.type) {
    case LOCK_FEATURE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOCK_FEATURE_SUCCESS:
      return {
        ...state,
        loading: false,
        isLock: true,
      };
    case LOCK_FEATURE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOCK_FEATURE_RESET:
      return {
        ...state,
        isLock: false,
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

// Unlock Feature 
export const unLockFeatureReducer = (state = {}, action) => {
  switch (action.type) {
    case UNLOCK_FEATURE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UNLOCK_FEATURE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUnlock: true,
      };
    case UNLOCK_FEATURE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UNLOCK_FEATURE_RESET:
      return {
        ...state,
        isUnlock: false,
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

// Lock List 
export const lockListReducer = (state = { LockList: {} }, action) => {
  switch (action.type) {
    case GET_LOCK_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_LOCK_LIST_SUCCESS: 
      return {
        loading: false,
        LockList: action.payload,
      };
    case GET_LOCK_LIST_FAIL:
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


