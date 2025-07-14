
-- The waitlist table already exists, but let's make sure we have the updated_at trigger
CREATE OR REPLACE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
