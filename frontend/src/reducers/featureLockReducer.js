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
    
    
    CREATE_APPLOCK_REQUEST,
    CREATE_APPLOCK_SUCCESS,
    CREATE_APPLOCK_FAIL,
    CREATE_APPLOCK_RESET,
    
    UPDATE_ACCESS_FEATURES_REQUEST,
    UPDATE_ACCESS_FEATURES_SUCCESS,
    UPDATE_ACCESS_FEATURES_FAIL,
    UPDATE_ACCESS_FEATURES_RESET,
    
    DELETE_APPLOCK_REQUEST,
    DELETE_APPLOCK_SUCCESS,
    DELETE_APPLOCK_FAIL,
    DELETE_APPLOCK_RESET,
    
    GET_ALL_APPLOCKS_REQUEST,
    GET_ALL_APPLOCKS_SUCCESS,
    GET_ALL_APPLOCKS_FAIL,
   
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

// Create AppLock reducer
export const createAppLockReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_APPLOCK_REQUEST:
      return { loading: true };
    case CREATE_APPLOCK_SUCCESS:
      return {
        loading: false,
        isCreated: true,
        appLock: action.payload,
      };
    case CREATE_APPLOCK_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CREATE_APPLOCK_RESET:
      return {
        isCreated: false,
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

// Get all AppLocks reducer
export const getAllAppLocksReducer = (state = { appLocks: [] }, action) => {
  switch (action.type) {
    case GET_ALL_APPLOCKS_REQUEST:
      return {
        loading: true,
        appLocks: [],
      };
    case GET_ALL_APPLOCKS_SUCCESS:
      return {
        loading: false,
        appLocks: action.payload,
        count: action.payload.length,
      };
    case GET_ALL_APPLOCKS_FAIL:
      return {
        loading: false,
        error: action.payload,
        appLocks: [],
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

// AppLock combined reducer (similar to udhar's deleteORUpdateUdharReducer)
export const appLockOperationsReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ACCESS_FEATURES_REQUEST:
    case DELETE_APPLOCK_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ACCESS_FEATURES_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload.success,
        message: action.payload.message,
      };
    case DELETE_APPLOCK_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload.success,
        message: action.payload.message,
      };
    case UPDATE_ACCESS_FEATURES_FAIL:
    case DELETE_APPLOCK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ACCESS_FEATURES_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_APPLOCK_RESET:
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


