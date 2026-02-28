import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { Section, SectionTitle } from "@/components/Section";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogsPage() {
  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data } = await supabase.from("blogs").select("*").eq("is_published", true).order("published_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <PublicLayout>
      <section className="hero-section py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4" style={{ color: "white" }}>
            Our <span className="text-primary">Blog</span>
          </motion.h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Insights, tutorials, and news from the cybersecurity world
          </p>
        </div>
      </section>

      <Section>
        {blogs && blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blogs/${blog.slug}`} className="block group">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border card-float">
                    {blog.cover_image && (
                      <img src={blog.cover_image} alt={blog.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3" />
                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : ""}
                        {blog.author && <span>• {blog.author}</span>}
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">{blog.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-primary mt-3">
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </Section>
    </PublicLayout>
  );
}
