
-- Course inquiries table
CREATE TABLE public.course_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit inquiries" ON public.course_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access inquiries" ON public.course_inquiries FOR ALL USING (true) WITH CHECK (true);

-- Student stories table
CREATE TABLE public.student_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  designation TEXT,
  company TEXT,
  testimonial TEXT,
  image_url TEXT,
  video_url TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.student_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active stories" ON public.student_stories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access stories" ON public.student_stories FOR ALL USING (true) WITH CHECK (true);

-- Course projects table
CREATE TABLE public.course_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active projects" ON public.course_projects FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access projects" ON public.course_projects FOR ALL USING (true) WITH CHECK (true);

-- Expert trainers table
CREATE TABLE public.expert_trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  experience_years INTEGER,
  specialization TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.expert_trainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active trainers" ON public.expert_trainers FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access trainers" ON public.expert_trainers FOR ALL USING (true) WITH CHECK (true);
