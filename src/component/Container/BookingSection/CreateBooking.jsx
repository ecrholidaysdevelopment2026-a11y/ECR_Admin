"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { ArrowLeft } from "lucide-react";

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

import { getAllVillas } from "../../../store/slice/villaSlice";
import { getAllLocations } from "../../../store/slice/locationSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";

const CreateBooking = ({ bookingData, onBack }) => {
    const dispatch = useDispatch();

    const { loading, message, error } = useSelector((state) => state.booking);
    const { villas } = useSelector((state) => state.villa);
    const { locations } = useSelector((state) => state.locations);

    useEffect(() => {
        dispatch(getAllVillas());
        dispatch(getAllLocations());
    }, [dispatch]);

    const [form, setForm] = useState({
        villaId: "",
        locationId: "",
        checkInDate: "",
        checkOutDate: "",
        basePrice: "",
        gstPercentage: 0,
        igstPercentage: 0,
        paymentMethod: "RAZORPAY",
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        adults: 1,
        children: 0,
        notes: "",
    });

    useEffect(() => {
        if (bookingData) {
            setForm({
                villaId: bookingData?.villaId,
                locationId: bookingData?.locationId,
                checkInDate: bookingData?.checkInDate,
                checkOutDate: bookingData?.checkOutDate,
                basePrice: bookingData?.basePrice,
                gstPercentage: bookingData?.gstPercentage,
                igstPercentage: bookingData?.igstPercentage,
                paymentMethod: bookingData?.paymentMethod,
                fullName: bookingData?.customer?.fullName || "",
                email: bookingData?.customer?.email || "",
                mobile: bookingData?.customer?.mobile || "",
                address: bookingData?.customer?.address || "",
                adults: bookingData?.guestDetails?.adults || 1,
                children: bookingData?.guestDetails?.children || 0,
                notes: bookingData?.notes || "",
            });
        }
    }, [bookingData]);

    const filteredVillas = form.locationId
        ? villas.filter(
            (villa) => villa.locationId === form.locationId
        )
        : [];

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            villaId: "",
        }));
    }, [form.locationId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            villaId: form.villaId,
            locationId: form.locationId,
            checkInDate: form.checkInDate,
            checkOutDate: form.checkOutDate,
            basePrice: Number(form.basePrice),
            gstPercentage: Number(form.gstPercentage),
            igstPercentage: Number(form.igstPercentage),
            paymentMethod: form.paymentMethod,
            customer: {
                fullName: form.fullName,
                email: form.email,
                mobile: form.mobile,
                address: form.address,
            },
            guestDetails: {
                adults: Number(form.adults),
                children: Number(form.children),
            },
            notes: form.notes,
        };

        if (bookingData) {
            dispatch(updateBooking({ id: bookingData._id, payload }));
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

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-4 p-6 rounded-xl shadow-2xl"
            >
                <SingleSelectDropdown
                    label="Location"
                    options={locations}
                    value={form.locationId}
                    onChange={(id) =>
                        setForm((prev) => ({ ...prev, locationId: id }))
                    }
                    searchable
                    labelKey="locationName"
                    placeholder="Select Location"
                />
                <SingleSelectDropdown
                    label="Villa"
                    options={filteredVillas}
                    value={form.villaId}
                    onChange={(id) =>
                        setForm((prev) => ({ ...prev, villaId: id }))
                    }
                    searchable
                    labelKey="villaName"
                    placeholder={
                        form.locationId
                            ? "Select Villa"
                            : "Select Location First"
                    }
                />

                <InputField
                    type="date"
                    name="checkInDate"
                    value={form.checkInDate}
                    onChange={handleChange}
                />
                <InputField
                    type="date"
                    name="checkOutDate"
                    value={form.checkOutDate}
                    onChange={handleChange}
                />

                <InputField
                    name="basePrice"
                    placeholder="Base Price"
                    value={form.basePrice}
                    onChange={handleChange}
                />

                <InputField
                    name="fullName"
                    placeholder="Customer Name"
                    value={form.fullName}
                    onChange={handleChange}
                />
                <InputField
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <InputField
                    name="mobile"
                    placeholder="Mobile"
                    value={form.mobile}
                    onChange={handleChange}
                />
                <InputField
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                />

                <InputField
                    name="adults"
                    placeholder="Adults"
                    value={form.adults}
                    onChange={handleChange}
                />
                <InputField
                    name="children"
                    placeholder="Children"
                    value={form.children}
                    onChange={handleChange}
                />

                <div className="col-span-2">
                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded"
                        rows={5}
                    />
                </div>

                <div className="col-span-2 flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {bookingData ? "Update Booking" : "Create Booking"}
                    </Button>
                    <Button
                        type="button"
                        className="bg-gray-200"
                        onClick={onBack}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateBooking);
