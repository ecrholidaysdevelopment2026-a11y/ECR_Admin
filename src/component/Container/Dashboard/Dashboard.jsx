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

import { Line } from "react-chartjs-2";
import { CalendarCheck, LucideHome } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../../store/slice/dashboardSlice";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import SelectedCalendar from "../../../common/selectedCalendar";
import { getDailyBookingSummary } from "../../../store/slice/bookingSlice";
import { MotionScrollRow } from "../../../common/MotionScrollRow";
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

    const checkIn = dailySummary?.checkIn || null;
    const checkOut = dailySummary?.checkOut || null;
    const totalBookings = dailySummary?.total || null;


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
            <div
                className="rounded-xl p-6 shadow-lg my-5"
                style={{ backgroundColor: "var(--card-bg)" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-5 flex justify-start">
                        <SelectedCalendar
                            onDateSelect={(date) => {
                                setDate(date);
                            }}
                        />

                    </div>
                    <div className="lg:col-span-7 space-y-1">
                        <h3 className="text-sm font-semibold px-1">Checked In Today</h3>
                        <MotionScrollRow
                            data={checkIn}
                            type="checkin"
                            speed={35}
                        />
                        <h3 className="text-sm font-semibold px-1">Checked Out Today</h3>
                        <MotionScrollRow
                            direction="right"
                            data={checkOut}
                            type="checkin"
                            speed={35}
                        />
                        <h3 className="text-sm font-semibold px-1">Booking</h3>
                        <MotionScrollRow
                            direction="left"
                            data={totalBookings}
                            type="checkin"
                            speed={35}
                        />
                    </div>

                </div>
            </div>

            <div className="w-full">
                <div
                    className="w-full rounded-xl p-6 shadow-lg"
                    style={{ backgroundColor: "var(--card-bg)" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Revenue</h3>

                        <div className="flex gap-2">
                            {["Month"].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-1.5 text-sm rounded-md transition
                            ${selectedPeriod === period
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-800 text-white"
                                        }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[321px] w-full">
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
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
