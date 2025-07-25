export type MarkerData = {
    id?: number,
    name: string,
    lat: number,
    lng: number,
}

export function getItems() : MarkerData[]{
    const raw = localStorage.getItem("markers")

    return raw ? JSON.parse(raw) : []
}

export function addItem(newItem: MarkerData) {
    return localStorage.setItem("markers", JSON.stringify([...getItems(), newItem]))
}


export function pullItems() {}

export function pushItems() {}
