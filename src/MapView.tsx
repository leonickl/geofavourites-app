import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import MapUpdater from "./MapUpdater";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import usePosition from "./hooks/usePosition";
import { useEffect, useState } from "react";

// Set default icon (otherwise it won't show up in many builds)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function MapView() {
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

    return (
        <>
            <button onClick={toCurrentPosition}>To Current Position</button>

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

                <MapUpdater center={center} />
            </MapContainer>
        </>
    );
}
