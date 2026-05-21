import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center p-8">
      <motion.div
        className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
      </motion.div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-bold">Loading</h3>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: ['0%', '-50%', '0%'],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
