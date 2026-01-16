import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onAddIdea: () => void;
  onAuthRequired: () => void;
}

export function HeroSection({ onAddIdea, onAuthRequired }: HeroSectionProps) {
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      onAddIdea();
    } else {
      onAuthRequired();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 sm:py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            Share your innovation with the world
          </motion.div>

          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Where Great Ideas
            <span className="block text-gradient-primary">Come to Life</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Submit your innovative ideas, track their progress, and watch them
            evolve from concept to reality.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={handleClick}
              className="bg-gradient-primary px-8 text-lg text-primary-foreground shadow-glow transition-all hover:opacity-90 hover:shadow-hover"
            >
              <Plus className="mr-2 h-5 w-5" />
              Submit Your Idea
            </Button>
            {!user && (
              <p className="mt-3 text-sm text-muted-foreground">
                Sign in required to submit ideas
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
