
import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('bloom_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
      setIsReady(true);
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('bloom_profile', JSON.stringify(newProfile));
    setIsReady(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {!isReady ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bloom-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-black">B</span>
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">Bloom</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    localStorage.removeItem('bloom_profile');
                    window.location.reload();
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Reset Profile
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                   <img src={`https://ui-avatars.com/api/?name=${profile?.name}&background=random`} alt="Avatar" />
                </div>
              </div>
            </div>
          </nav>

          <main>
            {profile && <Dashboard profile={profile} />}
          </main>
          
          <footer className="py-12 text-center text-slate-400 text-sm">
            <p>Made with 💖 for students everywhere</p>
            <p className="mt-1">Bloom AI © 2024 • Helping you reach your highest potential</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
