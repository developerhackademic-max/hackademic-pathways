import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AchievementForm {
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

const emptyForm: AchievementForm = { title: "", description: "", image_url: "", sort_order: 0, is_active: true };

export default function AdminAchievementsPage() {
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementForm>(emptyForm);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: achievements } = useQuery({
    queryKey: ["admin-achievements"],
    queryFn: async () => {
      const { data } = await supabase.from("achievements").select("*").order("sort_order");
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editId) {
        await supabase.from("achievements").update(form).eq("id", editId);
      } else {
        await supabase.from("achievements").insert([form]);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-achievements"] });
      toast({ title: editId ? "Achievement updated" : "Achievement added" });
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("achievements").delete().eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-achievements"] });
      toast({ title: "Achievement deleted" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `achievements/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      setForm({ ...form, image_url: urlData.publicUrl });
    }
    setUploading(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Achievements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setForm(emptyForm); setEditId(null); }}>
              <Plus className="h-4 w-4" /> Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit" : "Add"} Achievement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Image</label>
                <div className="flex gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </div>
                {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />}
              </div>
              <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              <Button onClick={() => save.mutate()} disabled={!form.title || save.isPending} className="w-full">
                {save.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(achievements || []).map((a) => (
          <div key={a.id} className="bg-card rounded-xl border border-border overflow-hidden card-float">
            {a.image_url ? (
              <img src={a.image_url} alt={a.title} className="w-full h-40 object-cover" />
            ) : (
              <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">No image</div>
            )}
            <div className="p-4">
              <h3 className="font-heading font-semibold text-foreground">{a.title}</h3>
              {a.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditId(a.id);
                    setForm({ title: a.title, description: a.description || "", image_url: a.image_url || "", sort_order: a.sort_order || 0, is_active: a.is_active ?? true });
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove.mutate(a.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
