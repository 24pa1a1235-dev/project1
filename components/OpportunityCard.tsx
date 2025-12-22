
import React from 'react';
import { Opportunity, OpportunityType } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onTrack: (id: string) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, isSaved, onToggleSave, onTrack }) => {
  const typeColors: Record<string, string> = {
    [OpportunityType.INTERNSHIP]: 'bg-blue-100 text-blue-700',
    [OpportunityType.SCHOLARSHIP]: 'bg-amber-100 text-amber-700',
    [OpportunityType.COMPETITION]: 'bg-purple-100 text-purple-700',
    [OpportunityType.LEARNING_PROGRAM]: 'bg-green-100 text-green-700',
    [OpportunityType.RESEARCH]: 'bg-indigo-100 text-indigo-700',
  };

  const daysLeft = Math.ceil((new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isUrgent = daysLeft > 0 && daysLeft < 7;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[opportunity.type] || 'bg-slate-100'}`}>
          {opportunity.type}
        </span>
        <button 
          onClick={() => onToggleSave(opportunity.id)}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
        {opportunity.title}
      </h3>
      <p className="text-sm font-medium text-slate-500 mb-3">{opportunity.organization}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {opportunity.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-5">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${isUrgent ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
        </div>
        {opportunity.diversityFocus && (
          <span className="bg-indigo-50 text-indigo-600 p-1 rounded-lg" title="Inclusivity Highlight">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <a 
          href={opportunity.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          View Details
        </a>
        <button 
          onClick={() => onTrack(opportunity.id)}
          className="px-4 bg-slate-100 text-slate-600 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          Track
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
