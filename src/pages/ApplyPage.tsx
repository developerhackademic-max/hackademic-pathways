import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApplyPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: course } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("slug", slug).single();
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("applications").insert([{
      ...form,
      course_id: course?.id,
    }]);
    setLoading(false);
    if (error) {
      toast({ title: "Error submitting application", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Application submitted successfully!" });
    }
  };

  return (
    <PublicLayout>
      <section className="hero-section py-32">
        <div className="container mx-auto px-4">
          <Link to={`/courses/${slug}`} className="inline-flex items-center gap-1 text-primary mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Course
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold" style={{ color: "white" }}>
            Apply for {course?.title || "Course"}
          </motion.h1>
        </div>
      </section>

      <Section>
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-8 border-2 border-cyber-green text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Application Submitted!</h2>
              <p className="text-muted-foreground mb-6">Thank you for applying. You will receive a confirmation email shortly. Our team will contact you soon.</p>
              <Link to="/courses"><Button>Browse More Courses</Button></Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-lg space-y-4">
              <SectionTitle subtitle="Enrollment" title="Fill Your Details" />
              <Input placeholder="Full Name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <Input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input placeholder="Phone Number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Textarea placeholder="Any message or query (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} />
              <Button type="submit" disabled={loading} className="w-full gap-2">
                <Send className="h-4 w-4" /> {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </PublicLayout>
  );
}
