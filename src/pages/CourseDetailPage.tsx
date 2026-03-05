import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft, Download, CheckCircle, Clock, Shield, BookOpen, Award, Users, Briefcase, Star, Wrench, FolderOpen, GraduationCap, Quote, Zap, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import courseCyber from "@/assets/course-cyber-security.jpg";
import courseVapt from "@/assets/course-vapt.jpg";
import courseCcna from "@/assets/course-ccna.jpg";
import courseThreat from "@/assets/course-threat-intel.jpg";
import courseGraphic from "@/assets/course-graphic-design.jpg";
import coursePython from "@/assets/course-python.jpg";
import courseRhcsa from "@/assets/course-rhcsa.jpg";
import toolsBg from "@/assets/tools-bg.jpg";
import projectsBg from "@/assets/projects-bg.jpg";

const courseImages: Record<string, string> = {
  "cyber-security": courseCyber,
  vapt: courseVapt,
  "ccna-network-security": courseCcna,
  "threat-intelligence": courseThreat,
  "graphic-designing": courseGraphic,
  python: coursePython,
  rhcsa: courseRhcsa,
};

const courseTools: Record<string, string[]> = {
  "cyber-security": ["Kali Linux", "Wireshark", "Metasploit", "Nmap", "Burp Suite", "John The Ripper", "Sqlmap", "Snort", "Nessus"],
  vapt: ["Burp Suite", "OWASP ZAP", "Nmap", "Metasploit", "Nikto", "Sqlmap", "Wireshark", "Nessus"],
  "ccna-network-security": ["Cisco Packet Tracer", "GNS3", "Wireshark", "PuTTY", "SolarWinds", "Nmap"],
  "threat-intelligence": ["MISP", "Maltego", "Shodan", "VirusTotal", "TheHive", "Splunk", "Wireshark"],
  python: ["Python 3", "VS Code", "Jupyter Notebook", "PyCharm", "Git", "Docker"],
  "graphic-designing": ["Adobe Photoshop", "Illustrator", "Figma", "Canva", "InDesign", "After Effects"],
  rhcsa: ["Red Hat Enterprise Linux", "VirtualBox", "VMware", "Ansible", "Bash", "Systemd"],
};

const toolEmojis: Record<string, string> = {
  "Kali Linux": "🐧", "Wireshark": "🦈", "Metasploit": "💉", "Nmap": "🗺️", "Burp Suite": "🔥",
  "John The Ripper": "🔓", "Sqlmap": "💾", "Snort": "🐷", "Nessus": "🛡️", "OWASP ZAP": "⚡",
  "Nikto": "🕷️", "Cisco Packet Tracer": "📡", "GNS3": "🌐", "PuTTY": "🖥️", "SolarWinds": "☀️",
  "MISP": "🎯", "Maltego": "🕸️", "Shodan": "👁️", "VirusTotal": "🦠", "TheHive": "🐝",
  "Splunk": "📊", "Python 3": "🐍", "VS Code": "💻", "Jupyter Notebook": "📓", "PyCharm": "🔧",
  "Git": "🌳", "Docker": "🐳", "Adobe Photoshop": "🎨", "Illustrator": "✏️", "Figma": "🖌️",
  "Canva": "🎭", "InDesign": "📐", "After Effects": "🎬", "Red Hat Enterprise Linux": "🎩",
  "VirtualBox": "📦", "VMware": "☁️", "Ansible": "⚙️", "Bash": "🐚", "Systemd": "🔄",
};

const benefitsData = [
  { title: "Recognized Certification", icon: Award, color: "from-amber-500/20 to-amber-500/5", points: ["Gain credentials that boost your career prospects", "Earn industry-recognized certifications", "Showcase verified skills to employers"] },
  { title: "Practical Training", icon: Wrench, color: "from-blue-500/20 to-blue-500/5", points: ["Learn through hands-on lab environments", "Work on real-world scenarios", "Master industry standard tools"] },
  { title: "Career Growth", icon: GraduationCap, color: "from-green-500/20 to-green-500/5", points: ["100% placement assistance", "Resume building workshops", "Mock interviews and career guidance"] },
  { title: "Expert Mentorship", icon: Target, color: "from-purple-500/20 to-purple-500/5", points: ["Learn from certified professionals", "One-on-one doubt clearing sessions", "Industry networking opportunities"] },
  { title: "Flexible Learning", icon: Zap, color: "from-cyan-500/20 to-cyan-500/5", points: ["Online & offline modes available", "Weekend batches for working professionals", "1 year+ LMS access"] },
  { title: "Industry Ready", icon: TrendingUp, color: "from-rose-500/20 to-rose-500/5", points: ["Real-world project portfolio", "Soft skills & personality development", "Interview preparation sessions"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [inquiryForm, setInquiryForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("slug", slug).single();
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["course-projects", course?.id],
    queryFn: async () => {
      const { data } = await supabase.from("course_projects").select("*").eq("course_id", course!.id).order("sort_order");
      return data || [];
    },
    enabled: !!course?.id,
  });

  const { data: stories } = useQuery({
    queryKey: ["student-stories", course?.id],
    queryFn: async () => {
      const { data } = await supabase.from("student_stories").select("*").eq("course_id", course!.id).order("sort_order");
      return data || [];
    },
    enabled: !!course?.id,
  });

  const { data: trainers } = useQuery({
    queryKey: ["expert-trainers"],
    queryFn: async () => {
      const { data } = await supabase.from("expert_trainers").select("*").order("sort_order");
      return data || [];
    },
  });

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("course_inquiries").insert([{ ...inquiryForm, course_id: course?.id }]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inquiry Submitted!", description: "We'll get back to you soon." });
      setInquiryForm({ full_name: "", email: "", phone: "", message: "" });
    }
  };

  if (isLoading) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div></PublicLayout>;
  if (!course) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Course not found</p></div></PublicLayout>;

  const rawModules = course.modules;
  const modules: string[] = Array.isArray(rawModules) ? rawModules.map(String) : [];
  const tools = courseTools[course.slug] || ["Kali Linux", "Wireshark", "Metasploit", "Nmap", "Burp Suite"];

  const courseHighlights = [
    { icon: Briefcase, value: "100%", label: "Job Assistance" },
    { icon: BookOpen, value: `${modules.length}+`, label: "Modules" },
    { icon: Wrench, value: `${tools.length}+`, label: "Tools" },
    { icon: Users, value: "15", label: "PDP Sessions" },
    { icon: FolderOpen, value: "5+", label: "Projects" },
    { icon: Clock, value: "1yr+", label: "LMS Access" },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={courseImages[course.slug] || courseCyber} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/70" />
        </div>
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
            animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{ left: `${10 + i * 9}%`, top: `${15 + (i % 4) * 22}%` }}
              animate={{ y: [-20, 20, -20], opacity: [0.1, 0.6, 0.1], scale: [0.5, 1.5, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link to="/courses" className="inline-flex items-center gap-1 text-primary mb-4 hover:underline text-sm">
                  <ArrowLeft className="h-4 w-4" /> Back to Courses
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 }}
                className="inline-block mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/10"
              >
                <span className="text-primary text-xs font-semibold">🔥 Most Popular Program</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
                {course.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {course.description?.substring(0, 200)}...
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-6 mb-6">
                {course.duration && (
                  <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                    <Clock className="h-5 w-5 text-primary" />
                    <div><p className="text-xs opacity-70">Duration</p><p className="font-bold">{course.duration}</p></div>
                  </div>
                )}
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div><p className="text-xs opacity-70">Mode</p><p className="font-bold">Online/Offline</p></div>
                </div>
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                  <Shield className="h-5 w-5 text-primary" />
                  <div><p className="text-xs opacity-70">Level</p><p className="font-bold">Beginner to Advanced</p></div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="flex gap-3">
                <Link to={`/apply/${course.slug}`}><Button size="lg" className="gap-2"><Zap className="h-4 w-4" /> Enroll Now</Button></Link>
                {course.brochure_url && (
                  <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 gap-2">
                      <Download className="h-4 w-4" /> Get Brochure
                    </Button>
                  </a>
                )}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.85, rotateY: 10 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 relative">
                <img src={courseImages[course.slug] || courseCyber} alt={course.title} className="w-full h-72 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border shadow-xl p-8">
            <h2 className="text-center font-heading font-bold text-2xl text-foreground mb-8">
              Course <span className="text-primary">Highlights</span>
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
              {courseHighlights.map((h) => (
                <motion.div key={h.label} variants={itemVariants} whileHover={{ scale: 1.08, y: -5 }}
                  className="text-center cursor-default">
                  <motion.div
                    className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h.icon className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div className="text-2xl font-heading font-bold text-foreground">{h.value}</div>
                  <div className="text-xs text-muted-foreground">{h.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Course Curriculum */}
      {modules.length > 0 && (
        <Section>
          <SectionTitle subtitle="Curriculum" title="Course Curriculum" description="Comprehensive modules designed by industry experts" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {modules.map((mod, i) => (
              <motion.div key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.03, x: 8 }}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-default"
              >
                <motion.div
                  className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </motion.div>
                <span className="text-sm text-foreground">{mod}</span>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      )}

      {/* Benefits */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 5 }} />
          <motion.div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1.3, 1, 1.3] }} transition={{ repeat: Infinity, duration: 7 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Why Join" title="Benefits of this Program" description="What makes HACKADEMIC's training stand out from the rest" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {benefitsData.map((benefit) => (
              <motion.div key={benefit.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card rounded-2xl border border-border p-7 hover:shadow-xl hover:border-primary/30 transition-all group"
              >
                <motion.div
                  className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-5`}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <benefit.icon className="h-7 w-7 text-primary" />
                </motion.div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-4 group-hover:text-primary transition-colors">{benefit.title}</h3>
                <ul className="space-y-2.5">
                  {benefit.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Industry Standard Tools */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={toolsBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Master" title="Industry Standard Tools" description="Get hands-on experience with the tools used by security professionals worldwide" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
          >
            {tools.map((tool) => (
              <motion.div key={tool}
                variants={itemVariants}
                whileHover={{ scale: 1.12, y: -8, rotate: 2 }}
                className="bg-card rounded-xl border border-border px-6 py-4 flex items-center gap-3 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all cursor-default"
              >
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: Math.random() * 2 }}
                >
                  {toolEmojis[tool] || "🔧"}
                </motion.span>
                <span className="font-medium text-foreground text-sm">{tool}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Real World Projects */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={projectsBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Hands-On" title="Real World Projects" description="Build practical skills through industry-relevant projects" />
          {(projects && projects.length > 0) ? (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
                  {project.image_url && (
                    <div className="overflow-hidden">
                      <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {["Phishing Simulation Setup", "Network Vulnerability Assessment", "Firewall Configuration Lab", "Incident Response Drill", "Web App Penetration Test", "Secure Architecture Design"].map((title) => (
                <motion.div key={title} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all group cursor-default">
                  <motion.div
                    className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-sm text-muted-foreground">Hands-on project with real-world security scenarios and deliverables</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* Student Stories */}
      <Section>
        <SectionTitle subtitle="Testimonials" title="Our Student Stories" description="Hear from students who transformed their careers with HACKADEMIC" />
        {(stories && stories.length > 0) ? (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stories.map((story) => (
              <motion.div key={story.id} variants={itemVariants} whileHover={{ y: -8 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all relative group">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4 group-hover:text-primary/40 transition-colors" />
                <div className="flex items-center gap-3 mb-4">
                  {story.image_url ? (
                    <img src={story.image_url} alt={story.student_name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{story.student_name}</h4>
                    <p className="text-xs text-muted-foreground">{story.designation} {story.company && `at ${story.company}`}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{story.testimonial}"</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Rahul S.", role: "Security Analyst", quote: "HACKADEMIC's hands-on training helped me land my dream cybersecurity role." },
              { name: "Priya M.", role: "SOC Analyst", quote: "The practical approach and industry tools experience made all the difference." },
              { name: "Amit K.", role: "Penetration Tester", quote: "Best cybersecurity training with real-world projects and excellent mentorship." },
            ].map((s) => (
              <motion.div key={s.name} variants={itemVariants} whileHover={{ y: -8 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all relative group cursor-default">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4 group-hover:text-primary/40 transition-colors" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{s.name}</h4>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{s.quote}"</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>

      {/* Expert Trainers */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Faculty" title="Our Expert Trainers" description="Learn from certified professionals with years of industry experience" />
          {(trainers && trainers.length > 0) ? (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {trainers.map((trainer) => (
                <motion.div key={trainer.id} variants={itemVariants} whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
                  {trainer.image_url ? (
                    <div className="overflow-hidden">
                      <img src={trainer.image_url} alt={trainer.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <GraduationCap className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  <div className="p-5 text-center">
                    <h3 className="font-heading font-semibold text-foreground">{trainer.name}</h3>
                    <p className="text-sm text-primary">{trainer.designation}</p>
                    {trainer.experience_years && (
                      <p className="text-xs text-muted-foreground mt-1">{trainer.experience_years}+ years experience</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: "Industry Expert", title: "Cyber Security Trainer", exp: "10+" },
                { name: "Certified Professional", title: "Network Security Specialist", exp: "8+" },
                { name: "Security Researcher", title: "VAPT Expert", exp: "12+" },
              ].map((t) => (
                <motion.div key={t.name} variants={itemVariants} whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-xl hover:border-primary/30 transition-all cursor-default">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-foreground">{t.name}</h3>
                  <p className="text-sm text-primary">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.exp} years experience</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* Inquire Now */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
          <motion.div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1.2, 1, 1.2] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle subtitle="Get Started" title="Inquire Now" description="Take the first step towards your cybersecurity career" center={false} />
              <div className="space-y-3 mt-4">
                {["Expert Career Guidance", "Free Demo Classes", "Flexible Timings", "100% Placement Support"].map((item, i) => (
                  <motion.div key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    </motion.div>
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30, rotateY: 5 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleInquiry} className="bg-card rounded-2xl border border-border p-8 space-y-4 shadow-xl">
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">Request Information</h3>
                <Input placeholder="Full Name *" value={inquiryForm.full_name} onChange={(e) => setInquiryForm({ ...inquiryForm, full_name: e.target.value })} required />
                <Input placeholder="Email *" type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
                <Input placeholder="Phone *" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} required />
                <Textarea placeholder="Message (optional)" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} rows={3} />
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit Inquiry"}</Button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Start Your Cybersecurity Journey?
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Link to={`/apply/${course.slug}`}>
              <Button size="lg" variant="secondary" className="gap-2">Apply Now <ArrowLeft className="h-4 w-4 rotate-180" /></Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
