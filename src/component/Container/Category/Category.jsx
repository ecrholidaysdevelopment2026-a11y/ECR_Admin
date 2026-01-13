import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";

import {
    getAllCategories,
    deleteCategory,
    clearCategoryMessage,
    clearCategoryError,
} from "../../../store/slice/categorySlice";

import { successAlert, errorAlert } from "../../../utils/alertService";
import CreateCategory from "./CreateCategory";

const Category = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);

    const {
        categories,
        deleteLoading,
        deleteCategoryMessage,
        error,
    } = useSelector((state) => state.category);


    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (deleteCategoryMessage) {
            successAlert(deleteCategoryMessage);
            dispatch(clearCategoryMessage());
            dispatch(getAllCategories());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearCategoryError());
        }
    }, [deleteCategoryMessage, error, dispatch]);

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddCategory = () => {
        setEditData(null);
        setShowCreate(true);
    };

    const handleDelete = () => {
        dispatch(deleteCategory(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    if (showCreate) {
        return (
            <CreateCategory
                categoryData={editData}
                onBack={() => {
                    setShowCreate(false);
                    setEditData(null);
                }}
            />
        );
    }

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={setSearch}
            itemsCount={categories?.length}
            buttonName="Add Category"
            displayTitle="Manage Categories"
            onAddClick={handleAddCategory}
        >
            <section className="my-5">
                {filteredCategories?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Slug</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories?.map((cat) => (
                                    <tr
                                        key={cat._id}
                                        className="border-b  border-gray-300 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-6">{cat.name}</td>
                                        <td className="py-3 px-6">{cat.slug}</td>
                                        <td className="py-3 px-6">
                                            {cat.status === 1 ? "Active" : "Inactive"}
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(cat);
                                                        setShowCreate(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded"
                                                >
                                                    <FiEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteId(cat._id);
                                                        setOpenDelete(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded"
                                                >
                                                    <FiTrash2 /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">
                        No categories found
                    </p>
                )}
            </section>

            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Are you sure you want to delete this category?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default Category;