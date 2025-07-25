import type { MarkerData } from "./storage";

const PROXY_SERVER = 'https://geoproxy.leonickl.de'
const AUTH_HEADER = 'Basic ' + btoa(`${import.meta.env.VITE_NC_USER}:${import.meta.env.VITE_NC_PASS}`);
const headers = {
    Authorization: AUTH_HEADER,
    'X-NC-Url': import.meta.env.VITE_NC_URL,
    'Content-Type': 'application/json'
}

export async function pullItems(): Promise<MarkerData[]> {
    const res = await fetch(`${PROXY_SERVER}?path=favorites`, {
        method: 'GET',
        headers,
    });

    if (!res.ok) {
        throw new Error(`Failed to pull markers: ${res.status}`);
    }

    const data = await res.json();

    return data as MarkerData[];
}

export async function pushMarker(marker: MarkerData): Promise<MarkerData> {
    const res = await fetch(`${PROXY_SERVER}?path=favorites`, {
        method: 'POST',
        headers,
        body: JSON.stringify(marker),
    });

    if (!res.ok) {
        throw new Error(`Failed to push marker: ${res.status}`);
    }

    return res.json() as Promise<MarkerData>;
}
