import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies to the server
});

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /*
     * On exclut les routes auth de l'interceptor pour éviter les boucles infinies
     * /auth/refresh → si ça échoue on logout directement
     * /auth/profile → appelé au démarrage, si absent on ne tente pas de refresh
     */
    const isAuthRoute =
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/profile") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/login");

    if (error.response?.status === 401 && !isAuthRoute) {
      try {
        await API.post("/auth/refresh");
        return API(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default API;
