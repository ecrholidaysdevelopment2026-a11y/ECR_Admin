import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../../common/MainLayout";
import {
    FiEdit,
    FiTrash2,
    FiGrid,
    FiList,
    FiCalendar,
    FiTag,
    FiClock,
    FiImage,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";

import {
    getAllEvents,
    deleteEvent,
    clearEventMessage,
    clearEventError,
} from "../../../store/slice/eventSlice";

import CreateEvent from "./CreateEvent";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { successAlert, errorAlert } from "../../../utils/alertService";
import Image from "../../../common/Image";

const EventSection = () => {
    const dispatch = useDispatch();
    const { events, deleteEventMessage, deleteEventError } = useSelector(
        (state) => state.event
    );

    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [search, setSearch] = useState("")

    useEffect(() => {
        dispatch(getAllEvents());
    }, [dispatch]);

    useEffect(() => {
        if (deleteEventMessage) {
            successAlert(deleteEventMessage);
            dispatch(clearEventMessage());
            dispatch(getAllEvents());
        }
        if (deleteEventError) {
            errorAlert(deleteEventError);
            dispatch(clearEventError());
        }
    }, [deleteEventMessage, deleteEventError, dispatch]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (showCreate) {
        return (
            <CreateEvent
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
            displayTitle="Manage Events"
            buttonName="Add Event"
            onAddClick={() => setShowCreate(true)}
            Inputvalue={search}
            InputOnChange={setSearch}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-lg" />
                    <span>{events?.length || 0} Events</span>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                    >
                        <FiGrid className="text-lg" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                    >
                        <FiList className="text-lg" />
                    </button>
                </div>
            </div>
            {viewMode === "grid" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events?.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                {event.eventImages && event.eventImages.length > 0 ? (
                                    <>
                                        <Image
                                            src={event.eventImages[0]}
                                            alt={event.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {event.eventImages.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <FiImage /> {event.eventImages.length}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-blue-50 to-purple-50">
                                        <FiCalendar className="text-4xl text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {event.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiTag className="text-gray-400" />
                                        <span className="font-medium">{event.categoryId?.name || 'No Category'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiCalendar className="text-gray-400" />
                                        <span>Created: {formatDate(event.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiClock className="text-gray-400" />
                                        <span>Updated: {formatDate(event.updatedAt)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setEditData(event);
                                            setShowCreate(true);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <FiEdit className="text-sm" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteId(event._id);
                                            setOpenDelete(true);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <FiTrash2 className="text-sm" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {viewMode === "list" && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Event</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Images</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Created</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events?.map((event) => (
                                <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            {event.eventImages && event.eventImages.length > 0 && (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={event.eventImages[0]}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                                <p className="text-xs text-gray-500">ID: {event._id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                                            <FiTag size={12} />
                                            {event.categoryId?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {event.status === 1 ? (
                                                <>
                                                    <FiCheckCircle className="text-green-500" />
                                                    <span className="text-green-600 text-sm">Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiXCircle className="text-red-500" />
                                                    <span className="text-red-600 text-sm">Inactive</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <FiImage />
                                            <span className="text-sm">{event.eventImages?.length || 0}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {formatDate(event.createdAt)}
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            {formatTime(event.createdAt)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditData(event);
                                                    setShowCreate(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Event"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteId(event._id);
                                                    setOpenDelete(true);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Event"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {(!events || events.length === 0) && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiCalendar className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first event</p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Your First Event
                    </button>
                </div>
            )}
            {imageModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="p-4">
                            <button
                                onClick={() => setImageModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                            <Image
                                src={selectedImage}
                                alt="Event Preview"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDeleteModal
                isOpen={openDelete}
                title="Delete Event"
                description="Are you sure you want to delete this event? This action cannot be undone."
                onConfirm={() => {
                    dispatch(deleteEvent(deleteId));
                    setOpenDelete(false);
                }}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default EventSection;