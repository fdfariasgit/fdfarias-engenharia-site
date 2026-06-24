import { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { 
  Save, 
  Image as ImageIcon, 
  Loader2,
  LayoutTemplate,
  FileText,
  Settings,
  Search
} from 'lucide-react';
import type { CmsContent, SiteSettings } from '../../types';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { useToast } from '../../components/ui/Toast';

export function CmsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Home Banner state
  const [homeBanner, setHomeBanner] = useState<CmsContent>({
    id: 'home_banner',
    title: '',
    text: '',
    imageUrl: '',
    updatedAt: ''
  });

  // About Page state
  const [aboutPage, setAboutPage] = useState<CmsContent>({
    id: 'about_page',
    title: '',
    text: '',
    imageUrl: '', // maybe not used, but kept for consistency
    updatedAt: ''
  });

  // Global Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    id: 'global_settings',
    phone: '',
    email: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    metaTitle: '',
    metaDescription: '',
    corporateName: '',
    tradeName: '',
    cnpj: '',
    updatedAt: ''
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

  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsService.setContent('home_banner', homeBanner);
      toast('Banner da Home salvo com sucesso!', 'success');
    } catch (error) {
      console.error('Error saving home banner:', error);
      toast('Erro ao salvar.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsService.setContent('about_page', aboutPage);
      toast('Página Sobre Nós salva com sucesso!', 'success');
    } catch (error) {
      console.error('Error saving about page:', error);
      toast('Erro ao salvar.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsService.setContent('global_settings', siteSettings);
      await refreshSettings();
      toast('Configurações Globais salvas com sucesso!', 'success');
    } catch (error) {
      console.error('Error saving global settings:', error);
      toast('Erro ao salvar configurações.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Conteúdo do Site (CMS)</h1>
        <p className="text-sm text-slate-500">Altere textos e imagens principais do site público</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Home Banner Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Banner Principal (Home)</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveHome} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Título do Banner</label>
                <input
                  type="text"
                  value={homeBanner.title || ''}
                  onChange={e => setHomeBanner({...homeBanner, title: e.target.value})}
                  placeholder="Ex: A maior variedade em ultrassons"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">Se deixado em branco, o site usará o título padrão.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Texto de Apoio (Subtítulo)</label>
                <textarea
                  rows={3}
                  value={homeBanner.text || ''}
                  onChange={e => setHomeBanner({...homeBanner, text: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">URL da Imagem de Fundo</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="url"
                    value={homeBanner.imageUrl || ''}
                    onChange={e => setHomeBanner({...homeBanner, imageUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                {homeBanner.imageUrl && (
                  <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-slate-200 relative group">
                    <img src={homeBanner.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  Salvar Home
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* About Page Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Texto Sobre Nós</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveAbout} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Título Principal</label>
                <input
                  type="text"
                  value={aboutPage.title || ''}
                  onChange={e => setAboutPage({...aboutPage, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">História / Descrição Completa</label>
                <textarea
                  rows={10}
                  value={aboutPage.text || ''}
                  onChange={e => setAboutPage({...aboutPage, text: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm custom-scrollbar"
                />
                <p className="text-[10px] text-slate-500 mt-1">Quebras de linha serão preservadas no site.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  Salvar Sobre
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Contatos e Redes Sociais</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Razão Social</label>
                  <input
                    type="text"
                    value={siteSettings.corporateName || ''}
                    onChange={e => setSiteSettings({...siteSettings, corporateName: e.target.value})}
                    placeholder="Ex: F.D FARIAS LTDA"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nome Fantasia</label>
                  <input
                    type="text"
                    value={siteSettings.tradeName || ''}
                    onChange={e => setSiteSettings({...siteSettings, tradeName: e.target.value})}
                    placeholder="Ex: FD COMERCIO E SERVICOS"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">CNPJ</label>
                  <input
                    type="text"
                    value={siteSettings.cnpj || ''}
                    onChange={e => setSiteSettings({...siteSettings, cnpj: e.target.value})}
                    placeholder="Ex: 44.539.341/0001-05"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={siteSettings.phone || ''}
                    onChange={e => setSiteSettings({...siteSettings, phone: e.target.value})}
                    placeholder="Ex: (69) 9312-3438 / (69) 9965-0890"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">E-mail de Contato</label>
                  <input
                    type="email"
                    value={siteSettings.email || ''}
                    onChange={e => setSiteSettings({...siteSettings, email: e.target.value})}
                    placeholder="Ex: contato@empresa.com"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Dica: se possível, crie um e-mail com domínio próprio (ex: contato@fdcomercioeservicos.com.br) para o site.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Endereço Físico</label>
                <input
                  type="text"
                  value={siteSettings.address || ''}
                  onChange={e => setSiteSettings({...siteSettings, address: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Link do Instagram</label>
                  <input
                    type="url"
                    value={siteSettings.instagramUrl || ''}
                    onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Link do Facebook</label>
                  <input
                    type="url"
                    value={siteSettings.facebookUrl || ''}
                    onChange={e => setSiteSettings({...siteSettings, facebookUrl: e.target.value})}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  Salvar Contatos
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">SEO Global (Google)</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Título da Página (Meta Title)</label>
                <input
                  type="text"
                  value={siteSettings.metaTitle || ''}
                  onChange={e => setSiteSettings({...siteSettings, metaTitle: e.target.value})}
                  placeholder="Ex: FD Farias - Manutenção de Ultrassom"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">Aparece na aba do navegador e no título dos resultados do Google.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Descrição (Meta Description)</label>
                <textarea
                  rows={3}
                  value={siteSettings.metaDescription || ''}
                  onChange={e => setSiteSettings({...siteSettings, metaDescription: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">O pequeno texto que resume seu site nos resultados de busca do Google (150-160 caracteres ideal).</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  Salvar SEO
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
