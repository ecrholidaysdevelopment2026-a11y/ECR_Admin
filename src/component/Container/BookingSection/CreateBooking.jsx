"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

import {
    createBooking,
    updateBooking,
    getAllBookings,
    clearBookingMessage,
    clearBookingError,
} from "../../../store/slice/bookingSlice";

import { getAllVillas, searchVillas } from "../../../store/slice/villaSlice";
import { getAllLocations } from "../../../store/slice/locationSlice";
import { successAlert, errorAlert, warningAlert } from "../../../utils/alertService";
import { getAllExtraServices } from "../../../store/slice/serviceSlice";
import MultiSelectDropdown from "../../../common/MultiSelectDropdown";

const CreateBooking = ({ bookingData, onBack }) => {
    const dispatch = useDispatch();
    const { services } = useSelector((state) => state.service);
    const { loading, message, error } = useSelector((state) => state.booking);
    const { villas, searchResults, searchLoading } = useSelector((state) => state.villa);
    const { locations } = useSelector((state) => state.locations);

    const [step, setStep] = useState(1);
    const [filteredVillas, setFilteredVillas] = useState([]);
    const [searchExecuted, setSearchExecuted] = useState(false);

    useEffect(() => {
        dispatch(getAllExtraServices());
        dispatch(getAllVillas());
        dispatch(getAllLocations());
    }, [dispatch]);

    const [step1Data, setStep1Data] = useState({
        locationId: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        locationName: ""
    });

    const [step2Data, setStep2Data] = useState({
        villaId: "",
        gstPercentage: 0,
        igstPercentage: 0,
        paymentMethod: "RAZORPAY",
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        notes: "",
        promoCode: "",
        extraServices: [],
    });

    useEffect(() => {
        if (bookingData) {
            setStep1Data({
                locationId: bookingData?.locationId?._id || bookingData?.locationId,
                checkInDate: bookingData?.checkInDate?.slice(0, 10),
                checkOutDate: bookingData?.checkOutDate?.slice(0, 10),
                adults: bookingData?.guestDetails?.adults || 1,
                children: bookingData?.guestDetails?.children || 0,
            });

            setStep2Data({
                villaId: bookingData?.villaId?._id || bookingData?.villaId,
                gstPercentage: bookingData?.gstPercentage,
                igstPercentage: bookingData?.igstPercentage,
                paymentMethod: bookingData?.paymentMethod,
                fullName: bookingData?.customer?.fullName || "",
                email: bookingData?.customer?.email || "",
                mobile: bookingData?.customer?.mobile || "",
                address: bookingData?.customer?.address || "",
                notes: bookingData?.notes || "",
                promoCode: bookingData?.promo?.code || "",
                extraServices: Array.isArray(bookingData?.extraServices)
                    ? bookingData.extraServices.map(
                        (service) => service.extraServiceId
                    )
                    : [],
            });

            if (bookingData?.locationId) {
                const filtered = villas.filter(
                    (villa) => villa.locationId === (bookingData?.locationId?._id || bookingData?.locationId)
                );
                setFilteredVillas(filtered);
            }
        }
    }, [bookingData, villas]);

    const handleStep1Change = (e) => {
        const { name, value } = e.target;
        const newValue = name.includes('adults') || name.includes('children') ? parseInt(value) || 0 : value;
        setStep1Data((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleStep2Change = (e) => {
        const { name, value } = e.target;
        setStep2Data((prev) => ({ ...prev, [name]: value }));
    };

    const handleStep1Submit = async (e) => {
        e.preventDefault();
        if (!step1Data.locationId || !step1Data.checkInDate || !step1Data.checkOutDate) {
            warningAlert("Please fill all required fields in Step 1");
            return;
        }

        if (new Date(step1Data.checkOutDate) <= new Date(step1Data.checkInDate)) {
            warningAlert("Check-out date must be after check-in date");
            return;
        }

        if (step1Data.adults < 1) {
            warningAlert("At least 1 adult is required");
            return;
        }

        if (step1Data.children < 0) {
            warningAlert("Number of children cannot be negative");
            return;
        }

        try {
            await dispatch(
                searchVillas({
                    destination: step1Data?.locationName,
                    locationId: step1Data.locationId,
                    checkIn: step1Data.checkInDate,
                    checkOut: step1Data.checkOutDate,
                    adults: step1Data.adults,
                    children: step1Data.children,
                })
            );

            setSearchExecuted(true);
            setStep(2);
        } catch (error) {
            errorAlert("Failed to search for available villas");
        }
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();

        if (!step2Data.villaId) {
            warningAlert("Please select a villa");
            return;
        }

        if (!step2Data.fullName || !step2Data.email || !step2Data.mobile || !step2Data.address) {
            warningAlert("Please fill all required customer information");
            return;
        }

        const payload = {
            villaId: step2Data.villaId,
            locationId: step1Data.locationId,
            checkInDate: step1Data.checkInDate,
            checkOutDate: step1Data.checkOutDate,
            gstPercentage: Number(step2Data.gstPercentage),
            igstPercentage: Number(step2Data.igstPercentage),
            paymentMethod: step2Data.paymentMethod,
            promoCode: step2Data.promoCode,
            extraServices: step2Data.extraServices,
            customer: {
                fullName: step2Data.fullName,
                email: step2Data.email,
                mobile: step2Data.mobile,
                address: step2Data.address,
            },
            guestDetails: {
                adults: Number(step1Data.adults),
                children: Number(step1Data.children),
            },
            notes: step2Data.notes,
        };

        if (bookingData) {
            dispatch(updateBooking({ id: bookingData?.bookingId, payload }));
        } else {
            dispatch(createBooking(payload));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllBookings());
            dispatch(clearBookingMessage());
            onBack();
        }
        if (error) {
            errorAlert(error);
            dispatch(clearBookingError());
        }
    }, [message, error, dispatch, onBack]);

    const getLocationName = () => {
        const location = locations.find(loc => loc._id === step1Data.locationId);
        return location ? location.locationName : "";
    };

    const getAvailableVillasCount = () => {
        return Array.isArray(searchResults) ? searchResults.length : 0;
    };

    return (
        <div className="px-6 mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">
                    {bookingData ? "Update Booking" : "Create Booking"}
                </h1>
            </div>
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                    <div className="flex flex-col items-center relative">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                            ${step === 1 ? 'ring-4 ring-blue-200' : ''}
                            transition-all duration-300
                        `}>
                            {step > 1 ? <Check size={20} /> : '1'}
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-700">
                            Location & Dates
                        </span>
                        {step === 1 && (
                            <div className="absolute -bottom-8 w-48 text-center">
                                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                    Current Step
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`w-32 h-1 mx-4 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'} transition-all duration-300`} />
                    <div className="flex flex-col items-center relative">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                            ${step === 2 ? 'ring-4 ring-blue-200' : ''}
                            transition-all duration-300
                        `}>
                            {step > 2 ? <Check size={20} /> : '2'}
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-700">
                            Booking Details
                        </span>
                        {step === 2 && (
                            <div className="absolute -bottom-8 w-48 text-center">
                                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                    Current Step
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {step === 1 && (
                <form
                    onSubmit={handleStep1Submit}
                    className="max-w-2xl mx-auto p-8 rounded-xl shadow-xl bg-white"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-300">
                        Step 1: Select Location, Dates & Guests
                    </h2>
                    <div className="space-y-6">
                        <SingleSelectDropdown
                            label="Location *"
                            options={locations}
                            value={step1Data.locationId}
                            labelKey="locationName"
                            searchable
                            placeholder="Select a location"
                            onChange={(value) => {
                                if (typeof value === "object" && value !== null) {
                                    setStep1Data((prev) => ({
                                        ...prev,
                                        locationId: value._id,
                                        locationName: value.locationName,
                                    }));
                                } else {
                                    const selected = locations.find((l) => l._id === value);
                                    setStep1Data((prev) => ({
                                        ...prev,
                                        locationId: value,
                                        locationName: selected?.locationName || "",
                                    }));
                                }
                            }}
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-in Date *
                                </label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={step1Data.checkInDate}
                                    onChange={handleStep1Change}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-out Date *
                                </label>
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={step1Data.checkOutDate}
                                    onChange={handleStep1Change}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    min={step1Data.checkInDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Adults *
                                </label>
                                <input
                                    type="number"
                                    name="adults"
                                    value={step1Data.adults}
                                    onChange={handleStep1Change}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 1 adult required</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Children
                                </label>
                                <input
                                    type="number"
                                    name="children"
                                    value={step1Data.children}
                                    onChange={handleStep1Change}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter 0 if no children</p>
                            </div>
                        </div>
                        {(step1Data.locationId || step1Data.checkInDate || step1Data.checkOutDate) && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-medium text-blue-800 mb-2">Selected Details:</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {step1Data.locationId && (
                                        <div>
                                            <span className="text-gray-600">Location:</span>
                                            <p className="font-medium">{getLocationName()}</p>
                                        </div>
                                    )}
                                    {step1Data.checkInDate && (
                                        <div>
                                            <span className="text-gray-600">Check-in:</span>
                                            <p className="font-medium">{step1Data.checkInDate}</p>
                                        </div>
                                    )}
                                    {step1Data.checkOutDate && (
                                        <div>
                                            <span className="text-gray-600">Check-out:</span>
                                            <p className="font-medium">{step1Data.checkOutDate}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-600">Adults:</span>
                                        <p className="font-medium">{step1Data.adults}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Children:</span>
                                        <p className="font-medium">{step1Data.children}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-300">
                            <Button
                                type="button"
                                className="bg-gray-800 text-gray-700 hover:bg-gray-600"
                                onClick={onBack}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={!step1Data.locationId || !step1Data.checkInDate || !step1Data.checkOutDate || searchLoading}
                                loading={searchLoading}
                            >
                                {searchLoading ? "Searching..." : "Continue to Step 2 →"}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
            {step === 2 && (
                <form
                    onSubmit={handleFinalSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-xl shadow-xl bg-white"
                >
                    <div className="col-span-full mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Step 2: Complete Booking Details</h2>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                                <ArrowLeft size={16} />
                                Edit Location & Dates
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-gray-700">Selected Details:</h3>
                                {searchExecuted && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailableVillasCount() > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {getAvailableVillasCount()} villa(s) available
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white p-3 rounded border border-gray-300">
                                    <div className="text-sm text-gray-500">Location</div>
                                    <div className="font-medium">{getLocationName()}</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-300">
                                    <div className="text-sm text-gray-500">Check-in</div>
                                    <div className="font-medium">{step1Data.checkInDate}</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-300">
                                    <div className="text-sm text-gray-500">Check-out</div>
                                    <div className="font-medium">{step1Data.checkOutDate}</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-300">
                                    <div className="text-sm text-gray-500">Guests</div>
                                    <div className="font-medium">
                                        {step1Data.adults} Adult{step1Data.adults !== 1 ? 's' : ''}
                                        {step1Data.children > 0 && `, ${step1Data.children} Child${step1Data.children !== 1 ? 'ren' : ''}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <SingleSelectDropdown
                            label="Select Villa *"
                            options={searchResults}
                            value={step2Data.villaId}
                            onChange={(id) =>
                                setStep2Data((prev) => ({ ...prev, villaId: id }))
                            }
                            searchable
                            labelKey="villaName"
                            placeholder={
                                searchLoading
                                    ? "Loading available villas..."
                                    : getAvailableVillasCount() === 0
                                        ? "No villas available for selected criteria"
                                        : "Select a villa from available options"
                            }
                            disabled={searchLoading || getAvailableVillasCount() === 0}
                            required
                        />
                        {searchExecuted && getAvailableVillasCount() === 0 && (
                            <p className="text-xs text-red-600 mt-2">
                                No villas available for your selected criteria. Please go back and adjust your dates or guest count, or search for a different location
                            </p>
                        )}
                    </div>
                    <MultiSelectDropdown
                        label="Extra Services"
                        options={services}
                        selected={step2Data.extraServices}
                        onChange={(ids) =>
                            setStep2Data((prev) => ({ ...prev, extraServices: ids }))
                        }
                        multiple
                        searchable
                        labelKey="name"
                        placeholder="Select additional services"
                    />
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <InputField
                            type="number"
                            label="GST Percentage"
                            name="gstPercentage"
                            value={step2Data.gstPercentage}
                            onChange={handleStep2Change}
                            placeholder="Enter GST percentage"
                            step="0.01"
                            min="0"
                        />
                        <InputField
                            type="number"
                            label="IGST Percentage"
                            name="igstPercentage"
                            value={step2Data.igstPercentage}
                            onChange={handleStep2Change}
                            placeholder="Enter IGST percentage"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <InputField
                        label="Promo Code (Optional)"
                        name="promoCode"
                        placeholder="Enter promo code"
                        value={step2Data.promoCode}
                        onChange={handleStep2Change}
                    />
                    <div className="col-span-full mt-4 pt-6 border-t border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information *</h3>
                        <p className="text-sm text-gray-600 mb-4">All fields are required</p>
                    </div>
                    <InputField
                        label="Full Name *"
                        name="fullName"
                        placeholder="Enter customer's full name"
                        value={step2Data.fullName}
                        onChange={handleStep2Change}
                        required
                    />
                    <InputField
                        label="Email *"
                        name="email"
                        type="email"
                        placeholder="Enter customer's email"
                        value={step2Data.email}
                        onChange={handleStep2Change}
                        required
                    />
                    <InputField
                        label="Mobile Number *"
                        name="mobile"
                        placeholder="Enter customer's mobile number"
                        value={step2Data.mobile}
                        onChange={handleStep2Change}
                        required
                    />
                    <div className="md:col-span-2">
                        <InputField
                            label="Address *"
                            name="address"
                            placeholder="Enter customer's full address"
                            value={step2Data.address}
                            onChange={handleStep2Change}
                            required
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            placeholder="Enter any additional notes or special requests..."
                            value={step2Data.notes}
                            onChange={handleStep2Change}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                        />
                    </div>
                    <div className="col-span-full flex justify-between gap-4 pt-6 border-t border-gray-300">
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                className="bg-gray-800 text-gray-700 hover:bg-gray-600"
                                onClick={() => setStep(1)}
                            >
                                ← Back to Step 1
                            </Button>
                            <Button
                                type="button"
                                className="bg-gray-800 text-gray-700 hover:bg-gray-600"
                                onClick={onBack}
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={!step2Data.villaId || !step2Data.fullName || !step2Data.email || !step2Data.mobile || !step2Data.address}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {bookingData ? "Update Booking" : "Create Booking"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default memo(CreateBooking);