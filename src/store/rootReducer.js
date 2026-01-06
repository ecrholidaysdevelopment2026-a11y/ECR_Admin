import { combineReducers } from "redux";
import loginReducer from "./slice/loginSlice";
import userReducer from "./slice/userSlice";
import locationReducer from "./slice/locationSlice";
import serviceReducer from "./slice/serviceSlice";
import villaReducer from "./slice/villaSlice";
import amenitiesReducer from "./slice/amenitiesSlice";
import bookingReducer from "./slice/bookingSlice";
import promoReducer from "./slice/promoSlice";
import notificationReducer from "./slice/notificationSlice";
import dashboardReducer from "./slice/dashboardSlice";
import blockedDatesReducer from "./slice/blockedDatesSlice";

const reducer = combineReducers({
  user: userReducer,
  auth: loginReducer,
  locations: locationReducer,
  service: serviceReducer,
  villa: villaReducer,
  amenities: amenitiesReducer,
  booking: bookingReducer,
  promo: promoReducer,
  notifications: notificationReducer,
  dashboard: dashboardReducer,
  blockedDates: blockedDatesReducer,
});
export default reducer;
