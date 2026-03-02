import { create } from "zustand";
import API from "../lib/axios";

const useAuthStore = create((set) => ({
  /*
   * user → les données de l'utilisateur connecté
   * isAuthenticated → true = connecté, false = non connecté
   * isCheckingAuth → empêche ProtectedRoute de rediriger avant la vérification du cookie
   * isLoading → pour afficher un spinner pendant les requêtes
   */
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  /*
   * Login → appel API + stocke le user dans Zustand
   * l'accessToken est géré automatiquement via le cookie
   */
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await API.post("/auth/login", { email, password });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /*
   * Signup → appel API + stocke le user dans Zustand
   */
  signup: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await API.post("/auth/signup", { email, password });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      /*
       * Sans ce catch, si l'API renvoie une erreur
       * isLoading reste à true → bouton bloqué sur "Loading..."
       */
      set({ isLoading: false });
      throw error; // on remonte l'erreur pour que le composant puisse l'afficher
    }
  },

  /*
   * Logout → appel API + remet le state à null
   * le backend supprime les cookies + Redis
   */
  logout: async () => {
    await API.post("/auth/logout");
    set({ user: null, isAuthenticated: false });
  },

  /*
   * getProfile → vérifie si le cookie accessToken est encore valide
   * appelé au démarrage dans App.jsx pour réhydrater le state au refresh
   */
  getProfile: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await API.get("/auth/profile");
      set({ user: data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch {
      /*
       * Cookie expiré ou invalide → on remet à null
       * ProtectedRoute redirigera vers /
       */
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
