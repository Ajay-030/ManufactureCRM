import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardCards from '../components/DashboardCards';
import ChartSection from '../components/ChartSection';
import api from '../services/api';
import { 
  Activity, 
  ArrowRight, 
  TrendingUp, 
  UserCheck2, 
  CalendarClock, 
  PlusCircle,
  FileCheck2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, clientsRes, notificationsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/clients'),
        api.get('/notifications'),
      ]);

      if (leadsRes.success) setLeads(leadsRes.data);
      if (clientsRes.success) setClients(clientsRes.data);
      if (notificationsRes.success) setNotifications(notificationsRes.data);
    } catch (err) {
      console.error('Dashboard aggregation failed:', err);
      setError(err || 'Failed to sync workspace metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center flex-col gap-3 min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Assembling your workspace dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Welcome Header bar */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl" />
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            Greetings, {user?.fullName || 'Associate'}!
          </h1>
          <p className="text-slate-400 text-xs mt-1">Here is your sales performance tracking summary for today.</p>
        </div>
        <div className="flex gap-2 self-stretch sm:self-auto">
          <button 
            onClick={fetchDashboardData}
            className="btn-secondary px-3 py-2 flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload
          </button>
          <button 
            onClick={() => navigate('/leads')}
            className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Lead
          </button>
        </div>
      </section>

      {/* Error alert banner */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/50 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <DashboardCards leads={leads} clients={clients} notifications={notifications} />

      {/* Graph and Recent activities Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG graph Column */}
        <div className="lg:col-span-2">
          <ChartSection />
        </div>

        {/* Recent Activity Column */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-4 text-base">
              <Activity className="text-brand-400 w-5 h-5" /> Recent Activity Feed
            </h3>

            {/* List of recent activities */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No recent activities recorded.
                </div>
              ) : (
                notifications.slice(0, 4).map((activity) => (
                  <div 
                    key={activity._id}
                    className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex gap-2.5 items-start">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        activity.type === 'Client Reply Received' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : activity.type === 'Proposal Reminder' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {activity.type === 'Client Reply Received' ? (
                          <UserCheck2 className="w-3.5 h-3.5" />
                        ) : activity.type === 'Proposal Reminder' ? (
                          <FileCheck2 className="w-3.5 h-3.5" />
                        ) : (
                          <CalendarClock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-300 leading-normal">
                          {activity.message}
                        </p>
                        <span className="text-[9px] text-slate-500 font-medium block mt-1">
                          {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/notifications')}
            className="w-full text-center text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center justify-center gap-1.5 border-t border-slate-800/80 pt-4 mt-6 hover:underline underline-offset-4"
          >
            Open Notifications Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
