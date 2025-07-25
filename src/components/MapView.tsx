import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import MapUpdater from "./MapUpdater";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import usePosition from "../hooks/usePosition";
import { useEffect, useState } from "react";
import {
    saveMarker,
    allMarkers,
    allFromQueue,
    type MarkerData,
    workQueue,
    updateList,
} from "../utils/storage";
import { toast } from "react-toastify";

// Fix Leaflet's marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function MarkerManager({
    markers,
    onAdd,
}: {
    markers: MarkerData[];
    onAdd: (position: [number, number]) => void;
}) {
    useMapEvents({
        click(e) {
            onAdd([e.latlng.lat, e.latlng.lng]);
        },
    });

    return (
        <>
            {markers.map((m) => (
                <Marker key={m.id} position={[m.lat, m.lng]}>
                    <Popup>{m.name ?? "---"}</Popup>
                </Marker>
            ))}
        </>
    );
}
export default function MapView() {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const { location } = usePosition();
    const [center, setCenter] = useState<[number, number]>([48.6, 13.5]);

    function toCurrentPosition() {
        if (!location) {
            return toast.error("Error reading location");
        }
        setCenter(location as [number, number]);
    }

    useEffect(() => {
        if (location) {
            toCurrentPosition();
        }
    }, [location]);

    useEffect(() => {
        setMarkers([...allMarkers(), ...allFromQueue()]);
    }, []);

    function addMarker(position: [number, number]) {
        const name = prompt("Enter a name for this marker:");

        if (!name || name.trim() === "") return;

        const newMarker: MarkerData = {
            name,
            lat: position[0],
            lng: position[1],
        };

        setMarkers((prev) => [...prev, newMarker]);
        saveMarker(newMarker);
    }

    return (
        <div className="app-container">
            <div className="menu-bar">
                <button onClick={toCurrentPosition}>Current Position</button>
                <button onClick={updateList}>Update List</button>
                <button onClick={workQueue}>Retry Unsaved</button>
            </div>

            <MapContainer
                center={center}
                zoom={13}
                className="leaflet-container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={center}>
                    <Popup>Your current position</Popup>
                </Marker>

                {markers.map((record) => (
                    <Marker key={record.id} position={[record.lat, record.lng]}>
                        <Popup>{record.name}</Popup>
                    </Marker>
                ))}

                <MapUpdater center={center} />
                <MarkerManager markers={markers} onAdd={addMarker} />
            </MapContainer>
        </div>
    );
}
