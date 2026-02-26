import { useEffect, useState } from "react";
import API from "../lib/axios";
import Navbar from "../components/Navbar";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");

  /*
   * editingApp → stocke la candidature en cours d'édition
   * null = pas d'édition en cours
   */
  const [editingApp, setEditingApp] = useState(null);

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
    await API.post("/applications", { company, position, status });
    setCompany("");
    setPosition("");
    setStatus("applied");
    fetchApplications();
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
  const updateApplication = async (e) => {
    e.preventDefault();
    await API.put(`/applications/${editingApp.id}`, { company, position, status });
    setEditingApp(null);
    setCompany("");
    setPosition("");
    setStatus("applied");
    fetchApplications();
  };

  const deleteApplication = async (id) => {
    await API.delete(`/applications/${id}`);
    fetchApplications();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Applications</h2>
         <div className="flex items-center gap-4">
            <p className="text-gray-500">Bonjour {user?.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/*
         * Le formulaire sert à la fois pour créer et mettre à jour
         * si editingApp est défini → mode édition
         * sinon → mode création
         */}
        <form
          onSubmit={editingApp ? updateApplication : createApplication}
          className="flex gap-4 mb-6"
        >
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

          <button className={`${editingApp ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded-lg transition`}>
            {editingApp ? "Update" : "Add"}
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

        {applications.map((app) => (
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
                Edit
              </button>
              <button
                onClick={() => deleteApplication(app.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;