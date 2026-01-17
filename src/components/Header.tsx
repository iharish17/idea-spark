import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Lightbulb, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Lightbulb className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight">
            Idea<span className="text-gradient-primary">Hub</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 transition-all duration-200 hover:bg-muted/80">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {displayName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onAuthClick} 
                className="bg-gradient-primary text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-glow"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
