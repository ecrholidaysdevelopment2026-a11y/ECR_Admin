import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { ArrowLeft } from "lucide-react";
import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";

import {
    createAmenity,
    updateAmenity,
    getAllAmenities,
    clearAmenityMessage,
    clearAmenityError,
} from "../../../store/slice/amenitiesSlice";

import { successAlert, errorAlert } from "../../../utils/alertService";
import { generateSlug } from "../../../utils/generateSlug";
import { getAmenityIcon } from "../../../utils/amenityIcons";
import { AMENITY_ICON_LIST } from "../../../utils/amenityIconList";

const CreateAmenity = ({ amenityData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector(
        (state) => state.amenities
    );

    const [form, setForm] = useState({
        name: "",
        key: "",
        icon: "",
    });

    const [iconSearch, setIconSearch] = useState("");

    useEffect(() => {
        if (amenityData) {
            setForm({
                name: amenityData.name,
                key: amenityData.key,
                icon: amenityData.icon,
            });
        } else {
            setForm({ name: "", key: "", icon: "" });
        }
    }, [amenityData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            setForm((p) => ({
                ...p,
                name: value,
                key: generateSlug(value),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            key: form.key,
            icon: form.icon,
        };

        if (amenityData) {
            dispatch(updateAmenity({ id: amenityData._id, payload }));
        } else {
            dispatch(createAmenity(payload));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllAmenities());
            onBack();
            dispatch(clearAmenityMessage());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearAmenityError());
        }
    }, [message, error, dispatch, onBack]);

    const PreviewIcon = getAmenityIcon(form.icon);

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
                    {amenityData ? "Update Amenity" : "Create Amenity"}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 rounded-xl shadow-2xl"
            >
                <InputField
                    name="name"
                    placeholder="Amenity Name"
                    value={form.name}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Search icon..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                />
                <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto border p-3 rounded-lg">
                    {AMENITY_ICON_LIST.filter((i) =>
                        i.label.toLowerCase().includes(iconSearch.toLowerCase())
                    ).map(({ key, Icon, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() =>
                                setForm((p) => ({ ...p, icon: key }))
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
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Preview:</span>
                    <PreviewIcon size={22} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {amenityData ? "Update" : "Create"}
                    </Button>
                    <Button type="button" className="bg-gray-200" onClick={onBack}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateAmenity);
