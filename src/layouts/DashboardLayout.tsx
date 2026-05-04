import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, FileText, MessageSquare,
  CreditCard, Star, HeartPulse, User, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CalendarDays, label: 'My Bookings', href: '/dashboard/bookings' },
  { icon: FileText, label: 'Documents', href: '/dashboard/documents' },
  { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/payments' },
  { icon: Star, label: 'Reviews', href: '/dashboard/reviews' },
  { icon: HeartPulse, label: 'Aftercare', href: '/dashboard/aftercare' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="MediTrip Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-bold text-lg">MediTrip</span>
            </Link>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">{profile?.full_name?.[0]?.toUpperCase() ?? 'U'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{profile?.full_name ?? 'Patient'}</p>
                <p className="text-gray-400 text-xs truncate">{profile?.email ?? ''}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-1">
              {sidebarLinks.map(({ icon: Icon, label, href }) => (
                <NavLink
                  key={href}
                  to={href}
                  end={href === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Sign Out */}
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-danger hover:bg-red-950 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-dark">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-dark">Dashboard</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
