import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { IdeasGrid } from '@/components/IdeasGrid';
import { AuthDialog } from '@/components/AuthDialog';
import { IdeaFormDialog } from '@/components/IdeaFormDialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const Index = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleAddIdea = () => {
    if (user) {
      setIdeaDialogOpen(true);
    } else {
      toast.info('Please sign in to submit an idea');
      setAuthDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setAuthDialogOpen(true)} />
      
      <main>
        <HeroSection 
          onAddIdea={handleAddIdea} 
          onAuthRequired={() => setAuthDialogOpen(true)} 
        />
        
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="container mx-auto px-4 py-12"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Community Ideas
            </h2>
            <p className="mt-1 text-muted-foreground">
              Explore ideas from our community and track their journey
            </p>
          </motion.div>
          
          <IdeasGrid />
        </motion.section>
      </main>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <IdeaFormDialog open={ideaDialogOpen} onOpenChange={setIdeaDialogOpen} />
    </div>
  );
};

export default Index;
