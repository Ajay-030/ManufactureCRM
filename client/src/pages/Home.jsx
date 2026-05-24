import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPopup from '../components/LoginPopup';
import SignupPopup from '../components/SignupPopup';
import { 
  Shield, 
  BarChart3, 
  Users, 
  Target, 
  Layers, 
  Zap, 
  LineChart, 
  Network 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // If already authenticated, redirect to dashboard immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-950 overflow-hidden">
      {/* Dynamic backdrop grid mesh and glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* Decorative colored lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-brand-500/10 p-2 rounded-xl border border-brand-500/20">
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <span className="font-extrabold text-slate-100 tracking-wide text-lg">Manufacture</span>
            <span className="font-semibold text-brand-400 text-lg">CRM</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Shield className="w-4 h-4 text-brand-500" /> SSL Encrypted
        </div>
      </header>

      {/* Hero Body Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 relative z-10">
        
        {/* Left Side: Product marketing & illustrative mock */}
        <section className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400">
              <Zap className="w-3.5 h-3.5 fill-brand-400" /> Enterprise Operations
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1] font-sans">
              Manage Leads, Clients <br className="hidden sm:inline" />
              and Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-400">Efficiently</span>
            </h1>
            <p className="text-slate-400 text-base max-w-xl font-medium leading-relaxed">
              ManufactureCRM helps manufacturing companies manage business development operations, convert raw leads to contracts, and track BDA performance dynamically.
            </p>
          </div>

          {/* Interactive CSS Dashboard Illustration */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-brand-500/30 transition-colors duration-300 hidden sm:block max-w-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl" />
            
            {/* Header bar mock */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-32 bg-slate-800 rounded-full" />
            </div>

            {/* Layout grid mock */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 flex flex-col gap-2">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Leads</span>
                <span className="text-lg font-bold text-slate-200">142</span>
                <div className="h-1 w-full bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-500" />
                </div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 flex flex-col gap-2">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Closed</span>
                <span className="text-lg font-bold text-brand-400">₹8.4M</span>
                <div className="h-1 w-full bg-brand-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-brand-400" />
                </div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 flex flex-col gap-2">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Quota</span>
                <span className="text-lg font-bold text-purple-400">92%</span>
                <div className="h-1 w-full bg-purple-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-11/12 bg-purple-500" />
                </div>
              </div>
            </div>

            {/* Activity feed mock */}
            <div className="space-y-2">
              <div className="h-9 bg-slate-900/60 rounded-lg flex items-center justify-between px-3 border border-slate-800/30">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-slate-400 font-medium">Global Castings deal closed by Rajesh</span>
                </div>
                <span className="text-[9px] text-brand-400 font-bold">+₹3.5M</span>
              </div>
              <div className="h-9 bg-slate-900/60 rounded-lg flex items-center justify-between px-3 border border-slate-800/30">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  <span className="text-[10px] text-slate-400 font-medium">New lead: Tata Auto Components</span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium">2m ago</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login card pop-in */}
        <section className="lg:col-span-5 w-full max-w-md mx-auto">
          <LoginPopup 
            onSignupClick={() => setIsSignupOpen(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        </section>
      </main>

      {/* Footer credits */}
      <footer className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-xs text-slate-600 border-t border-slate-900 relative z-10">
        <p>© 2026 ManufactureCRM. All rights reserved.</p>
        <p className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-slate-500" /> Assessment Project Platform</p>
      </footer>

      {/* Signup Modal Popup */}
      <SignupPopup 
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSignupSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home;
