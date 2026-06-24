import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteConfig();

  const getWhatsAppNumber = (phoneStr: string | undefined): string => {
    if (!phoneStr) return '556999650890';
    const firstPhone = phoneStr.split(/[/,]/)[0].trim();
    const digits = firstPhone.replace(/\D/g, '');
    return digits.startsWith('55') ? digits : `55${digits}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scrolling for hash links
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // @ts-ignore
          if (globalThis.lenis) {
            // @ts-ignore
            globalThis.lenis.scrollTo(element, { offset: -80 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
  }, [location.hash]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catálogo', path: '/#catalogo' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Suporte', path: '/suporte' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b pointer-events-none ${isScrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 py-4 shadow-md' : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between pointer-events-auto">

        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="FD Farias Logo" width="96" height="96" className="h-16 md:h-24 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.hash === link.path.substring(1));
            return (
              <div key={link.name} className="flex items-center gap-8">
                <Link
                  to={link.path}
                  className={`text-xs font-bold tracking-[0.15em] uppercase transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {link.name}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions (CTA) */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href={`https://wa.me/${getWhatsAppNumber(settings?.phone)}?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20com%20um%20especialista.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 inline-flex items-center justify-center gap-2 rounded-md shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 1.97 14.162 1.95 11.997 1.95c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.363 4.877L2.43 20.84l4.217-1.686zM17.06 14.78c-.284-.143-1.68-.827-1.94-.921-.26-.096-.45-.143-.638.143-.19.285-.733.919-.899 1.11-.165.19-.33.21-.613.068-.284-.143-1.202-.442-2.29-1.41-8.47-7.54-1.424-1.222-1.748-1.554-.324-.332-.324-.607.03-.68.354-.073.784-.919.882-1.096.097-.178.146-.33.073-.472-.072-.143-.638-1.536-.874-2.107-.23-.554-.482-.477-.66-.486-.168-.009-.36-.01-.553-.01-.193 0-.507.073-.77.36-.265.285-1.012.988-1.012 2.41 0 1.422 1.037 2.795 1.18 2.986.145.19 2.04 3.11 4.94 4.363.69.298 1.23.476 1.65.61.693.22 1.325.19 1.825.115.557-.084 1.68-.687 1.917-1.353.237-.666.237-1.237.166-1.353-.07-.115-.26-.184-.545-.326z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            className="text-slate-800 hover:text-blue-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Animated) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-6 md:hidden z-50 animate-in fade-in pointer-events-auto"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold tracking-widest text-slate-700 hover:text-slate-900 uppercase transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={`https://wa.me/${getWhatsAppNumber(settings?.phone)}?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20com%20um%20especialista.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white px-6 py-4 text-xs font-bold uppercase tracking-widest mt-4 text-center rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 1.97 14.162 1.95 11.997 1.95c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.363 4.877L2.43 20.84l4.217-1.686zM17.06 14.78c-.284-.143-1.68-.827-1.94-.921-.26-.096-.45-.143-.638.143-.19.285-.733.919-.899 1.11-.165.19-.33.21-.613.068-.284-.143-1.202-.442-2.29-1.41-8.47-7.54-1.424-1.222-1.748-1.554-.324-.332-.324-.607.03-.68.354-.073.784-.919.882-1.096.097-.178.146-.33.073-.472-.072-.143-.638-1.536-.874-2.107-.23-.554-.482-.477-.66-.486-.168-.009-.36-.01-.553-.01-.193 0-.507.073-.77.36-.265.285-1.012.988-1.012 2.41 0 1.422 1.037 2.795 1.18 2.986.145.19 2.04 3.11 4.94 4.363.69.298 1.23.476 1.65.61.693.22 1.325.19 1.825.115.557-.084 1.68-.687 1.917-1.353.237-.666.237-1.237.166-1.353-.07-.115-.26-.184-.545-.326z" />
              </svg>
              Falar no WhatsApp
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}