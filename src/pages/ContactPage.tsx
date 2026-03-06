import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const contactInfo = [
  { icon: Mail, title: "Email Us", value: "support@hackademic.in", color: "from-primary/20 to-primary/5" },
  { icon: Phone, title: "Call Us", value: "+91 7668116055", color: "from-cyber-green/20 to-cyber-green/5" },
  { icon: MapPin, title: "Visit Us", value: "India", color: "from-amber-500/20 to-amber-500/5" },
  { icon: Clock, title: "Working Hours", value: "Mon - Sat, 9AM - 7PM", color: "from-purple-500/20 to-purple-500/5" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Error submitting message", variant: "destructive" });
    } else {
      toast({ title: "Message sent successfully!" });
      const waMessage = encodeURIComponent(
        `Hi, I'm ${form.name}. ${form.subject ? `Subject: ${form.subject}. ` : ""}${form.message}`
      );
      window.open(`https://wa.me/917668116055?text=${waMessage}`, "_blank");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-primary/20" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }} animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} />
          {[...Array(12)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/30" style={{ left: `${5 + i * 8}%`, top: `${15 + (i % 5) * 18}%` }} animate={{ y: [-20, 20, -20], opacity: [0.1, 0.6, 0.1] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4 }} />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
            <span className="text-primary text-sm font-semibold">💬 We'd Love to Hear From You</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Have a question or want to learn more? Get in touch with our team
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative -mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((info, i) => (
              <motion.div key={info.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.03 }} className="bg-card rounded-xl p-5 shadow-lg border border-border text-center hover:border-primary/30 hover:shadow-primary/10 transition-all">
                <motion.div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mx-auto mb-3`} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <info.icon className="h-6 w-6 text-primary" />
                </motion.div>
                <h4 className="font-heading font-semibold text-foreground text-sm">{info.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{info.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <SectionTitle subtitle="Reach Out" title="Send us a Message" center={false} />
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-lg space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <Textarea placeholder="Your Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required />
              <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-cyber-green/10 to-cyber-green/5 rounded-2xl border border-cyber-green/20 p-8">
              <div className="flex items-start gap-4">
                <motion.div className="w-14 h-14 bg-cyber-green/20 rounded-xl flex items-center justify-center flex-shrink-0" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <MessageCircle className="h-7 w-7 text-cyber-green" />
                </motion.div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">Quick Chat on WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mb-4">Get instant responses from our team. We're available Mon-Sat, 9AM-7PM.</p>
                  <a href="https://wa.me/917668116055" target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-cyber-green hover:bg-cyber-green/90 text-cyber-green-foreground">
                      <MessageCircle className="h-4 w-4" /> Chat Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-heading font-bold text-lg text-foreground mb-4">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: "Explore Courses", path: "/courses", icon: Globe },
                  { label: "Get a Quotation", path: "/quotation", icon: Mail },
                  { label: "Internship Program", path: "/internship", icon: ArrowRight },
                ].map((link, i) => (
                  <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Link to={link.path} className="flex items-center justify-between bg-muted/50 rounded-xl p-4 hover:bg-accent transition-colors group">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                      <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Embed */}
            <div className="rounded-2xl overflow-hidden border border-border h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.0!2d73.85!3d18.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEyLjAiTiA3M8KwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="HACKADEMIC Location"
              />
            </div>
          </motion.div>
        </div>
      </Section>
    </PublicLayout>
  );
}
