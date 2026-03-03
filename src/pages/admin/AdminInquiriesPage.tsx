import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function AdminInquiriesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: inquiries } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data } = await supabase.from("course_inquiries").select("*, courses(title)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("course_inquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-inquiries"] }); toast({ title: "Deleted" }); },
  });

  return (
    <AdminLayout>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Course Inquiries</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(inquiries || []).map((inq: any) => (
              <tr key={inq.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium">{inq.full_name}</td>
                <td className="p-4 text-muted-foreground">{inq.email}</td>
                <td className="p-4 text-muted-foreground">{inq.phone}</td>
                <td className="p-4 text-muted-foreground">{inq.courses?.title || "General"}</td>
                <td className="p-4 text-muted-foreground">{new Date(inq.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteInquiry.mutate(inq.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
