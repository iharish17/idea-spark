-- Create enum for idea status
CREATE TYPE public.idea_status AS ENUM ('open', 'in_progress', 'completed');

-- Create ideas table
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT,
  author_name TEXT NOT NULL,
  status idea_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Everyone can view all ideas
CREATE POLICY "Anyone can view ideas" 
ON public.ideas 
FOR SELECT 
USING (true);

-- Authenticated users can create ideas
CREATE POLICY "Authenticated users can create ideas" 
ON public.ideas 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own ideas
CREATE POLICY "Users can update their own ideas" 
ON public.ideas 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can only delete their own ideas
CREATE POLICY "Users can delete their own ideas" 
ON public.ideas 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ideas_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for ideas
ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;