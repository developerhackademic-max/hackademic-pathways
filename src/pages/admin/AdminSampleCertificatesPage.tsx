import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X, Check, Upload } from "lucide-react";

export default function AdminSampleCertificatesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", image_url: "", description: "", sort_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: certs } = useQuery({
    queryKey: ["admin-sample-certs"],
    queryFn: async () => {
      const { data } = await supabase.from("sample_certificates").select("*").order("sort_order");
      return data || [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `sample-certificates/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) { toast({ title: "Upload Error", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    setForm({ ...form, image_url: urlData.publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.image_url) return;
    if (editId) {
      await supabase.from("sample_certificates").update(form).eq("id", editId);
    } else {
      await supabase.from("sample_certificates").insert([form]);
    }
    toast({ title: editId ? "Updated" : "Added" });
    setForm({ title: "", image_url: "", description: "", sort_order: 0 });
    setEditId(null);
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-sample-certs"] });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("sample_certificates").delete().eq("id", id);
    toast({ title: "Deleted" });
    qc.invalidateQueries({ queryKey: ["admin-sample-certs"] });
  };

  const handleEdit = (cert: any) => {
    setForm({ title: cert.title, image_url: cert.image_url, description: cert.description || "", sort_order: cert.sort_order || 0 });
    setEditId(cert.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Sample Certificates</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: "", image_url: "", description: "", sort_order: 0 }); }} className="gap-2">
          {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Sample</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3 items-center">
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="flex-1" />
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <Button type="button" variant="outline" className="gap-2" disabled={uploading} asChild><span><Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload"}</span></Button>
            </label>
          </div>
          {form.image_url && <img src={form.image_url} alt="Preview" className="h-32 rounded-lg object-cover" />}
          <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-32" />
          <Button onClick={handleSave} className="gap-2"><Check className="h-4 w-4" /> {editId ? "Update" : "Save"}</Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs?.map((cert) => (
          <div key={cert.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <img src={cert.image_url} alt={cert.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{cert.title}</h3>
              {cert.description && <p className="text-sm text-muted-foreground mt-1">{cert.description}</p>}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(cert)}><Edit2 className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(cert.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
        {(!certs || certs.length === 0) && <p className="text-muted-foreground text-center py-8 col-span-full">No sample certificates added yet.</p>}
      </div>
    </AdminLayout>
  );
}
