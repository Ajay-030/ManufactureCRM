import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  CalendarClock, 
  UserCheck2,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

const DashboardCards = ({ leads = [], clients = [], notifications = [] }) => {
  // Computed metrics
  const totalLeads = leads.length;
  const closedDeals = leads.filter(l => l.leadStatus === 'Closed').length;
  
  // Pending followups can be represented by leads in 'Contacted' or 'Proposal Sent' states,
  // or active unread follow-up notifications. Let's count leads in intermediary sales stages.
  const pendingFollowups = leads.filter(l => ['Contacted', 'Proposal Sent', 'Negotiation'].includes(l.leadStatus)).length;
  const activeClients = clients.length;

  const cardsData = [
    {
      title: 'Total Leads',
      value: totalLeads,
      description: 'Incoming sales inquiries',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400',
      icon: FileText,
      trend: '+12.5% vs last month',
      trendUp: true
    },
    {
      title: 'Deals Closed',
      value: closedDeals,
      description: 'Fully signed contracts',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400',
      icon: CheckCircle2,
      trend: '+8.3% conversion rate',
      trendUp: true
    },
    {
      title: 'Pending Followups',
      value: pendingFollowups,
      description: 'Active client pitches',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400',
      icon: CalendarClock,
      trend: 'Requires attention',
      trendUp: false
    },
    {
      title: 'Active Clients',
      value: activeClients,
      description: 'Onboarded accounts',
      color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20 text-purple-400',
      icon: UserCheck2,
      trend: '100% retention speed',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardsData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`glass-panel rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200 border bg-gradient-to-br ${card.color.split(' ')[0]} ${card.color.split(' ')[1]} ${card.color.split(' ')[2]}`}
          >
            {/* Background Glow */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-slate-900 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-300 pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl bg-slate-900/60 border border-slate-800 ${card.color.split(' ')[3]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs">
              <span className="text-slate-500">{card.description}</span>
              <span className={`font-semibold flex items-center gap-1 ${card.trendUp ? 'text-emerald-400' : 'text-amber-400'}`}>
                {card.trendUp && <ArrowUpRight className="w-3.5 h-3.5" />}
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
