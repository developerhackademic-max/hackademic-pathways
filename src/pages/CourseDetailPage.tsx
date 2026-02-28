import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Download, CheckCircle, Clock } from "lucide-react";

export default function CourseDetailPage() {
  const { slug } = useParams();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("slug", slug).single();
      return data;
    },
  });

  if (isLoading) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div></PublicLayout>;
  if (!course) return <PublicLayout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Course not found</p></div></PublicLayout>;

  const modules = (course.modules as string[]) || [];

  return (
    <PublicLayout>
      <section className="hero-section py-32">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="inline-flex items-center gap-1 text-primary mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            {course.title}
          </motion.h1>
          {course.duration && (
            <div className="flex items-center gap-2 mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Clock className="h-4 w-4" /> {course.duration}
            </div>
          )}
          <div className="flex gap-3">
            <Link to={`/apply/${course.slug}`}>
              <Button size="lg">Apply Now</Button>
            </Link>
            {course.brochure_url && (
              <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 gap-2">
                  <Download className="h-4 w-4" /> Download Brochure
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-4">About This Course</h2>
          <p className="text-muted-foreground leading-relaxed mb-10">{course.description}</p>

          {modules.length > 0 && (
            <>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Course Modules</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {modules.map((mod, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 bg-muted/50 rounded-lg p-4 border border-border"
                  >
                    <CheckCircle className="h-5 w-5 text-cyber-green flex-shrink-0" />
                    <span className="text-foreground">{mod}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <div className="mt-12 text-center">
            <Link to={`/apply/${course.slug}`}>
              <Button size="lg" className="gap-2">Apply Now</Button>
            </Link>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
}
