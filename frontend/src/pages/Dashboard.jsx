import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");

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
    fetchApplications();
  };

  const deleteApplication = async (id) => {
    await API.delete(`/applications/${id}`);
    fetchApplications();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <h2>My Applications</h2>

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
            Add
          </button>
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

            <button
              onClick={() => deleteApplication(app.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
