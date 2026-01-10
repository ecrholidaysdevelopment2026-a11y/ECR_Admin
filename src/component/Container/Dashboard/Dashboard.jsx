import { useEffect, useState } from "react";
import {
    FiShoppingCart,
    FiUsers
} from "react-icons/fi";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { CalendarCheck, LucideHome } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../../store/slice/dashboardSlice";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import SelectedCalendar from "../../../common/selectedCalendar";

import { getDailyBookingSummary } from "../../../store/slice/bookingSlice";
import Image from "../../../common/Image";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats } = useSelector(
        (state) => state.dashboard
    );
    const [selectedPeriod, setSelectedPeriod] = useState("Day");
    const graphData = stats?.graph?.data || [];
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; 
    });

    const { dailySummary } = useSelector(
        (state) => state.booking
    );


    useEffect(() => {
        if (date) {
            dispatch(getDailyBookingSummary({ date }));
        }
    }, [date, dispatch]);



    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);


    const stat = [
        {
            title: "Total Booking",
            value: stats?.summary?.totalBookings ?? 0,
            change: "+0.43%",
            icon: <CalendarCheck />,
            color: "var(--text-green)",
        },
        {
            title: "Total Revenue",
            value: `₹${stats?.summary?.totalRevenue ?? 0}`,
            change: "+4.35%",
            icon: <FiShoppingCart />,
            color: "var(--text-green)",
        },
        {
            title: "Total Villas",
            value: stats?.summary?.totalVillas ?? 0,
            change: "+2.59%",
            icon: <LucideHome />,
            color: "var(--text-green)",
        },
        {
            title: "Total Users",
            value: stats?.summary?.totalActiveUsers ?? 0,
            change: "-0.95%",
            icon: <FiUsers />,
            color: "var(--text-blue)",
        },
    ];

    const lineData = {
        labels: graphData?.map(
            (item) => monthNames[item._id.month - 1]
        ),
        datasets: [
            {
                label: "Total Revenue",
                data: graphData?.map(item => item.totalRevenue),
                borderColor: "#6366F1",
                backgroundColor: "rgba(99,102,241,0.2)",
                fill: true,
                tension: 0.4
            },
            {
                label: "Total Bookings",
                data: graphData?.map(item => item.totalBookings),
                borderColor: "#60A5FA",
                backgroundColor: "rgba(96,165,250,0.2)",
                fill: true,
                tension: 0.4
            }
        ]
    };

    return (
        <div
            className="p-6 min-h-screen"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stat?.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-xl p-5 shadow-lg"
                        style={{ backgroundColor: "var(--card-bg)" }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-full"
                                style={{ backgroundColor: "var(--icon-bg)" }}
                            >
                                {item.icon}
                            </div>
                            <span className="text-sm" style={{ color: item.color }}>
                                {item.change}
                            </span>
                        </div>
                        <h2 className="text-2xl font-semibold">{item.value}</h2>
                        <p style={{ color: "var(--muted-text)" }}>{item.title}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div
                    className="lg:col-span-2 rounded-xl p-6 shadow-lg"
                    style={{ backgroundColor: "var(--card-bg)" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                        <div className="flex gap-2">
                            {["Day", "Week", "Month"].map((period) => (
                                <button
                                    key={period}
                                    className="px-3 py-1 rounded text-sm"
                                    style={{
                                        backgroundColor:
                                            selectedPeriod === period
                                                ? "var(--primary-red)"
                                                : "var(--card-bg-dark)",
                                        color: selectedPeriod === period ? "#fff" : "#fff",
                                    }}
                                    onClick={() => setSelectedPeriod(period)}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={lineData} />
                    </div>
                </div>
                <div
                    className="rounded-xl p-6 shadow-lg"
                    style={{ backgroundColor: "var(--card-bg)" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Booking Dates</h3>
                        <span style={{ color: "var(--muted-text)" }}>This Month</span>
                    </div>
                    <div className="flex justify-end py-10">
                        <SelectedCalendar
                            onDateSelect={(date) => {
                                setDate(date);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div
                className="mt-6 rounded-xl p-6 shadow-lg"
                style={{ backgroundColor: "var(--card-bg)" }}
            >
                {dailySummary?.length > 0 ? (
                    dailySummary.slice(0, 5).map((item) => (
                        <div
                            key={item._id}
                            className="flex gap-5 items-center mb-4 last:mb-0"
                        >
                            <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                    src={item.villaId?.images?.villaImage}
                                    alt={item.villaId?.villaName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {item.villaId?.villaName}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Booking ID:{" "}
                                    <span className="font-medium">{item.bookingId}</span>
                                </p>

                                <div className="mt-1 flex items-center gap-3">
                                    <span className="text-lg font-bold text-green-600">
                                        ₹{item.villaId?.offerPrice}
                                    </span>
                                    <span className="text-sm line-through text-gray-400">
                                        ₹{item.villaId?.price}
                                    </span>
                                    <span className="text-sm text-gray-500">/ night</span>
                                </div>

                                <p className="mt-1 text-sm font-semibold text-indigo-600">
                                    Total: ₹{item.totalAmount}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-6">
                        No bookings found for this date
                    </div>
                )}
            </div>
            <div
                className="mt-6 rounded-xl p-6 shadow-lg"
                style={{ backgroundColor: "var(--card-bg)" }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Bookings</h3>
                    <button
                        onClick={() => navigate("/booking")}
                        className=" font-medium bg-gray-900 p-2 cursor-pointer text-xs text-white rounded-sm"
                    >
                        View All Bookings
                    </button>
                </div>

                {stats?.recentBookings?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr
                                    className="text-left"
                                    style={{ color: "var(--muted-text)" }}
                                >
                                    <th className="pb-3">Booking ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Villa</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBookings?.map((booking) => (
                                    <tr
                                        key={booking.bookingId}
                                        className="border-t"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        <td className="py-3 font-medium">
                                            {booking.bookingId}
                                        </td>
                                        <td className="py-3">{booking.customerName}</td>
                                        <td className="py-3">{booking.villaName}</td>
                                        <td className="py-3">
                                            {formatDate(booking.createdAt)}
                                        </td>
                                        <td className="py-3 text-right font-semibold">
                                            {formatCurrency(booking.totalAmount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: "var(--muted-text)" }}>
                        No recent bookings found
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
