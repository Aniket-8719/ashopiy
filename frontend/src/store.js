import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; 
import { composeWithDevTools } from "redux-devtools-extension";
import { addEarningReducer, completeDataReducer, deleteORUpdateEarningReducer, earningReducer, monthlyHistoryReducer, monthlyReducer, perDayReducer, yearlyReducer } from "./reducers/earningReducer";
import { addInvestmentReducer, deleteORUpdateInvestmentReducer, getInvestmentReducer } from "./reducers/investmentReducer";
import { allUsersReducer, contactusRducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import {addUdharReducer, deleteORUpdateUdharReducer, getSingleUdharReducer, getUdharReducer} from "./reducers/udharReducer";

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
  currentUdhar: addUdharReducer,
  allUdharInfo: getUdharReducer,
  singleUdhar: getSingleUdharReducer,
  deleteORUpdateUdhar: deleteORUpdateUdharReducer,
  monthlyHistory:monthlyHistoryReducer,
  completeData: completeDataReducer,
  contactUsMessage: contactusRducer,
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
  (process.env.REACT_APP_NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__)
    ? composeWithDevTools(applyMiddleware(thunk)) // If DevTools is available
    : applyMiddleware(thunk) // Fallback for environments without DevTools
);

export default store;
