import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { equipmentService } from '../../services/equipmentService';
import type { Ticket, Equipment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  FileEdit,
  AlertTriangle,
  Activity
} from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `Há ${diffMins}min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function getUrgencyLevel(createdAt: string): 'green' | 'yellow' | 'red' {
  const diffHours = (Date.now() - new Date(createdAt).getTime()) / 3600000;
  if (diffHours < 24) return 'green';
  if (diffHours < 72) return 'yellow';
  return 'red';
}

export function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketsData, equipmentData] = await Promise.all([
          ticketService.getAll(),
          equipmentService.getAllAdmin()
        ]);
        setTickets(ticketsData);
        setEquipment(equipmentData.filter(e => e.status !== 'deleted'));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const closedTickets = tickets.filter(t => t.status === 'closed');
  const urgentTickets = openTickets.filter(t => getUrgencyLevel(t.createdAt) === 'red');

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {getGreeting()}, {displayName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/chamados?status=open"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors">
              <AlertCircle className="w-5 h-5" />
            </div>
            {urgentTickets.length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                {urgentTickets.length} atrasado{urgentTickets.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-800">{openTickets.length}</h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Abertos</p>
        </Link>

        <Link
          to="/admin/chamados?status=in_progress"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group cursor-pointer"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl mb-3 w-fit group-hover:bg-amber-100 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">{inProgressTickets.length}</h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Em Andamento</p>
        </Link>

        <Link
          to="/admin/chamados?status=closed"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl mb-3 w-fit group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">{closedTickets.length}</h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Concluídos</p>
        </Link>

        <Link
          to="/admin/equipamentos"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mb-3 w-fit group-hover:bg-blue-100 transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">{equipment.length}</h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Equipamentos</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          to="/admin/equipamentos/novo"
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Novo Equipamento</p>
            <p className="text-[11px] text-slate-500">Adicionar ao catálogo</p>
          </div>
        </Link>

        <Link
          to="/admin/chamados"
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-amber-300 hover:shadow-sm transition-all group"
        >
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Gerenciar Chamados</p>
            <p className="text-[11px] text-slate-500">Atender solicitações</p>
          </div>
        </Link>

        <Link
          to="/admin/cms"
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-violet-300 hover:shadow-sm transition-all group"
        >
          <div className="p-2 bg-violet-50 text-violet-600 rounded-lg group-hover:bg-violet-100 transition-colors">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Editar Site</p>
            <p className="text-[11px] text-slate-500">Textos e conteúdo</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Urgent Tickets - Needs Attention */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Precisam de Atenção
            </h2>
            <Link to="/admin/chamados" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {openTickets.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Tudo em dia!</p>
                <p className="text-xs text-slate-400">Nenhum chamado aberto no momento</p>
              </div>
            ) : (
              openTickets.slice(0, 5).map(ticket => {
                const urgency = getUrgencyLevel(ticket.createdAt);
                return (
                  <div key={ticket.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      urgency === 'red' ? 'bg-red-500 animate-pulse' :
                      urgency === 'yellow' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{ticket.title}</p>
                      <p className="text-xs text-slate-500">{ticket.customerName}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      urgency === 'red' ? 'bg-red-50 text-red-600' :
                      urgency === 'yellow' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {getTimeAgo(ticket.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Atividade Recente
            </h2>
          </div>

          <div className="divide-y divide-slate-50">
            {tickets.length === 0 && equipment.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Nenhuma atividade registrada.
              </div>
            ) : (
              // Merge tickets and equipment into a timeline, sorted by most recent
              [...tickets.map(t => ({
                id: t.id,
                type: 'ticket' as const,
                title: t.title,
                subtitle: t.status === 'open' ? 'Chamado aberto' : t.status === 'in_progress' ? 'Em atendimento' : 'Concluído',
                date: t.updatedAt || t.createdAt,
                status: t.status
              })),
              ...equipment.slice(0, 3).map(e => ({
                id: e.id,
                type: 'equipment' as const,
                title: e.name,
                subtitle: `Equipamento • ${e.brand}`,
                date: '', // Equipment doesn't have updatedAt in current schema
                status: 'active' as const
              }))]
              .filter(item => item.date)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 6)
              .map(item => (
                <div key={`${item.type}-${item.id}`} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className={`p-1.5 rounded-lg ${
                    item.type === 'ticket'
                      ? item.status === 'open' ? 'bg-red-50 text-red-500' :
                        item.status === 'in_progress' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                      : 'bg-blue-50 text-blue-500'
                  }`}>
                    {item.type === 'ticket' ? <Wrench className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                  {item.date && (
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {getTimeAgo(item.date)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
