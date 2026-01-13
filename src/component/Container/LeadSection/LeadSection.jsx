import { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    Calendar,
    MapPin,
    User,
    Package,
    MessageSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../../common/MainLayout";
import { getAdminLeads } from "../../../store/slice/leadSlice";
import Image from "../../../common/Image";
import { formatDate } from "../../../utils/formatters";

const LeadSection = () => {
    const dispatch = useDispatch();
    const { leads = [] } = useSelector((state) => state.lead);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        dispatch(getAdminLeads());
    }, [dispatch]);

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            search === "" ||
            lead.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            lead.email?.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone?.includes(search);

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && lead.status === 1) ||
            (filterStatus === "inactive" && lead.status === 0);

        return matchesSearch && matchesStatus;
    });

    const isVideo = (url) =>
        url?.match(/\.(mp4|webm|ogg)$/i);

    const isImage = (url) =>
        url?.match(/\.(png|jpg|jpeg|webp)$/i);

    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={(e) => setSearch(e)}
            itemsCount={filteredLeads.length}
        >
            <div className="space-y-6">
                <div className="flex justify-end gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="overflow-hidden bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Enquiry
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLeads?.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center">
                                            <MessageSquare className="mx-auto text-gray-400" size={40} />
                                            <p className="mt-2 text-sm text-gray-500">
                                                No enquiries found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads?.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-50 border-b border-gray-300">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <User className="text-gray-400" size={18} />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {lead.firstName} {lead.lastName || ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail size={14} /> {lead.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Phone size={14} /> {lead.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1 text-sm">
                                                {lead.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} /> {lead.location}
                                                    </div>
                                                )}
                                                {lead.rooms && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Package size={14} /> {lead.rooms} Rooms
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead?.media?.length > 0 ? (
                                                    isImage(lead.media[0]) ? (
                                                        <Image
                                                            src={lead.media[0]}
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                    ) : isVideo(lead.media[0]) ? (
                                                        <video
                                                            src={lead.media[0]}
                                                            className="w-20 h-16 rounded"
                                                            controls
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-400">Unsupported file</span>
                                                    )
                                                ) : (
                                                    <span className="text-sm text-gray-400">No media</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                                                <Calendar size={14} />
                                                {formatDate(lead.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LeadSection;