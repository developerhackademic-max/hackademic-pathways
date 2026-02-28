import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      // WhatsApp redirect
      const waMessage = encodeURIComponent(
        `Hi, I'm ${form.name}. ${form.subject ? `Subject: ${form.subject}. ` : ""}${form.message}`
      );
      window.open(`https://wa.me/91XXXXXXXXXX?text=${waMessage}`, "_blank");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      <section className="hero-section py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Get in touch with our team for any queries
          </p>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <SectionTitle subtitle="Reach Out" title="Get In Touch" center={false} />
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-card rounded-xl p-6 border border-border card-float">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground">info@hackademic.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card rounded-xl p-6 border border-border card-float">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">Phone</h4>
                  <p className="text-muted-foreground">+91 XXXXX XXXXX</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card rounded-xl p-6 border border-border card-float">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">Location</h4>
                  <p className="text-muted-foreground">India</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card rounded-xl p-6 border border-border card-float">
                <div className="w-12 h-12 bg-cyber-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-cyber-green" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">WhatsApp</h4>
                  <p className="text-muted-foreground">Automated message sent on form submission</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-lg space-y-4">
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">Send us a message</h3>
              <Input placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <Textarea placeholder="Your Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} required />
              <Button type="submit" disabled={loading} className="w-full gap-2">
                <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </Section>
    </PublicLayout>
  );
}
