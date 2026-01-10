"use client";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SelectedCalendar = ({ onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState(null);

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

    const days = generateCalendarDays(
        currentMonth.getFullYear(),
        currentMonth.getMonth()
    );

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
                    const isToday =
                        date &&
                        date.toDateString() === new Date().toDateString();

                    const isSelected =
                        selectedDate &&
                        date &&
                        selectedDate.toDateString() === date.toDateString();

                    return (
                        <div
                            key={idx}
                            onClick={() => {
                                if (!date) return;
                                setSelectedDate(date);
                                onDateSelect?.(date);
                            }}
                            className={`
                h-8 md:h-8 flex items-center justify-center
                text-xs md:text-sm rounded-full cursor-pointer
                transition-colors duration-200
                ${!date ? "invisible" : ""}
                ${isSelected
                                    ? "bg-green-500 text-white"
                                    : "text-gray-800 hover:bg-gray-100"
                                }
                ${isToday && !isSelected ? "border border-green-500" : ""}
            `}
                        >
                            {date ? date.getDate() : ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SelectedCalendar;
