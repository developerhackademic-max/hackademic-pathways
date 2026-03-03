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

export default function AdminTrainersPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", designation: "", bio: "", linkedin_url: "", experience_years: "", specialization: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: trainers } = useQuery({ queryKey: ["admin-trainers"], queryFn: async () => { const { data } = await supabase.from("expert_trainers").select("*").order("sort_order"); return data || []; } });

  const save = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || null;
      if (imageFile) {
        const path = `trainers/${Date.now()}-${imageFile.name}`;
        await supabase.storage.from("uploads").upload(path, imageFile);
        const { data } = supabase.storage.from("uploads").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const payload = { ...form, image_url, experience_years: form.experience_years ? parseInt(form.experience_years) : null, is_active: true };
      if (editing) {
        const { error } = await supabase.from("expert_trainers").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("expert_trainers").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-trainers"] }); setOpen(false); resetForm(); toast({ title: editing ? "Updated" : "Created" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteTrainer = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("expert_trainers").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-trainers"] }); toast({ title: "Deleted" }); },
  });

  const resetForm = () => { setForm({ name: "", designation: "", bio: "", linkedin_url: "", experience_years: "", specialization: "" }); setImageFile(null); setEditing(null); };

  const openEdit = (t: any) => {
    setForm({ name: t.name, designation: t.designation, bio: t.bio || "", linkedin_url: t.linkedin_url || "", experience_years: t.experience_years?.toString() || "", specialization: t.specialization || "" });
    setEditing(t); setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Expert Trainers</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Trainer</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Trainer</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Designation *" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
              <Input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
              <Input placeholder="Experience (years)" type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
              <Textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
              <Input placeholder="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Photo</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-4 font-medium text-muted-foreground">Name</th><th className="text-left p-4 font-medium text-muted-foreground">Designation</th><th className="text-left p-4 font-medium text-muted-foreground">Experience</th><th className="text-right p-4 font-medium text-muted-foreground">Actions</th></tr></thead>
          <tbody>
            {(trainers || []).map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium">{t.name}</td>
                <td className="p-4 text-muted-foreground">{t.designation}</td>
                <td className="p-4 text-muted-foreground">{t.experience_years ? `${t.experience_years} yrs` : "–"}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteTrainer.mutate(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
