import { motion } from 'framer-motion';
import { Shield, Settings, Clock, CircleDollarSign, ArrowRight } from 'lucide-react';
import heroFranServices from '../../assets/hero fran services.jpg.jpeg';

export function Hero() {
  const features = [
    { icon: Shield, label: 'Assistência Especializada' },
    { icon: Settings, label: 'Técnicos Certificados' },
    { icon: Clock, label: 'Agilidade e Segurança' },
    { icon: CircleDollarSign, label: 'Compra e Venda de Seminovos' }
  ];

  return (
    <section className="relative w-full bg-[#030712] pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      
      {/* Background Image Container - Covers the entire hero section */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Ambient Dark Overlays to ensure maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/85 lg:via-[#030712]/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/40 via-transparent to-[#030712] z-10" />
        
        <img
          src={heroFranServices}
          alt=""
          className="object-cover object-right w-full h-full opacity-30 lg:opacity-85 transition-opacity duration-700"
        />
      </div>

      {/* Background Decorative Glows */}
      <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Split Grid: Text (Left) & Empty Space (Right, allowing bg to show) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[45vh] lg:min-h-[55vh]">
          
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col z-10 text-center lg:text-left items-center lg:items-start w-full"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Assistência especializada em equipamentos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">ultrassom.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 font-light text-base md:text-lg mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Manutenção, venda e acessórios para equipamentos de ultrassom com qualidade e confiança.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 mb-10 w-full">
              <a
                href="https://wa.me/556999650890?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20para%20manutenção%20de%20meu%20ultrassom."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] active:scale-95 cursor-pointer text-center w-full sm:w-auto"
              >
                Solicitar Orçamento <ArrowRight size={14} />
              </a>
              <a
                href="#servicos"
                className="border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md cursor-pointer text-center w-full sm:w-auto"
              >
                Nossos Serviços
              </a>
            </div>

            {/* Infinite Scrolling Horizontal Marquee Section */}
            <div className="w-full overflow-hidden border-t border-slate-900/80 pt-6 mt-6">
              <div className="relative w-full flex items-center overflow-x-hidden">
                <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
                  {/* First Copy */}
                  {features.map((feat, index) => (
                    <div key={`first-${index}`} className="flex items-center gap-3 shrink-0">
                      <div className="w-9 h-9 rounded-md bg-blue-950/40 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <feat.icon size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                        {feat.label}
                      </span>
                    </div>
                  ))}
                  {/* Second Copy for Infinite Loop */}
                  {features.map((feat, index) => (
                    <div key={`second-${index}`} className="flex items-center gap-3 shrink-0">
                      <div className="w-9 h-9 rounded-md bg-blue-950/40 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <feat.icon size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                        {feat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Empty spacer to let the absolute background show on desktop */}
          <div className="hidden lg:block lg:col-span-5" />

        </div>

      </div>
    </section>
  );
}