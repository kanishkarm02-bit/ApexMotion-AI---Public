import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Activity, Hexagon, Camera, Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User, profile?: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Profile Picture State
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile State
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('Male');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  // Verification & Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaStep, setCaptchaStep] = useState(0); // 0 to 3
  const [captchaGrid, setCaptchaGrid] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');

  // Clear state on mode switch
  useEffect(() => {
    setPassword('');
    setEmailError('');
    setIsRobotVerified(false); 
    setCaptchaOpen(false);
    setCaptchaStep(0);
  }, [isLogin]);

  // Generate random grid when captcha opens or step changes
  useEffect(() => {
    if (captchaOpen && !isRobotVerified) {
        generateCaptchaGrid();
    }
  }, [captchaOpen, captchaStep]);

  const generateCaptchaGrid = () => {
      const distractors = ['🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'];
      // Pick 3 random distractors
      const selected = [];
      const tempDistractors = [...distractors];
      for(let i=0; i<3; i++) {
          const idx = Math.floor(Math.random() * tempDistractors.length);
          selected.push(tempDistractors[idx]);
          tempDistractors.splice(idx, 1);
      }
      // Add the dog
      selected.push('🐶');
      // Shuffle
      for (let i = selected.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [selected[i], selected[j]] = [selected[j], selected[i]];
      }
      setCaptchaGrid(selected);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setEmail(val);
      if (val && !isValidEmail(val)) {
          setEmailError("Please enter a valid email address.");
      } else {
          setEmailError("");
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  setAvatar(ev.target.result as string);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleCaptchaSelection = (emoji: string) => {
      if (emoji === '🐶') {
          if (captchaStep < 2) {
              // Move to next step
              setCaptchaStep(prev => prev + 1);
          } else {
              // Success
              setIsRobotVerified(true);
              setCaptchaOpen(false);
          }
      } else {
          // Failed
          alert("Incorrect. Verification failed. Please try again.");
          setCaptchaStep(0);
          setCaptchaOpen(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setEmailError("Invalid email format.");
    if (!isRobotVerified) return;

    setIsLoading(true);

    setTimeout(() => {
      const userData: User = {
        name: name || email.split('@')[0],
        email: email,
        avatar: avatar || undefined
      };

      const profileData = !isLogin ? {
        age: parseInt(age) || 24,
        height: parseInt(height) || 180,
        weight: parseInt(weight) || 75,
        gender,
        skillLevel
      } : undefined;

      onLogin(userData, profileData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 mb-6 relative group">
               <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl group-hover:bg-primary/50 transition-all duration-500"></div>
               <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Hexagon size={48} className="text-primary fill-primary/10 stroke-[2px]" />
                    <Activity size={24} className="absolute text-white stroke-[3px]" />
               </div>
           </div>
           
           <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
             APEX<span className="text-primary">MOTION</span>
           </h1>
           <p className="text-gray-400 font-medium tracking-wide">Aim High. Rise Sky-High.</p>
        </div>

        <div className="bg-surface border border-gray-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
           <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1">
             <button onClick={() => setIsLogin(true)} className={`flex-1 pb-3 text-sm font-bold transition-colors ${isLogin ? 'text-white border-b-2 border-primary' : 'text-gray-500'}`}>Sign In</button>
             <button onClick={() => setIsLogin(false)} className={`flex-1 pb-3 text-sm font-bold transition-colors ${!isLogin ? 'text-white border-b-2 border-primary' : 'text-gray-500'}`}>Create Account</button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                  <div className="flex justify-center mb-6 animate-in fade-in zoom-in">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${avatar ? 'border-primary' : 'border-dashed border-gray-600 group-hover:border-white bg-black/40'}`}>
                              {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <Camera className="text-gray-500 group-hover:text-white" size={24} />}
                          </div>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                      </div>
                  </div>
              )}

              {!isLogin && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                      <div className="relative">
                          <UserIcon className="absolute left-4 top-3.5 text-gray-500" size={18} />
                          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-primary focus:outline-none transition-colors" placeholder="John Doe" />
                      </div>
                  </div>
              )}

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <input type="email" required value={email} onChange={handleEmailChange} className={`w-full bg-black/50 border rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none transition-colors ${emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary'}`} placeholder="athlete@example.com" />
                  </div>
                  {emailError && <p className="text-red-500 text-[10px] ml-1 flex items-center gap-1"><AlertCircle size={10} /> {emailError}</p>}
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                      <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
                  </div>
              </div>

              {/* REAL CAPTCHA */}
              <div className="pt-2">
                  {!isRobotVerified ? (
                      <div className="bg-black/30 border border-gray-700 rounded-xl p-4">
                          {!captchaOpen ? (
                              <button type="button" onClick={() => setCaptchaOpen(true)} className="w-full flex items-center justify-between text-gray-300 hover:text-white">
                                  <div className="flex items-center gap-2">
                                      <Fingerprint size={20} />
                                      <span className="text-sm font-bold">Verify you are human</span>
                                  </div>
                                  <div className="w-5 h-5 border-2 border-gray-500 rounded sm:rounded-md"></div>
                              </button>
                          ) : (
                              <div className="animate-in fade-in">
                                  <p className="text-center text-sm font-bold text-white mb-2">
                                      Select the <span className="text-primary uppercase tracking-wider">Dog</span> 🐶
                                  </p>
                                  <p className="text-center text-[10px] text-gray-400 mb-3 uppercase tracking-widest">
                                      Attempt {captchaStep + 1} of 3
                                  </p>
                                  <div className="grid grid-cols-4 gap-2">
                                      {captchaGrid.map((emoji, index) => (
                                          <button 
                                            key={index} 
                                            type="button" 
                                            onClick={() => handleCaptchaSelection(emoji)} 
                                            className="text-2xl p-2 bg-black/40 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-gray-600"
                                          >
                                              {emoji}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="w-full py-4 rounded-xl border-2 border-green-500 bg-green-500/10 text-green-500 flex items-center justify-center gap-2">
                          <ShieldCheck size={20} />
                          <span className="font-bold text-sm uppercase tracking-widest">Verified</span>
                      </div>
                  )}
              </div>

              <button 
                type="submit"
                disabled={isLoading || !isRobotVerified || !!emailError}
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg mt-6 flex items-center justify-center gap-2 group ${
                    isLoading || !isRobotVerified || !!emailError
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-primary hover:bg-cyan-400 text-black shadow-cyan-900/20'
                }`}
              >
                  {isLoading ? 'Processing...' : (isLogin ? 'Access Dashboard' : 'Join Team')}
                  {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;