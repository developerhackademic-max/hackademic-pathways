import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, XCircle, Shield, Award, Sparkles, PartyPopper, Star, HelpCircle, FileText } from "lucide-react";
import sampleCertImg from "@/assets/sample-certificate.jpg";

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ["hsl(var(--primary))", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: color, left: `${x}%`, top: "-10px" }}
      initial={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: [1, 1, 0], y: [0, 400, 600], rotate: [0, 360, 720], x: [0, (Math.random() - 0.5) * 200], scale: [1, 0.8, 0.3] }}
      transition={{ duration: 2.5, delay, ease: "easeOut" }}
    />
  );
}

function CelebrationOverlay() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i, delay: Math.random() * 0.8, x: Math.random() * 100,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />)}
    </div>
  );
}

export default function VerifyCertificatePage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const { data: faqs } = useQuery({
    queryKey: ["certificate-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("certificate_faqs").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const { data: sampleCerts } = useQuery({
    queryKey: ["sample-certificates"],
    queryFn: async () => {
      const { data } = await supabase.from("sample_certificates").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setShowCelebration(false);
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", certId.trim())
      .maybeSingle();
    setLoading(false);
    if (data) {
      setResult(data);
      setShowCelebration(true);
    } else {
      setNotFound(true);
    }
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const defaultFaqs = [
    { question: "How do I get my certificate ID?", answer: "Your certificate ID is printed on the bottom of your certificate and was also sent to your registered email after course completion." },
    { question: "What if my certificate is not found?", answer: "Please double-check the certificate ID. If the issue persists, contact our support team at support@hackademic.in." },
    { question: "Are HACKADEMIC certificates industry-recognized?", answer: "Yes! Our certificates are recognized across the cybersecurity and IT industry and validate your practical skills and knowledge." },
    { question: "Can employers verify my certificate?", answer: "Absolutely. Employers can use this same verification page to confirm the authenticity of your HACKADEMIC certificate." },
    { question: "How long is my certificate valid?", answer: "HACKADEMIC certificates do not expire. However, we recommend staying updated with the latest skills through our advanced courses." },
  ];

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs.map((f, i) => ({ ...f, id: String(i) }));

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy/80" />
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(hsl(var(--primary)/0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} />
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} className="absolute" style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }} animate={{ y: [-15, 15, -15], opacity: [0.2, 0.7, 0.2], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4 }}>
              <Shield className="h-4 w-4 text-primary/30" />
            </motion.div>
          ))}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Certificate Verification Portal</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Verify Your <span className="text-primary">Certificate</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Enter your unique certificate ID to verify its authenticity instantly
          </motion.p>
        </div>
      </section>

      {/* Verify Form */}
      <Section>
        <div className="max-w-xl mx-auto relative">
          <motion.form onSubmit={handleVerify} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter Certificate ID (e.g., HACK-2026-XXXX)" value={certId} onChange={(e) => setCertId(e.target.value)} className="pl-10 text-lg h-12" />
            </div>
            <Button type="submit" disabled={loading} className="gap-2 px-6 h-12">
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> : <Search className="h-4 w-4" />} Verify
            </Button>
          </motion.form>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div key="found" initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="relative">
                {showCelebration && <CelebrationOverlay />}
                <div className="bg-card rounded-2xl p-8 border-2 border-primary shadow-2xl shadow-primary/20 text-center relative overflow-hidden">
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                  <div className="relative z-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, delay: 0.2 }} className="relative inline-block mb-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" style={{ width: "80px", height: "80px", top: "-8px", left: "50%", marginLeft: "-40px" }} />
                      <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-2 mb-2">
                      <PartyPopper className="h-5 w-5 text-primary" />
                      <h3 className="font-heading font-bold text-2xl text-foreground">Certificate Verified!</h3>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </motion.div>
                    <p className="text-muted-foreground mb-6">This certificate is authentic and issued by HACKADEMIC.</p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-muted rounded-xl p-6 text-left space-y-4">
                      {[
                        { label: "Certificate ID", value: result.certificate_id, icon: "🏆" },
                        { label: "Student Name", value: result.student_name, icon: "👨‍🎓" },
                        { label: "Course", value: result.course, icon: "📚" },
                        { label: "Issue Date", value: result.issue_date, icon: "📅" },
                      ].map((item, i) => (
                        <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground flex items-center gap-2"><span>{item.icon}</span>{item.label}</span>
                          <span className="font-semibold text-foreground">{item.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.1, type: "spring" }}>
                          <Star className="h-5 w-5 text-primary fill-primary" />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {notFound && (
              <motion.div key="not-found" initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-card rounded-2xl p-8 border-2 border-destructive shadow-lg text-center">
                <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                </motion.div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Not Found</h3>
                <p className="text-muted-foreground">No certificate found with this ID. Please check and try again.</p>
              </motion.div>
            )}

            {!result && !notFound && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <Shield className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
                </motion.div>
                <p className="text-muted-foreground">Enter a certificate ID above to verify</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>

      {/* Sample Certificate */}
      <Section className="bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 6 }} />
        </div>
        <div className="relative z-10">
          <SectionTitle subtitle="Preview" title="Sample Certificate" description="Here's what your HACKADEMIC certificate looks like" />
          <div className="max-w-4xl mx-auto">
            {(sampleCerts && sampleCerts.length > 0) ? (
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-6">
                {sampleCerts.map((cert) => (
                  <motion.div key={cert.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -8, scale: 1.02 }} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
                    <div className="overflow-hidden"><img src={cert.image_url} alt={cert.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                    <div className="p-4 text-center">
                      <h3 className="font-heading font-semibold text-foreground">{cert.title}</h3>
                      {cert.description && <p className="text-sm text-muted-foreground mt-1">{cert.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30, rotateX: 5 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} whileHover={{ y: -5, scale: 1.01 }} className="bg-card rounded-2xl border-2 border-primary/20 overflow-hidden shadow-2xl shadow-primary/10 max-w-lg mx-auto">
                <div className="overflow-hidden"><img src={sampleCertImg} alt="Sample Certificate" className="w-full h-auto" /></div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-lg text-foreground">HACKADEMIC Certificate of Completion</h3>
                  <p className="text-sm text-muted-foreground mt-1">Awarded upon successful completion of any HACKADEMIC training program</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionTitle subtitle="Questions?" title="Frequently Asked Questions" description="Everything you need to know about HACKADEMIC certificates" />
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Accordion type="single" collapsible className="space-y-3">
              {displayFaqs.map((faq: any, i: number) => (
                <motion.div key={faq.id || i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <AccordionItem value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6 hover:border-primary/30 transition-colors">
                    <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline">
                      <span className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8">{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <motion.div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FileText className="h-12 w-12 text-primary-foreground/80 mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-primary-foreground mb-3">Want to Earn Your Certificate?</h2>
            <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto">Join HACKADEMIC's industry-leading training programs and earn your verified certificate</p>
            <a href="/courses"><Button size="lg" variant="secondary" className="gap-2">Explore Courses <Sparkles className="h-4 w-4" /></Button></a>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
