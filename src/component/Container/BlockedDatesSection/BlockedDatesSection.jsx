import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiGlobe, FiMapPin, FiHome } from "react-icons/fi";
import { format } from "date-fns";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import {
    getAllBlockedDates,
    deleteBlockedDate,
    clearBlockedDatesMessage,
    clearBlockedDatesError,
} from "../../../store/slice/blockedDatesSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";
import CreateBlockedDate from "./CreateBlockedDate";

const BlockedDatesSection = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);

    const {
        blockedDates = [],
        deleteLoading,
        deleteMessage,
        error,
    } = useSelector((state) => state.blockedDates);

    const { locations = [] } = useSelector((state) => state.locations);
    const { villas = [] } = useSelector((state) => state.villa);

    useEffect(() => {
        dispatch(getAllBlockedDates());
    }, [dispatch]);

    useEffect(() => {
        if (deleteMessage) {
            successAlert(deleteMessage);
            dispatch(clearBlockedDatesMessage());
            dispatch(getAllBlockedDates());
        }

        if (error) {
            errorAlert(error);
            dispatch(clearBlockedDatesError());
        }
    }, [deleteMessage, error, dispatch]);

    const getScopeLabel = (scope) => {
        switch (scope) {
            case 1: return { label: "Global", icon: <FiGlobe />, color: "bg-red-100 text-red-800" };
            case 2: return { label: "Location", icon: <FiMapPin />, color: "bg-blue-100 text-blue-800" };
            case 3: return { label: "Villa", icon: <FiHome />, color: "bg-green-100 text-green-800" };
            default: return { label: "Unknown", icon: null, color: "bg-gray-100 text-gray-800" };
        }
    };

    const getLocationName = (locationId) => {
        if (!locationId) return "All Locations";
        const location = locations.find(loc => loc._id === locationId);
        return location?.locationName || `Location ${locationId}`;
    };

    const getVillaName = (villaId) => {
        if (!villaId) return "All Villas";
        const villa = villas.find(v => v._id === villaId);
        return villa?.villaName || `Villa ${villaId}`;
    };

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) return "N/A";

        const start = new Date(startDate);
        if (!endDate || startDate === endDate) {
            return format(start, 'dd MMM yyyy');
        }

        const end = new Date(endDate);
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${format(start, 'dd')}-${format(end, 'dd MMM yyyy')}`;
        }
        if (start.getFullYear() === end.getFullYear()) {
            return `${format(start, 'dd MMM')}-${format(end, 'dd MMM yyyy')}`;
        }
        return `${format(start, 'dd MMM yyyy')} - ${format(end, 'dd MMM yyyy')}`;
    };

    const filteredBlockedDates = blockedDates.filter((blockedDate) => {
        if (!search) return true;

        const searchLower = search.toLowerCase();
        const reason = blockedDate.reason?.toLowerCase() || '';
        const scopeLabel = getScopeLabel(blockedDate.scope).label.toLowerCase();
        const locationName = getLocationName(blockedDate.locationId).toLowerCase();
        const villaName = getVillaName(blockedDate.villaId).toLowerCase();
        const dateRange = formatDateRange(blockedDate.startDate, blockedDate.endDate).toLowerCase();

        return (
            reason.includes(searchLower) ||
            scopeLabel.includes(searchLower) ||
            locationName.includes(searchLower) ||
            villaName.includes(searchLower) ||
            dateRange.includes(searchLower)
        );
    });

    const handleAddBlockedDate = () => {
        setEditData(null);
        setShowCreate(true);
    };

    const handleDelete = () => {
        dispatch(deleteBlockedDate(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    if (showCreate) {
        return (
            <CreateBlockedDate
                blockedDateData={editData}
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
            itemsCount={filteredBlockedDates?.length}
            buttonName="Add Blocked Date"
            displayTitle="Manage Blocked Dates"
            onAddClick={handleAddBlockedDate}
            searchPlaceholder="Search by reason, scope, location, or date..."
        >
            <section className="my-5">
                {filteredBlockedDates?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="text-gray-500 uppercase text-sm font-semibold">
                                    <th className="py-3 px-6 text-left">Scope</th>
                                    <th className="py-3 px-6 text-left">Date Range</th>
                                    <th className="py-3 px-6 text-left">Reason</th>
                                    <th className="py-3 px-6 text-left">Location</th>
                                    <th className="py-3 px-6 text-left">Villa</th>
                                    <th className="py-3 px-6 text-left">Created At</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlockedDates?.map((blockedDate) => {
                                    const scopeInfo = getScopeLabel(blockedDate.scope);
                                    return (
                                        <tr
                                            key={blockedDate?._id}
                                            className="border-b border-gray-300 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    {scopeInfo.icon}
                                                    <span className={`px-3 py-1 rounded-full text-sm ${scopeInfo.color}`}>
                                                        {scopeInfo.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="font-medium">
                                                    {formatDateRange(blockedDate.startDate, blockedDate.endDate)}
                                                </div>
                                                {blockedDate.startDate && blockedDate.endDate && (
                                                    <div className="text-xs text-gray-500">
                                                        {Math.ceil(
                                                            (new Date(blockedDate.endDate) - new Date(blockedDate.startDate)) /
                                                            (1000 * 60 * 60 * 24)
                                                        )} days
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className={`px-3 py-1 rounded-full text-sm ${blockedDate?.reason === 'Maintenance' ?
                                                    'bg-yellow-100 text-yellow-800' :
                                                    blockedDate?.reason === 'Holiday' ?
                                                        'bg-blue-100 text-blue-800' :
                                                        blockedDate?.reason === 'Event' ?
                                                            'bg-purple-100 text-purple-800' :
                                                            blockedDate?.reason === 'Private Booking' ?
                                                                'bg-pink-100 text-pink-800' :
                                                                blockedDate?.reason === 'Weather Conditions' ?
                                                                    'bg-gray-100 text-gray-800' :
                                                                    'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {blockedDate?.reason || 'No reason specified'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">
                                                        {getLocationName(blockedDate.locationId)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">
                                                        {getVillaName(blockedDate.villaId)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                {blockedDate?.createdAt ?
                                                    format(new Date(blockedDate.createdAt), 'dd MMM yyyy HH:mm') :
                                                    'N/A'
                                                }
                                            </td>
                                            <td className="py-3 px-6 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditData(blockedDate);
                                                            setShowCreate(true);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                                                    >
                                                        <FiEdit /> Edit
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(blockedDate?._id);
                                                            setOpenDelete(true);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                    >
                                                        <FiTrash2 /> Delete
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
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">
                            {search ? 'No blocked dates found matching your search' : 'No blocked dates found'}
                        </p>
                        <button
                            onClick={handleAddBlockedDate}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                        >
                            Add Your First Blocked Date
                        </button>
                    </div>
                )}
            </section>
            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Are you sure you want to delete this blocked date?"
                description="This action cannot be undone. The date will become available for bookings."
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default BlockedDatesSection;