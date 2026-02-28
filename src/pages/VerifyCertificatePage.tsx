import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Shield } from "lucide-react";

export default function VerifyCertificatePage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", certId.trim())
      .maybeSingle();
    setLoading(false);
    if (data) setResult(data);
    else setNotFound(true);
  };

  return (
    <PublicLayout>
      <section className="hero-section py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Verify <span className="text-primary">Certificate</span>
          </motion.h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Enter your certificate ID to verify its authenticity
          </p>
        </div>
      </section>

      <Section>
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleVerify} className="flex gap-3 mb-8">
            <Input
              placeholder="Enter Certificate ID"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="text-lg"
            />
            <Button type="submit" disabled={loading} className="gap-2 px-6">
              <Search className="h-4 w-4" /> Verify
            </Button>
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-8 border-2 border-cyber-green shadow-lg text-center">
              <CheckCircle className="h-16 w-16 text-cyber-green mx-auto mb-4" />
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Certificate Verified!</h3>
              <p className="text-muted-foreground mb-6">This certificate is authentic and issued by Hackademic.</p>
              <div className="bg-muted rounded-xl p-6 text-left space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Certificate ID</span><span className="font-semibold text-foreground">{result.certificate_id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Student Name</span><span className="font-semibold text-foreground">{result.student_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span className="font-semibold text-foreground">{result.course}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Issue Date</span><span className="font-semibold text-foreground">{result.issue_date}</span></div>
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-8 border-2 border-destructive shadow-lg text-center">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Not Found</h3>
              <p className="text-muted-foreground">No certificate found with this ID. Please check and try again.</p>
            </motion.div>
          )}

          {!result && !notFound && (
            <div className="text-center py-12">
              <Shield className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Enter a certificate ID above to verify</p>
            </div>
          )}
        </div>
      </Section>
    </PublicLayout>
  );
}
