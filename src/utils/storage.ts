export type MarkerData = {
    id?: number,
    name: string,
    lat: number,
    lng: number,
    category?: string;
    comment?: string;
}

export function getItems() : MarkerData[]{
    const raw = localStorage.getItem("markers")

    return raw ? JSON.parse(raw) : []
}

export function addItem(newItem: MarkerData) {
    localStorage.setItem("markers", JSON.stringify([...getItems(), newItem]))

    pushItem(newItem).then()
}

const BASE_URL = `${import.meta.env.VITE_NC_URL}/index.php/apps/maps/api/1.0/favorites`;
const AUTH_HEADER = 'Basic ' + btoa(`${import.meta.env.VITE_NC_USER}:${import.meta.env.VITE_NC_PASS}`);

export async function pullItems(): Promise<MarkerData[]> {
    const res = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            Authorization: AUTH_HEADER,
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to pull markers: ${res.status}`);
    }

    const data = await res.json();

    return data as MarkerData[];
}

export async function pushItem(marker: MarkerData): Promise<MarkerData> {
    const url = `${BASE_URL}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: AUTH_HEADER,
        },
        body: JSON.stringify(marker),
    });

    if (!res.ok) {
        throw new Error(`Failed to push marker: ${res.status}`);
    }

    return res.json() as Promise<MarkerData>;
}
