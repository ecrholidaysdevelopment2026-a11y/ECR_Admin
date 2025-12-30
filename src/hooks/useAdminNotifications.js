import { useEffect } from "react";
import { socket } from "../utils/socket";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slice/notificationSlice";

export const useAdminNotifications = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected with id:", socket.id);
      socket.emit("join-admin");
    });

    const handleNewBooking = (data) => {
      console.log("📩 admin-notification received:", data);
      dispatch(addNotification(data));
    };

    socket.on("admin-notification", handleNewBooking);
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Socket connection error:", error.message);
    });

    return () => {
      socket.off("admin-notification", handleNewBooking);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [dispatch]);
};
