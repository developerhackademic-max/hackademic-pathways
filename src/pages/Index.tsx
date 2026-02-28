import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Section, SectionTitle } from "@/components/Section";
import { PublicLayout } from "@/components/PublicLayout";
import { Shield, BookOpen, Briefcase, Award, ArrowRight, CheckCircle, Users, Globe } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

const Index = () => {
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

  const courseIcons: Record<string, string> = {
    "cyber-security": "🛡️",
    vapt: "🔍",
    "ccna-network-security": "🌐",
    "threat-intelligence": "🎯",
    "graphic-designing": "🎨",
    python: "🐍",
    rhcsa: "🐧",
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
                <Shield className="h-4 w-4" />
                Cyber Security Education & Services
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6"
              style={{ color: "white" }}
            >
              Future-Proof Your{" "}
              <span className="text-primary">Career</span> in Cyber Security
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg mb-8"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Master the skills employers demand. Join Hackademic and become a certified cybersecurity professional with hands-on training and industry-recognized certifications.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-lg border border-border text-center card-float"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-heading font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/courses/${course.slug}`} className="block group">
                <div className="bg-card rounded-xl p-6 border border-border card-float h-full">
                  <div className="text-4xl mb-4">{courseIcons[course.slug] || "📚"}</div>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.short_description}
                  </p>
                  {course.duration && (
                    <p className="text-xs text-primary mt-3 font-medium">{course.duration}</p>
                  )}
                </div>
              </Link>
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
      <Section className="bg-muted/50">
        <SectionTitle
          subtitle="Our Services"
          title="Comprehensive Cybersecurity Solutions"
          description="From security audits to corporate training, we protect and empower organizations"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services || []).slice(0, 6).map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-8 border border-border card-float"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.short_description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why Hackademic */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle
              subtitle="Why Choose Us"
              title="Why Hackademic?"
              description=""
              center={false}
            />
            <p className="text-muted-foreground mb-8">
              We combine cutting-edge curriculum with real-world experience to produce industry-ready cybersecurity professionals. Our comprehensive approach ensures you're not just learning — you're becoming.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyber-green flex-shrink-0" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-block mt-8">
              <Button className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-cyber-green/20 rounded-2xl p-8 border border-primary/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-6 text-center shadow-md">
                  <Award className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-2xl text-foreground">95%</p>
                  <p className="text-xs text-muted-foreground">Placement Rate</p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center shadow-md">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-2xl text-foreground">100+</p>
                  <p className="text-xs text-muted-foreground">Security Audits</p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center shadow-md col-span-2">
                  <BookOpen className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-2xl text-foreground">Hands-On Labs</p>
                  <p className="text-xs text-muted-foreground">Real-world cyber range environments</p>
                </div>
              </div>
            </div>
          </div>
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
              Join hundreds of professionals who have transformed their careers with Hackademic.
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
    </PublicLayout>
  );
};

export default Index;
