"use client";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AdminCalendar = ({ blockedDates = [] }) => {
    // 🔒 Always single month
    const [currentMonth, setCurrentMonth] = useState(() => {
        // Optional: derive year from data
        const year = blockedDates?.[0]
            ? new Date(blockedDates[0].startDate).getFullYear()
            : new Date().getFullYear();

        return new Date(year, 0, 1); // January
    });

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay();

    const generateCalendarDays = (year, month) => {
        const days = [];
        const firstDay = getFirstDayOfMonth(year, month);
        const totalDays = getDaysInMonth(year, month);

        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let d = 1; d <= totalDays; d++) {
            days.push(new Date(year, month, d));
        }
        return days;
    };

    const getBlockedInfo = (date) => {
        if (!date) return null;

        return blockedDates.find(block => {
            const start = new Date(block.startDate);
            const end = new Date(block.endDate);
            return date >= start && date <= end;
        });
    };

    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const renderMonth = () => {
        const days = generateCalendarDays(
            currentMonth.getFullYear(),
            currentMonth.getMonth()
        );

        return (
            <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(d => (
                        <div
                            key={d}
                            className="text-center text-xs font-medium text-gray-500"
                        >
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, idx) => {
                        const blocked = getBlockedInfo(date);
                        const isToday =
                            date &&
                            date.toDateString() ===
                            new Date().toDateString();

                        return (
                            <div
                                key={idx}
                                title={blocked?.reason || ""}
                                className={`
                                    h-8 md:h-10 flex items-center justify-center
                                    text-xs md:text-sm rounded-md
                                    ${!date ? "invisible" : ""}
                                    ${blocked ? "text-white" : "text-gray-800"}
                                    ${isToday ? "border border-blue-500" : ""}
                                `}
                                style={{
                                    backgroundColor: blocked?.color || "transparent",
                                }}
                            >
                                {date ? date.getDate() : ""}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <FiChevronLeft />
                </button>

                <h3 className="font-semibold">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                </h3>

                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <FiChevronRight />
                </button>
            </div>

            {renderMonth()}
        </div>
    );
};

export default AdminCalendar;
