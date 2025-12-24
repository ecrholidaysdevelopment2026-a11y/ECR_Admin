import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { getAmenityIcon } from "../../../utils/amenityIcons";
import {
    getAllAmenities,
    deleteAmenity,
    clearAmenityMessage,
    clearAmenityError,
} from "../../../store/slice/amenitiesSlice";

import { successAlert, errorAlert } from "../../../utils/alertService";
import CreateAmenity from "./CreateAmenity";

const AmenitiesSection = () => {
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);

    const {
        amenities,
        deleteLoading,
        deleteMessage,
        error,
    } = useSelector((state) => state.amenities);

    useEffect(() => {
        dispatch(getAllAmenities());
    }, [dispatch]);

    useEffect(() => {
        if (deleteMessage) {
            successAlert(deleteMessage);
            dispatch(clearAmenityMessage());
            dispatch(getAllAmenities());
        }

        if (error) {
            errorAlert(error);
            dispatch(clearAmenityError());
        }
    }, [deleteMessage, error, dispatch]);

    const filteredAmenities = amenities.filter((amenity) =>
        amenity.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddAmenity = () => {
        setEditData(null);
        setShowCreate(true);
    };

    const handleDelete = () => {
        dispatch(deleteAmenity(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    if (showCreate) {
        return (
            <CreateAmenity
                amenityData={editData}
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
            itemsCount={amenities?.length}
            buttonName="Add Amenity"
            displayTitle="Manage Your Amenities"
            onAddClick={handleAddAmenity}
        >
            <section className="my-5">
                {filteredAmenities?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead>
                                <tr className=" text-gray-500 uppercase text-sm font-semibold">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Icon</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAmenities?.map((amenity) => (
                                    <tr
                                        key={amenity?._id}
                                        className="border-b border-gray-300 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-6">{amenity?.name}</td>

                                        <td className="py-3 px-6">
                                            {(() => {
                                                const Icon = getAmenityIcon(amenity.icon);
                                                return <Icon size={20} />;
                                            })()}
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(amenity);
                                                        setShowCreate(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    <FiEdit /> Edit
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setDeleteId(amenity?._id);
                                                        setOpenDelete(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
                        No amenities found
                    </p>
                )}
            </section>

            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Are you sure you want to delete this amenity?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default AmenitiesSection;
