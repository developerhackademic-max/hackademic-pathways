import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const settingKeys = [
  { key: "about_us", label: "About Us" },
  { key: "mission", label: "Mission" },
  { key: "vision", label: "Vision" },
  { key: "why_hackademic", label: "Why Hackademic" },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value || ""));
      return map;
    },
  });

  useEffect(() => {
    if (settings) setValues(settings);
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(values)) {
        await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-settings"] }); toast({ title: "Settings saved" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <AdminLayout>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Site Settings</h1>
      <div className="bg-card rounded-xl border border-border p-6 space-y-6 max-w-2xl">
        {settingKeys.map((s) => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-foreground mb-2">{s.label}</label>
            <Textarea
              value={values[s.key] || ""}
              onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
              rows={4}
            />
          </div>
        ))}
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </AdminLayout>
  );
}
