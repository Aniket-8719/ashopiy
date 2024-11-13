import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; 
import { composeWithDevTools } from "redux-devtools-extension";
import { addEarningReducer, deleteEarningReducer, deleteORUpdateEarningReducer, earningReducer, monthlyReducer, perDayReducer, yearlyReducer } from "./reducers/earningReducer";
import { addInvestmentReducer, deleteORUpdateInvestmentReducer, getInvestmentReducer } from "./reducers/investmentReducer";

// Combine reducers
const rootReducer = combineReducers({
  todayEarnings: earningReducer, 
  currentEarning: addEarningReducer,
  deleteUpdateEarning: deleteORUpdateEarningReducer,
  perDay: perDayReducer,
  monthly: monthlyReducer,
  yearly: yearlyReducer,
  currentInvestment: addInvestmentReducer,
  investmentData: getInvestmentReducer,
  deleteUpdateInvestment: deleteORUpdateInvestmentReducer,
});

// Initial state
let initialState = {}; // You can add default values here if needed

// Middleware
const middleware = [thunk];

// Create store
const store = createStore(
  rootReducer,
  initialState,
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__)
    ? composeWithDevTools(applyMiddleware(thunk)) // If DevTools is available
    : applyMiddleware(thunk) // Fallback for environments without DevTools
);

export default store;
