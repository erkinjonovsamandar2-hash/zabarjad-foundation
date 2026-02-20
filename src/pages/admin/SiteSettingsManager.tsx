import { useState } from "react";
import { useData, SiteSettings } from "@/context/DataContext";
import { Save, Globe, MapPin, MessageSquare } from "lucide-react";

const SiteSettingsManager = () => {
  const { siteSettings, updateSiteSettings } = useData();
  const [settings, setSettings] = useState<SiteSettings>(siteSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await updateSiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sayt Sozlamalari</h1>
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
          <Save className="h-4 w-4" /> {saved ? "Saqlandi ✓" : "Saqlash"}
        </button>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-800">Bosh sahifa (Hero)</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shior (motto)</label>
            <input value={settings.hero.motto} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, motto: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qo'shimcha matn</label>
            <textarea value={settings.hero.subtitle} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tugma matni</label>
            <input value={settings.hero.cta_text} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, cta_text: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-800">Footer (pastki qism)</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input value={settings.footer.phone} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, phone: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={settings.footer.email} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, email: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
            <input value={settings.footer.address} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, address: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telegram link</label>
            <input value={settings.footer.telegram} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, telegram: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram link</label>
            <input value={settings.footer.instagram} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, instagram: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-800">Google Maps</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={settings.map.enabled} onChange={(e) => setSettings({ ...settings, map: { ...settings.map, enabled: e.target.checked } })} className="rounded border-gray-300 text-amber-500 focus:ring-amber-200" />
            Xaritani ko'rsatish
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
            <input value={settings.map.title} onChange={(e) => setSettings({ ...settings, map: { ...settings.map, title: e.target.value } })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
            <input value={settings.map.embed_url} onChange={(e) => setSettings({ ...settings, map: { ...settings.map, embed_url: e.target.value } })} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none" />
            <p className="text-xs text-gray-400 mt-1">Google Maps → Share → Embed a map → src="..." ichidagi URL ni nusxalang</p>
          </div>
          {settings.map.embed_url && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <iframe src={settings.map.embed_url} width="100%" height="200" style={{ border: 0 }} loading="lazy" allowFullScreen />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
