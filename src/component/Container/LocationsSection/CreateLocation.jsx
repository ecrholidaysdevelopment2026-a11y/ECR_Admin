import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { Upload, X, ArrowLeft } from "lucide-react";

import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";

import {
    createLocation,
    updateLocation,
    getAllLocations,
    clearLocationMessage,
    clearLocationError,
} from "../../../store/slice/locationSlice";

import {
    successAlert,
    errorAlert,
    warningAlert,
} from "../../../utils/alertService";
import { generateSlug } from "../../../utils/generateSlug";
import MapPicker from "../../../common/MapPicker";
import { getLatLngFromMapLink } from "../../../utils/getLatLngFromMapLink";

const CreateLocation = ({ formData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector(
        (state) => state.locations
    );

    const [form, setForm] = useState({
        locationName: "",
        slug: "",
        mapLink: "",
        villaCount: "",
        description: "",
        isPopular: false,
        locationImage: [],
        previewImages: [],
        coverImages: [],
        coverPreview: [],
        locationVideo: null,
        videoPreview: null,
    });

    useEffect(() => {
        if (formData) {
            setForm({
                locationName: formData?.locationName || "",
                slug: formData?.slug || "",
                mapLink: formData?.mapLink || "",
                villaCount: formData?.villaCount || "",
                description: formData?.description || "",
                isPopular: formData?.isPopular || false,
                locationImage: [],
                previewImages: Array.isArray(formData?.images) ? formData?.images : [],
                coverImages: [],
                coverPreview: formData?.coverImages || [],
                locationVideo: null,
                videoPreview: formData?.locationVideo || null,
            });
        } else {
            resetForm();
        }
    }, [formData]);

    const resetForm = () => {
        setForm({
            locationName: "",
            slug: "",
            mapLink: "",
            villaCount: "",
            description: "",
            isPopular: false,
            locationImage: [],
            previewImages: [],
            coverImages: [],
            coverPreview: [],
            locationVideo: null,
            videoPreview: null,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "locationName") {
            setForm((p) => ({
                ...p,
                locationName: value,
                slug: generateSlug(value),
            }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };

    const handleTogglePopular = () => {
        setForm((p) => ({ ...p, isPopular: !p.isPopular }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map((f) => URL.createObjectURL(f));

        setForm((p) => ({
            ...p,
            locationImage: [...p.locationImage, ...files],
            previewImages: [...p.previewImages, ...previews],
        }));
    };

    const removeImage = (index) => {
        setForm((p) => {
            const imgs = [...p.locationImage];
            const previews = [...p.previewImages];
            imgs.splice(index, 1);
            previews.splice(index, 1);
            return { ...p, locationImage: imgs, previewImages: previews };
        });
    };

    const handleCoverUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map((f) => URL.createObjectURL(f));

        setForm((p) => ({
            ...p,
            coverImages: [...p.coverImages, ...files],
            coverPreview: [...p.coverPreview, ...previews],
        }));
    };

    const removeCover = (index) => {
        setForm((p) => {
            const covers = [...p.coverImages];
            const previews = [...p.coverPreview];
            covers.splice(index, 1);
            previews.splice(index, 1);
            return { ...p, coverImages: covers, coverPreview: previews };
        });
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setForm((p) => ({ ...p, locationVideo: file, videoPreview: preview }));
    };

    const removeVideo = () => {
        setForm((p) => ({ ...p, locationVideo: null, videoPreview: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting with mapLink:", form.mapLink);
        if (!form.locationName.trim()) return warningAlert("Location name is required");
        if (!form.slug.trim()) return warningAlert("Slug is required");

        const fd = new FormData();
        fd.append("locationName", form.locationName);
        fd.append("slug", form.slug);
        fd.append("mapLink", form.mapLink);
        fd.append("villaCount", form.villaCount);
        fd.append("description", form.description);
        fd.append("isPopular", form.isPopular);

        form.locationImage.forEach((img) => fd.append("locationImage", img));
        form.coverImages.forEach((img) => fd.append("coverImages", img));
        if (form.locationVideo) fd.append("locationVideo", form.locationVideo);

        if (formData) {
            dispatch(updateLocation({ id: formData._id, payload: fd }));
        } else {
            dispatch(createLocation(fd));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllLocations());
            onBack();
            dispatch(clearLocationMessage());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearLocationError());
        }
    }, [message, error, dispatch, onBack]);

    return (
        <div className="px-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">
                    {formData ? "Update Location" : "Create Location"}
                </h1>
            </div>
            <form onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                }}
                className="flex flex-col gap-4 p-6 rounded-xl shadow">
                <InputField
                    name="locationName"
                    placeholder="Location Name"
                    value={form.locationName}
                    onChange={handleChange}
                />
                <MapPicker onSelect={(link) => setForm(prev => ({ ...prev, mapLink: link }))}
                    initialPosition={
                        formData?.mapLink
                            ? getLatLngFromMapLink(formData.mapLink)
                            : null
                    }
                />
                <p>{form?.mapLink}</p>
                <textarea
                    name="description"
                    rows={6}
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-0 focus:border-gray-300"
                />

                <div className="flex items-center gap-3">
                    <span className="font-medium">Popular:</span>
                    <div
                        onClick={handleTogglePopular}
                        className={`w-14 h-7 p-1 rounded-full cursor-pointer ${form.isPopular ? "bg-green-500" : "bg-gray-400"}`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full transition-transform ${form.isPopular ? "translate-x-7" : "translate-x-0"}`}
                        />
                    </div>
                </div>
                <div className="border-dashed border-2 p-4 rounded-lg text-center">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="location-img"
                        onChange={handleImageUpload}
                    />
                    <label
                        htmlFor="location-img"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <Upload />
                        <span>Upload Location Images</span>
                    </label>
                </div>
                {form?.previewImages?.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {form?.previewImages?.map((img, i) => (
                            <div key={i} className="relative w-full aspect-square">
                                <Image
                                    src={img}
                                    className="w-full h-30 rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="border-dashed border-2 p-4 rounded-lg text-center mt-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="cover-img"
                        onChange={handleCoverUpload}
                    />
                    <label
                        htmlFor="cover-img"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <Upload />
                        <span>Upload Cover Images</span>
                    </label>
                </div>

                {form?.coverPreview?.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {form?.coverPreview?.map((img, i) => (
                            <div key={i} className="relative w-full aspect-square">
                                <Image
                                    src={img}
                                    className="w-full h-30 rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeCover(i)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="border-dashed border-2 p-4 rounded-lg text-center mt-4">
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        id="location-video"
                        onChange={handleVideoUpload}
                    />
                    <label
                        htmlFor="location-video"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <Upload />
                        <span>Upload Location Video</span>
                    </label>
                </div>
                {form?.videoPreview && (
                    <div className="relative w-full mt-2">
                        <video
                            src={form?.videoPreview}
                            controls
                            className="w-full rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={removeVideo}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {formData ? "Update" : "Create"}
                    </Button>
                    <Button type="button" className="bg-gray-200" onClick={onBack}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateLocation);
