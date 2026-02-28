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

export default function AdminCoursesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", slug: "", short_description: "", description: "", duration: "", modules: "", brochure_url: "" });
  const [brochureFile, setBrochureFile] = useState<File | null>(null);

  const { data: courses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      let brochure_url = form.brochure_url;
      if (brochureFile) {
        const path = `brochures/${Date.now()}-${brochureFile.name}`;
        const { error: upErr } = await supabase.storage.from("uploads").upload(path, brochureFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        brochure_url = urlData.publicUrl;
      }
      const modules = form.modules ? form.modules.split("\n").filter(Boolean) : [];
      const payload = { ...form, modules: JSON.stringify(modules), brochure_url, is_active: true };
      if (editing) {
        const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setOpen(false);
      resetForm();
      toast({ title: editing ? "Course updated" : "Course created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({ title: "Course deleted" });
    },
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", short_description: "", description: "", duration: "", modules: "", brochure_url: "" });
    setBrochureFile(null);
    setEditing(null);
  };

  const openEdit = (course: any) => {
    const modules = Array.isArray(course.modules) ? (course.modules as string[]).join("\n") : "";
    setForm({ title: course.title, slug: course.slug, short_description: course.short_description || "", description: course.description || "", duration: course.duration || "", modules, brochure_url: course.brochure_url || "" });
    setEditing(course);
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Courses</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Course" : "Add Course"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} required />
              <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              <Input placeholder="Duration (e.g. 3 Months)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              <Input placeholder="Short Description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
              <Textarea placeholder="Full Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <Textarea placeholder="Modules (one per line)" value={form.modules} onChange={(e) => setForm({ ...form, modules: e.target.value })} rows={4} />
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Upload Brochure (PDF)</label>
                <Input type="file" accept=".pdf" onChange={(e) => setBrochureFile(e.target.files?.[0] || null)} />
                {form.brochure_url && <p className="text-xs text-muted-foreground mt-1">Current: {form.brochure_url.split("/").pop()}</p>}
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Duration</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Brochure</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(courses || []).map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium">{c.title}</td>
                <td className="p-4 text-muted-foreground">{c.duration || "–"}</td>
                <td className="p-4">{c.brochure_url ? <a href={c.brochure_url} target="_blank" className="text-primary hover:underline text-xs">Download</a> : "–"}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCourse.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
