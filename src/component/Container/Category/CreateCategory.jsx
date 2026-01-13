import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, memo } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";

import { InputField } from "../../../common/CommonInput";
import Button from "../../../common/Button";
import Image from "../../../common/Image";

import {
    createCategory,
    updateCategory,
    getAllCategories,
    clearCategoryMessage,
    clearCategoryError,
    deleteCategoryImage,
} from "../../../store/slice/categorySlice";

import {
    successAlert,
    errorAlert,
    warningAlert,
} from "../../../utils/alertService";
import { generateSlug } from "../../../utils/generateSlug";

const CreateCategory = ({ categoryData, onBack }) => {
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector(
        (state) => state.category
    );

    const [coverPreview, setCoverPreview] = useState(null);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        status: true,
        categoryImage: null,
    });

    useEffect(() => {
        if (!categoryData) {
            resetForm();
            return;
        }

        setForm({
            name: categoryData.name || "",
            slug: categoryData.slug || "",
            status:
                categoryData.status !== undefined
                    ? categoryData.status === 1
                    : true,
            categoryImage: null,
        });
        if (categoryData?.categoryImage) {
            setCoverPreview(categoryData.categoryImage);
        } else {
            setCoverPreview(null);
        }
    }, [categoryData]);

    const resetForm = () => {
        setForm({
            name: "",
            slug: "",
            status: true,
            categoryImage: null,
        });
        setCoverPreview(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            setForm((p) => ({
                ...p,
                name: value,
                slug: generateSlug(value),
            }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((p) => ({ ...p, categoryImage: file }));
        setCoverPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setCoverPreview(null);
        setForm((p) => ({ ...p, categoryImage: null }));

        if (categoryData?._id) {
            dispatch(deleteCategoryImage(categoryData._id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) return warningAlert("Category name is required");
        if (!form.slug.trim()) return warningAlert("Category slug is required");

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("slug", form.slug);
        fd.append("status", form.status ? 1 : 0);

        if (form.categoryImage) {
            fd.append("categoryImage", form.categoryImage);
        }

        if (categoryData) {
            dispatch(
                updateCategory({
                    id: categoryData._id,
                    payload: fd,
                })
            );
        } else {
            dispatch(createCategory(fd));
        }
    };

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(getAllCategories());
            onBack();
            dispatch(clearCategoryMessage());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearCategoryError());
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
                    {categoryData ? "Update Category" : "Create Category"}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                className="flex flex-col gap-4 p-6 rounded-xl shadow-2xl"
            >
                <InputField
                    name="name"
                    placeholder="Category name"
                    value={form.name}
                    onChange={handleChange}
                />
                <div className="border-dashed border-2 p-4 rounded-lg text-center">
                    <input
                        type="file"
                        hidden
                        id="category-image"
                        accept="image/*"
                        onChange={handleImage}
                    />
                    <label htmlFor="category-image" className="cursor-pointer">
                        <Upload className="mx-auto" />
                        <p>Upload Category Image</p>
                    </label>
                    {coverPreview && (
                        <div className="relative mt-4">
                            <Image
                                src={coverPreview}
                                className="h-40 mx-auto rounded-lg object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-medium">Status:</span>
                    <div
                        onClick={() =>
                            setForm((p) => ({ ...p, status: !p.status }))
                        }
                        className={`w-14 h-7 p-1 rounded-full cursor-pointer ${form.status ? "bg-green-500" : "bg-gray-400"
                            }`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full transition-transform ${form.status ? "translate-x-7" : ""
                                }`}
                        />
                    </div>
                    <span>{form.status ? "Active" : "Inactive"}</span>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="submit" loading={loading}>
                        {categoryData ? "Update" : "Create"}
                    </Button>
                    <Button type="button" className="bg-gray-200" onClick={onBack}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default memo(CreateCategory);