import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Section, SectionTitle } from "@/components/Section";
import { Trophy } from "lucide-react";

export function AchievementsSection() {
  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data } = await supabase.from("achievements").select("*").eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  if (!achievements?.length) return null;

  return (
    <Section>
      <SectionTitle subtitle="Our Achievements" title="Milestones & Recognition" description="Celebrating our journey and impact in cybersecurity education" />
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: achievements.length * 5, ease: "linear" }}
        >
          {/* Duplicate for seamless loop */}
          {[...achievements, ...achievements].map((a, i) => (
            <motion.div
              key={`${a.id}-${i}`}
              className="min-w-[320px] max-w-[320px] bg-card rounded-2xl border border-border overflow-hidden card-float flex-shrink-0"
              whileHover={{ scale: 1.03 }}
            >
              {a.image_url ? (
                <div className="h-44 overflow-hidden">
                  <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-primary/10 to-cyber-green/10 flex items-center justify-center">
                  <Trophy className="h-16 w-16 text-primary/40" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-heading font-bold text-foreground mb-1">{a.title}</h3>
                {a.description && <p className="text-sm text-muted-foreground line-clamp-3">{a.description}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
