import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Upload, X } from "lucide-react";

import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";

import {
    createVilla,
    updateVilla,
    getAllVillas,
    clearVillaMessage,
    clearVillaError,
} from "../../../store/slice/villaSlice";
import { getAllLocations } from "../../../store/slice/locationSlice";
import { successAlert, errorAlert, warningAlert } from "../../../utils/alertService";
import { generateSlug } from "../../../utils/generateSlug";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";
import MultiSelectDropdown from "../../../common/MultiSelectDropdown";
import { getAllExtraServices } from "../../../store/slice/serviceSlice";
import { getAllAmenities } from "../../../store/slice/amenitiesSlice";

const CreateVilla = ({ formData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector((state) => state.villa);
    const { locations } = useSelector((state) => state.locations);
    const {
        amenities,
    } = useSelector((state) => state.amenities);

    const { services } = useSelector((state) => state.service);
    const [coverPreview, setCoverPreview] = useState(null);

    const [form, setForm] = useState({
        villaName: "",
        slug: "",
        locationId: "",
        villaImage: null,
        villaGallery: [],
        galleryPreview: [],
        overview: "",
        highlights: [],
        attributes: [],
        surrounding: [],
        amenities: [],
        bedrooms: "",
        bathroom: "",
        offerPercentage: 0,
        faq: [],
        map: null,
        price: 0,
        isOffer: false,
        maxGuests: 0,
        isFeatured: false,
    });

    useEffect(() => {
        dispatch(getAllAmenities());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllExtraServices());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllLocations());
    }, [dispatch]);


    useEffect(() => {
        if (formData) {
            setForm({
                villaName: formData.villaName || "",
                slug: formData.slug || "",
                locationId: formData.locationId || "",
                villaImage: null,
                villaGallery: [],
                galleryPreview:
                    Array.isArray(formData?.images?.villaGallery) ? formData?.images?.villaGallery : [],
                overview: formData.overview || "",
                highlights: formData.highlights || [],
                bedrooms: formData?.bedrooms || {},
                bathroom: formData?.bathroom || {},
                attributes: formData.attributes || [],
                surrounding: formData.surrounding || [],
                amenities: formData.amenities || [],
                offerPercentage: formData.offerPercentage || 0,
                faq: formData.faq || [],
                map: formData.map || null,
                price: formData.price || 0,
                maxGuests: formData.maxGuests || 0,
                isFeatured: formData.isFeatured || false,
            });
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "villaName") {
            setForm((p) => ({ ...p, villaName: value, slug: generateSlug(value) }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };

    const handleToggle = (field) => {
        setForm((p) => ({ ...p, [field]: !p[field] }));
    };

    const handleSingleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((p) => ({ ...p, villaImage: file }));
        setCoverPreview(URL.createObjectURL(file));
    };


    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map((f) => URL.createObjectURL(f));

        setForm((p) => ({
            ...p,
            villaGallery: [...p.villaGallery, ...files],
            galleryPreview: [...p.galleryPreview, ...previews],
        }));
    };

    const removeGalleryImage = (index) => {
        setForm((p) => {
            let newGallery = [...p.villaGallery];
            let newPreview = [...p.galleryPreview];

            if (index < newGallery.length) newGallery.splice(index, 1);
            newPreview.splice(index, 1);

            return { ...p, villaGallery: newGallery, galleryPreview: newPreview };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.villaName.trim()) return warningAlert("Villa name is required");
        if (!form.slug.trim()) return warningAlert("Slug is required");

        const fd = new FormData();
        fd.append("villaName", form.villaName);
        fd.append("slug", form.slug);
        fd.append("locationId", form.locationId);
        if (form.villaImage) fd.append("villaImage", form.villaImage);
        form.villaGallery.forEach((img) => fd.append("villaGallery", img));
        fd.append("overview", form.overview);
        form.highlights.forEach((v) => fd.append("highlights[]", v));
        fd.append("bedrooms", form.bedrooms);
        fd.append("bathroom", form.bathroom);
        fd.append("offerPercentage", form.offerPercentage);
        form.attributes.forEach((v) => fd.append("attributes[]", v));
        form.surrounding.forEach((v) => fd.append("surrounding[]", v));
        form.amenities.forEach((v) => fd.append("amenities[]", v));
        form.faq.forEach((v) => fd.append("faq[]", v));
        fd.append("map", JSON.stringify(form.map));
        fd.append("price", form.price);
        fd.append("maxGuests", form.maxGuests);
        fd.append("isFeatured", form.isFeatured);

        if (formData) {
            dispatch(updateVilla({ id: formData._id, payload: fd }));
        } else {
            dispatch(createVilla(fd));
        }
    };

    useEffect(() => {
        if (formData?.images?.villaImage) {
            setCoverPreview(formData.images.villaImage);
        }
    }, [formData]);

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllVillas());
            onBack();
            dispatch(clearVillaMessage());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearVillaError());
        }
    }, [message, error, dispatch, onBack]);

    return (
        <div className="px-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">{formData ? "Update Villa" : "Create Villa"}</h1>
            </div>
            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                className="flex flex-col gap-4 p-6 rounded-xl shadow"
            >
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        name="villaName"
                        placeholder="Villa Name"
                        value={form.villaName}
                        onChange={handleChange}
                    />
                    <SingleSelectDropdown
                        label="Select Location"
                        options={locations}
                        value={form.locationId}
                        onChange={(id) => setForm((prev) => ({ ...prev, locationId: id }))}
                        searchable={true}
                        labelKey="locationName"
                        placeholder="Select a location"
                    />
                </div>
                <textarea
                    name="overview"
                    rows={4}
                    placeholder="Overview"
                    value={form.overview}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-0 focus:border-gray-300"
                />

                <div className="grid grid-cols-2 gap-3">
                    <MultiSelectDropdown
                        label="Select Amenities"
                        options={amenities}
                        selected={form.amenities}
                        onChange={(ids) =>
                            setForm((prev) => ({ ...prev, amenities: ids }))
                        }
                        multiple={true}
                        searchable={true}
                        labelKey="amenityName"
                        placeholder="Select Amenities"
                    />
                    <div>
                        <MultiSelectDropdown
                            label="Select Services"
                            options={services}
                            selected={form.highlights}
                            onChange={(ids) =>
                                setForm((prev) => ({ ...prev, highlights: ids }))
                            }
                            multiple={true}
                            searchable={true}
                            labelKey="highlights"
                            placeholder="Select Services"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <InputField type="number" name="bedrooms" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} />
                    <InputField type="number" name="bathroom" placeholder="Enter Bath Count" value={form.bathroom} onChange={handleChange} />
                </div>
                <div className="border-dashed border-2 p-4 rounded-lg text-center">
                    <input type="file" accept="image/*" className="hidden" id="villa-cover" onChange={handleSingleImage} />
                    <label htmlFor="villa-cover" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload />
                        <span>Upload Cover Image</span>
                    </label>
                    {coverPreview && (
                        <div className="relative mt-3 w-full max-w-sm mx-auto">
                            <Image
                                src={coverPreview}
                                className="w-full h-48 rounded-lg object-cover"
                                alt="Cover Preview"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setForm((p) => ({ ...p, villaImage: null }));
                                    setCoverPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                </div>

                <div className="border-dashed border-2 p-4 rounded-lg text-center mt-2">
                    <input type="file" multiple accept="image/*" className="hidden" id="villa-gallery" onChange={handleGalleryUpload} />
                    <label htmlFor="villa-gallery" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload />
                        <span>Upload Gallery Images</span>
                    </label>
                </div>
                {form?.galleryPreview?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {form?.galleryPreview?.map((img, i) => (
                            <div key={i} className="relative w-full">
                                <Image src={typeof img === "string" ? img : URL.createObjectURL(img)} className="w-full h-30 rounded-lg object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 items-center ">
                    <InputField type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
                    <div className="flex gap-2">
                        <input type="checkbox" checked={form.isOffer} onChange={() => handleToggle("isOffer")} />
                        <span>Is Offer?</span>
                    </div>
                    <div>
                        {form.isOffer && <InputField type="number" name="offerPercentage" placeholder="Offer Percentage" value={form.offerPercentage} onChange={handleChange} className="w-full" />}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputField type="number" name="maxGuests" placeholder="Max Guests" value={form.maxGuests} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium">Featured:</span>
                    <div onClick={() => handleToggle("isFeatured")} className={`w-14 h-7 p-1 rounded-full cursor-pointer ${form.isFeatured ? "bg-green-500" : "bg-gray-400"}`}>
                        <div className={`bg-white w-5 h-5 rounded-full transition-transform ${form.isFeatured ? "translate-x-7" : "translate-x-0"}`} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>{formData ? "Update" : "Create"}</Button>
                    <Button type="button" className="bg-gray-200" onClick={onBack}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateVilla);
