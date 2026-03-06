import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Shield, Globe, Palette, GraduationCap, Building2, ArrowRight, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const serviceIcons: Record<string, React.ReactNode> = {
  "security-audit": <Shield className="h-8 w-8" />,
  "web-development": <Globe className="h-8 w-8" />,
  "graphic-designing-service": <Palette className="h-8 w-8" />,
  "government-training": <GraduationCap className="h-8 w-8" />,
  "corporate-training": <Building2 className="h-8 w-8" />,
};

const whyUs = [
  "Certified Security Professionals (CEH, OSCP, CISSP)",
  "100+ Successful Security Audits",
  "Custom Solutions for Every Business",
  "24/7 Support & Monitoring",
  "Government & Corporate Trusted Partner",
  "Competitive & Transparent Pricing",
];

export default function ServicesPage() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-primary/20" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }} animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} />
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/30" style={{ left: `${8 + i * 9}%`, top: `${15 + (i % 4) * 20}%` }} animate={{ y: [-20, 20, -20], opacity: [0.1, 0.6, 0.1] }} transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }} />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
            <span className="text-primary text-sm font-semibold">🛡️ Enterprise Solutions</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Our <span className="text-primary">Services</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            End-to-end cybersecurity solutions for organizations of all sizes
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <Section>
        <SectionTitle subtitle="What We Offer" title="Comprehensive Solutions" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services || []).map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl hover:border-primary/30 transition-all group relative overflow-hidden"
            >
              <motion.div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-cyber-green" initial={{ width: "0%" }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }} />
              <motion.div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary mb-6" whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.5 }}>
                {serviceIcons[service.slug] || <Shield className="h-8 w-8" />}
              </motion.div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-muted-foreground mb-2">{service.short_description}</p>
              {service.description && (
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              )}
              <Link to={`/quotation?service=${encodeURIComponent(service.title)}`}>
                <Button size="sm" className="w-full gap-2 mt-2">
                  <FileText className="h-3 w-3" /> Get Quotation
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Trust" title="Why Choose HACKADEMIC?" />
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {whyUs.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.03, x: 5 }} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground text-sm font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <motion.div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Secure Your Organization?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Get a customized quotation tailored to your specific security needs
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex gap-4 justify-center">
            <Link to="/quotation">
              <Button size="lg" variant="secondary" className="gap-2">
                Request Quotation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
