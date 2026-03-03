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
import { ArrowLeft, Download, CheckCircle, Clock, Shield, BookOpen, Award, Users, Briefcase, Star, Wrench, FolderOpen, GraduationCap, Quote } from "lucide-react";
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
  { title: "Recognized Certification", icon: Award, points: ["Gain credentials that boost your career prospects", "Earn industry-recognized certifications", "Showcase verified skills to employers"] },
  { title: "Practical Training", icon: Wrench, points: ["Learn through hands-on lab environments", "Work on real-world scenarios", "Master industry standard tools"] },
  { title: "Career Growth", icon: GraduationCap, points: ["100% placement assistance", "Resume building workshops", "Mock interviews and career guidance"] },
];

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

  if (isLoading) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div></PublicLayout>;
  if (!course) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Course not found</p></div></PublicLayout>;

  const modules = (course.modules as string[]) || [];
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
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
              style={{ left: `${15 + i * 15}%`, top: `${25 + (i % 3) * 25}%` }}
              animate={{ y: [-15, 15, -15], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 + i * 0.4 }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Link to="/courses" className="inline-flex items-center gap-1 text-primary mb-4 hover:underline text-sm">
                <ArrowLeft className="h-4 w-4" /> Back to Courses
              </Link>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
                {course.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {course.description?.substring(0, 200)}...
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
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
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex gap-3">
                <Link to={`/apply/${course.slug}`}><Button size="lg">Enroll Now</Button></Link>
                {course.brochure_url && (
                  <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 gap-2">
                      <Download className="h-4 w-4" /> Get Brochure
                    </Button>
                  </a>
                )}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
                <img src={courseImages[course.slug] || courseCyber} alt={course.title} className="w-full h-72 object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border shadow-xl p-8">
            <h2 className="text-center font-heading font-bold text-2xl text-foreground mb-8">
              Course <span className="text-primary">Highlights</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {courseHighlights.map((h, i) => (
                <motion.div key={h.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <h.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-2xl font-heading font-bold text-foreground">{h.value}</div>
                  <div className="text-xs text-muted-foreground">{h.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Curriculum */}
      {modules.length > 0 && (
        <Section>
          <SectionTitle subtitle="Curriculum" title="Course Curriculum" description="Comprehensive modules designed by industry experts" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {modules.map((mod, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-sm text-foreground">{mod}</span>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Benefits */}
      <Section className="bg-muted/50">
        <SectionTitle subtitle="Why Join" title="Benefits of this Program" description="What makes HACKADEMIC's training stand out from the rest" />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefitsData.map((benefit, i) => (
            <motion.div key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-xl hover:border-primary/30 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-4">{benefit.title}</h3>
              <ul className="space-y-2">
                {benefit.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Industry Standard Tools */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={toolsBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Master" title="Industry Standard Tools" description="Get hands-on experience with the tools used by security professionals worldwide" />
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {tools.map((tool, i) => (
              <motion.div key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="bg-card rounded-xl border border-border px-6 py-4 flex items-center gap-3 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-default"
              >
                <span className="text-2xl">{toolEmojis[tool] || "🔧"}</span>
                <span className="font-medium text-foreground text-sm">{tool}</span>
              </motion.div>
            ))}
          </div>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {projects.map((project, i) => (
                <motion.div key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all"
                >
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {["Phishing Simulation Setup", "Network Vulnerability Assessment", "Firewall Configuration Lab", "Incident Response Drill", "Web App Penetration Test", "Secure Architecture Design"].map((title, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">Hands-on project with real-world security scenarios and deliverables</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Student Stories */}
      <Section>
        <SectionTitle subtitle="Testimonials" title="Our Student Stories" description="Hear from students who transformed their careers with HACKADEMIC" />
        {(stories && stories.length > 0) ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stories.map((story, i) => (
              <motion.div key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all relative"
              >
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex items-center gap-3 mb-4">
                  {story.image_url ? (
                    <img src={story.image_url} alt={story.student_name} className="w-12 h-12 rounded-full object-cover" />
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
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Rahul S.", role: "Security Analyst", quote: "HACKADEMIC's hands-on training helped me land my dream cybersecurity role." },
              { name: "Priya M.", role: "SOC Analyst", quote: "The practical approach and industry tools experience made all the difference." },
              { name: "Amit K.", role: "Penetration Tester", quote: "Best cybersecurity training with real-world projects and excellent mentorship." },
            ].map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all relative"
              >
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
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
          </div>
        )}
      </Section>

      {/* Expert Trainers */}
      <Section className="bg-muted/50">
        <SectionTitle subtitle="Faculty" title="Our Expert Trainers" description="Learn from certified professionals with years of industry experience" />
        {(trainers && trainers.length > 0) ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {trainers.map((trainer, i) => (
              <motion.div key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all group"
              >
                {trainer.image_url ? (
                  <img src={trainer.image_url} alt={trainer.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
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
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Industry Expert", title: "Cyber Security Trainer", exp: "10+" },
              { name: "Certified Professional", title: "Network Security Specialist", exp: "8+" },
              { name: "Security Researcher", title: "VAPT Expert", exp: "12+" },
            ].map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{t.name}</h3>
                <p className="text-sm text-primary">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.exp} years experience</p>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* Inquire Now */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
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
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleInquiry} className="bg-card rounded-2xl border border-border p-8 space-y-4 shadow-lg">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">Request Information</h3>
              <Input placeholder="Full Name *" value={inquiryForm.full_name} onChange={(e) => setInquiryForm({ ...inquiryForm, full_name: e.target.value })} required />
              <Input placeholder="Email *" type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
              <Input placeholder="Phone *" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} required />
              <Textarea placeholder="Message (optional)" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} rows={3} />
              <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit Inquiry"}</Button>
            </form>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Start Your Cybersecurity Journey?
          </motion.h2>
          <Link to={`/apply/${course.slug}`}>
            <Button size="lg" variant="secondary" className="gap-2">Apply Now <ArrowLeft className="h-4 w-4 rotate-180" /></Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
