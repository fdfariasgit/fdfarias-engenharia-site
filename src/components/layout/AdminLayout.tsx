import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import {
  LayoutDashboard,
  LogOut,
  Package,
  Wrench,
  Settings,
  Tags,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import logo from '../../assets/logo.webp';

const SIDEBAR_COLLAPSED_KEY = 'admin_sidebar_collapsed';

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  });
  const [openTicketCount, setOpenTicketCount] = useState(0);

  // Load open ticket count for badge
  useEffect(() => {
    ticketService.getAll().then(tickets => {
      setOpenTicketCount(tickets.filter(t => t.status === 'open').length);
    }).catch(() => {});
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Equipamentos', path: '/admin/equipamentos', icon: Package },
    { name: 'Marcas/Categorias', path: '/admin/taxonomia', icon: Tags },
    { name: 'Chamados', path: '/admin/chamados', icon: Wrench, badge: openTicketCount },
    { name: 'Site (CMS)', path: '/admin/cms', icon: Settings },
    { name: 'Meu Perfil', path: '/admin/perfil', icon: UserCircle },
  ];

  const isActive = (link: typeof navLinks[0]) => {
    if (link.exact) return location.pathname === link.path;
    return location.pathname.startsWith(link.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 bg-noise-pattern">

      {/* ===== Desktop Sidebar ===== */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[68px]' : 'w-[240px]'
        }`}
      >
        {/* Logo Area */}
        <div className={`flex items-center border-b border-slate-100 h-16 px-4 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <img src={logo} alt="FD Farias" className="h-9 w-auto shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[0.55rem] font-black tracking-[0.2em] text-slate-800 uppercase leading-none mb-0.5">FD FARIAS</span>
                <span className="text-[0.5rem] font-bold tracking-widest text-blue-600 uppercase leading-none">Admin</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                title={isCollapsed ? link.name : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 rounded-r-full" />
                )}

                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />

                {!isCollapsed && (
                  <span className="truncate">{link.name}</span>
                )}

                {/* Badge for open tickets */}
                {link.badge && link.badge > 0 ? (
                  <span className={`${isCollapsed ? 'absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px]' : 'ml-auto px-1.5 py-0.5 text-[10px]'} bg-red-500 text-white font-bold rounded-full flex items-center justify-center leading-none`}>
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-2 space-y-1">
          {/* View Site Link */}
          <Link
            to="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title="Ver site público"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Ver Site</span>}
          </Link>

          {/* Collapse Toggle */}
          <button
            onClick={toggleCollapsed}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!isCollapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      {/* ===== Main Area ===== */}
      <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-[68px]' : 'md:ml-[240px]'}`}>

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 h-14 flex items-center px-4 md:px-8 shadow-sm">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-3"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb-style page title */}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-slate-400 hidden sm:inline">Painel Admin</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-xs text-slate-500 truncate max-w-[200px]" title={user?.email || ''}>
              {user?.email}
            </span>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <motion.nav
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 w-[280px] h-full bg-white shadow-2xl z-50 flex flex-col md:hidden"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={logo} alt="FD Farias" className="h-9 w-auto" />
                    <div className="flex flex-col">
                      <span className="text-[0.55rem] font-black tracking-[0.2em] text-slate-800 uppercase leading-none mb-0.5">FD FARIAS</span>
                      <span className="text-[0.5rem] font-bold tracking-widest text-blue-600 uppercase leading-none">Admin</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-3 mb-2">
                    {user?.email}
                  </div>
                  {navLinks.map((link) => {
                    const active = isActive(link);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 rounded-r-full" />
                        )}
                        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{link.name}</span>
                        {link.badge && link.badge > 0 ? (
                          <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-red-500 text-white font-bold rounded-full leading-none">
                            {link.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>

                {/* Drawer Footer */}
                <div className="border-t border-slate-100 p-3 space-y-1">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Site Público</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair do Sistema</span>
                  </button>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
