import { toast } from "react-toastify";
import { queue } from "./datastructures";

export type MarkerData = {
    id?: number,
    name: string,
    lat: number,
    lng: number,
    category?: string;
    comment?: string;
    saved?: boolean;
    uuid?: string
}

export function getMarkers() : MarkerData[]{
    const raw = localStorage.getItem("markers")

    return raw ? JSON.parse(raw) : []
}

function setMarkers(items: MarkerData[]) {
    localStorage.setItem("markers", JSON.stringify(items))
}

function addMarker(item: MarkerData) {
    setMarkers([...getMarkers(), item])
}

function uploadQueue() {
    return queue("upload")
}

/**
 * adds a marker to the upload queue and starts the queue worker
 */
export function saveMarker(newItem: MarkerData) {
    uploadQueue().put(newItem)
    workQueue()
}

/**
 * tries to push a marker to remote
 */
function uploadMarker(marker: MarkerData) {
    pushMarker(marker).then(savedItem => {
        toast.success(`Saved "${savedItem.name}"`)
        addMarker(savedItem)
    }).catch(error => {
        toast.error(error.message)
        uploadQueue().put(marker)
    })
}

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

export async function workQueue() {
    while(uploadQueue().size()) {
        uploadMarker(uploadQueue().pop())
    }
}