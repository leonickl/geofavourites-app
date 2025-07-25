import type { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';

export default function usePosition () {
    const [location, setLocation] = useState<LatLngExpression | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => setLocation([
                position.coords.latitude,
                position.coords.longitude,
            ]),
            (err) => setError(err.message)
        );
    }, []);

    return { location, error };
};
