import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  TrendingUp, 
  UserCheck2,
  Calendar,
  Grid,
  List,
  Loader2,
  X,
  Phone,
  Mail,
  ChevronDown,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leads = () => {
  const { user } = useAuth();
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Layout views: 'kanban' or 'list'
  const [viewMode, setViewMode] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog modals states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState('New Lead');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const workflowStages = ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed'];

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/leads');
      if (response.success) {
        setLeads(response.data);
      }
    } catch (err) {
      console.error('Leads fetching error:', err);
      setError(err || 'Failed to load business leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenAdd = () => {
    setCompanyName('');
    setClientName('');
    setPhone('');
    setEmail('');
    setLeadStatus('New Lead');
    setValue('');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setCurrentLead(lead);
    setCompanyName(lead.companyName);
    setClientName(lead.clientName);
    setPhone(lead.phone);
    setEmail(lead.email);
    setLeadStatus(lead.leadStatus);
    setValue(lead.value || '');
    setNotes(lead.notes || '');
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { companyName, clientName, phone, email, notes, value: Number(value) || 0 };
      const response = await api.post('/leads', payload);
      if (response.success) {
        setIsAddOpen(false);
        fetchLeads();
      }
    } catch (err) {
      setError(err || 'Failed to register new lead.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { companyName, clientName, phone, email, leadStatus, notes, value: Number(value) || 0 };
      const response = await api.put(`/leads/${currentLead._id}`, payload);
      if (response.success) {
        setIsEditOpen(false);
        fetchLeads();
      }
    } catch (err) {
      setError(err || 'Failed to update lead metrics.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this lead?')) return;
    try {
      const response = await api.delete(`/leads/${id}`);
      if (response.success) {
        fetchLeads();
      }
    } catch (err) {
      setError(err || 'Failed to remove lead.');
    }
  };

  const updateStageInline = async (lead, newStage) => {
    try {
      const response = await api.put(`/leads/${lead._id}`, {
        ...lead,
        leadStatus: newStage
      });
      if (response.success) {
        fetchLeads();
      }
    } catch (err) {
      setError(err || 'Failed to transition workflow stage.');
    }
  };

  // Local client search matching
  const filteredLeads = leads.filter(l => 
    l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && leads.length === 0) {
    return (
      <div className="flex-grow p-8 flex items-center justify-center flex-col gap-3 min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading BDA workspace boards...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Workspace Menu Bar */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search company, clients, or emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        <div className="flex gap-3 items-center justify-between w-full sm:w-auto">
          {/* Layout switches */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              title="Kanban Board view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              title="Interactive List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-primary flex items-center gap-2 py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" /> Create Lead
          </button>
        </div>
      </section>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/50 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main leads content */}
      {viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {workflowStages.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.leadStatus === stage);
            return (
              <div 
                key={stage}
                className="glass-panel border border-slate-800 rounded-2xl p-4 space-y-4"
              >
                {/* Column header */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{stage}</span>
                  <span className="text-[10px] font-extrabold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Stage cards */}
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 text-[10px]">
                      Empty stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div 
                        key={lead._id}
                        className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-brand-500/20 p-4 rounded-xl space-y-3 shadow-md transition-all group relative"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-slate-200 group-hover:text-brand-400 transition-colors">{lead.companyName}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">{lead.clientName}</p>
                        </div>

                        <div className="space-y-1.5 text-[10px] text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 shrink-0" /> <span>{lead.phone}</span>
                          </div>
                        </div>

                        {/* Metric estimated value indicator */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                          <span className="text-brand-400 font-bold text-[11px]">₹{lead.value?.toLocaleString() || 0}</span>
                          <span className="text-[9px] text-slate-500">
                            {lead.assignedEmployeeName}
                          </span>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-slate-800/20">
                          <button 
                            onClick={() => handleOpenEdit(lead)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                            title="Edit lead"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(lead._id)}
                            className="p-1 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded"
                            title="Remove lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Next Stage flow trigger */}
                          {stage !== 'Closed' && (
                            <button
                              onClick={() => {
                                const currentIdx = workflowStages.indexOf(stage);
                                const nextStage = workflowStages[currentIdx + 1];
                                updateStageInline(lead, nextStage);
                              }}
                              className="p-1 hover:bg-brand-500/10 text-slate-500 hover:text-brand-400 rounded"
                              title="Advance workflow status"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Company</th>
                  <th className="py-4 px-5">Client Name</th>
                  <th className="py-4 px-5">Workflow Stage</th>
                  <th className="py-4 px-5">Deal Value</th>
                  <th className="py-4 px-5">Assigned BDA</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500 font-medium">
                      No leads match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead._id}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-200">{lead.companyName}</div>
                        <div className="text-[10px] text-slate-500 flex gap-2 mt-0.5">
                          <span>{lead.email}</span> • <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-300 font-medium">
                        {lead.clientName}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                          lead.leadStatus === 'Closed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : lead.leadStatus === 'Negotiation' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : lead.leadStatus === 'Proposal Sent' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-brand-400 font-bold">
                        ₹{lead.value?.toLocaleString() || 0}
                      </td>
                      <td className="py-4 px-5 text-slate-400 font-medium">
                        {lead.assignedEmployeeName}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="btn-secondary px-2.5 py-1.5 text-[10px] flex items-center gap-1 font-semibold"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Modify
                          </button>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="btn-secondary hover:bg-red-950/20 hover:text-red-400 hover:border-red-900 px-2.5 py-1.5 text-[10px] flex items-center gap-1 font-semibold text-slate-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Popup Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Plus className="text-brand-500 w-5 h-5" /> Register Business Lead
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Collect details of incoming manufacturing inquiry</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Tata Steel"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Client Contact Person</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Ramesh Patil"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    placeholder="+91 99999-99999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Estimated Deal Value (INR)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 500000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Inquiry Requirements Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="form-input resize-none"
                  placeholder="Provide specifications, quantities, and timelines required..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Popup Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Edit3 className="text-brand-500 w-5 h-5" /> Modify Business Lead
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Revise details and pipeline progress</p>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Client Contact Person</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Estimated Deal Value (INR)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Lead Pipeline Status</label>
                  <select
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    className="form-input font-medium bg-slate-900 text-slate-200"
                  >
                    {workflowStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Inquiry Requirements Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="form-input resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Leads;
