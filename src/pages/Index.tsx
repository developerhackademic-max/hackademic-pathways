import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Section, SectionTitle } from "@/components/Section";
import { PublicLayout } from "@/components/PublicLayout";
import { AIChatbot } from "@/components/AIChatbot";
import { AchievementsSection } from "@/components/AchievementsSection";
import { Shield, BookOpen, Briefcase, Award, ArrowRight, CheckCircle, Users, Globe, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef } from "react";

import courseCyber from "@/assets/course-cyber-security.jpg";
import courseVapt from "@/assets/course-vapt.jpg";
import courseCcna from "@/assets/course-ccna.jpg";
import courseThreat from "@/assets/course-threat-intel.jpg";
import courseGraphic from "@/assets/course-graphic-design.jpg";
import coursePython from "@/assets/course-python.jpg";
import courseRhcsa from "@/assets/course-rhcsa.jpg";

const stats = [
  { icon: Users, value: "500+", label: "Students Trained" },
  { icon: BookOpen, value: "15+", label: "Courses Offered" },
  { icon: Briefcase, value: "50+", label: "Corporate Clients" },
  { icon: Globe, value: "10+", label: "Countries Served" },
];

const features = [
  "Industry-Expert Instructors",
  "Hands-on Lab Environment",
  "Real-World Projects",
  "Placement Assistance",
  "Globally Recognized Certifications",
  "24/7 Learning Support",
];

const courseImages: Record<string, string> = {
  "cyber-security": courseCyber,
  vapt: courseVapt,
  "ccna-network-security": courseCcna,
  "threat-intelligence": courseThreat,
  "graphic-designing": courseGraphic,
  python: coursePython,
  rhcsa: courseRhcsa,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return data || [];
    },
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <PublicLayout>
      {/* Hero with Video Background */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
                <Shield className="h-4 w-4" />
                Cyber Security Education & Services
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6"
              style={{ color: "white" }}
            >
              Future-Proof Your{" "}
              <span className="text-primary">Career</span> in Cyber Security
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-lg mb-8"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Master the skills employers demand. Join HACKADEMIC and become a certified cybersecurity professional with hands-on training and industry-recognized certifications.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/courses">
                <Button size="lg" className="gap-2">
                  Explore Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  Talk to Expert
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${i % 3 === 0 ? 'w-3 h-3 bg-primary/20' : i % 3 === 1 ? 'w-2 h-2 bg-cyber-green/25' : 'w-1.5 h-1.5 bg-primary/30'}`}
              style={{ left: `${8 + i * 8}%`, top: `${15 + (i % 5) * 18}%` }}
              animate={{
                y: [-30, 30, -30],
                x: [-(i % 3) * 10, (i % 3) * 10, -(i % 3) * 10],
                opacity: [0.2, 0.7, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: "easeInOut" }}
            />
          ))}
          {/* Animated connecting lines */}
          <motion.div
            className="absolute top-1/3 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            animate={{ opacity: [0, 0.5, 0], x: [0, 100, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-2/3 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-cyber-green/20 to-transparent"
            animate={{ opacity: [0, 0.4, 0], x: [0, -80, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px hsl(199 89% 48% / 0.2)" }}
                className="bg-card rounded-xl p-6 shadow-lg border border-border text-center"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <motion.div
                  className="text-2xl font-heading font-bold text-foreground"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview with Images */}
      <Section>
        <SectionTitle
          subtitle="Our Courses"
          title="Industry-Leading Cybersecurity Training"
          description="Gain practical skills with our comprehensive courses designed by industry experts"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(courses || []).slice(0, 8).map((course, i) => (
            <motion.div
              key={course.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div className="group bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={courseImages[course.slug] || courseCyber}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {course.short_description}
                  </p>
                  {course.duration && (
                    <p className="text-xs text-primary mt-3 font-medium">{course.duration}</p>
                  )}
                  <Link to={`/courses/${course.slug}`} className="mt-3">
                    <Button size="sm" variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Eye className="h-3 w-3" /> View Course
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/courses">
            <Button variant="outline" className="gap-2">
              View All Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Services Preview */}
      <Section className="bg-muted/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyber-green/5 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          {/* Floating grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <SectionTitle
          subtitle="Our Services"
          title="Comprehensive Cybersecurity Solutions"
          description="From security audits to corporate training, we protect and empower organizations"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {(services || []).slice(0, 6).map((service, i) => (
            <motion.div
              key={service.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -12, rotateY: 3, rotateX: -3, scale: 1.02 }}
              className="group bg-card rounded-2xl p-8 border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/40 relative overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-cyber-green/5 transition-all duration-700" />
              {/* Animated border line */}
              <motion.div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-cyber-green"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3, duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="relative z-10 w-14 h-14 bg-gradient-to-br from-primary/20 to-cyber-green/20 rounded-xl flex items-center justify-center mb-5"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Briefcase className="h-7 w-7 text-primary" />
              </motion.div>
              <h3 className="relative z-10 font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="relative z-10 text-sm text-muted-foreground">
                {service.short_description}
              </p>
              {/* Floating particles inside card */}
              <motion.div
                className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-primary/20"
                animate={{ y: [-5, 5, -5], opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-12 right-8 w-1.5 h-1.5 rounded-full bg-cyber-green/20"
                animate={{ y: [5, -5, 5], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 + i * 0.2, ease: "easeInOut" }}
              />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Achievements */}
      <AchievementsSection />

      {/* Why Hackademic */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionTitle
              subtitle="Why Choose Us"
              title="Why HACKADEMIC?"
              description=""
              center={false}
            />
            <p className="text-muted-foreground mb-8">
              We combine cutting-edge curriculum with real-world experience to produce industry-ready cybersecurity professionals. Our comprehensive approach ensures you're not just learning — you're becoming.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-5 w-5 text-cyber-green flex-shrink-0" />
                  <span className="text-sm text-foreground">{f}</span>
                </motion.div>
              ))}
            </div>
            <Link to="/about" className="inline-block mt-8">
              <Button className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary/20 to-cyber-green/20 rounded-2xl p-8 border border-primary/20">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, val: "95%", lbl: "Placement Rate" },
                  { icon: Shield, val: "100+", lbl: "Security Audits" },
                ].map((item, i) => (
                  <motion.div
                    key={item.lbl}
                    className="bg-card rounded-xl p-6 text-center shadow-md"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <item.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="font-heading font-bold text-2xl text-foreground">{item.val}</p>
                    <p className="text-xs text-muted-foreground">{item.lbl}</p>
                  </motion.div>
                ))}
                <motion.div
                  className="bg-card rounded-xl p-6 text-center shadow-md col-span-2"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <BookOpen className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-2xl text-foreground">Hands-On Labs</p>
                  <p className="text-xs text-muted-foreground">Real-world cyber range environments</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4" style={{ color: "white" }}>
              Ready to Start Your Cybersecurity Journey?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              Join hundreds of professionals who have transformed their careers with HACKADEMIC.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="gap-2">
                  Browse Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chatbot */}
      <AIChatbot />
    </PublicLayout>
  );
};

export default Index;
