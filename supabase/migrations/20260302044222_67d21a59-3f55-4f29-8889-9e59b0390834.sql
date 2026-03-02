
-- Create success_gallery table for "Glimpse of our Success" section
CREATE TABLE public.success_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.success_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active success gallery" ON public.success_gallery
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access success gallery" ON public.success_gallery
  FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_success_gallery_updated_at
  BEFORE UPDATE ON public.success_gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
