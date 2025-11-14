import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/EditarEvento"
          className="bg-blue-600 text-white p-6 rounded-2xl shadow hover:bg-blue-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Eventos</h2>

        </Link>

        <Link
          to="/admin/EditarClub"
          className="bg-green-600 text-white p-6 rounded-2xl shadow hover:bg-green-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Clubes</h2>

        </Link>

        <Link
          to="/admin/EditarEstadio"
          className="bg-purple-600 text-white p-6 rounded-2xl shadow hover:bg-purple-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Estadios</h2>

        </Link>

      </div>
    </div>
  );
};

export default AdminPanel;
