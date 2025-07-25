import { toast } from "react-toastify";
import { queue, set } from "./datastructures";
import { pullItems, pushMarker } from "./http";

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

function markers() {
    return set("markers")
}

function uploadQueue() {
    return queue("upload")
}

export function allMarkers(): MarkerData[] {
    return markers().getItems()
}

export function allFromQueue(): MarkerData[] {
    return uploadQueue().getItems()
}

/**
 * adds a marker to the upload queue and starts the queue worker
 */
export function saveMarker(newItem: MarkerData) {
    uploadQueue().put(newItem)
    workQueue()
}

export async function workQueue() {
    while(uploadQueue().size()) {
        uploadMarker(uploadQueue().pop())
    }
}

/**
 * tries to push a marker to remote
 */
function uploadMarker(marker: MarkerData) {
    pushMarker(marker).then(savedItem => {
        toast.success(`Saved "${savedItem.name}"`)
        markers().addItem(savedItem)
    }).catch(error => {
        toast.error(error.message)
        uploadQueue().put(marker)
    })
}

export async function updateList() {
    const remote = await pullItems()
    const local = allMarkers()

    const localIds = new Set(local.map(marker => marker.id))
    
    remote.forEach(item => {
        if(![...localIds].includes(item.id)) {
            markers().addItem(item)
        }
    })
}