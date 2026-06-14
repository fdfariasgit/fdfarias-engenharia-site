import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#030712] font-sans text-slate-100 selection:bg-blue-600/50 selection:text-white transition-colors duration-300 bg-noise-pattern">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<AboutPage />} />
        </Routes>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}