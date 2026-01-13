import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Upload, X } from "lucide-react";

import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";

import {
    createEvent,
    updateEvent,
    getAllEvents,
    clearEventMessage,
    clearEventError,
} from "../../../store/slice/eventSlice";

import {
    successAlert,
    errorAlert,
    warningAlert,
} from "../../../utils/alertService";
import { generateSlug } from "../../../utils/generateSlug";
import { getAllCategories } from "../../../store/slice/categorySlice";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const CreateEvent = ({ formData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector((state) => state.event);
    const [coverPreview, setCoverPreview] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState([]);
    const {
        categories,
    } = useSelector((state) => state.category);

    const [form, setForm] = useState({
        eventName: "",
        eventImages: [],
        categoryId: null
    });

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (!formData) return;

        setForm({
            eventName: formData.title || "",
            eventImages: [],
            categoryId: formData.categoryId._id
        });

        if (Array.isArray(formData.eventImages) && formData.eventImages.length > 0) {
            setCoverPreview(formData.eventImages[0]);
            setGalleryPreview(formData.eventImages);
        } else {
            setCoverPreview(null);
            setGalleryPreview([]);
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "eventName") {
            setForm((p) => ({
                ...p,
                eventName: value,
                slug: generateSlug(value),
            }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };

    const handleImage = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setForm((p) => ({
            ...p,
            eventImages: [...p.eventImages, ...files],
        }));

        const previews = files.map((file) => URL.createObjectURL(file));
        setGalleryPreview((p) => [...p, ...previews]);

        if (!coverPreview) setCoverPreview(previews[0]);
    };

    const removeImage = (index) => {
        setGalleryPreview((p) => p.filter((_, i) => i !== index));
        setForm((p) => ({
            ...p,
            eventImages: p.eventImages.filter((_, i) => i !== index),
        }));

        if (index === 0) {
            setCoverPreview(galleryPreview[1] || null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.eventName.trim()) {
            return warningAlert("Event name required");
        }
        const fd = new FormData();
        fd.append("eventName", form.eventName);
        fd.append("categoryId", form.categoryId);

        form.eventImages.forEach((img) => {
            fd.append("eventImages", img);
        });

        if (formData) {
            dispatch(updateEvent({ id: formData._id, payload: fd }));
        } else {
            dispatch(createEvent(fd));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllEvents());
            onBack();
            dispatch(clearEventMessage());
        }

        if (error) {
            errorAlert(error);
            dispatch(clearEventError());
        }
    }, [message, error, dispatch, onBack]);

    return (
        <div className="px-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">
                    {formData ? "Update Event" : "Create Event"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 shadow rounded-xl space-y-4">
                <InputField
                    name="eventName"
                    placeholder="Event Name"
                    value={form.eventName}
                    onChange={handleChange}
                />
                <SingleSelectDropdown
                    label="Select Category"
                    options={categories}
                    value={form.categoryId}
                    onChange={(id) => setForm((prev) => ({ ...prev, categoryId: id }))}
                    searchable={true}
                    labelKey="name"
                    placeholder="Select a Category"
                />
                <div className="border-dashed border-2 p-4 rounded-lg text-center">
                    <input
                        type="file"
                        multiple
                        hidden
                        id="event-image"
                        onChange={handleImage}
                    />

                    <label htmlFor="event-image" className="cursor-pointer">
                        <Upload className="mx-auto" />
                        <p>Upload Event Images</p>
                    </label>
                    {coverPreview && (
                        <div className="mt-4">
                            <p className="text-sm mb-2 font-medium">Cover Image</p>
                            <Image
                                src={coverPreview}
                                className="h-48 mx-auto rounded-lg object-cover"
                            />
                        </div>
                    )}
                    {galleryPreview?.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {galleryPreview?.map((img, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={img}
                                        className="h-32 rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <Button loading={loading} type="submit">
                        {formData ? "Update" : "Create"}
                    </Button>
                    <Button type="button" onClick={onBack} className="bg-gray-200">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateEvent);