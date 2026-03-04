import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Clock, Download, Search, BookOpen, Shield, Award, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import coursesHero from "@/assets/courses-hero.jpg";
import courseCyber from "@/assets/course-cyber-security.jpg";
import courseVapt from "@/assets/course-vapt.jpg";
import courseCcna from "@/assets/course-ccna.jpg";
import courseThreat from "@/assets/course-threat-intel.jpg";
import courseGraphic from "@/assets/course-graphic-design.jpg";
import coursePython from "@/assets/course-python.jpg";
import courseRhcsa from "@/assets/course-rhcsa.jpg";

const courseImages: Record<string, string> = {
  "cyber-security": courseCyber,
  vapt: courseVapt,
  "ccna-network-security": courseCcna,
  "threat-intelligence": courseThreat,
  "graphic-designing": courseGraphic,
  python: coursePython,
  rhcsa: courseRhcsa,
};

const highlights = [
  { icon: Shield, value: "100%", label: "Job Assistance" },
  { icon: BookOpen, value: "22+", label: "Modules" },
  { icon: Award, value: "5+", label: "Certifications" },
  { icon: Users, value: "500+", label: "Students Trained" },
];

export default function CoursesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [inquiryForm, setInquiryForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return data || [];
    },
  });

  const filtered = (courses || []).filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("course_inquiries").insert([inquiryForm]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inquiry Submitted!", description: "We'll get back to you soon." });
      setInquiryForm({ full_name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={coursesHero} alt="Courses" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
        </div>
        {/* Animated grid overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
            animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          />
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{ left: `${5 + i * 8}%`, top: `${15 + (i % 5) * 18}%` }}
              animate={{ y: [-25, 25, -25], opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10"
          >
            <span className="text-primary text-sm font-semibold tracking-wide">🎓 Industry-Leading Programs</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4"
            style={{ color: "white" }}
          >
            Explore Our <span className="text-primary">Courses</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto mb-8"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Industry-leading cybersecurity and technology training programs designed by experts
          </motion.p>
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/90 border-border/50"
            />
          </motion.div>
        </div>
      </section>

      {/* Highlights Stats */}
      <section className="relative -mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="bg-card rounded-xl p-5 shadow-lg border border-border text-center hover:border-primary/30 hover:shadow-primary/10 transition-all"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                >
                  <stat.icon className="h-7 w-7 text-primary mx-auto mb-2" />
                </motion.div>
                <div className="text-2xl font-heading font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <Section>
        <SectionTitle subtitle="Programs" title="Our Training Programs" description="Choose from our wide range of industry-relevant courses" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 150 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="group bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={courseImages[course.slug] || courseCyber}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                  {/* Animated shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -translate-x-full" />
                  {course.duration && (
                    <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{course.short_description}</p>
                  
                  {/* Duration info row */}
                  {course.duration && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>Duration: <strong className="text-foreground">{course.duration}</strong></span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Link to={`/courses/${course.slug}`} className="flex-1">
                      <Button size="sm" className="w-full gap-1 group/btn">
                        View Program <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                    {course.brochure_url && (
                      <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Inquire Now Section */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 8 }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle subtitle="Get in Touch" title="Inquire Now" description="Fill in your details and our counselors will reach out to you" center={false} />
            <div className="space-y-4 mt-6">
              {["Expert Career Guidance", "Free Demo Classes", "Flexible Learning Options", "Placement Assistance"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleInquiry} className="bg-card rounded-2xl border border-border p-8 space-y-4 shadow-lg">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">Request Information</h3>
              <Input placeholder="Full Name *" value={inquiryForm.full_name} onChange={(e) => setInquiryForm({ ...inquiryForm, full_name: e.target.value })} required />
              <Input placeholder="Email *" type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
              <Input placeholder="Phone *" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} required />
              <Textarea placeholder="Message (optional)" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} rows={3} />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </motion.div>
        </div>
      </Section>
    </PublicLayout>
  );
}
