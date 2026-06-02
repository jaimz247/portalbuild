import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message, isVisible }: { message: string, isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-slate-950 border border-orange-500/30 text-white px-6 py-4 flex items-center gap-3 shadow-[0_10px_40px_rgba(249,115,22,0.1)]"
        >
          <CheckCircle className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-medium tracking-wide">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
