import MainLayout from "../../../common/MainLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getVillaWeeklyPrice,
    clearVillaPriceError,
} from "../../../store/slice/villaPriceSlice";

import { errorAlert } from "../../../utils/alertService";
import CreateVillaPrice from "./CreateVillaPrice";
import { getAllVillas } from "../../../store/slice/villaSlice";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";

const PriceManageSection = () => {
    const dispatch = useDispatch();

    const [showCreate, setShowCreate] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedVillaId, setSelectedVillaId] = useState("");

    const { villas = [] } = useSelector((state) => state.villa);
    const { weeklyPrice = [], error } = useSelector(
        (state) => state.villaPrice
    );

    useEffect(() => {
        dispatch(getAllVillas());
    }, [dispatch]);

    useEffect(() => {
        if (villas.length > 0 && !selectedVillaId) {
            setSelectedVillaId(villas[0]._id);
        }
    }, [villas, selectedVillaId]);

    const selectedVilla = villas.find(
        (villa) => villa._id === selectedVillaId
    );

    useEffect(() => {
        if (selectedVillaId) {
            dispatch(getVillaWeeklyPrice(selectedVillaId));
        }
    }, [dispatch, selectedVillaId]);

    useEffect(() => {
        if (error) {
            errorAlert(error);
            dispatch(clearVillaPriceError());
        }
    }, [error, dispatch]);

    if (showCreate) {
        return (
            <CreateVillaPrice
                villaId={selectedVillaId}
                onBack={() => setShowCreate(false)}
            />
        );
    }

    return (
        <MainLayout
            buttonName="Set Special Price"
            displayTitle="Villa Pricing Management"
            onAddClick={() => setShowCreate(true)}
            Inputvalue={search}
            InputOnChange={setSearch}
        >
            <div className="flex flex-wrap items-end justify-between gap-4 mt-6 mb-4">
                <div className="w-full sm:w-72">
                    <SingleSelectDropdown
                        label="Villa"
                        options={villas}
                        value={selectedVillaId}
                        onChange={(id) => {
                            setSelectedVillaId(id);
                            setShowCreate(false);
                        }}
                        searchable
                        labelKey="villaName"
                        placeholder="Choose a villa"
                    />
                </div>

                {selectedVilla && (
                    <div className="text-sm text-gray-500">
                        Showing prices for{" "}
                        <span className="font-medium text-gray-700">
                            {selectedVilla.villaName}
                        </span>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {!selectedVillaId ? (
                    <p className="text-center text-gray-500 py-12">
                        Please select a villa to view pricing
                    </p>
                ) : weeklyPrice.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-600">
                                        Date
                                    </th>
                                    <th className="py-3 px-6 text-left font-semibold text-gray-600">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {weeklyPrice?.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-300 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-6 text-gray-700">
                                            {item.date}
                                        </td>
                                        <td className="py-3 px-6 text-gray-700">
                                            ₹{item.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12">
                        No pricing found for this villa
                    </p>
                )}
            </div>
        </MainLayout>
    );
};

export default PriceManageSection;
