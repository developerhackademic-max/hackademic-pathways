import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ question: "", answer: "", sort_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: faqs } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("certificate_faqs").select("*").order("sort_order");
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!form.question || !form.answer) return;
    if (editId) {
      await supabase.from("certificate_faqs").update(form).eq("id", editId);
    } else {
      await supabase.from("certificate_faqs").insert([form]);
    }
    toast({ title: editId ? "FAQ Updated" : "FAQ Added" });
    setForm({ question: "", answer: "", sort_order: 0 });
    setEditId(null);
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("certificate_faqs").delete().eq("id", id);
    toast({ title: "FAQ Deleted" });
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
  };

  const handleEdit = (faq: any) => {
    setForm({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order || 0 });
    setEditId(faq.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Certificate FAQs</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ question: "", answer: "", sort_order: 0 }); }} className="gap-2">
          {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add FAQ</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <Input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <Textarea placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} />
          <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-32" />
          <Button onClick={handleSave} className="gap-2"><Check className="h-4 w-4" /> {editId ? "Update" : "Save"}</Button>
        </div>
      )}

      <div className="space-y-3">
        {faqs?.map((faq) => (
          <div key={faq.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(faq)}><Edit2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(faq.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        {(!faqs || faqs.length === 0) && <p className="text-muted-foreground text-center py-8">No FAQs added yet.</p>}
      </div>
    </AdminLayout>
  );
}
