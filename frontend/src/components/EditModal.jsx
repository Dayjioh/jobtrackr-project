import { useState } from "react";

function EditModal({ app, onClose, onUpdate }) {
  const [company, setCompany] = useState(app.company);
  const [position, setPosition] = useState(app.position);
  const [status, setStatus] = useState(app.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(app.id, { company, position, status });
    onClose();
  };

  return (
    /*
     * Overlay → fond sombre qui couvre toute la page
     * onClick sur l'overlay → ferme la modal
     */
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/*
       * Contenu de la modal
       * stopPropagation → empêche la fermeture quand on clique dans la modal
       */}
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Edit Application
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />

          <select
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition w-full font-semibold"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 text-slate-600 p-3 rounded-lg hover:bg-slate-200 transition w-full font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
