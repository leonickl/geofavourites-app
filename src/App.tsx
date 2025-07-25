import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import MapView from "./components/MapView";
import { updateList, workQueue } from "./utils/storage";
import { getCredentials, storeCredentials } from "./utils/credentials";

import "./styles.css";

export default function App() {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [credentials, setCredentials] = useState(getCredentials());

    useEffect(() => {
        updateList();
        workQueue();
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (url && name && password) {
            setCredentials({ url, name, password });
            storeCredentials({ url, name, password });
        } else {
            alert("Please fill in all fields.");
        }
    }

    if (
        !credentials ||
        !credentials.url ||
        !credentials.name ||
        !credentials.password
    ) {
        return (
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        URL
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Username
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    return (
        <main style={{ height: "100vh", width: "100vw" }}>
            <MapView />
            <ToastContainer />
        </main>
    );
}
