import { useEffect, useRef, useState } from "react";
import {
    FiBell,
    FiSearch,
    FiSun,
    FiMoon,
    FiUser,
    FiLogOut,
    FiCheckCircle,
    FiInfo,
    FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProfile } from "../../../store/slice/userSlice";
import { logout } from "../../../store/slice/loginSlice";
import { Link } from "react-router-dom";
import Image from "../../../common/Image";

const placeholders = [
    "Search luxury villas...",
    "Search villas by location...",
    "Search villas by budget...",
];

const notifications = [
    {
        text: "New villa inquiry received",
        icon: <FiInfo />,
        color: "text-blue-500",
    },
    {
        text: "Booking confirmed successfully",
        icon: <FiCheckCircle />,
        color: "text-green-500",
        extra: "+2.59%",
        extraColor: "text-green-500",
    },
    {
        text: "Payment pending",
        icon: <FiAlertCircle />,
        color: "text-red-500",
        extra: "-0.95%",
        extraColor: "text-blue-500",
    },
];

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

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

    return (
        <header
            className="w-full h-16 px-6 flex items-center justify-between transition-colors"
            style={{
                background: "var(--bg)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text)",
            }}
        >
            <div
                className="flex items-center gap-2 px-3 py-2 w-[60%] relative rounded-md"
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
                    onMouseEnter={() => setOpenNotifications(true)}
                    onMouseLeave={() => setOpenNotifications(false)}
                >
                    <button
                        className="relative p-2 rounded-full"
                        style={{ background: "var(--card-bg)" }}
                    >
                        <FiBell size={22} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            3
                        </span>
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

                                <div className="px-4 py-3 space-y-4">
                                    {notifications.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}
                                                    style={{ background: "var(--card-bg)" }}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span className="text-sm">{item.text}</span>
                                            </div>

                                            {item.extra && (
                                                <span
                                                    className={`text-sm font-medium ${item.extraColor}`}
                                                >
                                                    {item.extra}
                                                </span>
                                            )}
                                        </div>
                                    ))}
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
                        src={userData?.profilePhoto ? userData?.profilePhoto : "https://i.pravatar.cc/40"}
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
                                <Link to={"/profile"} className="flex items-center gap-2 px-4 py-2 w-full ">
                                    <FiUser size={16} /> Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center cursor-pointer gap-2 px-4 py-2 w-full text-red-500 "
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
