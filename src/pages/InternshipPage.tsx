import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Briefcase, Code, Shield, Globe, Award, CheckCircle, ArrowRight, Clock, Users, Star, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const internshipTracks = [
  { icon: Shield, title: "Cybersecurity Intern", duration: "3-6 Months", desc: "Work on live vulnerability assessments, SOC monitoring, and incident response projects.", skills: ["VAPT", "SIEM", "Incident Response", "Threat Analysis"] },
  { icon: Code, title: "Python Development Intern", duration: "3-6 Months", desc: "Build automation tools, APIs, and data analysis pipelines using Python.", skills: ["Python", "Flask/FastAPI", "Data Analysis", "Automation"] },
  { icon: Globe, title: "Web Development Intern", duration: "3-6 Months", desc: "Design and develop responsive web applications with modern frameworks.", skills: ["React", "TypeScript", "UI/UX", "REST APIs"] },
  { icon: Briefcase, title: "Digital Marketing Intern", duration: "2-4 Months", desc: "Execute digital campaigns, SEO strategies, and social media management.", skills: ["SEO", "Social Media", "Content", "Analytics"] },
];

const benefits = [
  { icon: Award, title: "Internship Certificate", desc: "Get an industry-recognized certificate upon successful completion" },
  { icon: Briefcase, title: "Real Project Experience", desc: "Work on live client projects, not just simulations" },
  { icon: Users, title: "Expert Mentorship", desc: "1-on-1 guidance from industry professionals throughout" },
  { icon: Star, title: "Letter of Recommendation", desc: "Top performers receive recommendation letters from our directors" },
  { icon: Target, title: "Pre-Placement Offer", desc: "Outstanding interns get direct job offers at HACKADEMIC" },
  { icon: Zap, title: "Skill Development", desc: "Weekly workshops on soft skills, resume building & interview prep" },
];

const processSteps = [
  { step: "01", title: "Apply Online", desc: "Fill the application form with your details" },
  { step: "02", title: "Screening", desc: "Our team reviews your profile and skills" },
  { step: "03", title: "Interview", desc: "Brief technical + HR interview round" },
  { step: "04", title: "Onboarding", desc: "Start your internship journey with us!" },
];

export default function InternshipPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert([{ ...form, status: "internship-inquiry" }]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application Submitted!", description: "We'll contact you about internship opportunities soon." });
      setForm({ full_name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-primary/20" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }} animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} />
          {[...Array(15)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/30" style={{ left: `${5 + i * 6}%`, top: `${10 + (i % 5) * 18}%` }} animate={{ y: [-20, 20, -20], opacity: [0.1, 0.6, 0.1] }} transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }} />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
            <span className="text-primary text-sm font-semibold">🚀 Launch Your Career</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Internship at <span className="text-primary">HACKADEMIC</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Gain real-world experience, work on live projects, and kickstart your career with India's leading cybersecurity training institute.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2" onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">View Courses</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Internship Tracks */}
      <Section>
        <SectionTitle subtitle="Opportunities" title="Internship Tracks" description="Choose from our diverse internship programs across multiple domains" />
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {internshipTracks.map((track, i) => (
            <motion.div key={track.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="bg-card rounded-2xl border border-border p-7 hover:shadow-xl hover:border-primary/30 transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <motion.div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <track.icon className="h-7 w-7 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">{track.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Clock className="h-3 w-3" /> {track.duration}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{track.desc}</p>
              <div className="flex flex-wrap gap-2">
                {track.skills.map((skill) => (
                  <span key={skill} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Perks" title="Why Intern With Us?" description="HACKADEMIC internships are designed to give you a competitive edge" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, i) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <benefit.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Selection Process */}
      <Section>
        <SectionTitle subtitle="How It Works" title="Selection Process" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {processSteps.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center relative">
              <motion.div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20" whileHover={{ scale: 1.1 }}>
                <span className="text-xl font-heading font-bold text-primary">{step.step}</span>
              </motion.div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
              {i < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Apply Form */}
      <Section id="apply-section" className="bg-muted/50">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <SectionTitle subtitle="Join Us" title="Apply for Internship" description="Fill in your details and we'll get back to you within 48 hours" center={false} />
            <div className="space-y-3 mt-4">
              {["No prior experience required", "Both online & offline modes", "Stipend for top performers", "Guaranteed internship certificate"].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 space-y-4 shadow-lg">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">Internship Application</h3>
              <Input placeholder="Full Name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Textarea placeholder="Tell us about yourself, your skills, and which track interests you..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} />
              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                <Briefcase className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </motion.div>
        </div>
      </Section>
    </PublicLayout>
  );
}
