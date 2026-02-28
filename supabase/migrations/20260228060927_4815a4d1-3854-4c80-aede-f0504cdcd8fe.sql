
-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  modules JSONB DEFAULT '[]'::jsonb,
  duration TEXT,
  brochure_url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  bio TEXT,
  quote TEXT,
  image_url TEXT,
  is_director BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certificates table for verification
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT false,
  author TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (key-value for mission, vision, about us, etc.)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Course applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies for public-facing data
CREATE POLICY "Public can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public can verify certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public can view published blogs" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can submit applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users = admin)
CREATE POLICY "Admin full access courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access team" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin view applications" ON public.applications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin view contacts" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for uploads (brochures, team images)
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies
CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Authenticated can update uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated can delete uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads');

-- Seed default courses
INSERT INTO public.courses (title, slug, short_description, description, is_active, sort_order) VALUES
('Cyber Security', 'cyber-security', 'Master the art of defending digital assets against modern cyber threats.', 'Comprehensive cyber security training covering network security, ethical hacking, incident response, and more.', true, 1),
('VAPT', 'vapt', 'Vulnerability Assessment and Penetration Testing professional certification.', 'Learn to identify vulnerabilities and perform penetration testing on networks, web applications, and systems.', true, 2),
('CCNA / Network Security', 'ccna-network-security', 'Cisco Certified Network Associate with security specialization.', 'Complete CCNA training with focus on network security, routing, switching, and firewall configuration.', true, 3),
('Threat Intelligence', 'threat-intelligence', 'Advanced threat detection, analysis, and intelligence gathering.', 'Learn to gather, analyze, and act on cyber threat intelligence to protect organizations.', true, 4),
('Graphic Designing', 'graphic-designing', 'Creative design skills for the digital world.', 'Master tools like Photoshop, Illustrator, and Figma to create stunning visual designs.', true, 5),
('Python Programming', 'python', 'Versatile programming language for automation and security.', 'Learn Python from basics to advanced, including security scripting and automation.', true, 6),
('RHCSA', 'rhcsa', 'Red Hat Certified System Administrator preparation.', 'Complete RHCSA certification training covering Linux administration and security.', true, 7);

-- Seed default services
INSERT INTO public.services (title, slug, short_description, is_active, sort_order) VALUES
('Security Audit', 'security-audit', 'Comprehensive security assessments to identify vulnerabilities in your infrastructure.', true, 1),
('Web Development', 'web-development', 'Modern, secure web applications built with cutting-edge technologies.', true, 2),
('Graphic Designing', 'graphic-designing-service', 'Professional visual design services for brands and businesses.', true, 3),
('Government Training', 'government-training', 'Specialized cybersecurity training programs for government organizations.', true, 4),
('Corporate Training', 'corporate-training', 'Tailored cybersecurity awareness and skill-building for enterprises.', true, 5);

-- Seed default site settings
INSERT INTO public.site_settings (key, value) VALUES
('mission', 'To empower individuals and organizations with cutting-edge cybersecurity knowledge and skills, creating a safer digital world.'),
('vision', 'To become the leading cybersecurity education and services provider, recognized for excellence in training, innovation, and real-world impact.'),
('about_us', 'Hackademic is a premier cybersecurity education and services company dedicated to building the next generation of cybersecurity professionals. We combine industry expertise with hands-on training to deliver world-class education.'),
('why_hackademic', 'Industry-expert instructors, hands-on labs, real-world projects, placement assistance, and globally recognized certifications set us apart from the rest.');
