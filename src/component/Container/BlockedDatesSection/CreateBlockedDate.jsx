import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createBlockedDate,
    updateBlockedDate,
    clearBlockedDatesMessage,
    clearBlockedDatesError,
    getAllBlockedDates,
} from "../../../store/slice/blockedDatesSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";
import { FiArrowLeft } from "react-icons/fi";
import SingleSelectDropdown from "../../../common/SingleSelectDropdown";
import CustomDatePicker from "../../../common/CustomDatePicker";
import { getAllVillas } from "../../../store/slice/villaSlice";
import { getAllLocations } from "../../../store/slice/locationSlice";

const CreateBlockedDate = ({ blockedDateData, onBack }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        scope: blockedDateData?.scope || 1,
        locationId: blockedDateData?.locationId?._id || "",
        villaId: blockedDateData?.villaId || "",
        startDate: blockedDateData?.startDate ? new Date(blockedDateData.startDate) : null,
        endDate: blockedDateData?.endDate ? new Date(blockedDateData.endDate) : null,
        reason: blockedDateData?.reason || "",
        color: blockedDateData?.color || "#EF4444",
        isBlocked: blockedDateData?.isBlocked || false,
    });

    const [filteredVillas, setFilteredVillas] = useState([]);
    const [blockType, setBlockType] = useState(blockedDateData?.endDate ? "range" : "single");
    const { loading, message, error } = useSelector((state) => state.blockedDates);
    const { locations = [] } = useSelector((state) => state.locations);
    const { villas = [] } = useSelector((state) => state.villa);

    useEffect(() => {
        if (formData.scope === 3 && formData.locationId && villas.length > 0) {
            const filtered = villas.filter(villa =>
                villa.locationId?._id === formData.locationId ||
                villa.location?._id === formData.locationId ||
                villa.location === formData.locationId
            );
            setFilteredVillas(filtered);
            if (formData.villaId && !filtered.some(v => v._id === formData.villaId)) {
                setFormData(prev => ({ ...prev, villaId: "" }));
            }
        } else {
            setFilteredVillas([]);
            if (formData.scope !== 3) {
                setFormData(prev => ({ ...prev, villaId: "" }));
            }
        }
    }, [formData.locationId, formData.scope, villas]);

    useEffect(() => {
        dispatch(getAllVillas());
        dispatch(getAllLocations());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(clearBlockedDatesMessage());
            dispatch(getAllBlockedDates());
            onBack();
        }

        if (error) {
            errorAlert(error);
            dispatch(clearBlockedDatesError());
        }
    }, [message, error, dispatch, onBack]);

    const scopeOptions = [
        { value: 1, label: "Global (All Villas)", description: "Block all villas" },
        { value: 2, label: "Specific Location", description: "Block all villas in a location" },
        { value: 3, label: "Specific Villa", description: "Block a specific villa" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedData = {
            scope: formData.scope,
            startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : null,
            endDate: blockType === "range" && formData.endDate ? formData.endDate.toISOString().split('T')[0] : formData.startDate.toISOString().split('T')[0],
            reason: formData.reason,
            color: formData.color,
            isBlocked: formData.isBlocked,
        };

        if (formData.scope === 2 || formData.scope === 3) {
            formattedData.locationId = formData.locationId;
        }

        if (formData.scope === 3) {
            formattedData.villaId = formData.villaId;
        }

        if (blockedDateData) {
            dispatch(updateBlockedDate({ id: blockedDateData._id, payload: formattedData }));
        } else {
            dispatch(createBlockedDate(formattedData));
        }
    };

    const handleChange = (field, value) => {
        const newFormData = { ...formData, [field]: value };
        if (field === "scope") {
            if (value === 1) {
                newFormData.locationId = "";
                newFormData.villaId = "";
            } else if (value === 2) {
                newFormData.villaId = "";
            } else if (value === 3) {
            }
        } else if (field === "locationId" && formData.scope === 2) {
            newFormData.villaId = "";
        }
        setFormData(newFormData);
    };

    const handleBlockTypeChange = (type) => {
        setBlockType(type);
        if (type === "single") {
            setFormData(prev => ({ ...prev, endDate: null }));
        }
    };

    const getEndDateMinDate = () => {
        if (formData.startDate) {
            const minDate = new Date(formData.startDate);
            minDate.setDate(minDate.getDate() + 1);
            return minDate;
        }
        return new Date();
    };

    const getScopeDescription = (scope) => {
        switch (scope) {
            case 1: return "This will block the selected dates for ALL villas across all locations.";
            case 2: return "This will block the selected dates for ALL villas in the selected location.";
            case 3: return "This will block the selected dates for a specific villa only.";
            default: return "";
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
            >
                <FiArrowLeft /> Back to Blocked Dates
            </button>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2">
                    {blockedDateData ? 'Edit Blocked Date & Highlights' : 'Add New Blocked Date & Highlights'}
                </h2>
                <p className="text-gray-600 mb-6">
                    {blockedDateData ?
                        'Update the details of this blocked date.' :
                        'Block dates at different scopes: global, location, or specific villa.'
                    }
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason / Notes
                            </label>
                            <input
                                value={formData.reason}
                                onChange={(e) => handleChange("reason", e.target.value)}
                                placeholder="Enter reason for blocking dates (e.g. maintenance, renovation, private booking...)"
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-0 focus:border-gray-400"
                                required
                            />
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Block Scope
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {scopeOptions.map((scope) => (
                                <button
                                    key={scope.value}
                                    type="button"
                                    onClick={() => handleChange("scope", scope.value)}
                                    className={`p-4 rounded-lg border transition-all ${formData.scope === scope.value
                                        ? "bg-black text-white border-black shadow-md"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                        }`}
                                >
                                    <div className="font-medium">{scope.label}</div>
                                    <div className="text-xs mt-1 opacity-80">
                                        {scope.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            {getScopeDescription(formData.scope)}
                        </p>
                    </div>
                    {(formData.scope === 2 || formData.scope === 3) && (
                        <div className="mb-6">
                            <SingleSelectDropdown
                                label="Select Location"
                                options={locations}
                                value={formData.locationId}
                                onChange={(id) => handleChange('locationId', id)}
                                searchable={true}
                                labelKey="locationName"
                                placeholder="Select a location"
                                required={formData.scope === 2 || formData.scope === 3}
                            />
                        </div>
                    )}
                    {formData.scope === 3 && (
                        <div className="mb-6">
                            <SingleSelectDropdown
                                label="Select Villa"
                                options={filteredVillas}
                                value={formData.villaId}
                                labelKey="villaName"
                                searchable={true}
                                onChange={(id) => handleChange('villaId', id)}
                                placeholder={formData.locationId ? "Select a villa" : "Please select a location first"}
                                disabled={!formData.locationId}
                                required={true}
                            />
                            {!formData.locationId && (
                                <p className="mt-1 text-sm text-gray-500">Please select a location first to see available villas</p>
                            )}
                            {formData.locationId && filteredVillas.length === 0 && (
                                <p className="mt-1 text-sm text-yellow-600">No villas available for the selected location</p>
                            )}
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Block Type
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleBlockTypeChange("single")}
                                className={`px-4 py-2 rounded-lg border transition-colors ${blockType === "single"
                                    ? "bg-black text-white border-black"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Single Date
                            </button>
                            <button
                                type="button"
                                onClick={() => handleBlockTypeChange("range")}
                                className={`px-4 py-2 rounded-lg border transition-colors ${blockType === "range"
                                    ? "bg-black text-white border-black"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Date Range
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            {blockType === "single"
                                ? "Block a single date"
                                : "Block a range of dates"}
                        </p>
                    </div>
                    <div className="mb-6">
                        <CustomDatePicker
                            selectedDate={formData.startDate}
                            onChange={(date) => handleChange('startDate', date)}
                            minDate={new Date()}
                            label="Start Date"
                            required={true}
                        />
                    </div>

                    {blockType === "range" && (
                        <div className="mb-6">
                            <CustomDatePicker
                                selectedDate={formData.endDate}
                                onChange={(date) => handleChange('endDate', date)}
                                minDate={getEndDateMinDate()}
                                label="End Date"
                                required={true}
                            />
                            {formData.startDate && formData.endDate && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Blocking {Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24))} days
                                </p>
                            )}
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Block Background Color
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => handleChange("color", e.target.value)}
                                className="w-14 h-10 p-1 border rounded cursor-pointer"
                            />

                            <span
                                className="px-3 py-2 rounded text-white text-sm"
                                style={{ backgroundColor: formData.color }}
                            >
                                Preview
                            </span>
                            <span className="text-sm text-gray-500">
                                Used for calendar blocked date background
                            </span>
                        </div>
                    </div>
                    <label className="flex items-center justify-end gap-2 h-[42px]">
                        <input
                            type="checkbox"
                            checked={formData.isBlocked}
                            onChange={(e) => handleChange("isBlocked", e.target.checked)}
                            className="mt-0"
                        />
                        <span className="text-sm">Is Booked?</span>
                    </label>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.startDate || !formData.reason ||
                                (formData.scope === 2 && !formData.locationId) ||
                                (formData.scope === 3 && (!formData.locationId || !formData.villaId))}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {blockedDateData ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    {blockedDateData ? 'Update Blocked Date' : 'Create Blocked Date'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlockedDate;