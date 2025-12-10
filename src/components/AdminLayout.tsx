import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { authAPI } from '../services/api';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Clients', path: '/admin/clients' },
    { label: 'Contact Submissions', path: '/admin/contact' },
    { label: 'Newsletter Subscribers', path: '/admin/newsletter' },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authAPI.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens even if logout fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/admin/login');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-6 py-3 hover:bg-gray-800 transition"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            <LogOut size={18} />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-900">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            View Site
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
