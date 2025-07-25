import { getCredentials } from "./credentials";
import type { MarkerData } from "./storage";

const credentials = getCredentials()!;

const PROXY_SERVER = "https://geoproxy.leonickl.de";

function headers() {
    return {
        Authorization:
            "Basic " + btoa(`${credentials.name}:${credentials.password}`),
        "X-NC-Url": credentials.url,
        "Content-Type": "application/json",
    };
}

export async function pullItems(): Promise<MarkerData[]> {
    const res = await fetch(`${PROXY_SERVER}?path=favorites`, {
        method: "GET",
        headers: headers(),
    });

    if (!res.ok) {
        throw new Error(`Failed to pull markers: ${res.status}`);
    }

    const data = await res.json();

    return data as MarkerData[];
}

export async function pushMarker(marker: MarkerData): Promise<MarkerData> {
    const res = await fetch(`${PROXY_SERVER}?path=favorites`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(marker),
    });

    if (!res.ok) {
        throw new Error(`Failed to push marker: ${res.status}`);
    }

    return res.json() as Promise<MarkerData>;
}
