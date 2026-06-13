import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import loadingReducer from "./loadingReducer";
import appSessionReducer from "./appSessionReducer";

const rootReducer = combineReducers({
  session: userSessionReducer,
  loading: loadingReducer,
  appSession: appSessionReducer,
});
export default rootReducer;
