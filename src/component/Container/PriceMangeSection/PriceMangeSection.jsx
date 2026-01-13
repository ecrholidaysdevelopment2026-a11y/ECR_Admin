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

    /* 🔹 Fetch villas */
    useEffect(() => {
        dispatch(getAllVillas());
    }, [dispatch]);

    /* 🔹 Auto-select first villa */
    useEffect(() => {
        if (villas.length > 0 && !selectedVillaId) {
            setSelectedVillaId(villas[0]._id);
        }
    }, [villas, selectedVillaId]);

    /* 🔹 Selected villa slug */
    const selectedVilla = villas.find(
        (villa) => villa._id === selectedVillaId
    );
    const villaSlug = selectedVilla?.slug;

    /* 🔹 Fetch weekly prices */
    useEffect(() => {
        if (villaSlug) {
            dispatch(getVillaWeeklyPrice(villaSlug));
        }
    }, [dispatch, villaSlug]);

    /* 🔹 Error handling */
    useEffect(() => {
        if (error) {
            errorAlert(error);
            dispatch(clearVillaPriceError());
        }
    }, [error, dispatch]);

    /* 🔹 Create price page */
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
            {/* 🔹 Villa Dropdown */}
            <div className="max-w-sm mt-6">
                <SingleSelectDropdown
                    label="Select Villa"
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

            <section className="my-5">
                {!selectedVillaId ? (
                    <p className="text-center text-gray-500 mt-10">
                        Please select a villa to view pricing
                    </p>
                ) : weeklyPrice.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-md text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-2 px-4 text-left font-medium text-gray-600">
                                        Date
                                    </th>
                                    <th className="py-2 px-4 text-left font-medium text-gray-600">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {weeklyPrice.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="py-2 px-4 text-gray-700">
                                            {item.date}
                                        </td>
                                        <td className="py-2 px-4 text-gray-700">
                                            ₹{item.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">
                        No pricing found for this villa
                    </p>
                )}
            </section>
        </MainLayout>
    );
};

export default PriceManageSection;
