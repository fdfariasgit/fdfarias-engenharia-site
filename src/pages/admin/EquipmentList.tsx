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
  AlertTriangle
} from 'lucide-react';

export function EquipmentList() {
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const data = await equipmentService.getAllAdmin();
      
      // Auto-Purge em segundo plano: verifica e remove do Firestore itens com mais de 30 dias na lixeira
      const now = new Date();
      const itemsToPurge: Equipment[] = [];
      const validItems: Equipment[] = [];

      data.forEach(item => {
        if (item.status === 'deleted' && item.deletedAt) {
          const deletedDate = new Date(item.deletedAt);
          const diffTime = now.getTime() - deletedDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 30) {
            itemsToPurge.push(item);
          } else {
            validItems.push(item);
          }
        } else {
          validItems.push(item);
        }
      });

      if (itemsToPurge.length > 0) {
        console.log(`Auto-Purge: Removendo ${itemsToPurge.length} item(ns) permanentemente expirados.`);
        for (const item of itemsToPurge) {
          await equipmentService.delete(item.id);
        }
      }

      setAllEquipment(validItems);
    } catch (error) {
      console.error('Error loading equipment:', error);
      toast('Erro ao carregar equipamentos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Mover para lixeira',
      message: 'Tem certeza que deseja enviar este equipamento para a Lixeira? Ele ficará invisível no site público.',
      confirmText: 'Mover para lixeira',
      variant: 'warning'
    });
    if (confirmed) {
      try {
        const nowISO = new Date().toISOString();
        await equipmentService.update(id, { 
          status: 'deleted',
          deletedAt: nowISO
        });
        
        setAllEquipment(prev => 
          prev.map(e => e.id === id ? { ...e, status: 'deleted', deletedAt: nowISO } : e)
        );
      } catch (error) {
        console.error('Error sending to trash:', error);
        toast('Erro ao enviar para a lixeira.', 'error');
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      // Remove o status 'deleted' e limpa a data
      await equipmentService.update(id, { 
        status: 'active',
        deletedAt: '' // O Firestore aceita string vazia para limpar campos
      });
      
      setAllEquipment(prev => 
        prev.map(e => e.id === id ? { ...e, status: 'active', deletedAt: undefined } : e)
      );
      
      toast('Equipamento restaurado com sucesso!', 'success');
    } catch (error) {
      console.error('Error restoring equipment:', error);
      toast('Erro ao restaurar equipamento.', 'error');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir permanentemente',
      message: 'ATENÇÃO: Deseja excluir permanentemente este equipamento do banco de dados? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir definitivamente',
      variant: 'danger'
    });
    if (confirmed) {
      try {
        await equipmentService.delete(id);
        setAllEquipment(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting permanently:', error);
        toast('Erro ao excluir definitivamente.', 'error');
      }
    }
  };

  const getDaysRemaining = (deletedAtStr?: string) => {
    if (!deletedAtStr) return 30;
    const deletedDate = new Date(deletedAtStr);
    const diffTime = Date.now() - deletedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaining = 30 - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  // Separação de abas
  const tabEquipment = allEquipment.filter(e => 
    activeTab === 'active' ? e.status !== 'deleted' : e.status === 'deleted'
  );

  // Filtro de Busca
  const filteredEquipment = tabEquipment.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Equipamentos</h1>
          <p className="text-sm text-slate-500">Gerencie o catálogo de produtos e lixeira do site</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to="/admin/equipamentos/novo"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Equipamento</span>
          </Link>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('active'); setSearchTerm(''); }}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'active' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Ativos ({allEquipment.filter(e => e.status !== 'deleted').length})
        </button>
        <button
          onClick={() => { setActiveTab('deleted'); setSearchTerm(''); }}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 cursor-pointer flex items-center space-x-2 ${
            activeTab === 'deleted' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Lixeira ({allEquipment.filter(e => e.status === 'deleted').length})</span>
          {allEquipment.filter(e => e.status === 'deleted').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Alerta de Lixeira */}
      {activeTab === 'deleted' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-xs md:text-sm flex items-start space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-semibold block">Atenção!</span>
            Os itens colocados na lixeira são guardados por **30 dias**. Após esse período, eles serão purgados de forma permanente da base de dados no Firestore.
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Barra de Busca */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'active' ? "Buscar por nome ou marca..." : "Buscar itens deletados..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-shadow text-sm"
            />
          </div>
        </div>

        {/* Listagem */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Marca</th>
                {activeTab === 'active' ? (
                  <th className="p-4 font-semibold">Categoria</th>
                ) : (
                  <th className="p-4 font-semibold">Tempo Restante</th>
                )}
                <th className="p-4 font-semibold w-28 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
                    <Inbox className="w-8 h-8 text-slate-300" />
                    <span>Nenhum equipamento {activeTab === 'active' ? 'ativo' : 'na lixeira'} encontrado.</span>
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{item.name}</td>
                    <td className="p-4 text-slate-600">{item.brand}</td>
                    
                    {activeTab === 'active' ? (
                      <td className="p-4 text-slate-600 capitalize">{item.category}</td>
                    ) : (
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          getDaysRemaining(item.deletedAt) <= 5
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          Exclui em {getDaysRemaining(item.deletedAt)} {getDaysRemaining(item.deletedAt) === 1 ? 'dia' : 'dias'}
                        </span>
                      </td>
                    )}

                    <td className="p-4 flex items-center justify-center space-x-1">
                      {activeTab === 'active' ? (
                        <>
                          <Link
                            to={`/admin/equipamentos/editar/${item.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar equipamento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleSoftDelete(item.id)}
                            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Mover para Lixeira"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(item.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Restaurar equipamento"
                          >
                            <Undo className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir permanentemente"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
