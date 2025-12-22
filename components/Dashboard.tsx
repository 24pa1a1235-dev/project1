
import React, { useState, useEffect } from 'react';
import { UserProfile, Opportunity, OpportunityType, ApplicationStatus, TrackingItem } from '../types';
import { getPersonalizedOpportunities } from '../services/geminiService';
import OpportunityCard from './OpportunityCard';
import ChatAssistant from './ChatAssistant';
import { MOTIVATIONAL_QUOTES } from '../constants';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [tracking, setTracking] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'tracking'>('discover');
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      const opps = await getPersonalizedOpportunities(profile);
      setOpportunities(opps);
      setLoading(false);
    };
    fetchOpps();
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, [profile]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startTracking = (id: string) => {
    if (tracking.some(t => t.opportunityId === id)) return;
    setTracking(prev => [...prev, {
      opportunityId: id,
      status: ApplicationStatus.SAVED,
      notes: '',
      reminderSet: true
    }]);
    setActiveTab('tracking');
  };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setTracking(prev => prev.map(t => t.opportunityId === id ? { ...t, status } : t));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Hello, {profile.name}! 👋</h1>
          <p className="text-slate-600 font-medium">{quote}</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'discover' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'tracking' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            My Tracker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'discover' ? (
            <>
              {/* Filters / Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Internships', count: opportunities.filter(o => o.type === OpportunityType.INTERNSHIP).length, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Scholarships', count: opportunities.filter(o => o.type === OpportunityType.SCHOLARSHIP).length, color: 'bg-amber-50 text-amber-600' },
                  { label: 'Saved', count: savedIds.size, color: 'bg-rose-50 text-rose-600' },
                  { label: 'Applied', count: tracking.length, color: 'bg-emerald-50 text-emerald-600' },
                ].map(stat => (
                  <div key={stat.label} className={`${stat.color} p-4 rounded-2xl flex flex-col items-center justify-center border border-white/50 shadow-sm`}>
                    <span className="text-2xl font-bold">{stat.count}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Opportunity Feed */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                    Personalized for you
                  </h2>
                  <button onClick={() => window.location.reload()} className="text-indigo-600 text-sm font-bold hover:underline">
                    Refresh List
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {opportunities.map(opp => (
                      <OpportunityCard 
                        key={opp.id} 
                        opportunity={opp} 
                        isSaved={savedIds.has(opp.id)}
                        onToggleSave={toggleSave}
                        onTrack={startTracking}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Tracking View */
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                 Application Journey
              </h2>
              {tracking.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">No applications tracked yet. Start exploring!</p>
                  <button onClick={() => setActiveTab('discover')} className="mt-4 text-indigo-600 font-bold hover:underline">Back to Discovery</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tracking.map(item => {
                    const opp = opportunities.find(o => o.id === item.opportunityId);
                    if (!opp) return null;
                    return (
                      <div key={item.opportunityId} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-indigo-600">
                             {opp.organization[0]}
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-800 text-sm">{opp.title}</h4>
                             <p className="text-xs text-slate-500">{opp.organization}</p>
                           </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <select 
                            value={item.status}
                            onChange={(e) => updateStatus(opp.id, e.target.value as ApplicationStatus)}
                            className="bg-white border-none rounded-xl text-xs font-bold text-slate-600 shadow-sm focus:ring-2 focus:ring-indigo-500"
                          >
                            {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <div className="text-[10px] font-bold text-rose-500 px-2 py-1 bg-white rounded-lg border border-rose-100">
                            Deadline: {opp.deadline}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Mentor Chat */}
        <div className="lg:sticky lg:top-8 h-fit">
          <ChatAssistant profile={profile} />
          
          <div className="mt-6 bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Pro Tip
            </h4>
            <p className="text-sm text-indigo-800 leading-relaxed">
              Applying for {profile.major} roles? Focus on highlighting your skills in {profile.skills.slice(0, 2).join(', ')} in your resume! 💡
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
