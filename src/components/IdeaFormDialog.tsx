import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIdeas } from '@/hooks/useIdeas';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

const ideaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  domain: z.string().max(50, 'Domain name too long').optional(),
  author_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
});

interface IdeaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IdeaFormDialog({ open, onOpenChange }: IdeaFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createIdea } = useIdeas();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = ideaSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      domain: domain.trim() || undefined,
      author_name: authorName.trim(),
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { error } = await createIdea({
      title: title.trim(),
      description: description.trim(),
      domain: domain.trim() || undefined,
      author_name: authorName.trim(),
    });

    if (!error) {
      onOpenChange(false);
      resetForm();
    }

    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDomain('');
    setAuthorName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Share Your Idea
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Idea Title *</Label>
            <Input
              id="title"
              placeholder="Give your idea a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              maxLength={2000}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">
              Domain <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="domain"
              placeholder="e.g., Healthcare, Education, Fintech"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorName">Your Name *</Label>
            <Input
              id="authorName"
              placeholder="How should we credit you?"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              maxLength={50}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Submit Idea
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
