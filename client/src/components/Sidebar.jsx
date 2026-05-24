import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Users2, 
  TrendingUp, 
  Bell, 
  LogOut,
  ChevronRight,
  Gauge
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: FileCheck2 },
    { name: 'Clients', path: '/clients', icon: Users2 },
    { name: 'Performance', path: '/performance', icon: TrendingUp },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Brand logo header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2.5">
        <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/25">
          <Gauge className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <span className="font-extrabold text-slate-100 tracking-wide text-base">Manufacture</span>
          <span className="font-semibold text-brand-400 text-base">CRM</span>
        </div>
      </div>

      {/* User profile segment */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center font-bold text-slate-900 uppercase">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-semibold text-sm text-slate-200 truncate">{user?.fullName || 'User Profile'}</h4>
            <span className="inline-block text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded font-medium mt-0.5">
              {user?.role || 'BDA'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav menu links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileOpen?.(false)}
            className={({ isActive }) => 
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-400 font-semibold border-l-2 border-brand-500 shadow-sm'
                  : 'hover:bg-slate-800/60 hover:text-slate-100 border-l-2 border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
              <span className="text-sm">{item.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-500" />
          </NavLink>
        ))}
      </nav>

      {/* Log out trigger */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-xl transition-all duration-200 active:scale-[0.98] text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside 
        className={`lg:hidden fixed top-0 bottom-0 left-0 w-64 z-40 transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
