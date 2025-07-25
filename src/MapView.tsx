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
import usePosition from "./hooks/usePosition";
import { useEffect, useState } from "react";

import {
    saveMarker,
    allMarkers,
    allFromQueue,
    type MarkerData,
    workQueue,
    updateList,
} from "./utils/storage";

// Set default icon (otherwise it won't show up in many builds)
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
            onAdd([e.latlng?.lat, e.latlng?.lng]);
        },
    });

    return (
        <>
            {markers.map((m) => (
                <Marker key={m.id} position={[m.lat, m.lng]}>
                    <Popup>{m.name}</Popup>
                </Marker>
            ))}
        </>
    );
}

export default function MapView() {
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const { location } = usePosition();

    const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);

    function toCurrentPosition() {
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

        if (!name || name.trim() === "") {
            return;
        }

        const newMarker: MarkerData = {
            name,
            lat: position[0],
            lng: position[1],
        };

        setMarkers(old => [...old, newMarker]);

        saveMarker(newMarker);
    }

    return (
        <>
            <button onClick={toCurrentPosition}>To Current Position</button>
            <button onClick={updateList}>Update List</button>
            <button onClick={workQueue}>Retry Unsaved</button>

            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "90%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={center}>
                    <Popup>Your current position</Popup>
                </Marker>

                {markers.map((record) => (
                    <Marker position={[record.lat, record.lng]}>
                        <Popup>{record.name}</Popup>
                    </Marker>
                ))}

                <MapUpdater center={center} />

                <MarkerManager markers={markers} onAdd={addMarker} />
            </MapContainer>
        </>
    );
}
