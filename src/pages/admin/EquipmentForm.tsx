import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { taxonomyService } from '../../services/taxonomyService';
import type { Equipment, TaxonomyItem } from '../../types';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Upload, 
  Trash2, 
  FileText, 
  Settings,
  X
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export function EquipmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Taxonomy states
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [brands, setBrands] = useState<TaxonomyItem[]>([]);


  // Configurações do Cloudinary (lê do env ou do localStorage)
  const [cloudName, setCloudName] = useState(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || localStorage.getItem('cloudinary_cloud_name') || '');
  const [uploadPreset, setUploadPreset] = useState(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || localStorage.getItem('cloudinary_upload_preset') || '');
  const [showConfig, setShowConfig] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>({
    name: '',
    brand: '',
    category: '',
    tagline: '',
    description: '',
    imageUrl: '',
    pdfUrl: '',
    gallery: []
  });

  // Imagens consolidadas (imageUrl + gallery)
  const [images, setImages] = useState<string[]>([]);
  
  // Status de uploads locais
  const [uploadingImages, setUploadingImages] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const taxData = await taxonomyService.getAll();
        
        // Auto-initialize if empty
        if (taxData.length === 0) {
          await taxonomyService.initializeDefaults();
          const refreshed = await taxonomyService.getAll();
          setCategories(refreshed.filter(t => t.type === 'category'));
          setBrands(refreshed.filter(t => t.type === 'brand'));
        } else {
          setCategories(taxData.filter(t => t.type === 'category'));
          setBrands(taxData.filter(t => t.type === 'brand'));
        }

        if (isEditing && id) {
          await loadEquipment(id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load taxonomy', err);
        setLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  const loadEquipment = async (equipmentId: string) => {
    try {
      const data = await equipmentService.getById(equipmentId);
      if (data) {
        setFormData({
          name: data.name,
          brand: data.brand,
          category: data.category,
          tagline: data.tagline || '',
          description: data.description,
          imageUrl: data.imageUrl,
          pdfUrl: data.pdfUrl || '',
          gallery: data.gallery || []
        });

        // Junta a imagem principal com a galeria para gerenciar tudo no mesmo painel
        const allImages = data.imageUrl ? [data.imageUrl, ...(data.gallery || [])] : [];
        setImages(allImages);
      } else {
        setError('Equipamento não encontrado.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar equipamento.');
    } finally {
      setLoading(false);
    }
  };

  // Upload para Cloudinary usando XMLHttpRequest (para termos a barra de progresso)
  const handleImageUpload = async (files: FileList) => {
    if (!cloudName || !uploadPreset) {
      setError('Configure as credenciais do Cloudinary na barra lateral para fazer upload de imagens.');
      setShowConfig(true);
      return;
    }

    setError('');
    const fileList = Array.from(files);

    for (const file of fileList) {
      // Gerar ID temporário para a barra de progresso
      const tempId = Math.random().toString(36).substring(7);
      setUploadingImages(prev => [...prev, { id: tempId, name: file.name, progress: 0 }]);

      try {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);

        const uploadPromise = new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentage = Math.round((e.loaded * 100) / e.total);
              setUploadingImages(prev =>
                prev.map(img => img.id === tempId ? { ...img, progress: percentage } : img)
              );
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const res = JSON.parse(xhr.responseText);
              resolve(res.secure_url);
            } else {
              reject(new Error('Erro no upload para o Cloudinary'));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Erro de rede')));
          xhr.open('POST', url, true);
          xhr.send(fd);
        });

        const secureUrl = await uploadPromise;
        setImages(prev => [...prev, secureUrl]);
      } catch (err) {
        console.error(err);
        setError(`Falha ao fazer upload da imagem "${file.name}". Verifique se o preset está correto.`);
      } finally {
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));
      }
    }
  };

  // Upload para Cloudinary (PDFs/Documentos)
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setError('Configure as credenciais do Cloudinary na barra lateral para fazer upload de PDFs.');
      setShowConfig(true);
      return;
    }

    setPdfUploading(true);
    setPdfProgress(0);
    setError('');

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            setPdfProgress(percentage);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            resolve(res.secure_url);
          } else {
            reject(new Error('Erro no upload do PDF para o Cloudinary'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Erro de rede')));
        xhr.open('POST', url, true);
        xhr.send(fd);
      });

      const secureUrl = await uploadPromise;
      setFormData(prev => ({ ...prev, pdfUrl: secureUrl }));
    } catch (err) {
      console.error(err);
      setError(`Falha ao enviar o PDF "${file.name}". Verifique se o seu preset do Cloudinary permite o envio de outros formatos além de imagem.`);
    } finally {
      setPdfUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const makeCoverImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const selected = updated.splice(index, 1)[0];
      updated.unshift(selected);
      return updated;
    });
  };

  const handleAddExternalUrl = () => {
    const url = prompt('Cole aqui a URL da imagem externa:');
    if (url) {
      if (url.trim().startsWith('http://') || url.trim().startsWith('https://')) {
        setImages(prev => [...prev, url.trim()]);
      } else {
        toast('Por favor, insira uma URL válida que comece com http:// ou https://', 'warning');
      }
    }
  };

  const handleSaveConfig = () => {
    localStorage.setItem('cloudinary_cloud_name', cloudName);
    localStorage.setItem('cloudinary_upload_preset', uploadPreset);
    setShowConfig(false);
    toast('Configurações salvas localmente!', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (images.length === 0) {
      setError('Adicione pelo menos uma imagem para o equipamento.');
      setSaving(false);
      return;
    }

    const finalData = {
      ...formData,
      imageUrl: images[0],
      gallery: images.slice(1)
    };

    try {
      if (isEditing && id) {
        await equipmentService.update(id, finalData);
      } else {
        await equipmentService.add(finalData);
      }
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'already-exists') {
        // Ocorre quando o Firebase tenta reenviar a requisição após sucesso anterior (retry de rede)
        navigate('/admin');
      } else {
        setError('Erro ao salvar equipamento no banco de dados. Verifique sua conexão.');
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <span className="text-slate-500 font-medium">Carregando dados do equipamento...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Header Estilo Shopify */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? formData.name || 'Editar Equipamento' : 'Novo Equipamento'}
            </h1>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Atualize as fotos e especificações' : 'Crie um novo produto no catálogo'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/admin" className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium text-sm">
            Cancelar
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Grid de 2 Colunas do Shopify */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal (Esquerda - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Informações Básicas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Informações Básicas</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nome do Equipamento</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 outline-none transition-shadow"
                placeholder="Ex: Mindray Resona I9"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Descrição</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 outline-none transition-shadow leading-relaxed"
                placeholder="Escreva detalhes técnicos, transdutores inclusos, diferenciais e estado de conservação do equipamento..."
              />
            </div>
          </div>

          {/* Card 2: Mídia (Shopify-Style Upload) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Mídia</h3>
                <p className="text-xs text-slate-500 mt-0.5">A primeira imagem será usada como capa nas listagens.</p>
              </div>
              <button 
                type="button"
                onClick={handleAddExternalUrl}
                className="text-xs font-bold text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Adicionar URL externa
              </button>
            </div>

            {/* Input de arquivo escondido */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            />

            {/* Drag & Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-slate-400 mb-3" />
              <span className="text-sm font-medium text-slate-700">Arraste imagens ou clique para fazer upload</span>
              <span className="text-xs text-slate-500 mt-1">Formatos aceitos: PNG, JPG, JPEG, WEBP</span>
            </div>

            {/* Uploads Ativos com Barra de Progresso */}
            {uploadingImages.length > 0 && (
              <div className="space-y-3 pt-2">
                {uploadingImages.map(img => (
                  <div key={img.id} className="text-xs border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
                    <div className="flex justify-between font-medium text-slate-600">
                      <span className="truncate max-w-[200px]">{img.name}</span>
                      <span>{img.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${img.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid de Imagens */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {images.map((url, idx) => {
                  const isCover = idx === 0;
                  return (
                    <div 
                      key={idx} 
                      className={`relative rounded-lg border overflow-hidden aspect-square flex flex-col justify-between bg-slate-50 transition-all ${
                        isCover ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
                      }`}
                    >
                      {/* Botão de Remover - Sempre visível no topo direito */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow z-10 cursor-pointer"
                        title="Remover imagem"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Imagem Centralizada */}
                      <div className="flex-1 flex items-center justify-center p-2 min-h-0">
                        <img src={url} alt={`Preview ${idx}`} className="max-w-full max-h-full object-contain" />
                      </div>

                      {/* Ações na Base do Card */}
                      <div className="w-full">
                        {isCover ? (
                          <div className="w-full bg-blue-600 text-white text-[10px] font-bold py-1.5 text-center uppercase tracking-wider">
                            Capa Principal
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => makeCoverImage(idx)}
                            className="w-full bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1.5 text-center border-t border-slate-200 transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Definir como Capa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Lateral (Direita - 1/3) */}
        <div className="space-y-6">
          
          {/* Card 3: Status e Organização */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Organização</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Marca</label>
              <select
                required
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 outline-none transition-shadow bg-white"
              >
                <option value="">Selecione uma marca...</option>
                {brands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Categoria</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 outline-none transition-shadow bg-white"
              >
                <option value="">Selecione uma categoria...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Frase de Efeito (Tagline)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 outline-none transition-shadow"
                placeholder="Ex: Alta definição e fluidez clínica"
              />
            </div>
          </div>

          {/* Card 4: Arquivo PDF (Firebase Storage) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Catálogo em PDF</h3>

            <input
              type="file"
              ref={pdfInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />

            {pdfUploading ? (
              <div className="text-xs border border-slate-100 rounded-lg p-4 bg-slate-50 flex flex-col gap-2">
                <div className="flex justify-between font-medium text-slate-600">
                  <span>Enviando PDF...</span>
                  <span>{pdfProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${pdfProgress}%` }}></div>
                </div>
              </div>
            ) : formData.pdfUrl ? (
              <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <FileText className="w-8 h-8 text-red-500 shrink-0" />
                  <div className="text-xs overflow-hidden">
                    <span className="font-semibold text-slate-800 block truncate">Catálogo anexado</span>
                    <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visualizar PDF
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pdfUrl: '' }))}
                  className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                  title="Remover PDF"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700 text-center">Carregar catálogo em PDF</span>
                <span className="text-[10px] text-slate-500 mt-1">Limite recomendado: 20MB</span>
              </div>
            )}
          </div>

          {/* Card 5: Configurações do Cloudinary (Collapsible) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700"
            >
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configuração do Cloudinary</span>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {showConfig ? 'Fechar' : 'Abrir'}
              </span>
            </button>

            {showConfig && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3.5 text-xs">
                <p className="text-slate-500 leading-relaxed">
                  Insira abaixo para salvar temporariamente no navegador. Para persistir definitivamente, configure no arquivo <code className="bg-slate-200 px-1 py-0.5 rounded text-red-600 font-mono">.env.local</code>.
                </p>

                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Cloud Name</label>
                  <input
                    type="text"
                    value={cloudName}
                    onChange={e => setCloudName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-slate-800"
                    placeholder="dbvhkc2rk"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Upload Preset</label>
                  <input
                    type="text"
                    value={uploadPreset}
                    onChange={e => setUploadPreset(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-slate-800"
                    placeholder="fran_preset"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  Salvar Configuração Local
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Barra de Ações Inferior */}
      <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
        <Link to="/admin" className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium text-sm">
          Cancelar
        </Link>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 font-medium text-sm shadow-sm cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Salvando...' : 'Salvar Equipamento'}</span>
        </button>
      </div>
    </div>
  );
}
