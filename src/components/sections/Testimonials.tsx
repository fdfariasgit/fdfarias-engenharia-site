import { motion } from 'framer-motion';
import { Star, Quote, MoveRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Dr. Roberto Silva",
    role: "Diretor Médico, Clínica Radiológica",
    text: "A FD Farias salvou nossa agenda! Nosso ultrassom parou no meio de uma manhã lotada e, em poucas horas, eles já estavam na clínica resolvendo o problema. Serviço impecável, ágil e muito transparente.",
    rating: 5,
  },
  {
    id: 2,
    name: "Dra. Ana Luiza Freitas",
    role: "Especialista em Medicina Fetal",
    text: "Confio a manutenção preventiva dos meus equipamentos apenas à FD Farias. A atenção aos detalhes e o conhecimento profundo sobre os sistemas garantem que meus aparelhos funcionem sempre como novos.",
    rating: 5,
  },
  {
    id: 3,
    name: "Carlos Mendes",
    role: "Gestor Hospitalar",
    text: "A agilidade no suporte técnico é o grande diferencial. Ter a segurança de que a FD Farias estará disponível para nos socorrer quando um equipamento crítico falhar é fundamental para a nossa operação.",
    rating: 5,
  }
];

export function Testimonials() {
  return (
    <section className="py-12 lg:py-24 bg-transparent border-t border-slate-200 relative transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="block text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-4">
            Assistência de Confiança
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Quem conhece, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">recomenda.</span>
          </h2>

          {/* Indicador de Swipe (Apenas Mobile) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-8 md:hidden text-slate-500 opacity-80"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Deslize para explorar</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <MoveRight size={16} />
            </motion.div>
          </motion.div>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm relative group flex flex-col justify-between snap-start min-w-[280px] sm:min-w-[340px] md:min-w-0"
            >
              <Quote size={40} className="text-slate-200 absolute top-6 right-6 z-0" />
              
              <div>
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                <p className="text-slate-600 font-light leading-relaxed mb-8 relative z-10 italic">
                  "{testimonial.text}"
                </p>
              </div>
              
              <div className="mt-auto relative z-10">
                <strong className="block text-slate-900 font-bold">{testimonial.name}</strong>
                <span className="text-xs text-slate-500">{testimonial.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
