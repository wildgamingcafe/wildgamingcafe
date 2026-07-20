import { Settings, Server } from "lucide-react";
import SettingsForm from "@/components/admin/SettingsForm";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
  const initialData = data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">System Settings</h1>
          <p className="text-text-secondary">Configure cafe preferences, contact details, and database connections.</p>
        </div>
      </div>

      <div className="bg-surface-100 border border-border rounded-lg p-8 mb-8">
        <div className="flex items-start gap-4 p-4 bg-white/5 border border-border rounded-md">
          <Server className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-bold mb-1">Database Configuration</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Currently running in Production Mode. 
              Connected to remote Supabase PostgreSQL Database.
            </p>
          </div>
        </div>
      </div>

      <SettingsForm initialData={initialData} />
    </div>
  );
}
