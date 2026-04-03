'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────────
interface SocialLinks { facebook: string; instagram: string; linkedin: string; }
interface AboutValue { title: string; description: string; }
interface About { intro: string; values: AboutValue[]; }
interface Service { title: string; description: string; }
interface Project { title: string; description: string; location: string; image: string; }
interface Testimonial { name: string; location: string; quote: string; }

interface SiteConfig {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  tagline: string;
  subtagline: string;
  social: SocialLinks;
  about: About;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  projectTypes: string[];
}

type Tab = 'settings' | 'services' | 'projects' | 'testimonials';

// ── Helpers ────────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatusBanner({ status }: { status: { type: 'success' | 'error'; msg: string } | null }) {
  if (!status) return null;
  const cls = status.type === 'success'
    ? 'bg-green-50 border border-green-300 text-green-800'
    : 'bg-red-50 border border-red-300 text-red-800';
  return <div className={`${cls} rounded-lg px-4 py-3 text-sm mb-4`}>{status.msg}</div>;
}

function SaveButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
    >
      {loading ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-y"
      />
    </div>
  );
}

// ── Site Settings Tab ─────────────────────────────────────────────────────
function SettingsTab({ config, setConfig, onSave, saving, status }: {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
  onSave: () => void;
  saving: boolean;
  status: { type: 'success' | 'error'; msg: string } | null;
}) {
  const set = (field: keyof SiteConfig) => (v: string) =>
    setConfig((c) => c ? { ...c, [field]: v } : c);
  const setSocial = (field: keyof SocialLinks) => (v: string) =>
    setConfig((c) => c ? { ...c, social: { ...c.social, [field]: v } } : c);
  const setAbout = (field: keyof About) => (v: string) =>
    setConfig((c) => c ? { ...c, about: { ...c.about, [field]: v } } : c);

  return (
    <div className="space-y-6">
      <StatusBanner status={status} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Company Name" value={config.companyName} onChange={set('companyName')} />
        <Input label="Email" value={config.email} onChange={set('email')} type="email" />
        <Input label="Phone" value={config.phone} onChange={set('phone')} />
        <Input label="Address" value={config.address} onChange={set('address')} />
        <Input label="Tagline" value={config.tagline} onChange={set('tagline')} />
        <Input label="Sub-tagline" value={config.subtagline} onChange={set('subtagline')} />
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Facebook" value={config.social.facebook} onChange={setSocial('facebook')} />
          <Input label="Instagram" value={config.social.instagram} onChange={setSocial('instagram')} />
          <Input label="LinkedIn" value={config.social.linkedin} onChange={setSocial('linkedin')} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">About Section</h3>
        <Textarea label="Introduction" value={config.about.intro} onChange={setAbout('intro')} rows={4} />
      </div>

      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={onSave} />
      </div>
    </div>
  );
}

// ── Services Tab ──────────────────────────────────────────────────────────
function ServicesTab({ config, setConfig, onSave, saving, status }: {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
  onSave: () => void;
  saving: boolean;
  status: { type: 'success' | 'error'; msg: string } | null;
}) {
  const update = (i: number, field: keyof Service, v: string) =>
    setConfig((c) => { if (!c) return c; const s = [...c.services]; s[i] = { ...s[i], [field]: v }; return { ...c, services: s }; });
  const add = () =>
    setConfig((c) => c ? { ...c, services: [...c.services, { title: '', description: '' }] } : c);
  const remove = (i: number) =>
    setConfig((c) => { if (!c) return c; const s = [...c.services]; s.splice(i, 1); return { ...c, services: s }; });

  return (
    <div className="space-y-4">
      <StatusBanner status={status} />
      {config.services.map((svc, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Service {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
          </div>
          <Input label="Title" value={svc.title} onChange={(v) => update(i, 'title', v)} />
          <Textarea label="Description" value={svc.description} onChange={(v) => update(i, 'description', v)} />
        </div>
      ))}
      <button onClick={add} className="w-full border-2 border-dashed border-gray-300 hover:border-yellow-400 text-gray-500 hover:text-yellow-600 py-3 rounded-lg text-sm font-medium transition-colors">
        + Add Service
      </button>
      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={onSave} />
      </div>
    </div>
  );
}

// ── Projects Tab ──────────────────────────────────────────────────────────
function ProjectsTab({ config, setConfig, onSave, saving, status }: {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
  onSave: () => void;
  saving: boolean;
  status: { type: 'success' | 'error'; msg: string } | null;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const token = getToken();

  const update = (i: number, field: keyof Project, v: string) =>
    setConfig((c) => { if (!c) return c; const p = [...c.projects]; p[i] = { ...p[i], [field]: v }; return { ...c, projects: p }; });
  const add = () =>
    setConfig((c) => c ? { ...c, projects: [...c.projects, { title: '', description: '', location: '', image: '' }] } : c);
  const remove = (i: number) =>
    setConfig((c) => { if (!c) return c; const p = [...c.projects]; p.splice(i, 1); return { ...c, projects: p }; });

  async function handleUpload(i: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(i);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) update(i, 'image', data.path);
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-4">
      <StatusBanner status={status} />
      {config.projects.map((proj, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Project {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Title" value={proj.title} onChange={(v) => update(i, 'title', v)} />
            <Input label="Location" value={proj.location} onChange={(v) => update(i, 'location', v)} />
          </div>
          <Textarea label="Description" value={proj.description} onChange={(v) => update(i, 'description', v)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex gap-2 items-center">
              <input type="text" value={proj.image} onChange={(e) => update(i, 'image', e.target.value)}
                placeholder="/images/projects/photo.jpg"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg transition-colors">
                {uploading === i ? 'Uploading…' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(i, e)} />
              </label>
            </div>
            {proj.image && <img src={proj.image} alt="preview" className="mt-2 h-20 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />}
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full border-2 border-dashed border-gray-300 hover:border-yellow-400 text-gray-500 hover:text-yellow-600 py-3 rounded-lg text-sm font-medium transition-colors">
        + Add Project
      </button>
      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={onSave} />
      </div>
    </div>
  );
}

// ── Testimonials Tab ───────────────────────────────────────────────────────
function TestimonialsTab({ config, setConfig, onSave, saving, status }: {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
  onSave: () => void;
  saving: boolean;
  status: { type: 'success' | 'error'; msg: string } | null;
}) {
  const update = (i: number, field: keyof Testimonial, v: string) =>
    setConfig((c) => { if (!c) return c; const t = [...c.testimonials]; t[i] = { ...t[i], [field]: v }; return { ...c, testimonials: t }; });
  const add = () =>
    setConfig((c) => c ? { ...c, testimonials: [...c.testimonials, { name: '', location: '', quote: '' }] } : c);
  const remove = (i: number) =>
    setConfig((c) => { if (!c) return c; const t = [...c.testimonials]; t.splice(i, 1); return { ...c, testimonials: t }; });

  return (
    <div className="space-y-4">
      <StatusBanner status={status} />
      {config.testimonials.map((t, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Testimonial {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Name" value={t.name} onChange={(v) => update(i, 'name', v)} />
            <Input label="Location" value={t.location} onChange={(v) => update(i, 'location', v)} />
          </div>
          <Textarea label="Quote" value={t.quote} onChange={(v) => update(i, 'quote', v)} rows={3} />
        </div>
      ))}
      <button onClick={add} className="w-full border-2 border-dashed border-gray-300 hover:border-yellow-400 text-gray-500 hover:text-yellow-600 py-3 rounded-lg text-sm font-medium transition-colors">
        + Add Testimonial
      </button>
      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={onSave} />
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('settings');
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  }, [router]);

  // Load content on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/admin'); return; }
    fetch('/api/admin/content', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then((data) => { if (data?.config) setConfig(data.config); })
      .catch(() => setStatus({ type: 'error', msg: 'Failed to load content' }))
      .finally(() => setLoading(false));
  }, [router, logout]);

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.message || 'Saved successfully!' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Save failed' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Connection error — please try again' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 6000);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'settings', label: 'Site Settings' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading content…</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">Failed to load config. <button onClick={logout} className="underline">Log out</button></div>
      </div>
    );
  }

  const tabProps = { config, setConfig, onSave: handleSave, saving, status };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-gray-900">R Kay Construction — Admin</h1>
          <p className="text-xs text-gray-500">Changes take ~30 seconds to go live after saving</p>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-800">Log out</button>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200 px-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setStatus(null); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'border-yellow-500 text-yellow-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'settings' && <SettingsTab {...tabProps} />}
        {tab === 'services' && <ServicesTab {...tabProps} />}
        {tab === 'projects' && <ProjectsTab {...tabProps} />}
        {tab === 'testimonials' && <TestimonialsTab {...tabProps} />}
      </main>
    </div>
  );
}
