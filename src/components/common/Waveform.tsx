import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

export const WaveformIcon = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0 bg-[#FF6B00] rounded-full blur-xl"
    />
    <Mic className="relative z-10 text-white w-6 h-6" />
  </div>
);

export const LoadingWaveform = () => (
  <div className="flex items-center gap-1 h-8">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={{
          height: ["20%", "100%", "20%"]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut"
        }}
        className="w-1 bg-[#FF6B00] rounded-full"
      />
    ))}
  </div>
);
