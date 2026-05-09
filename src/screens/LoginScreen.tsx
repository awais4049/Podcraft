import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { WaveformIcon } from '../components/common/Waveform';
import { THEME_CLASSES } from '../constants';
import { motion } from 'motion/react';

export const LoginScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('awais@gmail.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        // Mock signup
        const mockUser = {
          uid: 'uid-' + Math.random().toString(36).substring(7),
          email,
          displayName: name,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('podcraft_session', JSON.stringify(mockUser));
        navigate('/');
      } else {
        await authService.login(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col gap-8"
      >
        <div className="flex flex-col items-center gap-4">
          <WaveformIcon />
          <h1 className="text-4xl font-bold tracking-tighter">PodCraft</h1>
          <p className="text-center text-[#A0A0A0] text-sm leading-relaxed px-4">
            {isSignup ? 'Create your podcast workspace' : 'The Agentic AI Assistant for Professional Podcast Planning'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-500 rounded-xl text-xs text-center">{error}</div>}
          
          {isSignup && (
            <div className="flex flex-col">
              <span className={THEME_CLASSES.label}>Full Name</span>
              <input 
                type="text" 
                className={THEME_CLASSES.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="flex flex-col">
            <span className={THEME_CLASSES.label}>Email Address</span>
            <input 
              type="email" 
              className={THEME_CLASSES.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
            />
          </div>

          <div className="flex flex-col">
            <span className={THEME_CLASSES.label}>Password</span>
            <input 
              type="password" 
              className={THEME_CLASSES.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            className={`${THEME_CLASSES.buttonPrimary} mt-4 disabled:opacity-50`}
          >
            {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>

          <button 
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-[#FF6B00] font-bold mt-2 hover:underline"
          >
            {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>

          <p className="text-center text-[10px] text-[#A0A0A0] mt-4 uppercase tracking-[0.2em]">
            Demo login enabled: awais@gmail.com / 123
          </p>
        </form>
      </motion.div>
    </div>
  );
};
