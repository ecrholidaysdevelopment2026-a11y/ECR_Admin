import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiCalendar, FiHome, FiUser, FiDollarSign } from "react-icons/fi";
import { Mail, Phone, MapPin, Package } from "lucide-react";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import {
    getAllBookings,
    cancelBooking,
    clearBookingMessage,
    clearBookingError
} from "../../../store/slice/bookingSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";
import CreateBooking from "./CreateBooking";
import ViewBooking from "../../../pages/ViewBooking/ViewBooking";
import { format } from "date-fns";
import { getPaymentBadge, getStatusBadge } from "../../../utils/payment";

const BookingSection = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showView, setShowView] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);

    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPayment, setFilterPayment] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedBookings, setSelectedBookings] = useState([]);

    const { bookings, cancelLoading, cancelMessage, error } = useSelector((state) => state.booking);

    useEffect(() => {
        dispatch(getAllBookings());
    }, [dispatch]);

    useEffect(() => {
        if (cancelMessage) {
            successAlert(cancelMessage);
            dispatch(clearBookingMessage());
            dispatch(getAllBookings());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearBookingError());
        }
    }, [cancelMessage, error, dispatch]);

    const filteredBookings = bookings?.filter((booking) => {
        const matchesSearch =
            search === "" ||
            booking?.bookingId.toLowerCase().includes(search.toLowerCase()) ||
            booking?.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
            booking?.customer.email.toLowerCase().includes(search.toLowerCase()) ||
            booking?.villaId?.villaName?.toLowerCase().includes(search.toLowerCase()) ||
            booking?.locationId?.locationName?.toLowerCase().includes(search.toLowerCase());

        const matchesBookingStatus =
            filterStatus === "all" ||
            booking.bookingStatus === filterStatus;

        const matchesPaymentStatus =
            filterPayment === "all" ||
            booking.paymentStatus === filterPayment;

        return matchesSearch && matchesBookingStatus && matchesPaymentStatus;
    });

    const sortedBookings = [...filteredBookings]?.sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "amountHigh":
                return b.totalAmount - a.totalAmount;
            case "amountLow":
                return a.totalAmount - b.totalAmount;
            case "checkIn":
                return new Date(a.checkInDate) - new Date(b.checkInDate);
            default:
                return 0;
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd MMM yyyy");
    };



    const handleSelectBooking = (bookingId) => {
        setSelectedBookings((prev) =>
            prev.includes(bookingId)
                ? prev.filter((id) => id !== bookingId)
                : [...prev, bookingId]
        );
    };

    const handleSelectAll = () => {
        if (selectedBookings?.length === sortedBookings?.length) {
            setSelectedBookings([]);
        } else {
            setSelectedBookings(sortedBookings?.map((booking) => booking._id));
        }
    };

    const handleAddBooking = () => {
        setEditData(null);
        setShowCreate(true);
    };

    const handleCancel = () => {
        dispatch(cancelBooking(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    const handleCancelSelected = () => {
        console.log("Cancel selected bookings:", selectedBookings);
        setSelectedBookings([]);
    };

    if (showCreate) {
        return (
            <CreateBooking
                bookingData={editData}
                onBack={() => {
                    setShowCreate(false);
                    setEditData(null);
                    dispatch(getAllBookings());
                }}
            />
        );
    }

    if (showView) {
        return (
            <ViewBooking
                bookingData={viewData}
                onBack={() => {
                    setShowView(false);
                    setViewData(null);
                }}
            />
        );
    }

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={setSearch}
            itemsCount={sortedBookings.length}
            buttonName="Add Booking"
            displayTitle="Manage Bookings"
            onAddClick={handleAddBooking}
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Booking Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CHECKED_IN">Checked In</option>
                                <option value="CHECKED_OUT">Checked Out</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>

                            <select
                                value={filterPayment}
                                onChange={(e) => setFilterPayment(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Payment Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="PARTIAL">Partial</option>
                                <option value="PAID">Paid</option>
                                <option value="REFUNDED">Refunded</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="amountHigh">Amount (High to Low)</option>
                                <option value="amountLow">Amount (Low to High)</option>
                                <option value="checkIn">Check-in Date</option>
                            </select>
                        </div>
                    </div>
                </div>
                {selectedBookings?.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm font-medium text-blue-800">
                                {selectedBookings.length} booking(s) selected
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded hover:bg-blue-200">
                                    Export Selected
                                </button>
                                <button
                                    onClick={handleCancelSelected}
                                    className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200"
                                >
                                    Cancel Selected
                                </button>
                                <button
                                    onClick={() => setSelectedBookings([])}
                                    className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-6 py-3">
                                        <input
                                            type="checkbox"
                                            checked={
                                                sortedBookings.length > 0 &&
                                                selectedBookings.length === sortedBookings.length
                                            }
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Booking Details
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Villa  Name
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Location Name
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Villa & Dates
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Amount & Payment
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <FiCalendar className="w-12 h-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    No bookings found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedBookings?.map((booking) => (
                                        <tr
                                            key={booking._id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBookings.includes(booking._id)}
                                                    onChange={() => handleSelectBooking(booking._id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-semibold text-blue-600">
                                                        {booking.bookingId}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                        <FiUser size={14} />
                                                        {booking.customer.fullName}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Mail size={14} />
                                                        {booking.customer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Phone size={14} />
                                                        {booking.customer.mobile}
                                                    </div>
                                                    {booking.customer.address && (
                                                        <div className="flex items-start gap-2 text-xs text-gray-500">
                                                            <MapPin size={14} className="mt-0.5" />
                                                            <span className="line-clamp-2">{booking.customer.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                    <FiHome size={14} />
                                                    {booking.villaId?.villaName || "N/A"}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-xs text-gray-500">
                                                    {booking.locationId?.locationName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiCalendar size={14} />
                                                    {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                                        <FiDollarSign size={16} />
                                                        ₹{booking.totalAmount?.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Method: {booking.paymentMethod}
                                                    </div>
                                                    <div className="mt-1">
                                                        {getPaymentBadge(booking.paymentStatus)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {getStatusBadge(booking.bookingStatus)}
                                                    {booking.extraServices?.length > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-purple-600">
                                                            <Package size={12} />
                                                            {booking.extraServices.length} extra service(s)
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setViewData(booking);
                                                            setShowView(true);
                                                        }}
                                                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                                                        title="View Details"
                                                    >
                                                        <FiEye size={14} /> View
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditData(booking);
                                                            setShowCreate(true);
                                                        }}
                                                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                                        title="Edit Booking"
                                                    >
                                                        <FiEdit size={14} /> Edit
                                                    </button>
                                                    {/* <button
                                                        onClick={() => {
                                                            setDeleteId(booking._id);
                                                            setOpenDelete(true);
                                                        }}
                                                        disabled={booking.bookingStatus === "CANCELLED"}
                                                        className={`flex items-center justify-center gap-1 px-3 py-2 text-sm rounded ${booking.bookingStatus === "CANCELLED"
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-red-500 text-white hover:bg-red-600"
                                                            }`}
                                                        title={
                                                            booking.bookingStatus === "CANCELLED"
                                                                ? "Already Cancelled"
                                                                : "Cancel Booking"
                                                        }
                                                    >
                                                        <FiTrash2 size={14} /> Cancel
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ConfirmDeleteModal
                loading={cancelLoading}
                isOpen={openDelete}
                title="Are you sure you want to cancel this booking?"
                confirmText="Yes, Cancel Booking"
                cancelText="No, Keep Booking"
                onConfirm={handleCancel}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default BookingSection;