import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { equipmentService } from '../../services/equipmentService';
import type { Ticket, Equipment } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import {
  Plus,
  Search,
  Loader2,
  Inbox,
  X,
  Edit2,
  Trash2,
  MessageCircle,
  AlertCircle,
  Clock,
  CheckSquare,
  LayoutGrid,
  List,
  GripVertical
} from 'lucide-react';

// ========== Helpers ==========
function getTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  return `${diffDays}d`;
}

function getUrgencyColor(createdAt: string): string {
  const diffHours = (Date.now() - new Date(createdAt).getTime()) / 3600000;
  if (diffHours < 24) return 'bg-emerald-400';
  if (diffHours < 72) return 'bg-amber-400';
  return 'bg-red-500 animate-pulse';
}

const STATUS_LABELS: Record<string, string> = { open: 'Aberto', in_progress: 'Andamento', closed: 'Concluído' };
const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-50 text-red-700 border-red-100',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-100',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-100'
};

// ========== Draggable Kanban Card ==========
function KanbanCard({ ticket, equipment, onEdit, onDelete, isOverlay }: {
  ticket: Ticket; equipment: Equipment[]; onEdit: (t: Ticket) => void; onDelete: (id: string) => void; isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: ticket.id });
  const eq = equipment.find(e => e.id === ticket.equipmentId);
  const waUrl = formatWhatsApp(ticket.customerContact);

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm transition-all ${
        isDragging ? 'opacity-30 shadow-none' : 'hover:shadow-md'
      } ${isOverlay ? 'shadow-xl rotate-2 scale-105' : ''}`}
    >
      {/* Drag handle + Title */}
      <div className="flex items-start gap-2 mb-2">
        <div {...listeners} {...attributes} className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{ticket.title}</p>
          <p className="text-xs text-slate-500 truncate">{ticket.customerName}</p>
        </div>
        <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getUrgencyColor(ticket.createdAt)}`} />
      </div>

      {/* Description preview */}
      <p className="text-[11px] text-slate-500 line-clamp-2 mb-2.5 leading-relaxed">{ticket.description}</p>

      {/* Equipment tag */}
      {eq && (
        <span className="inline-block text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded mb-2 uppercase tracking-wider">
          {eq.name}
        </span>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <span className="text-[10px] text-slate-400 font-medium">{getTimeAgo(ticket.createdAt)}</span>
        <div className="flex items-center gap-0.5">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-emerald-500 hover:bg-emerald-50 rounded transition-colors" title="WhatsApp">
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={() => onEdit(ticket)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(ticket.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Droppable Column ==========
function KanbanColumn({ id, title, icon, color, count, children }: {
  id: string; title: string; icon: React.ReactNode; color: string; count: number; children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border transition-colors min-h-[300px] ${
        isOver ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-slate-50/50'
      }`}
    >
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${color}`}>
        {icon}
        <span className="text-sm font-bold">{title}</span>
        <span className="ml-auto text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

function formatWhatsApp(contact: string): string | null {
  const numeric = contact.replace(/\D/g, '');
  if (numeric.length >= 10) return `https://wa.me/55${numeric}?text=Olá!%20Falo%20da%20FD%20Farias%20sobre%20o%20seu%20chamado.`;
  return null;
}

// ========== Main Component ==========
export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [searchParams] = useSearchParams();

  // DnD state
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'open' as Ticket['status'],
    customerName: '', customerContact: '', equipmentId: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
    // Read status filter from URL params (from dashboard cards)
    const urlStatus = searchParams.get('status');
    if (urlStatus && ['open', 'in_progress', 'closed'].includes(urlStatus)) {
      setStatusFilter(urlStatus as any);
    }
  }, []);

  const loadData = async () => {
    try {
      const [tData, eData] = await Promise.all([
        ticketService.getAll(), equipmentService.getAllAdmin()
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
        title: ticket.title, description: ticket.description, status: ticket.status,
        customerName: ticket.customerName, customerContact: ticket.customerContact,
        equipmentId: ticket.equipmentId || ''
      });
    } else {
      setEditingTicket(null);
      setFormData({ title: '', description: '', status: 'open', customerName: '', customerContact: '', equipmentId: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingTicket(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTicket) {
        await ticketService.update(editingTicket.id, formData);
        toast('Chamado atualizado!', 'success');
      } else {
        await ticketService.create(formData);
        toast('Chamado criado!', 'success');
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      toast('Erro ao salvar o chamado.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir chamado', message: 'Tem certeza que deseja excluir este chamado permanentemente?',
      confirmText: 'Excluir', variant: 'danger'
    });
    if (confirmed) {
      try { await ticketService.delete(id); toast('Chamado excluído.', 'success'); await loadData(); }
      catch { toast('Erro ao excluir.', 'error'); }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Ticket['status']) => {
    try {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await ticketService.update(id, { status: newStatus });
      toast(`Status → ${STATUS_LABELS[newStatus]}`, 'success');
    } catch {
      toast('Erro ao atualizar status.', 'error');
      await loadData();
    }
  };

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => { setActiveId(event.active.id as string); };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id as string;
    const newStatus = over.id as Ticket['status'];
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status !== newStatus && ['open', 'in_progress', 'closed'].includes(newStatus)) {
      handleStatusChange(ticketId, newStatus);
    }
  };

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    total: tickets.length
  }), [tickets]);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Chamados</h1>
          <p className="text-sm text-slate-500">{stats.total} chamados • {stats.open} abertos</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle - Hidden on mobile, Kanban is default for mobile */}
          <div className="hidden md:flex bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Chamado</span>
          </button>
        </div>
      </div>

      {/* Filters bar (only in table mode) */}
      {viewMode === 'table' && (
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {[
              { key: 'all', label: 'Todos', count: stats.total },
              { key: 'open', label: 'Abertos', count: stats.open, color: 'text-red-600' },
              { key: 'in_progress', label: 'Em Andamento', count: stats.in_progress, color: 'text-amber-600' },
              { key: 'closed', label: 'Concluídos', count: stats.closed, color: 'text-emerald-600' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key as any)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === f.key ? `bg-white ${f.color || 'text-slate-800'} shadow` : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text" placeholder="Buscar chamado..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* ===== KANBAN VIEW ===== */}
      {viewMode === 'kanban' && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KanbanColumn id="open" title="Abertos" count={stats.open}
              icon={<AlertCircle className="w-4 h-4" />}
              color="border-red-100 bg-red-50/50 text-red-700"
            >
              {tickets.filter(t => t.status === 'open').map(t => (
                <KanbanCard key={t.id} ticket={t} equipment={equipment} onEdit={handleOpenModal} onDelete={handleDelete} />
              ))}
              {stats.open === 0 && <p className="text-xs text-slate-400 text-center py-6">Nenhum chamado aberto</p>}
            </KanbanColumn>

            <KanbanColumn id="in_progress" title="Em Andamento" count={stats.in_progress}
              icon={<Clock className="w-4 h-4" />}
              color="border-amber-100 bg-amber-50/50 text-amber-700"
            >
              {tickets.filter(t => t.status === 'in_progress').map(t => (
                <KanbanCard key={t.id} ticket={t} equipment={equipment} onEdit={handleOpenModal} onDelete={handleDelete} />
              ))}
              {stats.in_progress === 0 && <p className="text-xs text-slate-400 text-center py-6">Nenhum em andamento</p>}
            </KanbanColumn>

            <KanbanColumn id="closed" title="Concluídos" count={stats.closed}
              icon={<CheckSquare className="w-4 h-4" />}
              color="border-emerald-100 bg-emerald-50/50 text-emerald-700"
            >
              {tickets.filter(t => t.status === 'closed').map(t => (
                <KanbanCard key={t.id} ticket={t} equipment={equipment} onEdit={handleOpenModal} onDelete={handleDelete} />
              ))}
              {stats.closed === 0 && <p className="text-xs text-slate-400 text-center py-6">Nenhum concluído</p>}
            </KanbanColumn>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTicket ? (
              <KanbanCard ticket={activeTicket} equipment={equipment} onEdit={() => {}} onDelete={() => {}} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ===== TABLE VIEW ===== */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 w-1/4">Cliente & Contato</th>
                  <th className="p-4 w-1/3">Detalhes do Chamado</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="p-16 text-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" /><p className="text-slate-500">Carregando...</p></td></tr>
                ) : filteredTickets.length === 0 ? (
                  <tr><td colSpan={4} className="p-16 text-center"><Inbox className="w-8 h-8 text-slate-300 mx-auto mb-3" /><p className="font-semibold text-slate-700">Nenhum chamado encontrado</p></td></tr>
                ) : (
                  filteredTickets.map(item => {
                    const eq = equipment.find(e => e.id === item.equipmentId);
                    const waUrl = formatWhatsApp(item.customerContact);
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                        <td className="p-4 align-top">
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getUrgencyColor(item.createdAt)}`} />
                            <div>
                              <div className="font-bold text-slate-900 mb-1">{item.customerName}</div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{item.customerContact}</span>
                                {waUrl && (
                                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors" title="WhatsApp">
                                    <MessageCircle className="w-3 h-3" /> WhatsApp
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="font-bold text-slate-800 mb-1 line-clamp-1">{item.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-2 mb-2">{item.description}</div>
                          {eq && <span className="inline-flex text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-widest">Equip: {eq.name}</span>}
                        </td>
                        <td className="p-4 align-top">
                          <select
                            value={item.status}
                            onChange={e => handleStatusChange(item.id, e.target.value as Ticket['status'])}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer ${STATUS_COLORS[item.status]}`}
                          >
                            <option value="open">🔴 Aberto</option>
                            <option value="in_progress">🟡 Andamento</option>
                            <option value="closed">🟢 Concluído</option>
                          </select>
                          <div className="text-[10px] text-slate-400 mt-1.5 font-medium">
                            {getTimeAgo(item.createdAt)}
                          </div>
                        </td>
                        <td className="p-4 align-top text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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
      )}

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                {editingTicket ? 'Editar Chamado' : 'Novo Chamado'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              <form id="ticket-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nome do Cliente</label>
                    <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Contato</label>
                    <input required type="text" value={formData.customerContact} onChange={e => setFormData({...formData, customerContact: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Ticket['status']})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-semibold transition-all">
                      <option value="open">🔴 Aberto</option>
                      <option value="in_progress">🟡 Em Andamento</option>
                      <option value="closed">🟢 Concluído</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Equipamento (Opcional)</label>
                    <select value={formData.equipmentId} onChange={e => setFormData({...formData, equipmentId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all">
                      <option value="">-- Nenhum --</option>
                      {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.brand})</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Assunto</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Descrição</label>
                  <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all resize-y" />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              <button type="submit" form="ticket-form" disabled={saving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-70">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
