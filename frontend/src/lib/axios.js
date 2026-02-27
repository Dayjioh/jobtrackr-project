import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // send cookies to the server
});

// Add a response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await API.post("/auth/refresh");
        return API(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
