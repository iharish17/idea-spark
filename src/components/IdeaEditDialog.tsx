import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Idea, useIdeas } from '@/hooks/useIdeas';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2, Pencil } from 'lucide-react';

const editIdeaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  domain: z.string().max(50, 'Domain name too long').optional(),
});

interface IdeaEditDialogProps {
  idea: Idea;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IdeaEditDialog({ idea, open, onOpenChange }: IdeaEditDialogProps) {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [domain, setDomain] = useState(idea.domain || '');
  const [loading, setLoading] = useState(false);
  const { updateIdea } = useIdeas();

  useEffect(() => {
    if (open) {
      setTitle(idea.title);
      setDescription(idea.description);
      setDomain(idea.domain || '');
    }
  }, [open, idea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = editIdeaSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      domain: domain.trim() || undefined,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { error } = await updateIdea(idea.id, {
      title: title.trim(),
      description: description.trim(),
      domain: domain.trim() || undefined,
    });

    if (!error) {
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Idea
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Idea Title *</Label>
            <Input
              id="edit-title"
              placeholder="Give your idea a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
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
            <Label htmlFor="edit-domain">
              Domain <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="edit-domain"
              placeholder="e.g., Healthcare, Education, Fintech"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
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
                Saving...
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
