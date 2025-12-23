import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../../common/CommonDeleteModel";
import { getAllExtraServices, deleteExtraService, clearExtraServiceMessage, clearExtraServiceError } from "../../../store/slice/serviceSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";
import CreateService from "./CreateService";

const ExtraService = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);

    const { services, deleteLoading, deleteMessage, error } = useSelector((state) => state.service);

    useEffect(() => {
        dispatch(getAllExtraServices());
    }, [dispatch]);


    useEffect(() => {
        if (deleteMessage) {
            successAlert(deleteMessage);
            dispatch(clearExtraServiceMessage());
            dispatch(getAllExtraServices());
        }
        if (error) {
            errorAlert(error);
            dispatch(clearExtraServiceError());
        }
    }, [deleteMessage, error, dispatch]);

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase())
    );


    const handleAddService = () => {
        setEditData(null);
        setShowCreate(true)
    };

    const handleDelete = () => {
        dispatch(deleteExtraService(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };


    if (showCreate) {
        return (
            <CreateService serviceData={editData} onBack={() => {
                setShowCreate(false);
                setEditData(null);
            }} />
        )
    }
    return (
        <MainLayout
            Inputvalue={search}
            InputOnChange={setSearch}
            itemsCount={services?.length}
            buttonName="Add Service"
            displayTitle="Manage Your Services"
            onAddClick={handleAddService}
        >
            <section className="my-5">
                {filteredServices?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Code</th>
                                    <th className="py-3 px-6 text-left">Price</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices?.map((service) => (
                                    <tr key={service?._id} className="border-b border-gray-300 hover:bg-gray-50">
                                        <td className="py-3 px-6">{service?.name}</td>
                                        <td className="py-3 px-6">{service?.code}</td>
                                        <td className="py-3 px-6">₹{service?.price}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(service);
                                                        setShowCreate(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    <FiEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteId(service?._id);
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
                    <p className="text-center text-gray-500 mt-10">No services found</p>
                )}
            </section>

            <ConfirmDeleteModal
                loading={deleteLoading}
                isOpen={openDelete}
                title="Are you sure you want to delete this service?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDelete(false)}
            />
        </MainLayout>
    );
};

export default ExtraService;
