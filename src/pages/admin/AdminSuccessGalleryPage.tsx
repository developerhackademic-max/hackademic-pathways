import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function AdminSuccessGalleryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: items } = useQuery({
    queryKey: ["admin-success-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("success_gallery").select("*").order("sort_order");
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("success_gallery").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-gallery"] });
      toast({ title: "Deleted successfully" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `success-gallery/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    await supabase.from("success_gallery").insert({
      title: title || null,
      description: description || null,
      image_url: urlData.publicUrl,
      sort_order: (items?.length || 0) + 1,
    });
    setTitle("");
    setDescription("");
    setUploading(false);
    queryClient.invalidateQueries({ queryKey: ["admin-success-gallery"] });
    toast({ title: "Image added successfully" });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Glimpse of our Success</h1>

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Add New Image</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={1} />
        </div>
        <label className="cursor-pointer">
          <Button disabled={uploading} className="gap-2" asChild>
            <span>
              <Plus className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items?.map((item) => (
          <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden group relative">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title || "Success"} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="p-3">
              {item.title && <p className="font-semibold text-sm text-foreground">{item.title}</p>}
              {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => deleteMutation.mutate(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
