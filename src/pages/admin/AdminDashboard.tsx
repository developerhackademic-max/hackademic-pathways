import { AdminLayout } from "@/components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Briefcase, Users, Award, FileText, Mail } from "lucide-react";

export default function AdminDashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [courses, services, team, certs, blogs, apps] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
      ]);
      return {
        courses: courses.count || 0,
        services: services.count || 0,
        team: team.count || 0,
        certificates: certs.count || 0,
        blogs: blogs.count || 0,
        applications: apps.count || 0,
      };
    },
  });

  const cards = [
    { label: "Courses", count: counts?.courses, icon: BookOpen, color: "text-primary" },
    { label: "Services", count: counts?.services, icon: Briefcase, color: "text-cyber-green" },
    { label: "Team Members", count: counts?.team, icon: Users, color: "text-sky-dark" },
    { label: "Certificates", count: counts?.certificates, icon: Award, color: "text-primary" },
    { label: "Blog Posts", count: counts?.blogs, icon: FileText, color: "text-cyber-green" },
    { label: "Applications", count: counts?.applications, icon: Mail, color: "text-sky-dark" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl p-6 border border-border card-float">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`h-8 w-8 ${card.color}`} />
              <span className="text-3xl font-heading font-bold text-foreground">{card.count ?? "–"}</span>
            </div>
            <p className="text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
