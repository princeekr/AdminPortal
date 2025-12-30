
import React, { useState, useEffect, useMemo } from 'react';
import { Registration, RegistrationType, SortOrder, ColumnVisibility } from './types';
import { fetchRegistrations } from './services/api';
import StatCard from './components/StatCard';
import { 
  UsersIcon, 
  GraduateIcon, 
  BriefcaseIcon, 
  SearchIcon, 
  CopyIcon, 
  ChevronDownIcon, 
  EyeIcon
} from './components/Icons';

const App: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RegistrationType | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [columns, setColumns] = useState<ColumnVisibility>({
    phone: true,
    company: true,
    date: true
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Notifications
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchRegistrations();
      setRegistrations(data);
      setError(null);
    } catch (err) {
      setError('Connection to applicant database interrupted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`);
  };

  const stats = useMemo(() => {
    return {
      total: registrations.length,
      students: registrations.filter(r => r.registration_type === RegistrationType.STUDENT).length,
      professionals: registrations.filter(r => r.registration_type === RegistrationType.PROFESSIONAL).length,
    };
  }, [registrations]);

  const filteredData = useMemo(() => {
    let result = registrations.filter(reg => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = reg.name.toLowerCase().includes(query) || 
                          reg.email.toLowerCase().includes(query);
      const matchesType = typeFilter === 'All' || reg.registration_type === typeFilter;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [registrations, searchQuery, typeFilter, sortOrder]);

  const tableContentKey = useMemo(() => {
    return `${typeFilter}-${sortOrder}-${searchQuery.length > 0}`;
  }, [typeFilter, sortOrder, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl border text-white font-semibold flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {toast.message}
          </div>
        </div>
      )}

      {/* Summit Branded Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center gap-5">
              <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-100 ring-4 ring-emerald-50">
                <UsersIcon className="text-white w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Impact Collaborative</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Portal</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  AI for Humanity Summit 2025
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1.5 hidden md:block">
                  Building Ethical, Sustainable, and Human-Centered AI Solutions
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg border-2 border-slate-800">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Registration Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            label="Total Applicants" 
            value={stats.total} 
            icon={<UsersIcon />} 
            colorClass="bg-slate-900"
            loading={loading}
          />
          <StatCard 
            label="Student Track" 
            value={stats.students} 
            icon={<GraduateIcon />} 
            colorClass="bg-amber-500"
            loading={loading}
          />
          <StatCard 
            label="Professional Track" 
            value={stats.professionals} 
            icon={<BriefcaseIcon />} 
            colorClass="bg-emerald-600"
            loading={loading}
          />
        </div>

        {/* Exploratory Controls Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="flex flex-col xl:flex-row gap-5 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full xl:max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Find applicant by name or email address..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              {/* Type Selection */}
              <div className="flex items-center gap-1.5 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
                {(['All', RegistrationType.STUDENT, RegistrationType.PROFESSIONAL] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      typeFilter === type 
                        ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-200' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Sorting Selection */}
              <div className="relative group">
                <select 
                  className="appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 pr-12 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none cursor-pointer transition-all"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Advanced Visibility View */}
              <div className="relative">
                <button 
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className={`bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all ${showColumnMenu ? 'border-emerald-200 bg-emerald-50/30' : ''}`}
                >
                  <EyeIcon className={`w-4 h-4 transition-colors ${showColumnMenu ? 'text-emerald-600' : 'text-slate-500'}`} />
                  View Options
                </button>
                {showColumnMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowColumnMenu(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 animate-fade duration-100 origin-top-right">
                      <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Display Columns</div>
                      {[
                        { id: 'phone', label: 'Phone Contact', state: columns.phone },
                        { id: 'company', label: 'Organization', state: columns.company },
                        { id: 'date', label: 'Registration Date', state: columns.date },
                      ].map(col => (
                        <label key={col.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-emerald-50/50 rounded-xl cursor-pointer transition-colors group">
                          <input 
                            type="checkbox" 
                            checked={col.state} 
                            onChange={(e) => setColumns({...columns, [col.id]: e.target.checked})} 
                            className="w-4 h-4 rounded-lg text-emerald-600 border-2 border-slate-300 focus:ring-0 transition-all"
                          />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-900">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Data Grid (Table) */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Applicant Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  {columns.company && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Organization</th>}
                  {columns.phone && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>}
                  {columns.date && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered On</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" key={tableContentKey}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-full w-40 mb-3"></div><div className="h-3 bg-slate-100/50 rounded-full w-56"></div></td>
                      <td className="px-8 py-6"><div className="h-7 bg-slate-100 rounded-xl w-24"></div></td>
                      {columns.company && <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-full w-32"></div></td>}
                      {columns.phone && <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-full w-32"></div></td>}
                      {columns.date && <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-full w-24"></div></td>}
                    </tr>
                  ))
                ) : filteredData.length > 0 ? (
                  filteredData.map((reg) => (
                    <tr 
                      key={reg.id} 
                      className="hover:bg-slate-50/50 transition-all duration-200 group animate-row opacity-0"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">{reg.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-500">{reg.email}</span>
                            <button 
                              onClick={() => copyToClipboard(reg.email, 'Email')}
                              title="Copy email to clipboard"
                              className="p-1 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <CopyIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          reg.registration_type === RegistrationType.PROFESSIONAL 
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' 
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                        }`}>
                          {reg.registration_type}
                        </span>
                      </td>
                      {columns.company && (
                        <td className="px-8 py-6">
                          <span className="text-sm font-semibold text-slate-600">
                            {reg.registration_type === RegistrationType.PROFESSIONAL ? (reg.company || "—") : "—"}
                          </span>
                        </td>
                      )}
                      {columns.phone && (
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500 tabular-nums">
                              {reg.phone || "—"}
                            </span>
                            {reg.phone && (
                                <button 
                                  onClick={() => copyToClipboard(reg.phone!, 'Phone')}
                                  title="Copy phone to clipboard"
                                  className="p-1 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <CopyIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                          </div>
                        </td>
                      )}
                      {columns.date && (
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-slate-400 tabular-nums">
                            {new Date(reg.created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center animate-fade">
                      <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                          <SearchIcon className="w-10 h-10 text-slate-300" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-2">No applicants found</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Try adjusting your search criteria or switching registration categories.
                          </p>
                        </div>
                        <button 
                          onClick={() => { setSearchQuery(''); setTypeFilter('All'); }}
                          className="px-6 py-3 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"
                        >
                          Clear Exploration filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 font-bold">
                Records: <span className="text-slate-900 font-black">{filteredData.length}</span> / <span className="text-slate-400">{registrations.length}</span>
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Sync Enabled</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 opacity-50 cursor-not-allowed">First</div>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 opacity-50 cursor-not-allowed">Prev</div>
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-100">1</div>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 opacity-50 cursor-not-allowed">Next</div>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 opacity-50 cursor-not-allowed">Last</div>
            </div>
          </div>
        </div>
      </main>

      {/* Sync Error Overlay */}
      {error && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] shadow-2xl border-t-8 border-red-500 p-10 max-w-md w-full text-center transform transition-all animate-fade duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-red-50/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Access Restricted</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              We encountered a connection protocol error while attempting to sync with the AI for Humanity Summit applicant database.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[20px] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              Re-Sync Applicant Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
