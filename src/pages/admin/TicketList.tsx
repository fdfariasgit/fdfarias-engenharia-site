import { useState, useEffect, useMemo } from 'react';
import { ticketService } from '../../services/ticketService';
import { equipmentService } from '../../services/equipmentService';
import type { Ticket, Equipment } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { 
  Plus, 
  Search, 
  Loader2, 
  Inbox,
  X,
  Edit2,
  Trash2,
  MessageCircle,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckSquare
} from 'lucide-react';

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const { toast } = useToast();
  const { confirm } = useConfirm();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open' as Ticket['status'],
    customerName: '',
    customerContact: '',
    equipmentId: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tData, eData] = await Promise.all([
        ticketService.getAll(),
        equipmentService.getAllAdmin()
      ]);
      setTickets(tData);
      setEquipment(eData.filter(e => e.status !== 'deleted'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      setFormData({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        customerName: ticket.customerName,
        customerContact: ticket.customerContact,
        equipmentId: ticket.equipmentId || ''
      });
    } else {
      setEditingTicket(null);
      setFormData({
        title: '',
        description: '',
        status: 'open',
        customerName: '',
        customerContact: '',
        equipmentId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTicket) {
        await ticketService.update(editingTicket.id, formData);
        toast('Chamado atualizado com sucesso!', 'success');
      } else {
        await ticketService.create(formData);
        toast('Chamado criado com sucesso!', 'success');
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving ticket:', error);
      toast('Erro ao salvar o chamado.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir chamado',
      message: 'Tem certeza que deseja excluir este chamado permanentemente?',
      confirmText: 'Excluir',
      variant: 'danger'
    });
    if (confirmed) {
      try {
        await ticketService.delete(id);
        toast('Chamado excluído.', 'success');
        await loadData();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        toast('Erro ao excluir chamado.', 'error');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Ticket['status']) => {
    try {
      // Optimistic update
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await ticketService.update(id, { status: newStatus });
      toast('Status atualizado.', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      toast('Erro ao atualizar status.', 'error');
      await loadData(); // revert
    }
  };

  const formatWhatsAppUrl = (contact: string) => {
    // Remove non-numeric characters
    const numeric = contact.replace(/\D/g, '');
    if (numeric.length >= 10) {
      return `https://wa.me/55${numeric}?text=Olá!%20Falo%20da%20FD%20Farias%20sobre%20o%20seu%20chamado.`;
    }
    return null;
  };

  // Memoized stats
  const stats = useMemo(() => {
    return {
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      total: tickets.length
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Chamados</h1>
          <p className="text-sm text-slate-500">Métricas e acompanhamento de suporte técnico</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold tracking-wide uppercase"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Novo Chamado</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Abertos</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.open}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Em Andamento</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.in_progress}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Concluídos</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.closed}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between text-white">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <h3 className="text-2xl font-black text-white">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Toolbar: Filters & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${statusFilter === 'all' ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${statusFilter === 'open' ? 'bg-white text-red-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Abertos
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${statusFilter === 'in_progress' ? 'bg-white text-amber-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Em Andamento
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${statusFilter === 'closed' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Concluídos
            </button>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar chamado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-shadow text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 w-1/4">Cliente & Contato</th>
                <th className="p-4 w-1/3">Detalhes do Chamado</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Carregando chamados...</p>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-slate-500 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Inbox className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="font-semibold text-lg text-slate-700">Nenhum chamado encontrado</p>
                    <p className="text-sm mt-1">Tente ajustar seus filtros ou busca.</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((item) => {
                  const eq = equipment.find(e => e.id === item.equipmentId);
                  const waUrl = formatWhatsAppUrl(item.customerContact);

                  return (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Cliente e Contato */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-slate-900 mb-1">{item.customerName}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium border border-slate-200">
                            {item.customerContact}
                          </span>
                          {waUrl && (
                            <a 
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-md transition-colors"
                              title="Chamar no WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Detalhes do Chamado */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-slate-800 mb-1 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                          {item.description}
                        </div>
                        {eq && (
                          <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-widest">
                            Equip: {eq.name}
                          </div>
                        )}
                      </td>

                      {/* Status Atual */}
                      <td className="p-4 align-top">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                          item.status === 'open' ? 'bg-red-50 text-red-700 border-red-100' :
                          item.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {item.status === 'open' && <AlertCircle className="w-3.5 h-3.5" />}
                          {item.status === 'in_progress' && <Clock className="w-3.5 h-3.5" />}
                          {item.status === 'closed' && <CheckSquare className="w-3.5 h-3.5" />}
                          
                          {item.status === 'open' ? 'Aberto' : item.status === 'in_progress' ? 'Andamento' : 'Concluído'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-2 font-medium">
                          {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </td>

                      {/* Ações Rápidas */}
                      <td className="p-4 align-top text-center">
                        <div className="flex items-center justify-center space-x-1">
                          
                          {/* One-Click Status */}
                          {item.status === 'open' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'in_progress')}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors tooltip-trigger"
                              title="Iniciar Atendimento"
                            >
                              <PlayCircle className="w-5 h-5" />
                            </button>
                          )}
                          {item.status === 'in_progress' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'closed')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip-trigger"
                              title="Marcar como Concluído"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          )}
                          
                          {/* Actions separator */}
                          <div className="w-px h-6 bg-slate-200 mx-1"></div>

                          {/* Edit / Delete */}
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar / Ver Detalhes Completos"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lateral (Simplificado) para Criação/Edição Completa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-slate-800">
                {editingTicket ? 'Editar Chamado' : 'Novo Chamado Manual'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar bg-slate-50/50">
              <form id="ticket-form" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nome do Cliente</label>
                    <input
                      required
                      type="text"
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Contato (Telefone/Email)</label>
                    <input
                      required
                      type="text"
                      value={formData.customerContact}
                      onChange={e => setFormData({...formData, customerContact: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Status Atual</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as Ticket['status']})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold transition-all shadow-sm"
                    >
                      <option value="open">🔴 Aberto</option>
                      <option value="in_progress">🟡 Em Andamento</option>
                      <option value="closed">🟢 Concluído</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Equipamento (Opcional)</label>
                    <select
                      value={formData.equipmentId}
                      onChange={e => setFormData({...formData, equipmentId: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                    >
                      <option value="">-- Nenhum Selecionado --</option>
                      {equipment.map(eq => (
                         <option key={eq.id} value={eq.id}>{eq.name} ({eq.brand})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Assunto Principal</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Histórico / Descrição</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm custom-scrollbar transition-all shadow-sm resize-y"
                  />
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="ticket-form"
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Salvando...' : 'Salvar Chamado'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
