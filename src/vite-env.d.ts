/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
    export function registerSW(options?: {
        immediate?: boolean;
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
    }): () => void;
}

/// <reference types="vite-plugin-pwa/client" />
