import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-primary shadow-glow"
      >
        <Lightbulb className="h-12 w-12 text-primary-foreground" />
      </motion.div>
      <h3 className="mb-2 font-display text-2xl font-semibold text-foreground">
        No ideas yet
      </h3>
      <p className="max-w-sm text-muted-foreground">
        Be the first to share a brilliant idea! Click the button above to get started.
      </p>
    </motion.div>
  );
}
