import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  X,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  RefreshCw,
  Building
} from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state managers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  // Form inputs
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [requirement, setRequirement] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/clients');
      if (response.success) {
        setClients(response.data);
      }
    } catch (err) {
      console.error('Clients fetch error:', err);
      setError(err || 'Failed to fetch active client records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenAdd = () => {
    setCompanyName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
    setRequirement('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (client) => {
    setCurrentClient(client);
    setCompanyName(client.companyName);
    setContactPerson(client.contactPerson);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setRequirement(client.requirement);
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { companyName, contactPerson, email, phone, address, requirement };
      const response = await api.post('/api/clients', payload);
      if (response.success) {
        setIsAddOpen(false);
        fetchClients();
      }
    } catch (err) {
      setError(err || 'Failed to onboard new client.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { companyName, contactPerson, email, phone, address, requirement };
      const response = await api.put(`/clients/${currentClient._id}`, payload);
      if (response.success) {
        setIsEditOpen(false);
        fetchClients();
      }
    } catch (err) {
      setError(err || 'Failed to update client profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this active client record?')) return;
    try {
      const response = await api.delete(`/clients/${id}`);
      if (response.success) {
        fetchClients();
      }
    } catch (err) {
      setError(err || 'Failed to delete client record.');
    }
  };

  // Local filter
  const filteredClients = clients.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && clients.length === 0) {
    return (
      <div className="flex-grow p-8 flex items-center justify-center flex-col gap-3 min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading BDA clients directory...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Search and Header controls */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search accounts by company, contact person or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 py-2.5 text-sm self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Onboard Client
        </button>
      </section>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/50 rounded-2xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Grid listing client records */}
      {filteredClients.length === 0 ? (
        <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center text-slate-500 font-semibold">
          <Users className="w-8 h-8 mx-auto text-slate-600 mb-3" />
          No active clients found in directory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <div 
              key={client._id}
              className="glass-panel glass-panel-hover border border-slate-800 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Top ambient glow */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-brand-500/10 transition-colors" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="bg-brand-500/10 text-brand-400 p-2.5 rounded-xl border border-brand-500/20">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base leading-snug">{client.companyName}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        Active Account
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors border border-slate-800"
                      title="Edit details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="p-1.5 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-800 hover:border-red-900/40"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300 font-medium py-4 border-y border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Contact: <strong>{client.contactPerson}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{client.address}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 flex gap-2 items-start bg-slate-950/20 p-3 rounded-xl border border-slate-800/40">
                <ClipboardList className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demands & Requirements</p>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed font-semibold italic">{client.requirement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Client Dialog Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Plus className="text-brand-500 w-5 h-5" /> Onboard Business Client
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Register validated corporate account credentials</p>
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
                    placeholder="e.g. Reliance Steel"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Mukesh Ambani"
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
                    placeholder="+91 90000-00000"
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
                    placeholder="contact@reliance.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                  placeholder="Factory/Office Address, City, Pincode"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contract Requirements Summary</label>
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  rows="3"
                  className="form-input resize-none"
                  placeholder="Specify alloy types, volume orders, shipping cycles required..."
                  required
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Dialog Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Edit3 className="text-brand-500 w-5 h-5" /> Modify Client Profile
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Revise client specifications and contacts</p>
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
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

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contract Requirements Summary</label>
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  rows="3"
                  className="form-input resize-none"
                  required
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Clients;
