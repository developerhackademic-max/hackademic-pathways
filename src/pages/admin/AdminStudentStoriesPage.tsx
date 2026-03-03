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

export default function AdminStudentStoriesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ student_name: "", designation: "", company: "", testimonial: "", video_url: "", course_id: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: stories } = useQuery({ queryKey: ["admin-stories"], queryFn: async () => { const { data } = await supabase.from("student_stories").select("*, courses(title)").order("sort_order"); return data || []; } });
  const { data: courses } = useQuery({ queryKey: ["courses-list"], queryFn: async () => { const { data } = await supabase.from("courses").select("id, title").order("title"); return data || []; } });

  const save = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || null;
      if (imageFile) {
        const path = `stories/${Date.now()}-${imageFile.name}`;
        await supabase.storage.from("uploads").upload(path, imageFile);
        const { data } = supabase.storage.from("uploads").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const payload = { ...form, image_url, course_id: form.course_id || null, is_active: true };
      if (editing) {
        const { error } = await supabase.from("student_stories").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("student_stories").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-stories"] }); setOpen(false); resetForm(); toast({ title: editing ? "Updated" : "Created" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteStory = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("student_stories").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-stories"] }); toast({ title: "Deleted" }); },
  });

  const resetForm = () => { setForm({ student_name: "", designation: "", company: "", testimonial: "", video_url: "", course_id: "" }); setImageFile(null); setEditing(null); };

  const openEdit = (s: any) => {
    setForm({ student_name: s.student_name, designation: s.designation || "", company: s.company || "", testimonial: s.testimonial || "", video_url: s.video_url || "", course_id: s.course_id || "" });
    setEditing(s); setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Student Stories</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Story</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Student Story</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <Input placeholder="Student Name *" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} required />
              <Input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Textarea placeholder="Testimonial" value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} rows={3} />
              <Input placeholder="Video URL (YouTube)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
              <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
                <option value="">All Courses</option>
                {(courses || []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Student Photo</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-4 font-medium text-muted-foreground">Student</th><th className="text-left p-4 font-medium text-muted-foreground">Course</th><th className="text-left p-4 font-medium text-muted-foreground">Company</th><th className="text-right p-4 font-medium text-muted-foreground">Actions</th></tr></thead>
          <tbody>
            {(stories || []).map((s: any) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium">{s.student_name}</td>
                <td className="p-4 text-muted-foreground">{s.courses?.title || "General"}</td>
                <td className="p-4 text-muted-foreground">{s.company || "–"}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteStory.mutate(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
