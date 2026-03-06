import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { FileText, Send, Building2, User, Mail, Phone, Briefcase, Clock, IndianRupee, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const budgetRanges = [
  "Below ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹5,00,000",
  "₹5,00,000 - ₹10,00,000",
  "Above ₹10,00,000",
  "Not Sure / Need Consultation",
];

const timelines = [
  "Immediate (Within 1 week)",
  "1 - 2 Weeks",
  "1 Month",
  "2 - 3 Months",
  "Flexible",
];

const serviceOptions = [
  "Security Audit & Assessment",
  "Vulnerability Assessment & Penetration Testing",
  "Corporate Training Program",
  "Government Training Program",
  "Web Application Security",
  "Network Security Assessment",
  "Compliance & Certification Support",
  "Managed Security Services",
  "Graphic Design Services",
  "Web Development",
  "Other",
];

export default function QuotationPage() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    designation: "",
    email: "",
    phone: "",
    service_title: preselectedService,
    project_description: "",
    estimated_budget: "",
    timeline: "",
    additional_requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_name || !form.email || !form.phone || !form.service_title) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("service_quotations").insert([form]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Quotation Request Submitted! ✅", description: "Our team will prepare a detailed quotation and reach out within 24 hours." });

    // WhatsApp notification
    const waMessage = encodeURIComponent(
      `Hi, I'm ${form.contact_name} from ${form.company_name}. I'd like a quotation for: ${form.service_title}. ${form.project_description ? `Details: ${form.project_description}` : ""}`
    );
    window.open(`https://wa.me/917668116055?text=${waMessage}`, "_blank");

    setForm({ company_name: "", contact_name: "", designation: "", email: "", phone: "", service_title: "", project_description: "", estimated_budget: "", timeline: "", additional_requirements: "" });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-primary/20" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/30" style={{ left: `${8 + i * 9}%`, top: `${15 + (i % 4) * 20}%` }} animate={{ y: [-15, 15, -15], opacity: [0.1, 0.5, 0.1] }} transition={{ repeat: Infinity, duration: 3 + i * 0.3 }} />
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
            <span className="text-primary text-sm font-semibold">📋 Get a Quote</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Request a <span className="text-primary">Quotation</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Tell us about your requirements and we'll prepare a customized proposal for you
          </motion.p>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Left - Why Choose Us */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-1">
            <h3 className="font-heading font-bold text-xl text-foreground mb-6">Why Choose HACKADEMIC?</h3>
            <div className="space-y-4">
              {[
                { icon: Shield, title: "Certified Experts", desc: "CEH, OSCP, CISSP certified professionals" },
                { icon: CheckCircle, title: "Proven Track Record", desc: "100+ successful security audits" },
                { icon: Clock, title: "Quick Turnaround", desc: "Response within 24 hours guaranteed" },
                { icon: IndianRupee, title: "Competitive Pricing", desc: "Best-in-class services at fair rates" },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                  <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 shadow-lg space-y-5">
              <h3 className="font-heading font-bold text-xl text-foreground mb-1">Fill Your Requirements</h3>
              <p className="text-sm text-muted-foreground mb-4">All fields marked with * are required</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> Company Name *</label>
                  <Input placeholder="Your Company Name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><User className="h-3.5 w-3.5 text-primary" /> Your Name *</label>
                  <Input placeholder="Full Name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-primary" /> Designation</label>
                  <Input placeholder="e.g. CTO, IT Manager" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-primary" /> Email *</label>
                  <Input type="email" placeholder="your@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-primary" /> Phone *</label>
                  <Input placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-primary" /> Service Required *</label>
                  <Select value={form.service_title} onValueChange={(v) => setForm({ ...form, service_title: v })}>
                    <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-primary" /> Estimated Budget</label>
                  <Select value={form.estimated_budget} onValueChange={(v) => setForm({ ...form, estimated_budget: v })}>
                    <SelectTrigger><SelectValue placeholder="Select budget range" /></SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> Timeline</label>
                  <Select value={form.timeline} onValueChange={(v) => setForm({ ...form, timeline: v })}>
                    <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                    <SelectContent>
                      {timelines.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Project Description *</label>
                <Textarea placeholder="Describe your project requirements, scope, and any specific needs..." value={form.project_description} onChange={(e) => setForm({ ...form, project_description: e.target.value })} rows={4} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Additional Requirements</label>
                <Textarea placeholder="Any specific compliance requirements, certifications needed, or special considerations..." value={form.additional_requirements} onChange={(e) => setForm({ ...form, additional_requirements: e.target.value })} rows={3} />
              </div>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting}>
                <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Request Quotation"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your information is secure and will only be used to prepare your quotation.
              </p>
            </form>
          </motion.div>
        </div>
      </Section>
    </PublicLayout>
  );
}
