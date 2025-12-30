import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slice/notificationSlice";

export const useAdminNotifications = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.6;

    const onConnect = () => {
      console.log("✅ Socket connected with id:", socket.id);
      socket.emit("join-admin");
    };

    const handleNewNotification = (data) => {
      console.log("📩 admin-notification received:", data);

      dispatch(addNotification(data));

      if (window.__NOTIFICATION_SOUND_ENABLED__ !== false) {
        audioRef.current?.play().catch(() => {
          console.warn("🔇 Notification sound blocked until user interaction");
        });
      }
    };

    const onDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
    };

    const onError = (error) => {
      console.error("⚠️ Socket connection error:", error.message);
    };

    socket.on("connect", onConnect);
    socket.on("admin-notification", handleNewNotification);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("admin-notification", handleNewNotification);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, [dispatch]);
};
