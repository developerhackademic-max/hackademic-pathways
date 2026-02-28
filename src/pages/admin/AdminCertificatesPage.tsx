import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCertificatesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ certificate_id: "", student_name: "", course: "", issue_date: "" });

  const { data: certs } = useQuery({
    queryKey: ["admin-certs"],
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("certificates").insert([form]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-certs"] }); setOpen(false); setForm({ certificate_id: "", student_name: "", course: "", issue_date: "" }); toast({ title: "Certificate added" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("certificates").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-certs"] }); toast({ title: "Deleted" }); },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Certificates</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Certificate</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Certificate</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <Input placeholder="Certificate ID" value={form.certificate_id} onChange={(e) => setForm({ ...form, certificate_id: e.target.value })} required />
              <Input placeholder="Student Name" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} required />
              <Input placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required />
              <Input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} required />
              <Button type="submit" disabled={save.isPending} className="w-full">{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr>
            <th className="text-left p-4 font-medium text-muted-foreground">Cert ID</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Issue Date</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {(certs || []).map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-4 text-foreground font-mono">{c.certificate_id}</td>
                <td className="p-4 text-foreground">{c.student_name}</td>
                <td className="p-4 text-muted-foreground">{c.course}</td>
                <td className="p-4 text-muted-foreground">{c.issue_date}</td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
