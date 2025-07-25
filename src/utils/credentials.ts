type credentials = {
    url: string;
    name: string;
    password: string;
};

export function getCredentials(): credentials | undefined {
    const raw = localStorage.getItem("credentials");
    return raw ? JSON.parse(raw) : undefined;
}

export function storeCredentials(object: credentials) {
    localStorage.setItem("credentials", JSON.stringify(object));
}
