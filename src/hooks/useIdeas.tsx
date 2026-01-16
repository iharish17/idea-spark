import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type IdeaStatus = 'open' | 'in_progress' | 'completed';

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  domain: string | null;
  author_name: string;
  status: IdeaStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateIdeaData {
  title: string;
  description: string;
  domain?: string;
  author_name: string;
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchIdeas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Failed to load ideas');
    } else {
      setIdeas(data as Idea[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();

    const channel = supabase
      .channel('ideas-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
        },
        () => {
          fetchIdeas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createIdea = async (data: CreateIdeaData) => {
    if (!user) {
      toast.error('You must be logged in to submit an idea');
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase.from('ideas').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      domain: data.domain || null,
      author_name: data.author_name,
      status: 'open' as IdeaStatus,
    });

    if (error) {
      console.error('Error creating idea:', error);
      toast.error('Failed to submit idea');
      return { error };
    }

    toast.success('Idea submitted successfully!');
    return { error: null };
  };

  const updateIdeaStatus = async (id: string, status: IdeaStatus) => {
    const { error } = await supabase
      .from('ideas')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea status');
      return { error };
    }

    toast.success('Status updated!');
    return { error: null };
  };

  const deleteIdea = async (id: string) => {
    const { error } = await supabase.from('ideas').delete().eq('id', id);

    if (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
      return { error };
    }

    toast.success('Idea deleted');
    return { error: null };
  };

  return {
    ideas,
    loading,
    createIdea,
    updateIdeaStatus,
    deleteIdea,
    refetch: fetchIdeas,
  };
}
