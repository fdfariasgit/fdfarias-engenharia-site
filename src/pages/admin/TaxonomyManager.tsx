import { useState, useEffect } from 'react';
import { taxonomyService } from '../../services/taxonomyService';
import type { TaxonomyItem } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2,
  Tag,
  Briefcase
} from 'lucide-react';

export function TaxonomyManager() {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { toast } = useToast();
  const { confirm } = useConfirm();
  
  // State for forms
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      let data = await taxonomyService.getAll();
      
      if (data.length === 0) {
        await taxonomyService.initializeDefaults();
        data = await taxonomyService.getAll();
      }
      
      setItems(data);
      setLoadError('');
    } catch (error: any) {
      console.error('Erro ao carregar taxonomia:', error);
      setLoadError(error.message || 'Erro desconhecido ao carregar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (type: 'category' | 'brand') => {
    const name = type === 'category' ? newCategoryName : newBrandName;
    if (!name.trim()) return;
    
    try {
      await taxonomyService.add({ name: name.trim(), type });
      if (type === 'category') setNewCategoryName('');
      else setNewBrandName('');
      loadData();
    } catch (error: any) {
      console.error('Add error:', error);
      toast('Erro ao adicionar: ' + (error.message || 'Desconhecido'), 'error');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editItemName.trim()) return;
    
    try {
      await taxonomyService.update(id, editItemName.trim());
      setEditingId(null);
      setEditItemName('');
      loadData();
    } catch (error) {
      toast('Erro ao atualizar item.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir item',
      message: 'Tem certeza que deseja excluir este item? Ele poderá fazer falta nos formulários se já estiver em uso.',
      confirmText: 'Excluir',
      variant: 'danger'
    });
    if (!confirmed) return;
    
    try {
      await taxonomyService.delete(id);
      loadData();
    } catch (error) {
      toast('Erro ao excluir item.', 'error');
    }
  };

  const categories = items.filter(i => i.type === 'category');
  const brands = items.filter(i => i.type === 'brand');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl max-w-lg text-center">
          <h3 className="font-bold mb-2">Erro de Permissão (Firebase Rules)</h3>
          <p className="text-sm">O banco de dados bloqueou a leitura. Mensagem oficial do erro:</p>
          <code className="block mt-2 text-xs bg-red-100 p-2 rounded">{loadError}</code>
          <p className="text-sm mt-3 font-semibold">Certifique-se de que colou as Regras corretamente e clicou no botão "Publicar" no console do Firebase.</p>
        </div>
      </div>
    );
  }

  const renderSection = (
    title: string, 
    type: 'category' | 'brand', 
    data: TaxonomyItem[], 
    icon: React.ReactNode,
    inputValue: string,
    setInputValue: (val: string) => void
  ) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-full">
          {data.length} {data.length === 1 ? 'item' : 'itens'}
        </span>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd(type);
          }} 
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Nova ${type === 'category' ? 'Categoria' : 'Marca'}...`}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-2">
          {data.length === 0 && (
            <div className="text-sm text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
              Nenhum item cadastrado.
            </div>
          )}
          {data.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white hover:bg-slate-50 transition-colors group">
              {editingId === item.id ? (
                <div className="flex flex-1 gap-2 mr-2">
                  <input
                    type="text"
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none"
                    autoFocus
                  />
                  <button type="button" onClick={() => handleUpdate(item.id)} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200 transition-colors">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200 transition-colors">
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span 
                    className="font-medium text-slate-700 flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditItemName(item.name);
                    }}
                    title="Clique para editar"
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditItemName(item.name);
                      }} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(item.id)} 
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Categorias e Marcas</h1>
        <p className="text-sm text-slate-500">Gerencie as tags dinâmicas para o cadastro de equipamentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-180px)] min-h-[500px]">
        {renderSection('Categorias', 'category', categories, <Tag className="w-5 h-5 text-blue-600" />, newCategoryName, setNewCategoryName)}
        {renderSection('Marcas', 'brand', brands, <Briefcase className="w-5 h-5 text-blue-600" />, newBrandName, setNewBrandName)}
      </div>
    </div>
  );
}
