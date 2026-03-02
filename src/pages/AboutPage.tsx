import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Target, Eye, Users, Star, CheckCircle, Award, Briefcase, Globe, Camera } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import aboutEmpowering from "@/assets/about-empowering.jpg";
import serviceSecurity from "@/assets/service-security.jpg";
import serviceTraining from "@/assets/service-training.jpg";

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

  const { data: gallery } = useQuery({
    queryKey: ["success-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("success_gallery").select("*").eq("is_active", true).order("sort_order");
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

  const counterVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1, scale: 1,
      transition: { delay: i * 0.15, duration: 0.5, type: "spring" as const, stiffness: 150 },
    }),
  };

  return (
    <PublicLayout>
      {/* Hero Banner - Full width like Brillica */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutHero} alt="About HACKADEMIC" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-4"
            style={{ color: "white" }}
          >
            About <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Bridging the Cybersecurity Knowledge Gap
          </motion.p>
        </div>
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 4) * 20}%` }}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" }}
            />
          ))}
        </div>
      </section>

      {/* Empowering Section - Side by side like Brillica */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2 mb-6">
              Empowering India's <span className="text-primary">Cybersecurity Future</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {settings?.about_us || "HACKADEMIC is dedicated to empowering individuals with the skills and knowledge necessary to succeed in cybersecurity. Our programs bridge the gap between academic knowledge and industry requirements."}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: Users, val: "500+", lbl: "Students Trained" },
                { icon: Briefcase, val: "50+", lbl: "Corporate Clients" },
                { icon: Award, val: "95%", lbl: "Placement Rate" },
                { icon: Globe, val: "10+", lbl: "Countries" },
              ].map((item, i) => (
                <motion.div
                  key={item.lbl}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={counterVariants}
                  className="bg-muted/50 rounded-xl p-4 text-center border border-border"
                >
                  <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-xl text-foreground">{item.val}</p>
                  <p className="text-xs text-muted-foreground">{item.lbl}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={aboutEmpowering} alt="Students training" className="w-full h-80 object-cover" />
            </div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-2xl border border-primary/20"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-cyber-green/10 rounded-full border border-cyber-green/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </motion.div>
        </div>
      </Section>

      {/* Mission & Vision - Full width cards with images */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 8 }}
          />
        </div>
        <SectionTitle subtitle="Our Purpose" title="Mission & Vision" />

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <div className="relative">
            <img src={serviceSecurity} alt="Mission" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/50 flex items-center">
              <div className="p-8 md:p-12 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl" style={{ color: "white" }}>Our Mission</h3>
                </div>
                <p style={{ color: "rgba(255,255,255,0.8)" }} className="text-lg leading-relaxed">
                  {settings?.mission || "To provide world-class cybersecurity education and bridge the knowledge gap in the industry."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="relative">
            <img src={serviceTraining} alt="Vision" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-navy/90 to-navy/50 flex items-center justify-end">
              <div className="p-8 md:p-12 max-w-2xl text-right">
                <div className="flex items-center gap-3 mb-4 justify-end">
                  <h3 className="font-heading font-bold text-2xl" style={{ color: "white" }}>Our Vision</h3>
                  <div className="w-12 h-12 bg-cyber-green/20 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-cyber-green" />
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.8)" }} className="text-lg leading-relaxed">
                  {settings?.vision || "To be the leading cybersecurity education provider, producing industry-ready professionals."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Why HACKADEMIC */}
      <Section id="why">
        <SectionTitle subtitle="Why Choose Us" title="Why HACKADEMIC?" />
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center leading-relaxed text-lg mb-8"
          >
            {settings?.why_hackademic || "We combine cutting-edge curriculum with real-world experience to produce industry-ready cybersecurity professionals."}
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-4">
            {["Industry Expert Trainers", "Hands-on Cyber Range Labs", "Placement & Internship Support", "Globally Recognized Certifications", "Government & Corporate Partnerships", "24/7 Student Support"].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, x: 5 }}
                className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border"
              >
                <CheckCircle className="h-5 w-5 text-cyber-green flex-shrink-0" />
                <span className="text-foreground font-medium">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Glimpse of our Success */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -bottom-20 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
        </div>
        <SectionTitle
          subtitle="Our Achievements"
          title="Glimpse of our Success"
        />
        {gallery && gallery.length > 0 ? (
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -(gallery.length * 320)] }}
              transition={{ repeat: Infinity, duration: gallery.length * 5, ease: "linear" }}
            >
              {[...gallery, ...gallery].map((item, i) => (
                <motion.div
                  key={`${item.id}-${i}`}
                  className="flex-shrink-0 w-[300px] bg-card rounded-2xl overflow-hidden border border-border shadow-lg"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {item.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.image_url} alt={item.title || "Success"} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    {item.title && <h4 className="font-heading font-semibold text-foreground mb-1">{item.title}</h4>}
                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Success stories will appear here once added from the admin panel.</p>
          </div>
        )}
      </Section>

      {/* Leadership Team */}
      <Section id="team">
        <SectionTitle subtitle="Our People" title="Leadership Team" />

        {director && (
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-md"
            >
              <div className="relative bg-card rounded-2xl overflow-hidden border-2 border-primary shadow-xl">
                <div className={`h-2 bg-gradient-to-r ${getDesignationColor(director.designation)}`} />
                <div className="p-8 text-center">
                  <motion.div
                    className="w-28 h-28 rounded-full bg-primary/10 mx-auto mb-4 overflow-hidden border-4 border-primary/20"
                    whileHover={{ scale: 1.1 }}
                  >
                    {director.image_url ? (
                      <img src={director.image_url} alt={director.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </motion.div>
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

        {members.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border">
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
