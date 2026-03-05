
-- FAQ table for certificate page
CREATE TABLE public.certificate_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certificate_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access faqs" ON public.certificate_faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view active faqs" ON public.certificate_faqs FOR SELECT USING (is_active = true);

-- Sample certificates table
CREATE TABLE public.sample_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sample_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access sample certs" ON public.sample_certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view active sample certs" ON public.sample_certificates FOR SELECT USING (is_active = true);
