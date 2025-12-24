import { combineReducers } from "redux";
import loginReducer from "./slice/loginSlice";
import userReducer from "./slice/userSlice";
import locationReducer from "./slice/locationSlice";
import serviceReducer from "./slice/serviceSlice";
import villaReducer from "./slice/villaSlice";
import amenitiesReducer from "./slice/amenitiesSlice";
import bookingReducer from "./slice/bookingSlice";
const reducer = combineReducers({
  user: userReducer,
  auth: loginReducer,
  locations: locationReducer,
  service: serviceReducer,
  villa: villaReducer,
  amenities: amenitiesReducer,
  booking: bookingReducer,
});
export default reducer;
