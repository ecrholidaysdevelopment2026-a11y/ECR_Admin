import { useState, useEffect, useRef } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CustomDatePicker = ({ selectedDate, onChange, minDate, label = "Select Date" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const datePickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const today = new Date();
    const minDateObj = minDate ? new Date(minDate) : today;

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    const handleDateSelect = (date) => {
        onChange(date);
        setIsOpen(false);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayIndex = getFirstDayOfMonth(year, month);
        const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const days = [];
        const prevMonthDays = getDaysInMonth(year, month - 1);
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const date = new Date(year, month - 1, day);
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isPastMonth: true
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isDisabled = date < minDateObj;
            const isPast = date < today;

            days.push({
                date,
                day,
                isCurrentMonth: true,
                isToday,
                isSelected,
                isDisabled,
                isPast
            });
        }

        const totalCells = 42;
        const nextMonthDays = totalCells - days.length;

        for (let day = 1; day <= nextMonthDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isNextMonth: true
            });
        }

        return days;
    };

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="relative" ref={datePickerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={selectedDate ? formatDate(selectedDate) : ""}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-300"
                    placeholder="Click to select a date"
                />
                <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Previous month"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Next month"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames?.map((day, index) => (
                            <div
                                key={index}
                                className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays?.map((dayData, index) => {
                            const { date, day, isCurrentMonth, isToday, isSelected, isDisabled, isPast } = dayData;

                            if (!isCurrentMonth) {
                                return (
                                    <div
                                        key={index}
                                        className="h-8 flex items-center justify-center text-xs text-gray-400"
                                    >
                                        {day}
                                    </div>
                                );
                            }

                            const isActuallyDisabled = isDisabled || isPast;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => !isActuallyDisabled && handleDateSelect(date)}
                                    disabled={isActuallyDisabled}
                                    className={`
                                        h-8 w-8 flex items-center justify-center text-xs font-medium rounded-full transition-colors mx-auto
                                        ${isSelected
                                            ? "bg-black text-white"
                                            : isToday
                                                ? "bg-gray-100 text-gray-900"
                                                : isPast
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : isDisabled
                                                        ? "text-gray-300 cursor-not-allowed"
                                                        : "text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleDateSelect(today)}
                            className="flex-1 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const tomorrow = new Date(today);
                                tomorrow.setDate(today.getDate() + 1);
                                handleDateSelect(tomorrow);
                            }}
                            className="flex-1 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Tomorrow
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;