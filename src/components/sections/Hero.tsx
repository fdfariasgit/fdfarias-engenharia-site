import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cmsService } from '../../services/cmsService';
import type { CmsContent } from '../../types';
import defaultHeroImage from '../../assets/hero-fran-services.jpg.webp';

export function Hero() {
  const [content, setContent] = useState<CmsContent | null>(null);

  useEffect(() => {
    cmsService.getById('home_banner').then(data => {
      if (data) setContent(data);
    }).catch(err => console.error('Error fetching hero cms:', err));
  }, []);

  const title = content?.title || 'Catálogo Exclusivo de \nUltrassons.';
  const text = content?.text || 'Sistemas novos e seminovos de alta performance, além de suporte técnico e manutenção especializada. Confira nossas opções ou solicite assistência para sua clínica.';
  const bgImage = content?.imageUrl || defaultHeroImage;
  return (
    <section className="relative w-full bg-slate-50 pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 lg:via-slate-50/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-transparent to-slate-50 z-10" />
        
        <img
          src={bgImage}
          alt="Banner Principal"
          fetchPriority="high"
          loading="eager"
          className="object-cover object-right w-full h-full opacity-10 lg:opacity-30 transition-opacity duration-700"
        />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[40vh]">
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-8 flex flex-col z-10 text-center lg:text-left items-center lg:items-start w-full"
          >
            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">
              Revenda Especializada
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6 whitespace-pre-line">
              {title}
            </h1>

            <p className="text-slate-600 font-light text-base md:text-lg mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0 whitespace-pre-line">
              {text}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 w-full">
              <a
                href="#catalogo"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all rounded-md flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] active:scale-95 cursor-pointer text-center w-full sm:w-auto"
              >
                Ver Equipamentos <ChevronDown size={18} />
              </a>
              <Link
                to="/suporte"
                className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all rounded-md flex items-center justify-center gap-3 active:scale-95 cursor-pointer text-center w-full sm:w-auto"
              >
                Abrir Chamado Técnico
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}