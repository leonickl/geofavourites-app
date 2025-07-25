type item = {
    name: string
    lat: number,
    lng: number,
}

export function getItems() : item[]{
    const raw = localStorage.getItem("markers")

    return raw ? JSON.parse(raw) : []
}

export function addItem(newItem: item) {
    return localStorage.setItem("markers", JSON.stringify([...getItems(), newItem]))
}


export function pullItems() {}

export function pushItems() {}
