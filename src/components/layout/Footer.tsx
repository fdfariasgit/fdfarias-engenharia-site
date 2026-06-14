import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent pt-20 pb-10 border-t border-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Coluna 1: Brand e Bio */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-extrabold tracking-tighter text-white">
                FRAN<span className="text-blue-500">.</span>
              </span>
              <div className="flex flex-col ml-2 border-l border-slate-800 pl-3">
                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase leading-none mb-0.5">Samsung</span>
                <span className="text-[0.65rem] font-medium tracking-widest text-slate-400 uppercase leading-none">Associate</span>
              </div>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-8">
              Especialista em manutenção preventiva, corretiva e venda de equipamentos de ultrassom de alta performance. Elevando o padrão de diagnósticos na região Norte.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-6">Navegação</h4>
            <ul className="space-y-4">
              {['Home', 'Serviços', 'Catálogo', 'Sobre'].map((item, idx) => (
                <li key={idx}>
                  <a href={item === 'Home' ? '/' : item === 'Sobre' ? '/sobre' : `/#${item.toLowerCase().split(' ')[0]}`} className="text-slate-400 hover:text-white text-sm font-semibold transition-colors flex items-center group">
                    {item}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contato e Localização */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm font-medium">
                <MapPin size={18} className="text-slate-500 shrink-0 mt-0.5" />
                <span>Atendimento presencial no <strong className="text-white">Acre</strong> e <strong className="text-white">Rondônia</strong>.</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Phone size={18} className="text-slate-500 shrink-0" />
                <a href="tel:+5565999653131" className="hover:text-white transition-colors">(65) 99965-3131</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Mail size={18} className="text-slate-500 shrink-0" />
                <a href="mailto:contato@exemplo.com" className="hover:text-white transition-colors">contato@exemplo.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">
            © {currentYear} Fran. Todos os direitos reservados.
          </p>
          <div className="text-slate-500 text-xs font-bold tracking-wide">
            Design focado em performance.
          </div>
        </div>
      </div>
    </footer>
  );
}