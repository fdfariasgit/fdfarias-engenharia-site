import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import type { Equipment } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Undo,
  Trash,
  Inbox,
  AlertTriangle,
  LayoutGrid,
  List,
  Package
} from 'lucide-react';

export function EquipmentList() {
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => { loadEquipment(); }, []);

  const loadEquipment = async () => {
    try {
      const data = await equipmentService.getAllAdmin();
      const now = new Date();
      const itemsToPurge: Equipment[] = [];
      const validItems: Equipment[] = [];

      data.forEach(item => {
        if (item.status === 'deleted' && item.deletedAt) {
          const deletedDate = new Date(item.deletedAt);
          const diffDays = Math.floor((now.getTime() - deletedDate.getTime()) / 86400000);
          if (diffDays >= 30) itemsToPurge.push(item);
          else validItems.push(item);
        } else {
          validItems.push(item);
        }
      });

      if (itemsToPurge.length > 0) {
        for (const item of itemsToPurge) await equipmentService.delete(item.id);
      }
      setAllEquipment(validItems);
    } catch (error) {
      toast('Erro ao carregar equipamentos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    const confirmed = await confirm({ title: 'Mover para lixeira', message: 'Enviar este equipamento para a Lixeira?', confirmText: 'Mover', variant: 'warning' });
    if (confirmed) {
      try {
        const nowISO = new Date().toISOString();
        await equipmentService.update(id, { status: 'deleted', deletedAt: nowISO });
        setAllEquipment(prev => prev.map(e => e.id === id ? { ...e, status: 'deleted', deletedAt: nowISO } : e));
        toast('Movido para a lixeira.', 'success');
      } catch { toast('Erro ao mover.', 'error'); }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await equipmentService.update(id, { status: 'active', deletedAt: '' });
      setAllEquipment(prev => prev.map(e => e.id === id ? { ...e, status: 'active', deletedAt: undefined } : e));
      toast('Restaurado com sucesso!', 'success');
    } catch { toast('Erro ao restaurar.', 'error'); }
  };

  const handlePermanentDelete = async (id: string) => {
    const confirmed = await confirm({ title: 'Excluir permanentemente', message: 'Esta ação não pode ser desfeita.', confirmText: 'Excluir', variant: 'danger' });
    if (confirmed) {
      try { await equipmentService.delete(id); setAllEquipment(prev => prev.filter(e => e.id !== id)); toast('Excluído.', 'success'); }
      catch { toast('Erro ao excluir.', 'error'); }
    }
  };

  const getDaysRemaining = (deletedAtStr?: string) => {
    if (!deletedAtStr) return 30;
    return Math.max(0, 30 - Math.floor((Date.now() - new Date(deletedAtStr).getTime()) / 86400000));
  };

  const tabEquipment = allEquipment.filter(e => activeTab === 'active' ? e.status !== 'deleted' : e.status === 'deleted');
  const filteredEquipment = tabEquipment.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const activeCount = allEquipment.filter(e => e.status !== 'deleted').length;
  const deletedCount = allEquipment.filter(e => e.status === 'deleted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Equipamentos</h1>
          <p className="text-sm text-slate-500">
            {activeTab === 'active'
              ? `Mostrando ${filteredEquipment.length} de ${activeCount} equipamentos`
              : `${deletedCount} na lixeira`
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle (only for active tab) - Hidden on mobile, Grid is default */}
          {activeTab === 'active' && (
            <div className="hidden md:flex bg-slate-100 p-0.5 rounded-lg">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Grade">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Tabela">
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
          <Link to="/admin/equipamentos/novo" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-sm font-bold">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Equipamento</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto hide-scrollbar">
        <button onClick={() => { setActiveTab('active'); setSearchTerm(''); }} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Ativos ({activeCount})
        </button>
        <button onClick={() => { setActiveTab('deleted'); setSearchTerm(''); }} className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'deleted' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          Lixeira ({deletedCount})
          {deletedCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
        </button>
      </div>

      {/* Trash warning */}
      {activeTab === 'deleted' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div><span className="font-semibold">Atenção:</span> Itens são excluídos permanentemente após 30 dias na lixeira.</div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input type="text" placeholder="Buscar por nome ou marca..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm bg-white" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && filteredEquipment.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Inbox className="w-10 h-10 text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">Nenhum equipamento encontrado</p>
          <p className="text-sm">Tente ajustar sua busca.</p>
        </div>
      )}

      {/* ===== GRID VIEW ===== */}
      {!loading && activeTab === 'active' && viewMode === 'grid' && filteredEquipment.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEquipment.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
              {/* Image */}
              <div className="aspect-square bg-slate-50 relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-slate-200" />
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1.5">
                    <Link to={`/admin/equipamentos/editar/${item.id}`} className="p-2 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleSoftDelete(item.id)} className="p-2 bg-white text-red-600 rounded-lg shadow-lg hover:bg-red-50 transition-colors" title="Lixeira">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">{item.brand}</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== TABLE VIEW ===== */}
      {!loading && (activeTab === 'deleted' || viewMode === 'table') && filteredEquipment.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4">Equipamento</th>
                  <th className="p-4">Marca</th>
                  {activeTab === 'active' ? <th className="p-4">Categoria</th> : <th className="p-4">Tempo Restante</th>}
                  <th className="p-4 w-28 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredEquipment.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{item.brand}</td>
                    {activeTab === 'active' ? (
                      <td className="p-4">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">{item.category}</span>
                      </td>
                    ) : (
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getDaysRemaining(item.deletedAt) <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-700'}`}>
                          {getDaysRemaining(item.deletedAt)} dia{getDaysRemaining(item.deletedAt) !== 1 ? 's' : ''}
                        </span>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        {activeTab === 'active' ? (
                          <>
                            <Link to={`/admin/equipamentos/editar/${item.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleSoftDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Lixeira">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleRestore(item.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Restaurar">
                              <Undo className="w-4 h-4" />
                            </button>
                            <button onClick={() => handlePermanentDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir definitivamente">
                              <Trash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
