import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Shield, Globe, Palette, GraduationCap, Building2 } from "lucide-react";

const serviceIcons: Record<string, React.ReactNode> = {
  "security-audit": <Shield className="h-8 w-8" />,
  "web-development": <Globe className="h-8 w-8" />,
  "graphic-designing-service": <Palette className="h-8 w-8" />,
  "government-training": <GraduationCap className="h-8 w-8" />,
  "corporate-training": <Building2 className="h-8 w-8" />,
};

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
      <section className="hero-section py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Our <span className="text-primary">Services</span>
          </motion.h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            End-to-end cybersecurity solutions for organizations of all sizes
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle subtitle="What We Offer" title="Comprehensive Solutions" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services || []).map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border card-float group"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-sky-light flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {serviceIcons[service.slug] || <Shield className="h-8 w-8" />}
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.short_description}</p>
              {service.description && (
                <p className="text-sm text-muted-foreground mt-3">{service.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </Section>
    </PublicLayout>
  );
}
