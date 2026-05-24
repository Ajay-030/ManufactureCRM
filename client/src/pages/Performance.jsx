import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle2, 
  Users2, 
  Loader2,
  Medal,
  Activity,
  Flame
} from 'lucide-react';

const Performance = () => {
  const [performanceList, setPerformanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPerformance = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/performance');
      if (response.success) {
        setPerformanceList(response.data);
      }
    } catch (err) {
      console.error('Performance fetch error:', err);
      setError(err || 'Failed to sync employee performance index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow p-8 flex items-center justify-center flex-col gap-3 min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Assembling BDA Leaderboard stats...</span>
      </div>
    );
  }

  // Get Top Performer
  const topPerformer = performanceList.length > 0 ? performanceList[0] : null;

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Top Performer Banner Spot */}
      {topPerformer && topPerformer.closedDeals > 0 && (
        <section className="bg-gradient-to-r from-brand-900/60 via-slate-900 to-slate-900/40 p-6 rounded-2xl border border-brand-500/25 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Decorative flame/spark particles */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4.5 relative z-10">
            <div className="bg-brand-500/10 p-3 rounded-2xl border border-brand-500/30 text-brand-400 animate-pulse">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20 text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                <Flame className="w-3 h-3 fill-brand-400" /> Star BDA Performer
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{topPerformer.employeeName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Leads closed: <strong>{topPerformer.closedDeals} Deals</strong> with a conversion rate of <strong className="text-brand-400">{topPerformer.performancePercentage}%</strong></p>
            </div>
          </div>

          <div className="flex gap-4 relative z-10 shrink-0">
            <div className="text-center bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Closed Value Rank</span>
              <span className="text-lg font-bold text-brand-400 block mt-0.5">#1 in Sales</span>
            </div>
            <div className="text-center bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Efficiency Index</span>
              <span className="text-lg font-bold text-emerald-400 block mt-0.5">A+ Rating</span>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/50 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Leaderboard Table and Cards Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-slate-200 text-base">BDA Efficiency Ratings</h3>
          </div>

          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-5">Rank</th>
                    <th className="py-4 px-5">Associate Name</th>
                    <th className="py-4 px-5 text-center">Assigned Leads</th>
                    <th className="py-4 px-5 text-center">Deals Closed</th>
                    <th className="py-4 px-5 text-right">Conversion Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {performanceList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-500 font-semibold">
                        No performance snapshots recorded yet. Move leads to 'Closed' to trigger rankings!
                      </td>
                    </tr>
                  ) : (
                    performanceList.map((perf, index) => (
                      <tr 
                        key={perf._id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-4 px-5 font-extrabold text-slate-400">
                          {index === 0 ? (
                            <Medal className="w-4 h-4 text-amber-400" />
                          ) : index === 1 ? (
                            <Medal className="w-4 h-4 text-slate-300" />
                          ) : index === 2 ? (
                            <Medal className="w-4 h-4 text-amber-700" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </td>
                        <td className="py-4 px-5 font-bold text-slate-200">
                          {perf.employeeName}
                        </td>
                        <td className="py-4 px-5 text-center text-slate-300 font-semibold">
                          {perf.assignedLeads}
                        </td>
                        <td className="py-4 px-5 text-center text-brand-400 font-bold">
                          {perf.closedDeals}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-3.5">
                            {/* Visual Progress Bar mock */}
                            <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                              <div 
                                className="bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full"
                                style={{ width: `${perf.performancePercentage}%` }}
                              />
                            </div>
                            <span className="font-extrabold text-slate-100">{perf.performancePercentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytics card metrics */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-slate-200 text-base">Conversion Targets</h3>
          </div>

          <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Enterprise Deal Volume Target</span>
                <span className="text-brand-400 font-bold">75% Quota</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full w-3/4" />
              </div>
              <p className="text-[10px] text-slate-500">Reflects aggregated BDA conversion targets across steel castings & alloy deals.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Average Team Conversion Rate</span>
                <span className="text-emerald-400 font-bold">60%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-3/5" />
              </div>
              <p className="text-[10px] text-slate-500">Target company onboarding average score. Kept in sync with active lead ratios.</p>
            </div>

            {/* Quick coaching notice badge */}
            <div className="p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
              <h4 className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
                💡 BDA Action Tip
              </h4>
              <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1.5">
                Transitioning leads to "Proposal Sent" or "Negotiation" automatically increases BDA exposure index. Try updating lead statuses as follow-ups complete.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Performance;
