import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Wand2, Briefcase } from 'lucide-react';
import { THEME_CLASSES } from '../constants';
import { episodeService } from '../services/episodeService';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { generatePodcastPlan } from '../lib/gemini';
import { LoadingWaveform } from '../components/common/Waveform';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
  { id: 1, title: 'Basics', sub: 'The Core Info' },
  { id: 2, title: 'Guest', sub: 'Interview Details' },
  { id: 3, title: 'Vibe', sub: 'Tone & Style' }
];

export const WizardScreen = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    title: '',
    niche: '',
    goal: 'Educational',
    guestName: '',
    guestBio: '',
    tone: 'Professional',
    length: '30-45 mins',
    format: 'Solo / Deep Dive'
  });

  useEffect(() => {
    if (user) {
      profileService.getByUserId(user.uid).then(profile => {
        if (profile) {
          setFormData(prev => ({
            ...prev,
            niche: profile.niche || prev.niche,
          }));
        }
      });
    }
  }, [user]);

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleGenerate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Generate with AI
      const aiData = await generatePodcastPlan(formData);
      
      // 2. Save to DB
      const episodeId = await episodeService.create({
        userId: user.uid,
        title: formData.title || `New Episode - ${formData.niche}`,
        niche: formData.niche,
        guestName: formData.guestName,
        guestBio: formData.guestBio,
        goal: formData.goal,
        tone: formData.tone,
        length: formData.length,
        format: formData.format,
        status: 'completed',
        data: aiData
      });

      navigate(`/episode/${episodeId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate episode plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col items-center justify-center p-8 text-center text-white">
        <LoadingWaveform />
        <h2 className="text-2xl font-bold mt-8 mb-2">Analyzing Guest & Topic</h2>
        <p className="text-[#A0A0A0] text-sm">PodCraft AI is crafting your episode strategy...</p>
        <div className="mt-12 flex flex-col gap-3 w-full max-w-xs">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF6B00]">Step-by-step reasoning</p>
          <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] text-[10px] text-left leading-relaxed text-[#A0A0A0]">
            1. Researching ${formData.niche} trends...<br/>
            2. Extracting guest expertise...<br/>
            3. Synthesizing ${formData.goal} structure...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
          <ChevronLeft />
        </button>
        <div>
          <h2 className="text-xl font-bold">New Creation</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">Step {step} of 3</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((s) => (
          <div 
            key={s.id} 
            className={`h-1 flex-1 rounded-full transition-colors ${s.id <= step ? 'bg-[#FF6B00]' : 'bg-[#2A2A2A]'}`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex flex-col gap-6"
        >
          {step === 1 && (
            <>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Episode Title (Optional)</span>
                <input 
                  className={THEME_CLASSES.input}
                  placeholder="e.g., The Future of Remote Work"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Category / Niche</span>
                <input 
                  className={THEME_CLASSES.input}
                  placeholder="e.g., Tech, Business, Health"
                  value={formData.niche}
                  onChange={e => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Primary Goal</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Educational', 'Entertainment', 'Promotional'].map(goal => (
                    <button
                      key={goal}
                      onClick={() => setFormData({ ...formData, goal })}
                      className={`text-[10px] py-3 rounded-lg border font-bold uppercase transition-all ${formData.goal === goal ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#A0A0A0]'}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Guest Name</span>
                <input 
                  className={THEME_CLASSES.input}
                  placeholder="e.g., Jane Doe"
                  value={formData.guestName}
                  onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Guest Bio or Bio Link</span>
                <textarea 
                  rows={4}
                  className={THEME_CLASSES.input}
                  placeholder="Paste bio or LinkedIn URL here..."
                  value={formData.guestBio}
                  onChange={e => setFormData({ ...formData, guestBio: e.target.value })}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Desired Tone</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Professional', 'Casual', 'Dramatic', 'Energetic'].map(tone => (
                    <button
                      key={tone}
                      onClick={() => setFormData({ ...formData, tone })}
                      className={`text-[10px] py-4 rounded-lg border font-bold uppercase transition-all ${formData.tone === tone ? 'bg-[#FF6B00]/20 border-[#FF6B00] text-[#FF6B00]' : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#A0A0A0]'}`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Expected Length</span>
                <select 
                  className={THEME_CLASSES.input}
                  value={formData.length}
                  onChange={e => setFormData({ ...formData, length: e.target.value })}
                >
                  <option>10-15 mins</option>
                  <option>30-45 mins</option>
                  <option>60+ mins</option>
                </select>
              </div>
              <div className="flex flex-col">
                <span className={THEME_CLASSES.label}>Show Format</span>
                <select 
                  className={THEME_CLASSES.input}
                  value={formData.format}
                  onChange={e => setFormData({ ...formData, format: e.target.value })}
                >
                  <option>Solo / Deep Dive</option>
                  <option>1-on-1 Interview</option>
                  <option>Panel Discussion</option>
                </select>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
        <div className="flex gap-4">
          {step > 1 && (
            <button onClick={prevStep} className={THEME_CLASSES.buttonSecondary}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} className={THEME_CLASSES.buttonPrimary + " flex-1 flex items-center justify-center gap-2"}>
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleGenerate} className={THEME_CLASSES.buttonPrimary + " flex-1 flex items-center justify-center gap-2"}>
              Generate Plan <Wand2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
