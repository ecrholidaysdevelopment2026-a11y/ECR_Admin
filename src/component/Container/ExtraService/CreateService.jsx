import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { ArrowLeft } from "lucide-react";
import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";

import {
    createExtraService,
    updateExtraService,
    getAllExtraServices,
    clearExtraServiceMessage,
    clearExtraServiceError,
} from "../../../store/slice/serviceSlice";

import { successAlert, errorAlert, warningAlert } from "../../../utils/alertService";
import { generateSlug } from "../../../utils/generateSlug";

const CreateService = ({ serviceData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector((state) => state.service);

    const [form, setForm] = useState({
        name: "",
        code: "",
        price: "",
        status: true,
    });

    useEffect(() => {
        if (serviceData) {
            setForm({
                name: serviceData?.name || "",
                code: serviceData?.code || "",
                price: serviceData?.price || "",
                status: serviceData?.status !== undefined ? serviceData?.status === 1 : true,
            });
        } else {
            resetForm();
        }
    }, [serviceData]);

    const resetForm = () => {
        setForm({
            name: "",
            code: "",
            price: "",
            status: true,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            setForm((p) => ({
                ...p,
                name: value,
                code: generateSlug(value),
            }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };


    const handleToggleStatus = () => {
        setForm((p) => ({ ...p, status: !p.status }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return warningAlert("Service name is required");
        if (!form.code.trim()) return warningAlert("Service code is required");
        if (!form.price || isNaN(form.price)) return warningAlert("Valid price is required");

        const payload = {
            name: form.name,
            code: form.code,
            price: Number(form.price),
            status: form.status ? 1 : 0,
        };

        if (serviceData) {
            dispatch(updateExtraService({ code: serviceData.code, payload }));
        } else {
            dispatch(createExtraService(payload));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllExtraServices());
            onBack();
            dispatch(clearExtraServiceMessage());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearExtraServiceError());
        }
    }, [message, error, dispatch, onBack]);

    return (
        <div className="px-6  mx-auto"
        >
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">
                    {serviceData ? "Update Service" : "Create Service"}
                </h1>
            </div>
            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                className="flex flex-col gap-4 p-6 rounded-xl shadow-2xl"
                style={{
                    background: "var(--bg)",
                    color: "var(--text)",
                    borderRight: "1px solid var(--border)",
                }}
            >
                <InputField
                    name="name"
                    placeholder="Service Name"
                    value={form.name}
                    onChange={handleChange}
                />
                <InputField
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />

                <div className="flex items-center gap-3">
                    <span className="font-medium">Status:</span>
                    <div
                        onClick={handleToggleStatus}
                        className={`w-14 h-7 p-1 rounded-full cursor-pointer ${form.status ? "bg-green-500" : "bg-gray-400"}`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full transition-transform ${form.status ? "translate-x-7" : "translate-x-0"}`}
                        />
                    </div>
                    <span>{form.status ? "Active" : "Inactive"}</span>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {serviceData ? "Update" : "Create"}
                    </Button>
                    <Button type="button" className="bg-gray-200" onClick={onBack}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateService);
