import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ProductPage } from './pages/ProductPage';
import { SupportPage } from './pages/SupportPage';
import { AuthProvider } from './contexts/AuthContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Loader2 } from 'lucide-react';

// Lazy loaded Admin Components (Code Splitting)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const EquipmentForm = lazy(() => import('./pages/admin/EquipmentForm').then(m => ({ default: m.EquipmentForm })));
const EquipmentList = lazy(() => import('./pages/admin/EquipmentList').then(m => ({ default: m.EquipmentList })));
const TicketList = lazy(() => import('./pages/admin/TicketList').then(m => ({ default: m.TicketList })));
const CmsManager = lazy(() => import('./pages/admin/CmsManager').then(m => ({ default: m.CmsManager })));
const TaxonomyManager = lazy(() => import('./pages/admin/TaxonomyManager').then(m => ({ default: m.TaxonomyManager })));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile').then(m => ({ default: m.AdminProfile })));

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

// Global Loading fallback for Suspense
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
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
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes - Eagerly loaded for performance except when not needed */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/sobre" element={<PublicLayout><AboutPage /></PublicLayout>} />
                    <Route path="/produto/:id" element={<PublicLayout><ProductPage /></PublicLayout>} />
                    <Route path="/suporte" element={<PublicLayout><SupportPage /></PublicLayout>} />
                    
                    {/* Admin Routes - Lazy Loaded */}
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
                </Suspense>
              </div>
            </Router>
          </ConfirmProvider>
        </ToastProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}