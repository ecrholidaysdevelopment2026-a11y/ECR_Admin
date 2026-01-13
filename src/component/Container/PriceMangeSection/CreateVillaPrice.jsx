import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { ArrowLeft } from "lucide-react";
import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";

import {
    setVillaSpecialPrice,
    getVillaWeeklyPrice,
    clearVillaPriceMessage,
    clearVillaPriceError,
} from "../../../store/slice/villaPriceSlice";

import { getAllVillas } from "../../../store/slice/villaSlice";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

import { successAlert, errorAlert, warningAlert } from "../../../utils/alertService";

const CreateVillaPrice = ({ villaId, priceData, onBack }) => {
    const dispatch = useDispatch();

    const { loading, message, error } = useSelector(
        (state) => state.villaPrice
    );
    const { villas = [] } = useSelector(
        (state) => state.villa
    );
    const [selectedVillaId, setSelectedVillaId] = useState(villaId || "");

    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        price: "",
    });

    useEffect(() => {
        dispatch(getAllVillas());
    }, [dispatch]);

    useEffect(() => {
        if (priceData) {
            setForm({
                startDate: priceData.date,
                endDate: priceData.date,
                price: priceData.price,
            });
        }
    }, [priceData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedVillaId) {
            return warningAlert("Please select a villa");
        }
        if (!form.startDate || !form.endDate || !form.price) {
            return warningAlert("All fields are required");
        }
        const payload = {
            villaId: selectedVillaId,
            startDate: form.startDate,
            endDate: form.endDate,
            price: Number(form.price),
        };
        dispatch(setVillaSpecialPrice(payload));
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getVillaWeeklyPrice(selectedVillaId));
            dispatch(clearVillaPriceMessage());
            onBack();
        }

        if (error) {
            errorAlert(error);
            dispatch(clearVillaPriceError());
        }
    }, [message, error, dispatch, selectedVillaId, onBack]);

    return (
        <div className="px-6 mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">
                    {priceData ? "Update Price" : "Set Special Price"}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 rounded-xl shadow-2xl"
            >
                <SingleSelectDropdown
                    label="Select Villa"
                    options={villas}
                    value={selectedVillaId}
                    onChange={setSelectedVillaId}
                    searchable
                    labelKey="villaName"
                    placeholder="Choose a villa"
                />

                <InputField
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                />

                <InputField
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                />

                <InputField
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {priceData ? "Update" : "Save"}
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

export default memo(CreateVillaPrice);
