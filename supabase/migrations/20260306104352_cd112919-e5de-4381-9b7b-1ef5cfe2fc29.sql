
CREATE TABLE public.service_quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  designation TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_description TEXT,
  estimated_budget TEXT,
  timeline TEXT,
  additional_requirements TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit quotations" ON public.service_quotations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access quotations" ON public.service_quotations
  FOR ALL USING (true) WITH CHECK (true);
