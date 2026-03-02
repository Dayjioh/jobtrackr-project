import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white shadow-md">
      <div className="flex gap-2 items-center ">
        <img className="w-8" src="./job_logo.svg" alt="" />
        <h1 className="text-xl font-bold">JobTrackr </h1>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
      >
        <LogOut />
      </button>
    </div>
  );
}

export default Navbar;
