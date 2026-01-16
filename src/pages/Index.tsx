import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { IdeasGrid } from '@/components/IdeasGrid';
import { AuthDialog } from '@/components/AuthDialog';
import { IdeaFormDialog } from '@/components/IdeaFormDialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

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
        
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Community Ideas
            </h2>
            <p className="mt-1 text-muted-foreground">
              Explore ideas from our community and track their journey
            </p>
          </div>
          
          <IdeasGrid />
        </section>
      </main>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <IdeaFormDialog open={ideaDialogOpen} onOpenChange={setIdeaDialogOpen} />
    </div>
  );
};

export default Index;
