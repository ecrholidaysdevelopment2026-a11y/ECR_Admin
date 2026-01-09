import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2, FiGrid, FiList } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { TbView360 } from "react-icons/tb";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import Image from "../../../common/Image";
import { errorAlert, successAlert } from "../../../utils/alertService";
import {
    getAllVillas,
    deleteVilla,
    clearVillaMessage,
    clearVillaError,
} from "../../../store/slice/villaSlice";
import { SimpleNoVillas } from "../../../common/Animation";
import CreateVilla from "./CreateVilla";
import { useNavigate } from "react-router-dom";
import { getAllBlockedDates } from "../../../store/slice/blockedDatesSlice";
import AdminCalendar from "../../../common/AdminCalendar";

const VillaSection = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { villas = [], deleteMessage, deleteLoading, deleteError } = useSelector(
        (state) => state.villa
    );

    const {
        blockedDates = [],
    } = useSelector((state) => state.blockedDates);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        dispatch(getAllBlockedDates());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllVillas());
    }, [dispatch]);

    useEffect(() => {
        if (deleteMessage) {
            successAlert(deleteMessage);
            dispatch(clearVillaMessage());
            dispatch(getAllVillas());
        }
        if (deleteError) {
            errorAlert(deleteError);
            dispatch(clearVillaError());
        }
    }, [deleteMessage, deleteError, dispatch]);

    const filteredVillas = villas?.filter((villa) =>
        villa?.villaName.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddVilla = () => {
        setEditData(null);
        setShowCreate(true);
    };

    const handleDelete = () => {
        dispatch(deleteVilla(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    if (showCreate) {
        return (
            <CreateVilla
                formData={editData}
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
            itemsCount={villas.length}
            buttonName="Add Villa"
            displayTitle="Manage Your Villas"
            onAddClick={handleAddVilla}

        >
            <div className="flex justify-end py-10">
                <AdminCalendar
                    blockedDates={blockedDates}
                    isMobile={false}
                />
            </div>

            <div className="my-5">
                <div className="flex items-center space-x-2 justify-end mb-4">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg border ${viewMode === "grid"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                        title="Grid View"
                    >
                        <FiGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg border ${viewMode === "list"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                        title="List View"
                    >
                        <FiList size={20} />
                    </button>
                </div>
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVillas?.map((villa) => (
                            <div
                                key={villa?._id}
                                className=" rounded-xl shadow-md border border-gray-200 p-6 relative group hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold  capitalize">
                                            {villa?.villaName}
                                        </h2>
                                        <p className=" text-md mt-1">
                                            {villa?.locationId?.name || "Location not specified"}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <button className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100">
                                            <HiDotsVertical size={20} />
                                        </button>
                                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-10">
                                            <button
                                                onClick={() =>
                                                    navigate(`/villadetails/${villa?.slug}`)
                                                }
                                                className="w-full px-4 py-2 text-sm  hover:bg-blue-100 text-left"
                                            >
                                                👁 View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditData(villa);
                                                    setShowCreate(true);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FiEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteId(villa?._id);
                                                    setOpenDelete(true);
                                                }}
                                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm mt-1 line-clamp-2">
                                    {villa?.overview || "No description available"}
                                </p>
                                {villa?.images?.villaImage && (
                                    <div className="mt-4">
                                        <Image
                                            src={villa.images.villaImage}
                                            alt={villa.villaName}
                                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                        />
                                        {villa?.images?.villaGallery?.length > 0 && (
                                            <div className="flex items-center mt-2 text-sm ">
                                                <TbView360 className="mr-1" />
                                                <span>+{villa.images.villaGallery.length} more images</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    {villa?.highlights?.length > 0 && (
                                        <div className="flex overflow-x-auto gap-2 mb-3 scrollbar-hide">
                                            {villa.highlights.slice(0, 3).map((highlight, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-50 text-black  rounded-full text-xs font-medium whitespace-nowrap"
                                                >
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${villa.status ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                                }`}>
                                                {villa?.status ? "Active" : "Inactive"}
                                            </span>
                                            <span className="text-sm">
                                                ₹{villa?.offerPrice || villa?.price}/night
                                            </span>
                                        </div>
                                        {villa?.isFeatured && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {viewMode === "list" && (
                    <div className=" rounded-xl shadow border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Villa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=" divide-y divide-gray-200">
                                {filteredVillas?.map((villa) => (
                                    <tr key={villa._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {villa?.images?.villaImage && (
                                                    <div className=" h-12 w-12 mr-3">
                                                        <Image
                                                            src={villa.images.villaImage}
                                                            alt={villa.villaName}
                                                            className="h-12 w-12 rounded-lg object-cover border border-gray-300"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {villa.villaName}
                                                    </div>
                                                    <div className="text-sm line-clamp-1">
                                                        {villa.overview || "No description"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {villa?.locationId?.name || "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                {villa?.isOffer ? (
                                                    <div>
                                                        <span className="text-red-600 font-semibold">
                                                            ₹{villa.offerPrice}
                                                        </span>
                                                        <span className="line-through text-xs ml-2">
                                                            ₹{villa.price}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold">₹{villa.price}</span>
                                                )}
                                                <div className="text-xs text-gray-500">per night</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${villa.status
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}>
                                                {villa.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className=" py-4">
                                            {villa.isFeatured ? (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setEditData(villa);
                                                        setShowCreate(true);
                                                    }}
                                                    className=" hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <FiEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteId(villa?._id);
                                                        setOpenDelete(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredVillas?.length === 0 && (
                    <SimpleNoVillas
                        title="No results found"
                        message="Villa not found. Please try a different search."
                    />
                )}
            </div>

            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Are you sure you want to delete this villa?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default VillaSection;