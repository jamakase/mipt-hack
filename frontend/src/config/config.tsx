declare global {
  interface Window {
    API_URL?: string;
  }
}

export const config = {
  apiUrl: window.API_URL || import.meta.env.VITE_API_URL || "http://localhost:8080"
}