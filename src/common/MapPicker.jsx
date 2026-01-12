import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";

const provider = new OpenStreetMapProvider({
    params: { countrycodes: "in" },
    fetch: window.fetch,
});

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const MapController = ({ mapRef }) => {
    const map = useMap();
    useEffect(() => {
        mapRef.current = map;
    }, [map]);
    return null;
};

const MapPicker = ({ onSelect, initialPosition = null, isInput = true }) => {
    const [position, setPosition] = useState(initialPosition);
    const [query, setQuery] = useState("");
    const mapRef = useRef(null);

    const providerRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            providerRef.current = new OpenStreetMapProvider({
                params: { countrycodes: "in" },
                fetch: window.fetch,
            });
        }
    }, []);


    useEffect(() => {
        if (initialPosition && mapRef.current) {
            mapRef.current.setView([initialPosition.lat, initialPosition.lng], 13);
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim() || !mapRef.current) return;

        try {
            const results = await provider.search({ query });
            if (!results.length) {
                alert("Location not found");
                return;
            }
            const place = results[0];
            const { x: lng, y: lat, bounds } = place;
            setPosition({ lat, lng });
            if (bounds) {
                mapRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
            } else {
                mapRef.current.setView([lat, lng], 13, { animate: true });
            }
            onSelect(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}`);
        } catch (err) {
            console.error("Search error:", err);
            alert("Failed to fetch location");
        }
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                mapRef.current?.setView(e.latlng, 15, { animate: true });

                onSelect(
                    `https://www.openstreetmap.org/?mlat=${e.latlng.lat}&mlon=${e.latlng.lng}`
                );
            },
        });

        return position ? <Marker position={position} /> : null;
    };

    return (
        <div>
            {
                isInput &&
                <div className="flex gap-2 mb-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                        placeholder="Search location (eg: Chennai, Tamil Nadu)"
                        className="border p-2 w-full rounded"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 bg-black text-white rounded"
                    >
                        Search
                    </button>
                </div>
            }


            <MapContainer
                center={initialPosition ? [initialPosition.lat, initialPosition.lng] : [20, 78]}
                zoom={initialPosition ? 13 : 5}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <MapController mapRef={mapRef} />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default MapPicker;
