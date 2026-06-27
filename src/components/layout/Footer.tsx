import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/logo.webp';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

function getFooterLinkPath(item: string): string {
  if (item === 'Home') return '/';
  if (item === 'Sobre') return '/sobre';
  if (item === 'Suporte') return '/suporte';
  return `/#${item.toLowerCase().split(' ')[0]}`;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteConfig();

  return (
    <footer className="bg-blue-600 pt-20 pb-10 border-t border-blue-700">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Coluna 1: Brand e Bio */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} alt="FD Farias Logo" width="56" height="56" className="h-12 md:h-14 w-auto rounded bg-white p-1" />
            </div>
            <p className="text-blue-100 font-medium leading-relaxed max-w-sm mb-8">
              Especialista em manutenção preventiva, corretiva e venda de equipamentos de ultrassom de alta performance. Elevando o padrão de diagnósticos na região Norte.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-6">Navegação</h4>
            <ul className="space-y-4">
              {['Home', 'Catálogo', 'Sobre', 'Suporte'].map((item) => (
                <li key={item}>
                  <a href={getFooterLinkPath(item)} className="text-blue-100 hover:text-white text-sm font-semibold transition-colors flex items-center group">
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
              <li className="flex items-start gap-3 text-blue-100 text-sm font-medium">
                <MapPin size={18} className="text-blue-300 shrink-0 mt-0.5" />
                <span>{settings?.address || 'Rua Petrópolis, nº 3450, Bairro Eletronorte, Porto Velho - RO, CEP 76.808-460'}</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100 text-sm font-medium">
                <Phone size={18} className="text-blue-300 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  {settings?.phone ? (
                    settings.phone.split(/[/,]/).map((phone) => {
                      const trimmedPhone = phone.trim();
                      const digits = trimmedPhone.replace(/\D/g, '');
                      // Prepend country code if not present
                      const telNumber = digits.startsWith('55') ? digits : `55${digits}`;
                      return (
                        <a key={trimmedPhone} href={`tel:+${telNumber}`} className="hover:text-white transition-colors">
                          {trimmedPhone}
                        </a>
                      );
                    })
                  ) : (
                    <>
                      <a href="tel:+556993123438" className="hover:text-white transition-colors">(69) 9312-3438</a>
                      <a href="tel:+556999650890" className="hover:text-white transition-colors">(69) 9965-0890</a>
                    </>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-3 text-blue-100 text-sm font-medium">
                <Mail size={18} className="text-blue-300 shrink-0" />
                <a href={`mailto:${settings?.email || 'san98@outlook.com.br'}`} className="hover:text-white transition-colors">
                  {settings?.email || 'san98@outlook.com.br'}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="pt-8 border-t border-blue-500/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-left">
            <p className="text-blue-200 text-xs tracking-widest uppercase font-bold">
              © {currentYear} {settings?.tradeName || 'FD COMERCIO E SERVICOS'} - Todos os direitos reservados.
            </p>
            <p className="text-blue-300 text-[10px] font-medium leading-relaxed max-w-3xl">
              <span className="font-semibold text-blue-200">{settings?.corporateName || 'F.D FARIAS LTDA'}</span>
              <span className="mx-2 text-blue-400">|</span>
              <span>CNPJ: {settings?.cnpj || '44.539.341/0001-05'}</span>
              <span className="mx-2 text-blue-400">|</span>
              <span>{settings?.address || 'Rua Petrópolis, nº 3450, Bairro Eletronorte, Porto Velho - RO, CEP 76.808-460'}</span>
            </p>
          </div>
          <div className="text-blue-200 text-xs font-bold tracking-wide shrink-0 md:text-right">
            Design focado em performance.
          </div>
        </div>
      </div>
    </footer>
  );
}