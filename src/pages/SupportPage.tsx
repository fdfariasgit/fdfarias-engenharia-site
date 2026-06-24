import { useState } from 'react';
import type { FormEvent as ReactFormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, 
  Send, 
  User, 
  Mail, 
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { useToast } from '../components/ui/Toast';

export function SupportPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    title: '',
    description: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: ReactFormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerContact || !formData.title || !formData.description) {
      toast('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await ticketService.create({
        customerName: formData.customerName,
        customerContact: formData.customerContact,
        title: formData.title,
        description: formData.description,
        status: 'open'
      });
      
      setSubmitted(true);
      toast('Chamado enviado com sucesso! Entraremos em contato em breve.', 'success');
    } catch (error) {
      console.error('Erro ao abrir chamado:', error);
      toast('Ocorreu um erro ao enviar seu chamado. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center pt-28 lg:pt-40 pb-16 px-4 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Chamado Recebido!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Sua solicitação de suporte foi registrada com sucesso. Nossa equipe técnica analisará o seu caso e entrará em contato através dos dados informados o mais rápido possível.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({ customerName: '', customerContact: '', title: '', description: '' });
            }}
            className="w-full py-3.5 px-6 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Abrir outro chamado
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-28 lg:pt-40 pb-20 bg-white">
      {/* Hero Section */}
      <section className="px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-2"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Suporte Técnico</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Como podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ajudar você?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Preencha o formulário abaixo descrevendo seu problema ou dúvida. Nossa equipe técnica está pronta para atender você com agilidade.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="space-y-2">
                  <label htmlFor="customerName" className="block text-sm font-semibold text-slate-700">
                    Seu Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Ex: João da Silva"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Contato */}
                <div className="space-y-2">
                  <label htmlFor="customerContact" className="block text-sm font-semibold text-slate-700">
                    E-mail ou WhatsApp
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="customerContact"
                      name="customerContact"
                      value={formData.customerContact}
                      onChange={handleChange}
                      placeholder="Como falar com você?"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Assunto */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                  Assunto do Chamado
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Equipamento não liga / Dúvida sobre garantia"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                  Descrição Detalhada
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o máximo de detalhes possível sobre a sua situação..."
                    rows={5}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-y min-h-[120px]"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Solicitação de Suporte</span>
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
              <LifeBuoy className="w-4 h-4" />
              Nossa equipe responde a chamados em horário comercial.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
