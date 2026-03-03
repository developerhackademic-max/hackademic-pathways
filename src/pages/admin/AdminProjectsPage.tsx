import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", course_id: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: projects } = useQuery({ queryKey: ["admin-projects"], queryFn: async () => { const { data } = await supabase.from("course_projects").select("*, courses(title)").order("sort_order"); return data || []; } });
  const { data: courses } = useQuery({ queryKey: ["courses-list"], queryFn: async () => { const { data } = await supabase.from("courses").select("id, title").order("title"); return data || []; } });

  const save = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || null;
      if (imageFile) {
        const path = `projects/${Date.now()}-${imageFile.name}`;
        await supabase.storage.from("uploads").upload(path, imageFile);
        const { data } = supabase.storage.from("uploads").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const payload = { ...form, image_url, course_id: form.course_id || null, is_active: true };
      if (editing) {
        const { error } = await supabase.from("course_projects").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("course_projects").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); setOpen(false); resetForm(); toast({ title: editing ? "Updated" : "Created" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("course_projects").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); toast({ title: "Deleted" }); },
  });

  const resetForm = () => { setForm({ title: "", description: "", course_id: "" }); setImageFile(null); setEditing(null); };

  const openEdit = (p: any) => {
    setForm({ title: p.title, description: p.description || "", course_id: p.course_id || "" });
    setEditing(p); setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Course Projects</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Project</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Project</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <Input placeholder="Project Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
                <option value="">All Courses</option>
                {(courses || []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Project Image</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-4 font-medium text-muted-foreground">Title</th><th className="text-left p-4 font-medium text-muted-foreground">Course</th><th className="text-right p-4 font-medium text-muted-foreground">Actions</th></tr></thead>
          <tbody>
            {(projects || []).map((p: any) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium">{p.title}</td>
                <td className="p-4 text-muted-foreground">{p.courses?.title || "General"}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteProject.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
