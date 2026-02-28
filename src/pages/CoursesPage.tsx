import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Download } from "lucide-react";

const courseIcons: Record<string, string> = {
  "cyber-security": "🛡️",
  vapt: "🔍",
  "ccna-network-security": "🌐",
  "threat-intelligence": "🎯",
  "graphic-designing": "🎨",
  python: "🐍",
  rhcsa: "🐧",
};

export default function CoursesPage() {
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <PublicLayout>
      <section className="hero-section py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Our <span className="text-primary">Courses</span>
          </motion.h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Industry-leading cybersecurity and technology training programs
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle subtitle="Programs" title="Explore Our Courses" description="Choose from our wide range of industry-relevant courses" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(courses || []).map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="bg-card rounded-2xl border border-border overflow-hidden card-float h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary/10 to-sky-light/50 p-8 text-center">
                  <span className="text-5xl">{courseIcons[course.slug] || "📚"}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{course.short_description}</p>
                  {course.duration && (
                    <div className="flex items-center gap-1 text-xs text-primary mt-3">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Link to={`/courses/${course.slug}`} className="flex-1">
                      <Button size="sm" className="w-full gap-1">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                    {course.brochure_url && (
                      <a href={course.brochure_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </PublicLayout>
  );
}
