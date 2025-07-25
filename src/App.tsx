import { ToastContainer } from "react-toastify";
import MapView from "./components/MapView";
import { useEffect } from "react";
import { updateList, workQueue } from "./utils/storage";

export default function App() {
    useEffect(() => {
        updateList();
        workQueue();
    }, []);

    return (
        <main style={{ height: "100vh", width: "100vw" }}>
            <MapView />
            <ToastContainer />
        </main>
    );
}
