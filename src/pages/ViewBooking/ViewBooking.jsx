import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getBookingById } from "../../store/slice/bookingSlice"
import { FiArrowLeft, FiHome, FiUser, FiCalendar, FiDollarSign, FiCreditCard, FiMapPin, FiCheckCircle, FiXCircle, FiInfo, FiPackage, FiStar, FiClock } from "react-icons/fi"
import { format } from "date-fns"
import { getPaymentBadge, getStatusBadge } from "../../utils/payment"

function ViewBooking({ bookingData, onBack }) {
    const dispatch = useDispatch()
    const { selectedBooking, loading } = useSelector((state) => state.booking);

    useEffect(() => {
        if (bookingData?._id) {
            dispatch(getBookingById(bookingData.bookingId))
        }
    }, [bookingData, dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        )
    }

    const booking = selectedBooking || bookingData;
    if (!booking) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd MMM yyyy");
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
    };


    return (
        <div className="min-h-screen  p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                        <FiArrowLeft /> Back to Bookings
                    </button>
                </div>
                <div className="bg-white rounded-xl  overflow-hidden">
                    <div className=" p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                    Booking ID: {booking.bookingId}
                                </h1>
                                <p>
                                    Created on {formatDateTime(booking.createdAt)}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                                <div className="text-3xl font-bold">
                                    ₹{booking.totalAmount?.toLocaleString()}
                                </div>
                                <div className="flex gap-2">
                                    {getStatusBadge(booking.bookingStatus)}
                                    {getPaymentBadge(booking.paymentStatus)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FiUser className="text-blue-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Customer Details</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                        <p className="text-lg font-medium text-gray-900">{booking.customer?.fullName}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                            <p className="text-gray-900">{booking.customer?.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Mobile</label>
                                            <p className="text-gray-900">{booking.customer?.mobile}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                        <p className="text-gray-900">{booking.customer?.address || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FiHome className="text-green-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Villa Details</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Villa Name</label>
                                        <p className="text-lg font-medium text-gray-900">{booking.villaId?.villaName || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="text-gray-500" size={16} />
                                            <p className="text-gray-900">{booking.locationId?.locationName}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Max Guests</label>
                                            <p className="text-gray-900">{booking.villaId?.maxGuests || booking.guestDetails?.totalGuests}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Check-in Time</label>
                                            <p className="text-gray-900">{booking.villaId?.checkInTime || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Overview</label>
                                        <p className="text-gray-900">{booking.villaId?.overview || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FiCalendar className="text-purple-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Stay Details</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Check-in Date</label>
                                            <p className="text-lg font-medium text-blue-600">{formatDate(booking.checkInDate)}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Check-out Date</label>
                                            <p className="text-lg font-medium text-blue-600">{formatDate(booking.checkOutDate)}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Nights</label>
                                            <p className="text-xl font-bold text-gray-900">{booking.nights}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Adults</label>
                                            <p className="text-xl font-bold text-gray-900">{booking.guestDetails?.adults}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Children</label>
                                            <p className="text-xl font-bold text-gray-900">{booking.guestDetails?.children}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Total Guests</label>
                                        <p className="text-lg font-medium text-gray-900">{booking.guestDetails?.totalGuests} guests</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <FiDollarSign className="text-yellow-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Base Price</span>
                                        <span className="font-medium">₹{booking.basePrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Extra Services</span>
                                        <span className="font-medium">₹{booking.extraServiceTotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{booking.subTotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">GST ({booking.gstPercentage}%)</span>
                                        <span className="font-medium">₹{booking.gstAmount?.toLocaleString()}</span>
                                    </div>
                                    {booking.igstAmount > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-600">IGST ({booking.igstPercentage}%)</span>
                                            <span className="font-medium">₹{booking.igstAmount?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg">
                                        <span className="text-lg font-bold text-blue-800">Total Amount</span>
                                        <span className="text-2xl font-bold text-blue-800">₹{booking.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
                                            <p className="font-medium">{booking.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Payment Status</label>
                                            {getPaymentBadge(booking.paymentStatus)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {booking?.extraServices?.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 lg:col-span-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FiPackage className="text-purple-600" size={20} />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Extra Services</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Service Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Code</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {booking?.extraServices?.map((service, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{service.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">{service.code}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{service.price?.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 lg:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FiInfo className="text-gray-600" size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Special Notes</label>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[100px]">
                                            <p className="text-gray-900">{booking.notes || "No special notes provided."}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Timestamps</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <FiClock className="text-gray-400" size={14} />
                                                <span className="text-gray-600">Created: </span>
                                                <span className="font-medium">{formatDateTime(booking.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FiClock className="text-gray-400" size={14} />
                                                <span className="text-gray-600">Last Updated: </span>
                                                <span className="font-medium">{formatDateTime(booking.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBooking