import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedLayout from "./protectedRoute/ProtectedRoute";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import User from "./pages/User/User";
import NotFound from "./pages/NotFound/NotFound";
import { setupTokenRefresh } from "./utils/setupTokenRefresh";
import Locations from "./pages/Locations/Locations";
import Service from "./pages/Service/Service";
import Villa from "./pages/Villa/Villa";
import VillaDetails from "./pages/VillaDetails/VillaDetails";
import Amenities from "./pages/Amenities/Amenities";
import Booking from "./pages/Booking/Booking";
import Promo from "./pages/Promo/Promo";
import { useAdminNotifications } from "./hooks/useAdminNotifications";
import BlockedDates from "./pages/BlockedDates/BlockedDates";
import Lead from "./pages/Lead/Lead";

function App() {
  useAdminNotifications()
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      setupTokenRefresh(dispatch);
    }
  }, [accessToken, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<User />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/extra-services" element={<Service />} />
        <Route path="/villa" element={<Villa />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/villadetails/:slug" element={<VillaDetails />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/blocked-dates" element={<BlockedDates />} />
        <Route path="/enquiries" element={<Lead />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
