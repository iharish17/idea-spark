import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Idea, IdeaStatus } from '@/hooks/useIdeas';
import { Clock, CheckCircle2, Rocket, User, Tag, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IdeaDetailDialogProps {
  idea: Idea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<IdeaStatus, { label: string; icon: React.ReactNode; className: string }> = {
  open: {
    label: 'Open',
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-status-open/10 text-status-open border-status-open/30',
  },
  in_progress: {
    label: 'In Progress',
    icon: <Rocket className="h-3 w-3" />,
    className: 'bg-status-progress/10 text-status-progress border-status-progress/30',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: 'bg-status-completed/10 text-status-completed border-status-completed/30',
  },
};

export function IdeaDetailDialog({ idea, open, onOpenChange }: IdeaDetailDialogProps) {
  if (!idea) return null;

  const status = statusConfig[idea.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold leading-tight text-foreground pr-8">
            {idea.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Status and Domain badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`${status.className} border`}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
            {idea.domain && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                <Tag className="mr-1 h-3 w-3" />
                {idea.domain}
              </Badge>
            )}
          </div>

          {/* Full description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Description</h4>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {idea.description}
            </div>
          </div>

          {/* Author and date info */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-medium">{idea.author_name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
