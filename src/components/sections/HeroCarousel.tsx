import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { MapPin, MapPinned, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

import heroImage1 from '../../assets/hero-ultrassom-clean.jpg';
// Usando a mesma imagem como placeholder se não houver outras, mas idealmente teríamos mais.
const slides = [
  { id: 1, image: heroImage1 },
  { id: 2, image: heroImage1 }, 
  { id: 3, image: heroImage1 },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="relative w-full bg-slate-50 pt-24 pb-0 flex flex-col">
      {/* Carousel Area */}
      <div className="relative w-full h-[60vh] lg:h-[75vh] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full min-w-0">
              <img 
                src={slide.image} 
                alt="Equipamento de Ultrassom" 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Overlay Azul Escuro (Premium) */}
              <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-slate-50/40 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button 
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-20"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-20"
          aria-label="Próximo slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6 drop-shadow-lg">
                VENDA SEU EQUIPAMENTO DE ULTRASSOM NA FD FARIAS
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-10 font-light max-w-2xl drop-shadow-md">
                Anuncie e venda seu equipamento e acessórios para ultrassom aqui! Conectamos quem quer vender com quem precisa comprar.
              </p>
              
              <a 
                href="https://wa.me/556999650890?text=Olá!%20Gostaria%20de%20anunciar/vender%20meu%20equipamento%20de%20ultrassom."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest transition-colors rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)] inline-block"
              >
                Entre em contato
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Info Cards (Bottom Overlapping) */}
      <div className="container mx-auto px-4 lg:px-12 relative z-20 -mt-16 sm:-mt-24 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-xl flex items-center justify-between border border-slate-200 hover:-translate-y-1 transition-transform"
          >
            <div>
              <span className="text-[10px] font-bold tracking-widest text-sky-600 uppercase bg-sky-100 px-2 py-1 rounded">Entregamos para</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">Todo<br/>Brasil</h3>
            </div>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 shrink-0">
              <MapPin size={32} />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl p-6 shadow-xl flex items-center justify-between hover:-translate-y-1 transition-transform"
          >
            <div>
              <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-white/20 px-2 py-1 rounded">Anuncie e venda</span>
              <h3 className="text-xl font-bold text-white mt-2 leading-tight">SEU EQUIPAMENTO<br/><span className="text-3xl font-extrabold">AQUI!</span></h3>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0">
              <MapPinned size={32} />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-center border border-slate-200 hover:-translate-y-1 transition-transform relative overflow-hidden"
          >
            <div className="absolute right-[-10%] top-[-10%] text-slate-900/5">
              <CreditCard size={120} />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold tracking-widest text-green-600 uppercase bg-green-100 px-2 py-1 rounded">Parcelamos em até</span>
              <h3 className="text-5xl font-extrabold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-600">48X</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">Solicite uma simulação</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
