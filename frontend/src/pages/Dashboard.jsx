import { useEffect, useState } from "react";
import API from "../lib/axios";
import Navbar from "../components/Navbar";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditModal from "../components/EditModal";
import {Trash2,SquarePen,CirclePlus, LogOut} from "lucide-react";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");

  /*
   * editingApp → stocke la candidature en cours d'édition
   * null = pas d'édition en cours
   */
  // Remplacez startEditing et updateApplication par :
  const [editingApp, setEditingApp] = useState(null);

  const updateApplication = async (id, updatedData) => {
    try {
      await API.put(`/applications/${id}`, updatedData);
      toast.success("Application updated! ✏️");
      setEditingApp(null);
      fetchApplications();
    } catch {
      toast.error("Failed to update application");
    }
  };

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const fetchApplications = async () => {
    const res = await API.get("/applications");
    setApplications(res.data);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const createApplication = async (e) => {
    e.preventDefault();
    try {
      await API.post("/applications", { company, position, status });
      toast.success("Application added ! 🗒️");
      setCompany("");
      setPosition("");
      setStatus("applied");
      fetchApplications();
    } catch {
      toast.error("Failed to add application");
    }
  };

  /*
   * Pré-remplit le formulaire avec les données de la candidature à éditer
   * et stocke la candidature dans editingApp
   */
  const startEditing = (app) => {
    setEditingApp(app);
    setCompany(app.company);
    setPosition(app.position);
    setStatus(app.status);
  };

  /*
   * Envoie la mise à jour au backend avec l'id de editingApp
   */

  const deleteApplication = async (id) => {
    try {
      await API.delete(`/applications/${id}`);
      toast.success("Application deleted ! 🗑️");
      fetchApplications();
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully !");
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  /*
   * activeFilter → le filtre actif
   * "all" par défaut → affiche toutes les candidatures
   */
  const [activeFilter, setActiveFilter] = useState("all");

  /*
   * filteredApplications → candidatures filtrées selon le filtre actif
   * si "all" → on affiche tout
   * sinon → on filtre par status
   */
  const filteredApplications =
    activeFilter === "all"
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  /*
   * On calcule les stats directement depuis le tableau applications
   * pas besoin de requête supplémentaire au backend
   */
  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    interview: applications.filter((app) => app.status === "interview").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Applications</h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-500">Welcome {user?.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut/>
            </button>
          </div>
        </div>

        {/* Stats visuelles */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-sm text-slate-500 mt-1">Total</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
            <p className="text-sm text-blue-400 mt-1">Applied</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {stats.interview}
            </p>
            <p className="text-sm text-yellow-400 mt-1">Interview</p>
          </div>

          <div className="bg-red-50 p-4 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
            <p className="text-sm text-red-400 mt-1">Rejected</p>
          </div>
        </div>

        {/* Filtres par status */}
        <div className="flex gap-2 mb-6">
          {["all", "applied", "interview", "rejected"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeFilter === filter
                  ? "bg-blue-600 text-white" // ← actif
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200" // ← inactif
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/*
         * Le formulaire sert à la fois pour créer et mettre à jour
         * si editingApp est défini → mode édition
         * sinon → mode création
         */}
        <form onSubmit={createApplication} className="flex gap-4 mb-6">
          <input
            className="border p-2 rounded-lg w-full"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="border p-2 rounded-lg w-full"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <select
            className="border p-2 rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <CirclePlus/>
          </button>

          {/*
           * Annuler l'édition → remet le formulaire à zéro
           */}
          {editingApp && (
            <button
              type="button"
              onClick={() => {
                setEditingApp(null);
                setCompany("");
                setPosition("");
                setStatus("applied");
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </form>

        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="flex justify-between items-center p-4 mb-3 bg-slate-50 rounded-xl shadow"
          >
            <div>
              <p className="font-semibold">{app.company}</p>
              <p className="text-gray-600">{app.position}</p>
              <span
                className={`text-sm font-medium ${
                  app.status === "applied"
                    ? "text-blue-500"
                    : app.status === "interview"
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {app.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEditing(app)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
              >
               <SquarePen className="w-4 h-8" />
              </button>
              <button
                onClick={() => deleteApplication(app.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-8" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingApp && (
        <EditModal
          app={editingApp}
          onClose={() => setEditingApp(null)}
          onUpdate={updateApplication}
        />
      )}
    </div>
  );
}

export default Dashboard;
