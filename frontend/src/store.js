import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; 
import { composeWithDevTools } from "redux-devtools-extension";
import { addEarningReducer, deleteORUpdateEarningReducer, earningReducer, monthlyHistoryReducer, monthlyReducer, perDayReducer, yearlyReducer } from "./reducers/earningReducer";
import { addInvestmentReducer, deleteORUpdateInvestmentReducer, getInvestmentReducer } from "./reducers/investmentReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  profileUpdateDelete: profileReducer,
  forgotPassword: forgotPasswordReducer,
  todayEarnings: earningReducer, 
  currentEarning: addEarningReducer,
  deleteUpdateEarning: deleteORUpdateEarningReducer,
  perDay: perDayReducer,
  monthly: monthlyReducer,
  yearly: yearlyReducer,
  currentInvestment: addInvestmentReducer,
  investmentData: getInvestmentReducer,
  deleteUpdateInvestment: deleteORUpdateInvestmentReducer,
  monthlyHistory:monthlyHistoryReducer,
  // admin
  allUser:allUsersReducer,
  singleUser:userDetailsReducer,
});

// Initial state
let initialState = {}; // You can add default values here if needed

// Middleware
// const middleware = [thunk];

// Create store
const store = createStore(
  rootReducer,
  initialState,
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__)
    ? composeWithDevTools(applyMiddleware(thunk)) // If DevTools is available
    : applyMiddleware(thunk) // Fallback for environments without DevTools
);

export default store;
