import { useIdeas } from '@/hooks/useIdeas';
import { IdeaCard } from './IdeaCard';
import { EmptyState } from './EmptyState';
import { Loader2 } from 'lucide-react';

export function IdeasGrid() {
  const { ideas, loading } = useIdeas();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (ideas.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea, index) => (
        <IdeaCard key={idea.id} idea={idea} index={index} />
      ))}
    </div>
  );
}
