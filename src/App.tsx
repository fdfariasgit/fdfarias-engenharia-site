import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ProductPage } from './pages/ProductPage';
import { SupportPage } from './pages/SupportPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EquipmentForm } from './pages/admin/EquipmentForm';
import { EquipmentList } from './pages/admin/EquipmentList';
import { TicketList } from './pages/admin/TicketList';
import { CmsManager } from './pages/admin/CmsManager';
import { TaxonomyManager } from './pages/admin/TaxonomyManager';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AuthProvider } from './contexts/AuthContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { useEffect } from 'react';
import Lenis from 'lenis';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });
    
    // @ts-ignore
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      // @ts-ignore
      delete window.lenis;
    };
  }, []);

  return (
    <AuthProvider>
      <SiteConfigProvider>
        <ToastProvider>
          <ConfirmProvider>
        <Router>
          <ScrollToTop />
          <div className="relative min-h-screen font-sans text-slate-900 selection:bg-blue-600/20 selection:text-blue-900 transition-colors duration-300 bg-noise-pattern">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/produto/:id" element={<PublicLayout><ProductPage /></PublicLayout>} />
            <Route path="/suporte" element={<PublicLayout><SupportPage /></PublicLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="equipamentos" element={<EquipmentList />} />
                <Route path="equipamentos/novo" element={<EquipmentForm />} />
                <Route path="equipamentos/editar/:id" element={<EquipmentForm />} />
                <Route path="taxonomia" element={<TaxonomyManager />} />
                <Route path="chamados" element={<TicketList />} />
                <Route path="cms" element={<CmsManager />} />
                <Route path="perfil" element={<AdminProfile />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
          </ConfirmProvider>
        </ToastProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}