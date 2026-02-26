import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

/*
 * Redirige vers login si l'utilisateur n'est pas authentifié
 * Protège toutes les routes qui nécessitent une connexion
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;
  if (!isAuthenticated) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
