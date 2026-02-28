import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminTeamPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", designation: "", bio: "", quote: "", is_director: false, linkedin_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: team } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("sort_order");
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || "";
      if (imageFile) {
        const path = `team/${Date.now()}-${imageFile.name}`;
        const { error: upErr } = await supabase.storage.from("uploads").upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
      const payload = { ...form, image_url };
      if (editing) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-team"] }); setOpen(false); resetForm(); toast({ title: "Saved" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("team_members").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-team"] }); toast({ title: "Deleted" }); },
  });

  const resetForm = () => { setForm({ name: "", designation: "", bio: "", quote: "", is_director: false, linkedin_url: "" }); setImageFile(null); setEditing(null); };

  const openEdit = (m: any) => {
    setForm({ name: m.name, designation: m.designation, bio: m.bio || "", quote: m.quote || "", is_director: m.is_director, linkedin_url: m.linkedin_url || "" });
    setEditing(m);
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Team Members</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Member</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
              <Textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
              <Input placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
              <Input placeholder="LinkedIn URL" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Upload Photo</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                {editing?.image_url && <img src={editing.image_url} alt="Current" className="mt-2 w-16 h-16 rounded-full object-cover" />}
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_director} onCheckedChange={(v) => setForm({ ...form, is_director: v })} />
                <span className="text-sm text-foreground">Director / CEO (Special card)</span>
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full">{save.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr>
            <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Designation</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Director</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {(team || []).map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="p-4 text-foreground font-medium flex items-center gap-2">
                  {m.image_url && <img src={m.image_url} className="w-8 h-8 rounded-full object-cover" alt="" />}
                  {m.name}
                </td>
                <td className="p-4 text-muted-foreground">{m.designation}</td>
                <td className="p-4">{m.is_director ? "⭐" : "–"}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteItem.mutate(m.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
