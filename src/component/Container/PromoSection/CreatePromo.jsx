import { useState, useEffect, memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

import {
    createPromo,
    updatePromo,
    clearPromoMessage,
    clearPromoError,
    getAllPromos,
} from "../../../store/slice/promoSlice";
import { getAllVillas } from "../../../store/slice/villaSlice";
import { getAllLocations } from "../../../store/slice/locationSlice";
import { successAlert, errorAlert, warningAlert } from "../../../utils/alertService";

const CreatePromo = ({ promoData, onBack }) => {
    const dispatch = useDispatch();

    const { loading, message, error } = useSelector((state) => state.promo);
    const { villas = [] } = useSelector((state) => state.villa);
    const { locations = [] } = useSelector((state) => state.locations);
    const isInitialLoad = useRef(true);

    const [form, setForm] = useState({
        code: "",
        scope: 1,
        discountType: 1,
        discountValue: "",
        villaId: "",
        locationId: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        dispatch(getAllVillas());
        dispatch(getAllLocations());
    }, [dispatch]);

    useEffect(() => {
        if (!promoData) return;
        if ((promoData.scope === 2 && villas.length === 0) || (promoData.scope === 3 && locations.length === 0)) {
            return;
        }

        setForm({
            code: promoData?.code || "",
            scope: promoData?.scope || 1,
            discountType: promoData?.discountType || 1,
            discountValue: promoData?.discountValue || "",
            villaId: promoData?.scope === 2 ? promoData?.villaId?._id || "" : "",
            locationId:
                promoData?.scope === 3
                    ? promoData?.locationId?._id || ""
                    : promoData?.scope === 2
                        ? promoData?.villaId?.locationId?._id || ""
                        : "",
            startDate: promoData?.startDate?.slice(0, 10) || "",
            endDate: promoData?.endDate?.slice(0, 10) || "",
        });
    }, [promoData, villas, locations]);

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        if (form.scope === 1) setForm((p) => ({ ...p, villaId: "", locationId: "" }));
        if (form.scope === 2) setForm((p) => ({ ...p, locationId: "" }));
        if (form.scope === 3) setForm((p) => ({ ...p, villaId: "" }));
    }, [form.scope]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.code.trim()) return warningAlert("Promo code is required");
        if (!form.discountValue) return warningAlert("Discount value is required");
        if (!form.startDate || !form.endDate) return warningAlert("Start & End date required");

        const payload = {
            code: form.code.trim(),
            scope: Number(form.scope),
            discountType: Number(form.discountType),
            discountValue: Number(form.discountValue),
            startDate: form.startDate,
            endDate: form.endDate,
        };

        if (form.scope === 2) {
            if (!form.villaId) return warningAlert("Please select a villa");
            payload.villaId = form.villaId;
        }

        if (form.scope === 3) {
            if (!form.locationId) return warningAlert("Please select a location");
            payload.locationId = form.locationId;
        }

        if (promoData) {
            dispatch(updatePromo({ id: promoData._id, payload }));
        } else {
            dispatch(createPromo(payload));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllPromos());
            dispatch(clearPromoMessage());
            onBack();
        }
        if (error) {
            errorAlert(error);
            dispatch(clearPromoError());
        }
    }, [message, error, dispatch, onBack]);

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">{promoData ? "Update Promo Code" : "Create Promo Code"}</h1>
            </div>

            <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} className="flex flex-col gap-4 p-6 rounded-xl shadow">
                <InputField name="code" placeholder="Promo Code (eg: NEWYEAR2025)" value={form.code} onChange={handleChange} />

                <div className="grid grid-cols-2 gap-4">
                    <SingleSelectDropdown
                        label="Scope"
                        value={form.scope}
                        options={[
                            { _id: 1, name: "All Villas" },
                            { _id: 2, name: "Specific Villa" },
                            { _id: 3, name: "Specific Location" },
                        ]}
                        labelKey="name"
                        onChange={(val) => setForm((p) => ({ ...p, scope: val }))}
                    />
                    <SingleSelectDropdown
                        label="Discount Type"
                        value={form.discountType}
                        options={[
                            { _id: 1, name: "Percentage (%)" },
                            { _id: 2, name: "Flat Amount (₹)" },
                        ]}
                        labelKey="name"
                        onChange={(val) => setForm((p) => ({ ...p, discountType: val }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField type="number" name="discountValue" placeholder="Discount Value" value={form.discountValue} onChange={handleChange} />

                    <div>
                        {form.scope === 2 && (
                            <SingleSelectDropdown
                                label="Select Villa"
                                options={villas}
                                value={form.villaId}
                                labelKey="villaName"
                                searchable
                                onChange={(id) => setForm((p) => ({ ...p, villaId: id }))}
                            />
                        )}
                        {form.scope === 3 && (
                            <SingleSelectDropdown
                                label="Select Location"
                                options={locations}
                                value={form.locationId}
                                labelKey="locationName"
                                searchable
                                onChange={(id) => setForm((p) => ({ ...p, locationId: id }))}
                            />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                    <InputField type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {promoData ? "Update Promo" : "Create Promo"}
                    </Button>
                    <Button type="button" className="bg-gray-200" onClick={onBack}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreatePromo);
