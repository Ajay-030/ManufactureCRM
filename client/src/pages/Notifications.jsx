import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Bell, 
  Check, 
  Trash2, 
  CalendarClock, 
  FileCheck2, 
  UserCheck2, 
  Loader2,
  Inbox,
  AlertCircle
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters: 'all', 'unread'
  const [filterMode, setFilterMode] = useState('all');
  const [updating, setUpdating] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/notifications');
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('Notifications fetch error:', err);
      setError(err || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      if (response.success) {
        // Update local state
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Mark read error:', err);
      setError(err || 'Failed to update alert status.');
    }
  };

  const markAllAsRead = async () => {
    setUpdating(true);
    try {
      const response = await api.put('/notifications/read-all');
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Mark all read error:', err);
      setError(err || 'Failed to clear alerts.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredAlerts = filterMode === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  if (loading && notifications.length === 0) {
    return (
      <div className="flex-grow p-8 flex items-center justify-center flex-col gap-3 min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading BDA Inbox...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Inbox Controls Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
        
        {/* Toggle filters */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              filterMode === 'all' 
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              filterMode === 'unread' 
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Unread Alerts ({notifications.filter(n => !n.read).length})
          </button>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={updating || notifications.filter(n => !n.read).length === 0}
          className="btn-secondary flex items-center gap-2 py-2.5 text-xs font-bold w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4 text-emerald-400" /> Mark all as read
        </button>
      </section>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/50 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main notifications table card list */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6">
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-semibold flex flex-col items-center gap-3">
              <Inbox className="w-10 h-10 text-slate-700" />
              <span>Inbox is completely clean! No alerts found.</span>
            </div>
          ) : (
            filteredAlerts.map((n) => (
              <div 
                key={n._id}
                className={`p-4 rounded-xl border transition-all flex justify-between items-center gap-4 ${
                  n.read 
                    ? 'bg-slate-900/25 border-slate-800/40 opacity-75' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-brand-500/20 shadow-md'
                }`}
              >
                <div className="flex gap-4 items-start">
                  {/* Glowing icon badge matching alert type */}
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${
                    n.type === 'Client Reply Received' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : n.type === 'Proposal Reminder' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : n.type === 'Followup Pending'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700/60'
                  }`}>
                    {n.type === 'Client Reply Received' ? (
                      <UserCheck2 className="w-4 h-4" />
                    ) : n.type === 'Proposal Reminder' ? (
                      <FileCheck2 className="w-4 h-4" />
                    ) : n.type === 'Followup Pending' ? (
                      <CalendarClock className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        n.type === 'Client Reply Received' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : n.type === 'Proposal Reminder' 
                          ? 'bg-blue-500/10 text-blue-400'
                          : n.type === 'Followup Pending'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {n.type}
                      </span>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-ping" />
                      )}
                    </div>
                    <p className="text-slate-200 text-xs font-semibold leading-relaxed mt-2">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1.5">
                      {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Mark as read button */}
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="p-2 bg-slate-950/60 border border-slate-800 hover:border-brand-500/30 text-slate-400 hover:text-brand-400 rounded-lg transition-all shrink-0 hover:scale-105 active:scale-[0.97]"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
