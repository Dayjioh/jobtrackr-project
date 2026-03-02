import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./stores/useAuthStore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { getProfile, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    getProfile(); // ← réhydrate le state au rechargement
  }, []);

  if (isCheckingAuth) return null;

  return (
    <BrowserRouter>
      <Toaster  />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
