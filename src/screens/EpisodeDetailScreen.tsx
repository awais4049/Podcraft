import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Share2, Copy, RefreshCcw, Check, Sparkles } from 'lucide-react';
import { episodeService } from '../services/episodeService';
import { Episode } from '../types';
import { THEME_CLASSES, COLORS } from '../constants';
import { formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const TABS = ['Topics', 'Questions', 'Hooks', 'Outline', 'Timeline'];

import { jsPDF } from 'jspdf';

export const EpisodeDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [activeTab, setActiveTab] = useState('Topics');
  const [copied, setCopied] = useState(false);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [selectedHook, setSelectedHook] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadEpisode();
    }
  }, [id]);

  const toggleBookmark = (topicTitle: string) => {
    setBookmarks(prev => ({
      ...prev,
      [topicTitle]: !prev[topicTitle]
    }));
  };

  const loadEpisode = async () => {
    const data = await episodeService.getById(id!);
    setEpisode(data);
  };

  const handleExportPDF = () => {
    if (!episode || !episode.data) return;
    const doc = new jsPDF();
    const { data } = episode;
    
    doc.setFontSize(22);
    doc.text(episode.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Niche: ${episode.niche} | Goal: ${episode.goal}`, 20, 30);
    
    let y = 45;
    doc.setFontSize(16);
    doc.text("Topics", 20, y);
    y += 10;
    doc.setFontSize(10);
    data.topics.forEach(t => {
      doc.text(`- ${t.title}: ${t.whyItMatters}`, 20, y, { maxWidth: 170 });
      y += 15;
    });

    y += 5;
    doc.setFontSize(16);
    doc.text("Outline", 20, y);
    y += 10;
    doc.setFontSize(10);
    data.outline.segments.forEach(s => {
      doc.text(`${s.name} (${s.duration}): ${s.description}`, 20, y, { maxWidth: 170 });
      y += 15;
    });

    doc.save(`${episode.title.replace(/\s+/g, '_')}_Plan.pdf`);
  };

  const handleCopy = () => {
    if (!episode?.data) return;
    const text = JSON.stringify(episode.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!episode) return <div className="p-8 text-center text-white">Loading...</div>;

  const { data } = episode;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Header */}
      <div className="bg-[#1A1A1A] rounded-b-[40px] p-6 pt-8 border-b border-[#2A2A2A] shadow-2xl overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF6B00] rounded-full blur-[80px]"
        />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
            <ChevronLeft />
          </button>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="w-10 h-10 flex items-center justify-center bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <button onClick={handleExportPDF} className="w-10 h-10 flex items-center justify-center bg-[#FF6B00] rounded-xl shadow-lg ring-4 ring-[#FF6B00]/10">
              <Download size={18} className="text-white" />
            </button>
          </div>
        </div>

        <div className="relative z-10 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF6B00] mb-2 inline-block">PRODUCTION PLAN</span>
          <h1 className="text-3xl font-bold leading-tight">{episode.title}</h1>
          <p className="text-xs text-[#A0A0A0] mt-2 flex items-center gap-2">
            {formatDate(episode.createdAt)} • {episode.niche} • {episode.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-[#0A0A0A] z-40 py-4 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-[#1A1A1A]">
        <div className="flex gap-2 min-w-max px-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#FF6B00] text-white shadow-lg' : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#2A2A2A]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {activeTab === 'Topics' && data?.topics.map((t, i) => (
              <div key={i} className={THEME_CLASSES.card + " relative group"}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#FF6B00] font-bold">{t.title}</h3>
                  <button 
                    onClick={() => toggleBookmark(t.title)}
                    className={`transition-colors ${bookmarks[t.title] ? 'text-[#FF6B00]' : 'text-[#3A3A3A] group-hover:text-[#A0A0A0]'}`}
                  >
                    <Sparkles size={16} fill={bookmarks[t.title] ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="text-sm text-white mb-3 font-medium">{t.whyItMatters}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {t.talkingPoints.map((tp, j) => (
                    <span key={j} className="text-[10px] px-2 py-1 bg-[#2A2A2A] rounded-md text-[#A0A0A0] border border-[#3A3A3A]">{tp}</span>
                  ))}
                </div>
                <div className="pt-3 border-t border-[#2A2A2A] text-[9px] uppercase tracking-widest text-[#A0A0A0]">
                  Suggested for: <span className="text-white">{t.suggestedSegment}</span>
                </div>
              </div>
            ))}

            {activeTab === 'Questions' && data?.questions.map((q, i) => (
              <div key={i} className={THEME_CLASSES.card + " flex gap-4 items-start"}>
                <div className="w-8 h-8 rounded-lg bg-[#2A2A2A] flex items-center justify-center shrink-0 border border-[#3A3A3A] text-[#FF6B00] font-bold text-xs">{i+1}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] uppercase tracking-widest px-2 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-md font-bold">{q.priority}</span>
                    <span className="text-[10px] text-[#A0A0A0]">{q.duration}</span>
                  </div>
                  <p className="font-medium text-sm">{q.question}</p>
                  <p className="text-[10px] mt-2 text-[#A0A0A0] uppercase tracking-widest">{q.category}</p>
                </div>
              </div>
            ))}

            {activeTab === 'Hooks' && (
              <div className="flex flex-col gap-4">
                {data?.hooks.map((h, i) => (
                  <motion.div 
                    key={i} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedHook(i)}
                    className={THEME_CLASSES.card + ` border-l-4 transition-all duration-300 ${selectedHook === i ? 'border-l-[#FF6B00] bg-[#FF6B00]/5' : 'border-l-transparent'}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="italic text-sm leading-relaxed pr-4">"{h}"</p>
                      {selectedHook === i && <Check size={16} className="text-[#FF6B00] shrink-0" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'Outline' && (
              <div className="flex flex-col gap-8 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-[#2A2A2A]">
                {data?.outline.segments.map((s, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-[#FF6B00] border-4 border-[#0A0A0A] shadow-[0_0_10px_rgba(255,107,0,0.4)]" />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{s.name}</h4>
                      <span className="text-[10px] font-mono bg-[#1A1A1A] px-2 py-1 rounded text-[#FF6B00]">{s.duration}</span>
                    </div>
                    <p className="text-sm text-[#A0A0A0] leading-relaxed mb-3">{s.description}</p>
                    {s.transition && (
                      <div className="bg-[#1A1A1A] p-3 rounded-xl border border-[#2A2A2A]">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#FF6B00] font-bold block mb-1">Transition Tip</span>
                        <p className="text-[11px] italic text-[#A0A0A0]">{s.transition}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Timeline' && (
              <div className={THEME_CLASSES.card + " divide-y divide-[#2A2A2A]"}>
                {data?.timestamps.map((t, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="font-mono text-[#FF6B00] text-sm w-12">{t.time}</span>
                    <span className="font-medium text-sm">{t.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button for regeneration */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-full flex items-center justify-center border border-[#2A2A2A] shadow-2xl active:scale-90 transition-transform">
        <RefreshCcw size={20} className="text-[#A0A0A0]" />
      </button>
    </div>
  );
};
