'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Label, Input, Textarea, FieldHint } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/providers/ToastProvider';
import { apiClient } from '@/lib/api-client';
import type { SiteSettingsData } from '@/lib/data/settings';

const SOCIAL_KEYS = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'] as const;

export default function AdminSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<SiteSettingsData | null>(null);
  const [serviceAreasText, setServiceAreasText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.get<SiteSettingsData>('/api/admin/settings');
        setForm(data);
        setServiceAreasText((data.serviceAreas || []).join(', '));
      } catch {
        toast.error('Unable to load settings');
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        serviceAreas: serviceAreasText.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const updated = await apiClient.patch<SiteSettingsData>('/api/admin/settings', payload);
      setForm(updated);
      toast.success('Settings saved');
    } catch {
      toast.error('Unable to save settings');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !form) {
    return <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-navy-400" /></div>;
  }

  return (
    <div>
      <PageHeader title="Site Settings" description="Global business information used across the public site." />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <section className="rounded-md border border-navy-900/10 bg-white p-6">
          <h2 className="font-display text-lg text-navy-950">Business Information</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="businessName" required>Business Name</Label>
              <Input id="businessName" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone" required>Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email" required>Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="address">Address (optional)</Label>
              <Input id="address" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="mt-5">
            <Label htmlFor="serviceAreas">Service Areas (comma separated)</Label>
            <Input id="serviceAreas" value={serviceAreasText} onChange={(e) => setServiceAreasText(e.target.value)} />
          </div>
          <div className="mt-5">
            <Label htmlFor="footerText">Footer Text</Label>
            <Input id="footerText" value={form.footerText || ''} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
          </div>
        </section>

        <section className="rounded-md border border-navy-900/10 bg-white p-6">
          <h2 className="font-display text-lg text-navy-950">Branding</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" value={form.logo || ''} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
              <FieldHint>Upload your logo in Media Library, then paste the URL here.</FieldHint>
            </div>
            <div>
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input id="favicon" value={form.favicon || ''} onChange={(e) => setForm({ ...form, favicon: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-10 w-14 rounded-sm border border-navy-900/15" />
                <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="h-10 w-14 rounded-sm border border-navy-900/15" />
                <Input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-md border border-navy-900/10 bg-white p-6">
          <h2 className="font-display text-lg text-navy-950">Social Links</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SOCIAL_KEYS.map((key) => (
              <div key={key}>
                <Label htmlFor={key} className="capitalize">{key}</Label>
                <Input
                  id={key}
                  value={form.socialLinks?.[key] || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })}
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-navy-900/10 bg-white p-6">
          <h2 className="font-display text-lg text-navy-950">SEO Defaults</h2>
          <div className="mt-5 space-y-5">
            <div>
              <Label htmlFor="defaultSeoTitle" required>Default SEO Title</Label>
              <Input id="defaultSeoTitle" value={form.defaultSeoTitle} onChange={(e) => setForm({ ...form, defaultSeoTitle: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="defaultSeoDescription" required>Default SEO Description</Label>
              <Textarea id="defaultSeoDescription" rows={3} value={form.defaultSeoDescription} onChange={(e) => setForm({ ...form, defaultSeoDescription: e.target.value })} required />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4" /> {isSaving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
