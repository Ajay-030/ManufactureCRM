import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Gauge } from 'lucide-react';
import api from '../services/api';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [unreadCount, setUnreadCount] = useState(0);

  // Dynamically load unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/notifications');
        if (response.success && Array.isArray(response.data)) {
          const unreads = response.data.filter(n => !n.read).length;
          setUnreadCount(unreads);
        }
      } catch (err) {
        console.warn('Silent count check skipped:', err);
      }
    };

    fetchUnreadCount();
    
    // Check every 25 seconds for alerts
    const interval = setInterval(fetchUnreadCount, 25000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/leads': return 'Lead Management';
      case '/clients': return 'Active Clients';
      case '/performance': return 'BDA Leaderboard';
      case '/notifications': return 'System Notifications';
      default: return 'ManufactureCRM';
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Toggle Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-2 rounded-lg transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dashboard Title */}
        <div>
          <h2 className="font-bold text-lg text-slate-100 leading-tight tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            Manufacturing Operations Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800/80 rounded-xl transition-all duration-200"
          aria-label="View Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Status indicator indicator */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/40 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-slate-400">API Connected</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
