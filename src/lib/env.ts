// Expose typed environment variables to the app
// Use these constants in your app instead of reading import.meta.env everywhere.

export const VITE_MONGO_URI = (import.meta as any).env.VITE_MONGO_URI as string | undefined;
export const VITE_PORT = Number((import.meta as any).env.VITE_PORT ?? (import.meta as any).env.VITE_APP_PORT ?? 0);

export const isDev = (import.meta as any).env.MODE === "development";
