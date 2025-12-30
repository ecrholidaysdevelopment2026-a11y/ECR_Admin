import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export const socket = io(SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: true,
});
socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("❌ SOCKET ERROR:", err.message);
});
