import { useEffect, useState } from 'react';
import { Plus, Clock, Search, ChevronRight, Mic2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { episodeService } from '../services/episodeService';
import { authService } from '../services/authService';
import { Episode } from '../types';
import { THEME_CLASSES, COLORS } from '../constants';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';

export const HomeScreen = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEpisodes();
  }, [user, navigate]);

  const loadEpisodes = async () => {
    if (user) {
      const data = await episodeService.getAll(user.uid);
      setEpisodes(data);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome, {user?.displayName?.split(' ')[0]}</h2>
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1 text-[10px] text-[#A0A0A0] mt-1 uppercase tracking-widest hover:text-[#FF6B00] transition-colors"
          >
            Manage Podcast Profile <ChevronRight size={10} />
          </button>
        </div>
        <div 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] flex items-center justify-center cursor-pointer hover:border-[#FF6B00] transition-colors"
        >
          <Briefcase size={20} className="text-[#FF6B00]" />
        </div>
      </header>

      {/* Stats / Quick Actions */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className={THEME_CLASSES.card + " flex flex-col gap-2"}>
          <span className="text-4xl font-bold text-[#FF6B00]">{episodes.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0A0]">Total Drafts</span>
        </div>
        <div className={THEME_CLASSES.card + " flex flex-col gap-2"}>
          <span className="text-4xl font-bold text-white">4</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0A0]">AI Insights</span>
        </div>
      </section>

      {/* Main Action */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/wizard')}
        className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8533] p-1 rounded-2xl mb-8 group"
      >
        <div className="bg-[#0A0A0A] rounded-[calc(1rem-1px)] p-6 flex items-center justify-between group-active:bg-transparent transition-colors">
          <div className="text-left">
            <h3 className="font-bold text-lg">Plan New Episode</h3>
            <p className="text-xs text-[#A0A0A0] mt-1">Start high-speed AI planning</p>
          </div>
          <div className="bg-[#FF6B00] p-3 rounded-xl shadow-lg ring-4 ring-[#FF6B00]/10">
            <Plus className="text-white" />
          </div>
        </div>
      </motion.button>

      {/* Recent Episodes */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold uppercase text-xs tracking-[0.2em] text-[#A0A0A0]">Recent Projects</h3>
          <button className="text-[10px] text-[#FF6B00] font-bold">VIEW ALL</button>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-[#1A1A1A] animate-pulse rounded-2xl" />
            ))
          ) : episodes.length === 0 ? (
            <div className="p-8 text-center bg-[#1A1A1A] rounded-2xl border border-dashed border-[#2A2A2A]">
              <p className="text-[#A0A0A0] text-sm">No episodes yet. Start your first plan!</p>
            </div>
          ) : (
            episodes.map((episode) => (
              <motion.div 
                key={episode.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/episode/${episode.id}`)}
                className={THEME_CLASSES.card + " flex items-center gap-4 cursor-pointer hover:border-[#FF6B00]/50 transition-colors"}
              >
                <div className="w-12 h-12 bg-[#2A2A2A] rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#FF6B00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate">{episode.title || 'Untitled Episode'}</h4>
                  <p className="text-[10px] text-[#A0A0A0] mt-1 uppercase tracking-wider">{episode.niche} • {formatDate(episode.updatedAt)}</p>
                </div>
                <ChevronRight size={18} className="text-[#3A3A3A]" />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
