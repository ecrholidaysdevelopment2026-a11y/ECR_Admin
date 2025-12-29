import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    AiOutlineDashboard,
    AiOutlineSetting,
} from "react-icons/ai";
import {
    MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import {
    LuFolder,
    LuChevronDown,
    LuWrench,
    LuMapPin,
    LuSofa,
    LuTag,
} from "react-icons/lu";

import logo from "../../../assets/ecr-logo.svg";
import { FaGift, FaUserCheck } from "react-icons/fa";
import { LucideHome } from "lucide-react";

const Sidebar = () => {
    const [openCatalog, setOpenCatalog] = useState(true);

    const baseLink =
        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors";

    return (
        <aside
            className="h-screen flex flex-col shadow-md transition-colors duration-300"
            style={{
                background: "var(--bg)",
                color: "var(--text)",
                borderRight: "1px solid var(--border)",
            }}
        >
            <div
                className="flex items-center h-16 px-4"
                style={{ borderBottom: "1px solid var(--border)" }}
            >
                <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4">
                <nav className="flex flex-col gap-1">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${baseLink} ${isActive ? "bg-teal-700 text-white" : ""
                            }`
                        }
                        style={!window.location.pathname === "/" ? { color: "var(--text)" } : {}}
                        onMouseEnter={(e) =>
                            !e.currentTarget.classList.contains("bg-teal-700") &&
                            (e.currentTarget.style.background = "var(--card-bg)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                        }
                    >
                        <AiOutlineDashboard className="text-xl" />
                        Dashboard
                    </NavLink>
                    <button
                        onClick={() => setOpenCatalog(!openCatalog)}
                        className={`${baseLink} justify-between`}
                        style={{ color: "var(--text)" }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--card-bg)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                        }
                    >
                        <div className="flex items-center gap-3">
                            <LuFolder className="text-xl" />
                            Catalog
                        </div>
                        <LuChevronDown
                            className={`transition-transform duration-200 ${openCatalog ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                    {openCatalog && (
                        <div className="ml-8 flex flex-col gap-1 mt-1">
                            {[

                                {
                                    to: "/locations",
                                    label: "Location",
                                    icon: <LuMapPin />,
                                },
                                {
                                    to: "/extra-services",
                                    label: "Extra Service",
                                    icon: <LuWrench />,
                                },

                                {
                                    to: "/amenities",
                                    label: "Amenities",
                                    icon: <LuSofa />,
                                },
                                {
                                    to: "/promo",
                                    label: "Promo Code",
                                    icon: <LuTag />,
                                },
                                {
                                    to: "/villa",
                                    label: "Villa",
                                    icon: <LucideHome />,
                                },

                            ]?.map(({ to, label, icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 text-sm transition-colors ${isActive ? "font-medium" : ""
                                        }`
                                    }
                                    style={{ color: "var(--muted-text)" }}
                                >
                                    <span className="text-lg">{icon}</span>
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                    {[
                        { to: "/profile", label: "Profile", icon: <AiOutlineSetting /> },
                        { to: "/booking", label: "Booking", icon: <MdOutlineProductionQuantityLimits /> },
                        { to: "/users", label: "Users", icon: <FaUserCheck /> },
                    ].map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `${baseLink} ${isActive ? "bg-teal-700 text-white" : ""
                                }`
                            }
                        >
                            <span className="text-xl">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
