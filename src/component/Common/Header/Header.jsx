import { useEffect, useRef, useState } from "react";
import {
    FiBell,
    FiSearch,
    FiSun,
    FiMoon,
    FiUser,
    FiLogOut,
    FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProfile } from "../../../store/slice/userSlice";
import { logout } from "../../../store/slice/loginSlice";
import { markAllRead } from "../../../store/slice/notificationSlice";
import { Link } from "react-router-dom";
import Image from "../../../common/Image";

const placeholders = [
    "Search luxury villas...",
    "Search villas by location...",
    "Search villas by budget...",
];

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioRef = useRef(null);

    const dispatch = useDispatch();

    const { userData } = useSelector((state) => state.user);
    const { list, unreadCount } = useSelector(
        (state) => state.notifications
    );

    const notificationRef = useRef(null);


    useEffect(() => {
        dispatch(getAdminProfile());
    }, [dispatch]);

    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

    useEffect(() => {
        if (inputValue) return;
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [inputValue]);


    const handleLogout = () => {
        dispatch(logout());
        setOpenProfile(false);
    };

    const handleOpenNotifications = () => {
        setOpenNotifications(true);
        dispatch(markAllRead());
    };

    useEffect(() => {
        window.__NOTIFICATION_SOUND_ENABLED__ = soundEnabled;
    }, [soundEnabled]);


    useEffect(() => {
        audioRef.current = new Audio("/sounds/notification.mp3");
        audioRef.current.volume = 0.6;

        const unlockAudio = () => {
            audioRef.current
                ?.play()
                .then(() => {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                })
                .catch(() => { });
            window.removeEventListener("click", unlockAudio);
        };

        window.addEventListener("click", unlockAudio);
        return () => window.removeEventListener("click", unlockAudio);
    }, []);


    return (
        <header
            className="w-full h-16 px-6 flex items-center justify-between"
            style={{
                background: "var(--bg)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text)",
            }}
        >
            <div
                className="flex items-center gap-2 px-3 py-2 w-[60%] rounded-md relative"
                style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                }}
            >
                <FiSearch size={18} />
                <div className="relative w-full h-5">
                    <AnimatePresence mode="wait">
                        {!inputValue && (
                            <motion.span
                                key={placeholderIndex}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.3 }}
                                className="absolute left-0 text-sm pointer-events-none"
                                style={{ color: "var(--muted-text)" }}
                            >
                                {placeholders[placeholderIndex]}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full absolute inset-0"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 relative">
                <button
                    onClick={() => setDarkMode((p) => !p)}
                    className="p-2 rounded-full"
                    style={{ background: "var(--card-bg)" }}
                >
                    {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
                <div
                    ref={notificationRef}
                    className="relative"
                    onMouseEnter={handleOpenNotifications}
                    onMouseLeave={() => setOpenNotifications(false)}
                >
                    <button
                        className="relative p-2 rounded-full"
                        style={{ background: "var(--card-bg)" }}
                    >
                        <FiBell size={22} />

                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {openNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl z-50"
                                style={{ background: "var(--bg)" }}
                            >
                                <div
                                    className="px-5 py-3 font-semibold"
                                    style={{ borderBottom: "1px solid var(--border)" }}
                                >
                                    Notifications
                                </div>

                                <div className="px-4 py-3 space-y-4 max-h-80 overflow-y-auto">
                                    {list?.length === 0 ? (
                                        <p className="text-sm text-center text-gray-400">
                                            No notifications
                                        </p>
                                    ) : (
                                        list?.map((item, i) => (
                                            <div
                                                key={item.bookingId || item.email || i}
                                                className="flex items-start gap-3"
                                            >
                                                <span
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === "USER_REGISTRATION"
                                                        ? "text-blue-500"
                                                        : "text-green-500"
                                                        }`}
                                                    style={{ background: "var(--card-bg)" }}
                                                >
                                                    {item.type === "USER_REGISTRATION" ? (
                                                        <FiUser />
                                                    ) : (
                                                        <FiCheckCircle />
                                                    )}
                                                </span>
                                                <div>
                                                    {item.type === "USER_REGISTRATION" && (
                                                        <>
                                                            <p className="text-xs text-gray-500">
                                                                {item.userName}  {item.userEmail}
                                                            </p>
                                                            <p>
                                                                / {item.createdAt}
                                                            </p>
                                                        </>
                                                    )}
                                                    {item.type === "USER_BOOKING" && (
                                                        <>
                                                            <p className="text-xs font-medium">
                                                                🏡 {item.villaName} booked
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                ₹{item.amount} / {item.createdAt}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div
                    className="relative"
                    onMouseEnter={() => setOpenProfile(true)}
                    onMouseLeave={() => setOpenProfile(false)}
                >
                    <Image
                        src={
                            userData?.profilePhoto
                                ? userData.profilePhoto
                                : "https://i.pravatar.cc/40"
                        }
                        alt="profile"
                        className="rounded-full cursor-pointer w-10 h-10 object-cover"
                    />

                    <AnimatePresence>
                        {openProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-40 shadow-lg rounded-lg overflow-hidden z-50"
                                style={{ background: "var(--bg)" }}
                            >
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2"
                                >
                                    <FiUser size={16} /> Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-red-500 w-full"
                                >
                                    <FiLogOut size={16} /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
