import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";

export default function AdminApplicationsPage() {
  const { data: apps } = useQuery({
    queryKey: ["admin-apps"],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("*, courses(title)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <AdminLayout>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Applications</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr>
            <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
          </tr></thead>
          <tbody>
            {(apps || []).map((a: any) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium">{a.full_name}</td>
                <td className="p-4 text-muted-foreground">{a.email}</td>
                <td className="p-4 text-muted-foreground">{a.phone}</td>
                <td className="p-4 text-muted-foreground">{a.courses?.title || "–"}</td>
                <td className="p-4 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
