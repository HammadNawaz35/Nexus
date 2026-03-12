import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fast initial progress
    const t1 = setTimeout(() => setProgress(30), 100);
    const t2 = setTimeout(() => setProgress(60), 400);
    const t3 = setTimeout(() => setProgress(80), 800);

    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => setVisible(false), 400);
    };

    if (document.readyState === 'complete') {
      // Already loaded, animate quickly
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setVisible(false), 400);
      }, 600);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tracking-tight"
          >
            <span className="nexus-gold-text">Nexus</span>
          </motion.h1>
          <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gold"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-xs text-muted-foreground"
          >
            Loading premium experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
