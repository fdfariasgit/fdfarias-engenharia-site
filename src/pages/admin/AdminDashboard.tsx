import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { equipmentService } from '../../services/equipmentService';
import type { Ticket, Equipment } from '../../types';
import { 
  Package, 
  Wrench, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

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

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Geral</h1>
        <p className="text-sm text-slate-500">Visão geral do sistema e manutenções</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Equipamentos</p>
              <h3 className="text-3xl font-black text-slate-800">{equipment.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <Link to="/admin/equipamentos" className="text-xs font-bold text-blue-600 flex items-center hover:text-blue-700 transition-colors">
            Gerenciar Catálogo <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-1">Chamados Abertos</p>
              <h3 className="text-3xl font-black text-red-600">{openTickets}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <Link to="/admin/chamados" className="text-xs font-bold text-red-600 flex items-center hover:text-red-700 transition-colors">
            Ver Chamados <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-1">Em Andamento</p>
              <h3 className="text-3xl font-black text-amber-600">{inProgressTickets}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <Link to="/admin/chamados" className="text-xs font-bold text-amber-600 flex items-center hover:text-amber-700 transition-colors">
            Acompanhar <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-1">Concluídos</p>
              <h3 className="text-3xl font-black text-emerald-600">{closedTickets}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <Link to="/admin/chamados" className="text-xs font-bold text-emerald-600 flex items-center hover:text-emerald-700 transition-colors">
            Histórico <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* Últimos Chamados */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" /> Chamados Recentes
          </h2>
          <Link to="/admin/chamados" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ver Todos</Link>
        </div>
        <div className="p-0">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Nenhum chamado registrado no momento.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Assunto</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Data</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.slice(0, 5).map(ticket => (
                  <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-900">{ticket.customerName}</td>
                    <td className="p-4 text-slate-600">{ticket.title}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                        ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Andamento' : 'Concluído'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
