import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../common/MainLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Search } from "lucide-react";
import { HiDotsVertical } from "react-icons/hi";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import Image from "../../../common/Image";
import { errorAlert, successAlert } from "../../../utils/alertService";

import {
    getAllLocations,
    deleteLocation,
    clearLocationMessage,
    clearLocationError,
} from "../../../store/slice/locationSlice";
import { SimpleNoVillas } from "../../../common/Animation";
import CreateLocation from "./CreateLocation";

const LocationsSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        locations = [],
        deleteLocationMessage,
        deleteLocationError,
        deleteLoading
    } = useSelector((state) => state.locations);

    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);


    useEffect(() => {
        dispatch(getAllLocations());
    }, [dispatch]);

    useEffect(() => {
        if (deleteLocationMessage) {
            successAlert(deleteLocationMessage);
            dispatch(clearLocationMessage());
            dispatch(getAllLocations());
        }
        if (deleteLocationError) {
            errorAlert(deleteLocationError);
            dispatch(clearLocationError());
        }
    }, [deleteLocationMessage, deleteLocationError, dispatch]);

    const filteredLocations = locations?.filter((loc) =>
        loc?.locationName.toLowerCase().includes(search.toLowerCase())
    );
    const handleAddLocation = () => {
        setEditData(null);
        setShowCreate(true)
    };

    const handleDelete = () => {
        dispatch(deleteLocation(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    if (showCreate) {
        return (
            <CreateLocation formData={editData} onBack={() => {
                setShowCreate(false);
                setEditData(null);
            }} />
        )

    }
    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={setSearch}
            itemsCount={locations.length}
            buttonName="Add Location"
            onButtonClick={() => navigate("/locations/create")}
            displayTitle="Manage Your Locations"
            onAddClick={handleAddLocation}
        >
            <section className="my-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLocations?.map((loc) => (
                        <div
                            key={loc?._id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 relative group"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-lg font-semibold text-gray-800 capitalize">
                                    {loc?.locationName}
                                </h2>

                                <div className="relative">
                                    <button className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100">
                                        <HiDotsVertical size={20} />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-10">
                                        {/* <button
                                            onClick={() =>
                                                navigate(`/locations/view/${loc?._id}`)
                                            }
                                            className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left"
                                        >
                                            👁 View
                                        </button> */}
                                        <button
                                            onClick={() => {
                                                setEditData(loc);
                                                setShowCreate(true);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <FiEdit /> Edit
                                        </button>

                                        <button
                                            onClick={() => {
                                                setDeleteId(loc?._id);
                                                setOpenDelete(true);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-xs mt-2 line-clamp-3">
                                {loc.description || "No description available"}
                            </p>
                            {loc?.images?.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 my-3">
                                    {loc?.images?.map((img, i) => (
                                        <Image
                                            key={i}
                                            src={img}
                                            alt={loc.i}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-2">
                                <div>
                                    <span className="text-sm text-gray-500">Villas:</span>
                                    <span className="text-sm font-medium"> {loc?.villaCount}</span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${loc.status ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                        }`}
                                >
                                    {loc?.status ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredLocations?.length === 0 && (
                    <SimpleNoVillas
                        title="No results found"
                        message="Location not found. Please try a different search."
                        Icon={Search}
                    />

                )}
            </section>
            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Are you sure you want to delete this location?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default LocationsSection;
