import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVillaBySlug } from "../../../store/slice/villaSlice";
import Image from "../../../common/Image";
import { getLatLngFromMapLink } from "../../../utils/getLatLngFromMapLink";
import MapPicker from "../../../common/MapPicker";
import {
    Users,
    Star,
    MapPin,
    Clock,
    CheckCircle,
    Home,
    Bed,
    Bath,
    Wifi,
    Car,
    Coffee,
    Tv,
    ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VillaDetailsSection = ({ slug }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedVilla, loading, error } = useSelector(
        (state) => state.villa
    );

    
    useEffect(() => {
        if (slug) {
            dispatch(getVillaBySlug(slug));
        }
    }, [slug, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="text-red-600 font-semibold text-lg mb-2">Error Loading Villa</div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => dispatch(getVillaBySlug(slug))}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedVilla) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Villa Found</h3>
                <p className="text-gray-500 mb-6">This property could not be found.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const allImages = [
        selectedVilla?.images?.villaImage,
        ...(selectedVilla?.images?.villaGallery || []),
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedVilla.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedVilla.status === 1 ? 'Available' : 'Unavailable'}
                        </span>
                        {selectedVilla.isFeatured && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 ">
                        {selectedVilla.villaName}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 ">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedVilla.locationId?.locationName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{selectedVilla.ratingAverage || 0}</span>
                            <span className="text-sm text-gray-500">({selectedVilla.reviews?.length || 0})</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-3 mb-3">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">
                                ₹{selectedVilla.isOffer ? selectedVilla.offerPrice : selectedVilla.price}
                            </span>
                            <span className="text-gray-500">/night</span>
                        </div>
                        {selectedVilla.isOffer && (
                            <>
                                <span className="text-gray-400 line-through">
                                    ₹{selectedVilla.price}
                                </span>
                                <span className="text-sm text-emerald-700 font-medium">
                                    Save ₹{selectedVilla.price - selectedVilla.offerPrice}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-6  border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-teal-50 rounded-md">
                                <Users className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{selectedVilla.maxGuests} guests</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-md">
                                <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm">
                                <div className="text-gray-900">Check-in: {selectedVilla.checkInTime}</div>
                                <div className="text-gray-500">Check-out: {selectedVilla.checkOutTime}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {allImages.length > 0 && (
                    <div className="mb-5">
                        <div className="mb-4">
                            <div className="relative overflow-hidden rounded-lg">
                                <Image
                                    src={allImages[0]}
                                    alt="Main Villa"
                                    className="w-full h-[300px] object-cover"
                                />
                            </div>
                        </div>

                        {allImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-2">
                                {allImages.slice(1, 4).map((img, i) => (
                                    <div key={i} className="relative overflow-hidden rounded-md">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${i + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                        {i === 2 && allImages.length > 4 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-medium text-sm">
                                                    +{allImages.length - 4}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {selectedVilla.overview && (
                    <div className="mb-3">
                        <h2 className="text-lg font-semibold text-gray-900 ">Overview</h2>
                        <p className="text-gray-700">
                            {selectedVilla.overview}
                        </p>
                    </div>
                )}
                {selectedVilla?.highlights?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Highlights</h2>
                        <div className="space-y-2">
                            {selectedVilla.highlights.map((h, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                                    <span className="text-gray-800">
                                        {h.replace(/[\[\]"]/g, "").trim()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Amenities</h2>
                    <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center gap-2 p-1">
                            <Bed className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Comfortable Beds</span>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                            <Bath className="w-4 h-4 text-teal-600" />
                            <span className="text-sm text-gray-700">Private Bathrooms</span>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                            <Wifi className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">High-speed WiFi</span>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                            <Car className="w-4 h-4 text-orange-600" />
                            <span className="text-sm text-gray-700">Free Parking</span>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                            <Coffee className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm text-gray-700">Kitchen</span>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                            <Tv className="w-4 h-4 text-amber-600" />
                            <span className="text-sm text-gray-700">Entertainment</span>
                        </div>
                    </div>
                </div>
                {selectedVilla?.locationId?.mapLink && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Location</h2>

                        <div className="h-[300px] rounded-lg overflow-hidden border">
                            <MapPicker
                                isInput={false}
                                initialPosition={getLatLngFromMapLink(selectedVilla?.locationId?.mapLink)}
                                onSelect={() => { }}
                            />
                        </div>

                        <div className="mt-3">
                            <a
                                href={selectedVilla?.locationId?.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600"
                            >
                                View on Google Map
                            </a>
                        </div>
                    </div>
                )}

                <div className="mb-8 pt-6 border-t border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                    <div className="grid grid-cols-1 gap-1">
                        <div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Property ID</span>
                                <span className="text-sm font-mono text-gray-800">
                                    {selectedVilla._id?.substring(0, 8)}...
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Created</span>
                                <span className="text-sm text-gray-800">
                                    {new Date(selectedVilla.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Last Updated</span>
                                <span className="text-sm text-gray-800">
                                    {new Date(selectedVilla.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Location ID</span>
                                <span className="text-sm font-mono text-gray-800">
                                    {selectedVilla.locationId?._id?.substring(0, 8) || 'N/A'}...
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VillaDetailsSection;