export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-60 bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold mb-6">Panel de Administracion</h2>
        <nav className="flex flex-col space-y-2">
          
          <a href="/admin/eventos" className="hover:text-blue-500">Eventos</a>
          <a href="/admin/clubes" className="hover:text-blue-500">Clubes</a>
          <a href="/admin/estadios" className="hover:text-blue-500">Estadios</a>
          <a href="/admin/sectores" className="hover:text-blue-500">Sectores</a>

        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Bienvenido, administrador</h1>
        {/* Aquí se cargan los componentes según la sección */}
      </main>
    </div>
  );
}
