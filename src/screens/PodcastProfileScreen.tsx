import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Sparkles } from 'lucide-react';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { THEME_CLASSES } from '../constants';
import { motion } from 'motion/react';
import { PodcastProfile } from '../types';

export const PodcastProfileScreen = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState<PodcastProfile | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    description: '',
    audience: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (user) {
      const data = await profileService.getByUserId(user.uid);
      if (data) {
        setProfile(data);
        setFormData({
          name: data.name,
          niche: data.niche,
          description: data.description,
          audience: data.audience,
        });
      }
      setInitialLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (profile) {
        await profileService.update(profile.id, formData);
      } else {
        await profileService.create({
          userId: user.uid,
          ...formData,
        });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
          <ChevronLeft />
        </button>
        <div>
          <h2 className="text-xl font-bold">Podcast Profile</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">Your Workspace DNA</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 bg-[#1A1A1A] rounded-3xl border-2 border-dashed border-[#2A2A2A] flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-[#FF6B00] transition-colors">
            <Camera size={24} className="text-[#3A3A3A] group-hover:text-[#FF6B00]" />
            <span className="text-[8px] uppercase tracking-widest text-[#A0A0A0]">Cover Art</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className={THEME_CLASSES.label}>Podcast Name</span>
          <input 
            required
            className={THEME_CLASSES.input}
            placeholder="e.g., Tech Talk Weekly"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <span className={THEME_CLASSES.label}>Default Niche</span>
          <input 
            required
            className={THEME_CLASSES.input}
            placeholder="e.g., Artificial Intelligence"
            value={formData.niche}
            onChange={e => setFormData({ ...formData, niche: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <span className={THEME_CLASSES.label}>Description</span>
          <textarea 
            required
            rows={3}
            className={THEME_CLASSES.input}
            placeholder="What is your podcast about?"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <span className={THEME_CLASSES.label}>Target Audience</span>
          <input 
            required
            className={THEME_CLASSES.input}
            placeholder="e.g., Tech enthusiasts, developers"
            value={formData.audience}
            onChange={e => setFormData({ ...formData, audience: e.target.value })}
          />
        </div>

        <div className="p-4 bg-[#FF6B00]/10 rounded-2xl border border-[#FF6B00]/20 flex gap-3">
          <Sparkles size={20} className="text-[#FF6B00] shrink-0" />
          <p className="text-[10px] text-[#A0A0A0] leading-relaxed">
            This profile data will be used by PodCraft AI to stabilize and personalize all your future episode outlines.
          </p>
        </div>

        <button 
          disabled={loading}
          className={THEME_CLASSES.buttonPrimary + " mt-4"}
        >
          {loading ? 'Saving Workspace...' : (profile ? 'Update Workspace' : 'Create Workspace')}
        </button>
      </form>
    </div>
  );
};
