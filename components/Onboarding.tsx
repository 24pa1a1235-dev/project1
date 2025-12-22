
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    major: '',
    interests: [],
    skills: [],
    careerGoals: '',
    educationLevel: 'Undergraduate'
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const commonInterests = ['Tech', 'Design', 'Environment', 'Finance', 'Medicine', 'Social Good', 'Law', 'Business'];

  return (
    <div className="min-h-screen bloom-gradient flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Let's get started! ✨</h2>
            <p className="text-slate-500 mb-8">First, tell us who you are so Bloom can help you thrive.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">What's your name?</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Alex"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">What are you studying?</label>
                <input 
                  type="text" 
                  value={profile.major}
                  onChange={(e) => setProfile(p => ({ ...p, major: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">What excites you? 🚀</h2>
            <p className="text-slate-500 mb-8">Select your interests to customize your feed.</p>
            <div className="grid grid-cols-2 gap-3">
              {commonInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                    profile.interests.includes(interest) 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Your Dream Goal 🌟</h2>
            <p className="text-slate-500 mb-8">Where do you see yourself in 3 years?</p>
            <textarea
              value={profile.careerGoals}
              onChange={(e) => setProfile(p => ({ ...p, careerGoals: e.target.value }))}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 h-32 focus:ring-2 focus:ring-indigo-500 transition-all resize-none mb-6"
              placeholder="e.g. I want to build sustainable tech products for local communities."
            />
            <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-4 border border-indigo-100">
               <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💡</span>
               </div>
               <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                 Bloom uses this to find programs that align with your long-term vision.
               </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-12">
          {step > 1 && (
            <button 
              onClick={handlePrev}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              Back
            </button>
          )}
          <button 
            onClick={step === 3 ? () => onComplete(profile) : handleNext}
            disabled={step === 1 && !profile.name}
            className={`flex-[2] py-4 rounded-2xl font-bold transition-all shadow-lg ${
              (step === 1 && !profile.name) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {step === 3 ? "Let's Bloom!" : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
