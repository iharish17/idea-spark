import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Idea, IdeaStatus, useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Rocket,
  User,
  Tag,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { IdeaDetailDialog } from './IdeaDetailDialog';

interface IdeaCardProps {
  idea: Idea;
  index: number;
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

export function IdeaCard({ idea, index }: IdeaCardProps) {
  const { user } = useAuth();
  const { updateIdeaStatus, deleteIdea } = useIdeas();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const isOwner = user?.id === idea.user_id;
  const status = statusConfig[idea.status];

  const handleStatusChange = async (newStatus: IdeaStatus) => {
    await updateIdeaStatus(idea.id, newStatus);
  };

  const handleDelete = async () => {
    await deleteIdea(idea.id);
    setDeleteDialogOpen(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on dropdown or buttons
    if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) return;
    setDetailDialogOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        layout
        whileHover={{ y: -4 }}
      >
        <Card 
          className="group relative overflow-hidden border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-hover cursor-pointer"
          onClick={handleCardClick}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <h3 className="font-display text-lg font-semibold leading-tight text-card-foreground">
                  {idea.title}
                </h3>
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
              </div>
              
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleStatusChange('open')}>
                      <Clock className="mr-2 h-4 w-4" />
                      Mark as Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                      <Rocket className="mr-2 h-4 w-4" />
                      Mark In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="leading-relaxed line-clamp-3">
                {idea.description}
              </div>
              {idea.description.length > 120 && (
                <button 
                  onClick={() => setDetailDialogOpen(true)} 
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Read more
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">{idea.author_name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <IdeaDetailDialog 
        idea={idea} 
        open={detailDialogOpen} 
        onOpenChange={setDetailDialogOpen} 
      />
    </>
  );
}
