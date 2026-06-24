import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, LogOut, Package, ArrowLeft, Wrench, Settings, Tags, UserCircle, Menu, X } from 'lucide-react';
import logo from '../../assets/logo.webp';

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Equipamentos', path: '/admin/equipamentos', icon: Package },
    { name: 'Marcas/Categorias', path: '/admin/taxonomia', icon: Tags },
    { name: 'Chamados', path: '/admin/chamados', icon: Wrench },
    { name: 'Site (CMS)', path: '/admin/cms', icon: Settings },
    { name: 'Meu Perfil', path: '/admin/perfil', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 bg-noise-pattern">
      
      {/* Top Header Administrativo */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={logo} alt="FD Farias Logo" className="h-12 w-auto" />
              <div className="flex flex-col border-l border-slate-300 pl-3">
                <span className="text-[0.6rem] font-black tracking-[0.25em] text-slate-800 uppercase leading-none mb-0.5">FD FARIAS</span>
                <span className="text-[0.6rem] font-bold tracking-widest text-blue-600 uppercase leading-none">Painel Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider transition-colors px-3 py-2 rounded-lg ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden lg:inline text-xs text-slate-500 border-r border-slate-200 pr-4 truncate max-w-[200px]" title={user?.email || ''}>
              {user?.email}
            </span>

            <Link
              to="/"
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-2 md:hidden z-40"
          >
            <div className="text-xs text-slate-500 mb-2 truncate">
              Logado como: {user?.email}
            </div>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 text-sm font-bold uppercase tracking-wider transition-colors px-4 py-3 rounded-xl ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            <div className="h-px bg-slate-200 my-2"></div>
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
              className="flex items-center space-x-3 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl transition-all cursor-pointer w-full text-left uppercase tracking-wider"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair do Sistema</span>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
