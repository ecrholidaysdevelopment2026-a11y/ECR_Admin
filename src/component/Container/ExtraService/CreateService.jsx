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
import { SERVICE_ICON_LIST } from "../../../utils/serviceIconList";
import { getServiceIcon } from "../../../utils/serviceIcons";

const CreateService = ({ serviceData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector((state) => state.service);
    const [iconSearch, setIconSearch] = useState("");

    const [form, setForm] = useState({
        icon: "",
        name: "",
        code: "",
        price: "",
        description: "",
        status: true,
        hasPrice: true,
    });

    useEffect(() => {
        if (serviceData) {
            setForm({
                name: serviceData?.name || "",
                code: serviceData?.code || "",
                price: serviceData?.price || "",
                icon: serviceData?.icon || "",
                hasPrice: serviceData?.price > 0,
                description: serviceData?.description || "",
                status: serviceData?.status !== undefined ? serviceData?.status === 1 : true,
            });
        } else {
            resetForm();
        }
    }, [serviceData]);

    const resetForm = () => {
        setForm({
            icon: "",
            name: "",
            code: "",
            price: "",
            description: "",
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

        const payload = {
            name: form.name,
            code: form.code,
            description: form.description,
            price: form.hasPrice && Number(form.price)  ,
            status: form.status ? 1 : 0,
            icon: form.icon,
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

    const PreviewIcon = form.icon ? getServiceIcon(form.icon) : null;

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
                    placeholder="Service name (Breakfast, Airport Pickup, Pool)"
                    value={form.name}
                    onChange={handleChange}
                />
                <div className="flex items-center gap-3">
                    <span className=" text-gray-600">Paid Service:</span>
                    <div
                        onClick={() =>
                            setForm((p) => ({
                                ...p,
                                hasPrice: !p.hasPrice,
                                price: !p.hasPrice ? p.price : "",
                            }))
                        }
                        className={`w-14 h-7 p-1 rounded-full cursor-pointer 
        ${form.hasPrice ? "bg-green-500" : "bg-gray-400"}`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full transition-transform
            ${form.hasPrice ? "translate-x-7" : "translate-x-0"}`}
                        />
                    </div>
                    <span>{form.hasPrice ? "Paid" : "Free"}</span>
                </div>
                {form.hasPrice && (
                    <InputField
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                    />
                )}
                <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto border p-3 rounded-lg">
                    {SERVICE_ICON_LIST.filter((i) =>
                        i.label.toLowerCase().includes(iconSearch.toLowerCase())
                    ).map(({ key, Icon, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() =>
                                setForm((p) => ({
                                    ...p,
                                    icon: key,
                                    name: label,
                                    code: generateSlug(label),
                                }))
                            }
                            className={`p-2 flex flex-col items-center rounded-lg border
                ${form.icon === key
                                    ? "bg-blue-100 border-blue-500"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            <Icon size={22} />
                            <span className="text-[10px]">{label}</span>
                        </button>
                    ))}
                </div>
                {PreviewIcon && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Preview:</span>
                        <PreviewIcon size={22} />
                    </div>
                )}
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-0 focus:border-gray-300"
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
