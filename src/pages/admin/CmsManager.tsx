import { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import {
  Save,
  Image as ImageIcon,
  Loader2,
  LayoutTemplate,
  FileText,
  Settings,
  Search,
  CheckCircle2
} from 'lucide-react';
import type { CmsContent, SiteSettings } from '../../types';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { useToast } from '../../components/ui/Toast';

type TabId = 'banner' | 'about' | 'contacts' | 'seo';

const TABS: { id: TabId; label: string; icon: typeof LayoutTemplate }[] = [
  { id: 'banner', label: 'Banner Home', icon: LayoutTemplate },
  { id: 'about', label: 'Sobre Nós', icon: FileText },
  { id: 'contacts', label: 'Contatos & Redes', icon: Settings },
  { id: 'seo', label: 'SEO', icon: Search },
];

export function CmsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('banner');
  const [dirtyTabs, setDirtyTabs] = useState<Set<TabId>>(new Set());
  const { toast } = useToast();

  // Home Banner state
  const [homeBanner, setHomeBanner] = useState<CmsContent>({
    id: 'home_banner', title: '', text: '', imageUrl: '', updatedAt: ''
  });

  // About Page state
  const [aboutPage, setAboutPage] = useState<CmsContent>({
    id: 'about_page', title: '', text: '', imageUrl: '', updatedAt: ''
  });

  // Global Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    id: 'global_settings', phone: '', email: '', address: '',
    facebookUrl: '', instagramUrl: '', metaTitle: '', metaDescription: '',
    corporateName: '', tradeName: '', cnpj: '', updatedAt: ''
  });

  const { refreshSettings } = useSiteConfig();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [homeData, aboutData, settingsData] = await Promise.all([
          cmsService.getById('home_banner'),
          cmsService.getById('about_page'),
          cmsService.getById('global_settings')
        ]);
        if (homeData) setHomeBanner(homeData);
        if (aboutData) setAboutPage(aboutData);
        if (settingsData) setSiteSettings(settingsData as SiteSettings);
      } catch (error) {
        console.error('Error loading CMS data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const markDirty = (tab: TabId) => {
    setDirtyTabs(prev => new Set(prev).add(tab));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      switch (activeTab) {
        case 'banner':
          await cmsService.setContent('home_banner', homeBanner);
          toast('Banner da Home salvo com sucesso!', 'success');
          break;
        case 'about':
          await cmsService.setContent('about_page', aboutPage);
          toast('Página Sobre Nós salva com sucesso!', 'success');
          break;
        case 'contacts':
        case 'seo':
          await cmsService.setContent('global_settings', siteSettings);
          await refreshSettings();
          toast(activeTab === 'contacts' ? 'Contatos salvos com sucesso!' : 'Configurações SEO salvas!', 'success');
          break;
      }
      setDirtyTabs(prev => {
        const next = new Set(prev);
        next.delete(activeTab);
        return next;
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast('Erro ao salvar. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const metaDescLength = (siteSettings.metaDescription || '').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Conteúdo (CMS)</h1>
        <p className="text-sm text-slate-500">Altere textos, imagens e configurações do site público</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDirty = dirtyTabs.has(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isDirty && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* Banner Home */}
          {activeTab === 'banner' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Título do Banner</label>
                <input
                  type="text"
                  value={homeBanner.title || ''}
                  onChange={e => { setHomeBanner({...homeBanner, title: e.target.value}); markDirty('banner'); }}
                  placeholder="Ex: A maior variedade em ultrassons"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
                <p className="text-[10px] text-slate-500 mt-1">Se deixado em branco, o site usará o título padrão.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Texto de Apoio (Subtítulo)</label>
                <textarea
                  rows={3}
                  value={homeBanner.text || ''}
                  onChange={e => { setHomeBanner({...homeBanner, text: e.target.value}); markDirty('banner'); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">URL da Imagem de Fundo</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="url"
                    value={homeBanner.imageUrl || ''}
                    onChange={e => { setHomeBanner({...homeBanner, imageUrl: e.target.value}); markDirty('banner'); }}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                {homeBanner.imageUrl && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-slate-200 max-w-md">
                    <img src={homeBanner.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* About Page */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Título Principal</label>
                <input
                  type="text"
                  value={aboutPage.title || ''}
                  onChange={e => { setAboutPage({...aboutPage, title: e.target.value}); markDirty('about'); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">História / Descrição Completa</label>
                <textarea
                  rows={12}
                  value={aboutPage.text || ''}
                  onChange={e => { setAboutPage({...aboutPage, text: e.target.value}); markDirty('about'); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all custom-scrollbar"
                />
                <p className="text-[10px] text-slate-500 mt-1">Quebras de linha serão preservadas no site.</p>
              </div>
            </div>
          )}

          {/* Contacts & Social */}
          {activeTab === 'contacts' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Razão Social</label>
                  <input type="text" value={siteSettings.corporateName || ''} onChange={e => { setSiteSettings({...siteSettings, corporateName: e.target.value}); markDirty('contacts'); }} placeholder="Ex: F.D FARIAS LTDA" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nome Fantasia</label>
                  <input type="text" value={siteSettings.tradeName || ''} onChange={e => { setSiteSettings({...siteSettings, tradeName: e.target.value}); markDirty('contacts'); }} placeholder="Ex: FD COMERCIO E SERVICOS" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">CNPJ</label>
                  <input type="text" value={siteSettings.cnpj || ''} onChange={e => { setSiteSettings({...siteSettings, cnpj: e.target.value}); markDirty('contacts'); }} placeholder="Ex: 44.539.341/0001-05" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Telefone / WhatsApp</label>
                  <input type="text" value={siteSettings.phone || ''} onChange={e => { setSiteSettings({...siteSettings, phone: e.target.value}); markDirty('contacts'); }} placeholder="Ex: (69) 9312-3438" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">E-mail de Contato</label>
                  <input type="email" value={siteSettings.email || ''} onChange={e => { setSiteSettings({...siteSettings, email: e.target.value}); markDirty('contacts'); }} placeholder="Ex: contato@fdfarias.com.br" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Endereço Físico</label>
                <input type="text" value={siteSettings.address || ''} onChange={e => { setSiteSettings({...siteSettings, address: e.target.value}); markDirty('contacts'); }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Link do Instagram</label>
                  <input type="url" value={siteSettings.instagramUrl || ''} onChange={e => { setSiteSettings({...siteSettings, instagramUrl: e.target.value}); markDirty('contacts'); }} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Link do Facebook</label>
                  <input type="url" value={siteSettings.facebookUrl || ''} onChange={e => { setSiteSettings({...siteSettings, facebookUrl: e.target.value}); markDirty('contacts'); }} placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Título da Página (Meta Title)</label>
                <input
                  type="text"
                  value={siteSettings.metaTitle || ''}
                  onChange={e => { setSiteSettings({...siteSettings, metaTitle: e.target.value}); markDirty('seo'); }}
                  placeholder="Ex: FD Farias - Manutenção de Ultrassom"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
                <p className="text-[10px] text-slate-500 mt-1">Aparece na aba do navegador e no título dos resultados do Google.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Descrição (Meta Description)</label>
                <textarea
                  rows={3}
                  value={siteSettings.metaDescription || ''}
                  onChange={e => { setSiteSettings({...siteSettings, metaDescription: e.target.value}); markDirty('seo'); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-500">Texto que resume seu site nos resultados do Google.</p>
                  <span className={`text-[10px] font-bold ${
                    metaDescLength === 0 ? 'text-slate-400' :
                    metaDescLength <= 160 ? 'text-emerald-600' :
                    metaDescLength <= 200 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {metaDescLength}/160
                  </span>
                </div>
              </div>

              {/* SEO Preview */}
              {(siteSettings.metaTitle || siteSettings.metaDescription) && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preview no Google</p>
                  <div className="space-y-0.5">
                    <p className="text-blue-700 text-base font-medium truncate">{siteSettings.metaTitle || 'Título da página'}</p>
                    <p className="text-emerald-700 text-xs">fdfarias.com.br</p>
                    <p className="text-slate-600 text-xs line-clamp-2">{siteSettings.metaDescription || 'Descrição da página...'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unified Save Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {dirtyTabs.has(activeTab) ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-medium text-amber-600">Alterações não salvas</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tudo salvo</span>
              </>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !dirtyTabs.has(activeTab)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
