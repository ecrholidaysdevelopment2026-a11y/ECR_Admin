import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { HiOutlineTag } from "react-icons/hi";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import {
    getAllPromos,
    deletePromo,
    clearPromoMessage,
    clearPromoError,
} from "../../../store/slice/promoSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";
import CreatePromo from "./CreatePromo";

const Promo = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);

    const { promos, deleteLoading, deleteMessage, error } = useSelector(
        (state) => state.promo
    );


    useEffect(() => {
        dispatch(getAllPromos());
    }, [dispatch]);

    useEffect(() => {
        if (deleteMessage) {
            successAlert(deleteMessage);
            dispatch(clearPromoMessage());
            dispatch(getAllPromos());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearPromoError());
        }
    }, [deleteMessage, error, dispatch]);

    const filteredPromos = promos?.filter((promo) => {
        const matchesSearch = promo?.code?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const handleAddPromo = () => {
        setEditData(null);
        setShowCreate(true);
    };

    const handleDelete = () => {
        dispatch(deletePromo(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    const getStatusBadge = (status) => {
        if (status === 1) {
            return {
                text: "Active",
                className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                icon: <FiCheckCircle className="w-4 h-4" />
            };
        }
        return {
            text: "Inactive",
            className: "bg-gray-100 text-gray-700 border border-gray-200",
            icon: <FiXCircle className="w-4 h-4" />
        };
    };

    const getTypeBadge = (type) => {
        if (type === "percentage") {
            return {
                text: "Percentage",
                className: "bg-blue-50 text-blue-700 border border-blue-200"
            };
        }
        return {
            text: "Fixed",
            className: "bg-purple-50 text-purple-700 border border-purple-200"
        };
    };

    if (showCreate) {
        return (
            <CreatePromo
                promoData={editData}
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
            itemsCount={promos?.length}
            buttonName="Add Location"
            displayTitle="Manage Your Promo"
            onAddClick={handleAddPromo}
        >
            <section className="bg-white  border border-gray-200 shadow-sm overflow-hidden my-10">
                {filteredPromos?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Type & Value
                                    </th>

                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPromos?.map((promo) => {
                                    const statusBadge = getStatusBadge(promo?.status);
                                    const typeBadge = getTypeBadge(promo?.discountType);
                                    return (
                                        <tr key={promo?._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-900">{promo?.code}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeBadge.className}`}>
                                                        {typeBadge.text}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {promo?.discountType === "percentage"
                                                            ? `${promo?.discountValue}% OFF`
                                                            : `₹${promo?.discountValue} OFF`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                                    {statusBadge.icon}
                                                    {statusBadge.text}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <button
                                                        onClick={() => {
                                                            setEditData(promo);
                                                            setShowCreate(true);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2  font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(promo?._id);
                                                            setOpenDelete(true);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2  font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <HiOutlineTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No promo codes found</h3>
                        <p className="text-gray-500 mb-6">
                            {search ? "Try adjusting your search or filter" : "Get started by creating a new promo code"}
                        </p>
                        {!search && (
                            <button
                                onClick={handleAddPromo}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                <FiPlus className="w-5 h-5" />
                                Create First Promo Code
                            </button>
                        )}
                    </div>
                )}
            </section>

            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Delete Promo Code"
                description="Are you sure you want to delete this promo code? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default Promo;