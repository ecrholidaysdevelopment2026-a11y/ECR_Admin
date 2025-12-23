import { combineReducers } from "redux";
import loginReducer from "./slice/loginSlice";
import userReducer from "./slice/userSlice";
import locationReducer from "./slice/locationSlice";
import serviceReducer from "./slice/serviceSlice";
import villaReducer from "./slice/villaSlice";
const reducer = combineReducers({
  user: userReducer,
  auth: loginReducer,
  locations: locationReducer,
  service: serviceReducer,
  villa: villaReducer,
});
export default reducer;
