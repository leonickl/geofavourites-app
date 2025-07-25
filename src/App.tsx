import { ToastContainer } from "react-toastify";
import MapView from "./components/MapView";

export default function App() {
    return (
        <main style={{ height: "100vh", width: "100vw" }}>
            <MapView />
            <ToastContainer />
        </main>
    );
}
