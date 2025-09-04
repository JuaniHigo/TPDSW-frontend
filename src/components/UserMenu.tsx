import { Link } from "react-router-dom";
export default function UserMenu() {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
      <ul className="py-1">
        <li>
          <Link
            to="/dashboardH"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Mi Perfil
          </Link>
        </li>
        <li>
          <Link
            to="/mis-entradas"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Mis Entradas
          </Link>
        </li>
        <li>
          <Link
            to="/configuracion"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Configuración
          </Link>
        </li>
        <li>
          <button
            onClick={() => console.log("Cerrar sesión")}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
