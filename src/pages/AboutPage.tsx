import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Target, Eye, Users, Star, CheckCircle } from "lucide-react";
import aboutBg from "@/assets/about-bg.jpg";

export default function AboutPage() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value || ""));
      return map;
    },
  });

  const { data: team } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("sort_order");
      return data || [];
    },
  });

  const director = team?.find((m) => m.is_director);
  const members = team?.filter((m) => !m.is_director) || [];

  const getDesignationColor = (designation: string) => {
    const d = designation.toLowerCase();
    if (d.includes("director") || d.includes("ceo")) return "from-primary to-sky-dark";
    if (d.includes("manager") || d.includes("lead")) return "from-cyber-green to-primary";
    if (d.includes("senior")) return "from-sky-dark to-navy-light";
    return "from-primary/80 to-sky-dark/80";
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${aboutBg})` }} />
        <div className="absolute inset-0 bg-navy/90" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            About <span className="text-primary">Hackademic</span>
          </motion.h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Building the next generation of cybersecurity professionals
          </p>
        </div>
      </section>

      {/* About */}
      <Section>
        <SectionTitle subtitle="Who We Are" title="About Hackademic" />
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground text-center leading-relaxed text-lg">
            {settings?.about_us || "Loading..."}
          </p>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section id="mission" className="bg-muted/50">
        <SectionTitle subtitle="Our Purpose" title="Mission & Vision" />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-8 border border-border card-float">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">Our Mission</h3>
            <p className="text-muted-foreground">{settings?.mission || "Loading..."}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-8 border border-border card-float">
            <div className="w-14 h-14 bg-cyber-green/10 rounded-xl flex items-center justify-center mb-4">
              <Eye className="h-7 w-7 text-cyber-green" />
            </div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">Our Vision</h3>
            <p className="text-muted-foreground">{settings?.vision || "Loading..."}</p>
          </motion.div>
        </div>
      </Section>

      {/* Why Hackademic */}
      <Section id="why">
        <SectionTitle subtitle="Why Choose Us" title="Why Hackademic?" />
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground text-center leading-relaxed text-lg mb-8">
            {settings?.why_hackademic || "Loading..."}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {["Industry Expert Trainers", "Hands-on Cyber Range Labs", "Placement & Internship Support", "Globally Recognized Certifications", "Government & Corporate Partnerships", "24/7 Student Support"].map((f) => (
              <div key={f} className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border">
                <CheckCircle className="h-5 w-5 text-cyber-green flex-shrink-0" />
                <span className="text-foreground font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Leadership Team */}
      <Section id="team" className="bg-muted/50">
        <SectionTitle subtitle="Our People" title="Leadership Team" />

        {/* Director Card - Special */}
        {director && (
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="animate-float w-full max-w-md"
            >
              <div className="relative bg-card rounded-2xl overflow-hidden border-2 border-primary shadow-xl">
                <div className={`h-2 bg-gradient-to-r ${getDesignationColor(director.designation)}`} />
                <div className="p-8 text-center">
                  <div className="w-28 h-28 rounded-full bg-primary/10 mx-auto mb-4 overflow-hidden border-4 border-primary/20">
                    {director.image_url ? (
                      <img src={director.image_url} alt={director.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-foreground">{director.name}</h3>
                  <p className="text-primary font-semibold mt-1">{director.designation}</p>
                  {director.quote && (
                    <blockquote className="mt-4 italic text-muted-foreground border-l-4 border-primary pl-4 text-left">
                      "{director.quote}"
                    </blockquote>
                  )}
                  {director.bio && <p className="mt-4 text-sm text-muted-foreground">{director.bio}</p>}
                  <div className="absolute top-4 right-4">
                    <Star className="h-6 w-6 text-primary fill-primary" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Other Members */}
        {members.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border card-float">
                  <div className={`h-1.5 bg-gradient-to-r ${getDesignationColor(member.designation)}`} />
                  <div className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 overflow-hidden border-2 border-border">
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.designation}</p>
                    {member.bio && <p className="mt-2 text-xs text-muted-foreground">{member.bio}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {(!team || team.length === 0) && (
          <p className="text-center text-muted-foreground">Team members will appear here once added from the admin panel.</p>
        )}
      </Section>
    </PublicLayout>
  );
}
